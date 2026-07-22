import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { API_BASE_URL } from '../../config';


// --- Mock Data ---
type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  date: string;
  items: OrderItem[];
}

export const AdminDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(order => order.id.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'internal_admin')) {
      navigate('/portal/login');
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  // Fetch initial orders and connect to WebSocket
  useEffect(() => {
    // 1. Fetch initial data
    fetch(`${API_BASE_URL}/api/orders`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Error fetching orders:", err));

    // 2. Connect to WebSocket
    const ws = new WebSocket('ws://localhost:8000/ws/admin');
    
    ws.onopen = () => {
      setIsOnline(true);
      console.log('Connected to backend WebSocket');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ORDER_UPDATED') {
        console.log(`[WebSocket] Order ${data.order_id} updated to ${data.status}`);
        setOrders(currentOrders => 
          currentOrders.map(o => 
            o.id === data.order_id ? { ...o, status: data.status as OrderStatus } : o
          )
        );
        setSelectedOrder(current => 
          (current && current.id === data.order_id) ? { ...current, status: data.status as OrderStatus } : current
        );
      }
    };

    ws.onclose = () => {
      setIsOnline(false);
      console.log('Disconnected from backend WebSocket');
    };

    return () => {
      ws.close();
    };
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}/status?status=${newStatus}`, {
        method: 'PUT'
      });
      // We don't manually update state here because the WebSocket will broadcast the change back to us!
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch(status) {
      case 'pending': return '#f59e0b'; // amber
      case 'paid': return '#3b82f6'; // blue
      case 'processing': return '#8b5cf6'; // purple
      case 'shipped': return '#10b981'; // emerald
      case 'delivered': return '#64748b'; // slate
      default: return 'white';
    }
  };

  const generateMonthlyReport = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('SquadWear - Monthly Sales Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Calculate some metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'shipped').length;
    
    doc.text(`Total Orders: ${orders.length}`, 14, 40);
    doc.text(`Completed Orders: ${completedOrders}`, 14, 46);
    doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 14, 52);

    const tableData = orders.map(order => [
      order.id,
      order.customerName,
      new Date(order.date).toLocaleDateString(),
      order.status.toUpperCase(),
      `$${order.totalAmount.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: 60,
      head: [['Order ID', 'Customer', 'Date', 'Status', 'Total Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] }, // Match var(--color-primary)
    });

    doc.save(`SquadWear_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (isLoading || !isAuthenticated || user?.role !== 'internal_admin') {
    return (
      <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop py-12 flex justify-center items-center min-h-[50vh]">
        <div className="font-headline-md text-on-surface">Checking authorization...</div>
      </main>
    );
  }

  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop py-12 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">Manager Portal</h1>
          <p className="text-on-surface-variant font-body-md text-body-md">Live Order Fulfillment Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={generateMonthlyReport}
            className="neo-extruded-sm neo-interactive px-4 py-2 rounded-xl font-label-md text-label-md text-on-surface bg-surface" 
          >
            📄 Generate Monthly Report (PDF)
          </button>
          <div className="neo-extruded-sm bg-surface px-4 py-2 rounded-xl flex items-center gap-2">
            <div style={{ 
              width: '10px', height: '10px', borderRadius: '50%', 
              backgroundColor: isOnline ? '#10b981' : '#ba1a1a', 
              boxShadow: `0 0 8px ${isOnline ? '#10b981' : '#ba1a1a'}` 
            }}></div>
            <span className="font-label-md text-label-md text-on-surface">{isOnline ? 'System Online' : 'Offline'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Left Column: Order List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="neo-extruded bg-surface p-4 rounded-2xl flex items-center gap-3">
            <Search className="text-on-surface-variant" size={20} />
            <input
              type="text"
              placeholder="Search by order number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none font-body-md text-on-surface w-full placeholder:text-on-surface-variant/50"
            />
          </div>
          
          {filteredOrders.map(order => (
            <div 
              key={order.id} 
              className={`neo-interactive rounded-3xl p-6 transition-all duration-300 ${
                selectedOrder?.id === order.id ? 'neo-recessed bg-surface-container-low scale-[0.98]' : 'neo-extruded bg-surface'
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="font-headline-md text-headline-md text-on-surface">{order.id}</h3>
                  <span className="px-3 py-1 rounded-full font-label-md text-label-sm uppercase" style={{ 
                    backgroundColor: `${getStatusColor(order.status)}20`,
                    color: getStatusColor(order.status),
                    border: `1px solid ${getStatusColor(order.status)}40`
                  }}>
                    {order.status}
                  </span>
                </div>
                <div className="font-headline-md text-on-surface">
                  ${order.totalAmount.toFixed(2)}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-on-surface-variant font-body-md text-body-md">
                <div>{order.customerName}</div>
                <div>{new Date(order.date).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 sticky top-24">
          {selectedOrder ? (
            <div className="neo-extruded bg-surface p-8 rounded-[32px] space-y-6">
              <h2 className="font-headline-md text-headline-md text-on-surface pb-4 border-b border-outline-variant/30">
                Order Details
              </h2>
              
              <div className="flex flex-col gap-4">
                <div>
                  <div className="font-label-md text-label-sm text-on-surface-variant uppercase tracking-widest">Customer</div>
                  <div className="font-body-lg text-on-surface">{selectedOrder.customerName}</div>
                </div>
                <div>
                  <div className="font-label-md text-label-sm text-on-surface-variant uppercase tracking-widest">Order Date</div>
                  <div className="font-body-md text-on-surface">{new Date(selectedOrder.date).toLocaleString()}</div>
                </div>
              </div>

              <div className="font-label-md text-label-sm text-on-surface-variant uppercase tracking-widest">Items</div>
              <div className="flex flex-col gap-3">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="neo-recessed flex justify-between items-center p-4 rounded-2xl bg-surface-container-low">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 neo-extruded-sm bg-surface rounded-lg flex items-center justify-center font-label-md text-label-sm text-on-surface">
                        {item.quantity}x
                      </div>
                      <div className="font-body-md text-on-surface">{item.productName}</div>
                    </div>
                    <div className="font-headline-md text-on-surface text-lg">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30">
                <span className="font-headline-md text-headline-md text-on-surface">Total</span>
                <span className="font-headline-lg text-headline-lg text-on-surface font-bold">${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>

              <div className="flex flex-col gap-3">
                <div className="font-label-md text-label-sm text-on-surface-variant uppercase tracking-widest text-center">Actions</div>
                
                {selectedOrder.status === 'paid' && (
                   <button className="neo-extruded-sm neo-interactive w-full py-4 rounded-xl bg-on-surface text-surface font-label-md font-bold" onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}>
                     Mark as Processing
                   </button>
                )}
                
                {selectedOrder.status === 'processing' && (
                   <button className="neo-extruded-sm neo-interactive w-full py-4 rounded-xl bg-on-surface text-surface font-label-md font-bold" onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}>
                     Mark as Shipped
                   </button>
                )}

                {(selectedOrder.status === 'pending' || selectedOrder.status === 'delivered') && (
                  <div className="text-center font-body-md text-on-surface-variant p-4 neo-recessed rounded-2xl bg-surface-container-low">
                    No actions available for current status.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="neo-recessed bg-surface-container-low rounded-[32px] flex items-center justify-center h-64 text-on-surface-variant font-body-md">
              Select an order to view details
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
