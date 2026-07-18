import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  // Fetch initial orders and connect to WebSocket
  useEffect(() => {
    // 1. Fetch initial data
    fetch('http://localhost:8000/api/orders')
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
          current?.id === data.order_id ? { ...current, status: data.status as OrderStatus } : current
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
      await fetch(`http://localhost:8000/api/orders/${orderId}/status?status=${newStatus}`, {
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
    doc.text('SquadGear - Monthly Sales Report', 14, 22);
    
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

    doc.save(`SquadGear_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="heading-2">Manager Portal</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Live Order Fulfillment Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={generateMonthlyReport}
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            📄 Generate Monthly Report (PDF)
          </button>
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '10px', height: '10px', borderRadius: '50%', 
              backgroundColor: isOnline ? '#10b981' : '#f43f5e', 
              boxShadow: `0 0 8px ${isOnline ? '#10b981' : '#f43f5e'}` 
            }}></div>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{isOnline ? 'System Online' : 'Offline'}</span>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        {/* Left Column: Order List */}
        <div className="flex-col gap-4" style={{ display: 'flex' }}>
          {orders.map(order => (
            <div 
              key={order.id} 
              className="glass-panel"
              style={{ 
                padding: '1.5rem', 
                cursor: 'pointer',
                border: selectedOrder?.id === order.id ? '1px solid var(--color-primary)' : '1px solid var(--color-glass-border)',
                transition: 'all 0.2s ease',
                transform: selectedOrder?.id === order.id ? 'translateX(5px)' : 'none'
              }}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="heading-3" style={{ fontSize: '1.25rem' }}>{order.id}</h3>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    backgroundColor: `${getStatusColor(order.status)}20`,
                    color: getStatusColor(order.status),
                    border: `1px solid ${getStatusColor(order.status)}40`
                  }}>
                    {order.status}
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                  ${order.totalAmount.toFixed(2)}
                </div>
              </div>
              
              <div className="flex justify-between items-center" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                <div>{order.customerName}</div>
                <div>{new Date(order.date).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Details */}
        <div style={{ position: 'sticky', top: '2rem' }}>
          {selectedOrder ? (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 className="heading-3 mb-6" style={{ borderBottom: '1px solid var(--color-glass-border)', paddingBottom: '1rem' }}>
                Order Details
              </h2>
              
              <div className="flex-col gap-4 mb-6" style={{ display: 'flex' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</div>
                  <div style={{ fontWeight: 500 }}>{selectedOrder.customerName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Date</div>
                  <div style={{ fontWeight: 500 }}>{new Date(selectedOrder.date).toLocaleString()}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Items</div>
              <div className="flex-col gap-3 mb-8" style={{ display: 'flex' }}>
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center" style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
                    <div className="flex items-center gap-3">
                      <div style={{ width: '30px', height: '30px', backgroundColor: 'var(--color-bg-elevated)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600 }}>
                        {item.quantity}x
                      </div>
                      <div style={{ fontSize: '0.875rem' }}>{item.productName}</div>
                    </div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-8" style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-glass-border)' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 500 }}>Total</span>
                <span className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 700 }}>${selectedOrder.totalAmount.toFixed(2)}</span>
              </div>

              <div className="flex-col gap-3" style={{ display: 'flex' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Actions</div>
                
                {selectedOrder.status === 'paid' && (
                   <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}>
                     Mark as Processing
                   </button>
                )}
                
                {selectedOrder.status === 'processing' && (
                   <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}>
                     Mark as Shipped
                   </button>
                )}

                {(selectedOrder.status === 'pending' || selectedOrder.status === 'delivered') && (
                  <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    No actions available for current status.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel flex items-center justify-center" style={{ height: '300px', color: 'var(--color-text-muted)' }}>
              Select an order to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
