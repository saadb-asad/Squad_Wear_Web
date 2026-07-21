import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { PRODUCTS } from '../../data/mockData';
import { Link, useNavigate } from 'react-router-dom';

export const CheckoutPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { isAuthenticated, token } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (!isAuthenticated) {
      navigate('/portal/login');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('http://localhost:8000/api/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Redirect to Payfast gateway
        if (data.payfast_url && data.payment_data) {
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = data.payfast_url;
          
          for (const key in data.payment_data) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = data.payment_data[key];
            form.appendChild(hiddenField);
          }
          
          document.body.appendChild(form);
          clearCart(); // Clear the local cart before going to gateway
          form.submit();
        } else {
          setIsProcessing(false);
          alert('Missing payment gateway details.');
        }
      } else {
        const errData = await response.json().catch(() => null);
        console.error('Checkout failed', errData);
        alert('Checkout failed: ' + (errData?.detail || 'Unknown error'));
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error during checkout', error);
      setIsProcessing(false);
      alert('Network error during checkout.');
    }
  };

  const applyPromo = () => {
    if (promoCode.toLowerCase() === 'squad10') {
      setDiscount(total * 0.1);
      alert('Promo code applied: 10% off!');
    } else {
      alert('Invalid promo code');
    }
  };

  const subtotal = total;
  const tax = (subtotal - discount) * 0.08;
  const finalTotal = subtotal - discount + tax;

  // Get some recommendations for 'Complete the Kit'
  const recommendations = PRODUCTS.slice(0, 2);

  return (
    <main className="w-full max-w-max-width mx-auto px-margin-desktop space-y-12 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        
        {/* Shopping Bag List */}
        <div className="lg:col-span-8 space-y-8">
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-8">Your Bag</h1>
          
          {items.length === 0 ? (
            <div className="neo-extruded rounded-2xl p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">shopping_bag</span>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Your bag is empty</h2>
              <Link to="/catalog">
                <button className="neo-extruded px-8 py-3 rounded-xl font-label-md text-label-md text-secondary hover:neo-recessed transition-all">
                  Continue Shopping
                </button>
              </Link>
            </div>
          ) : (
            items.map(item => {
              const productInfo = PRODUCTS.find(p => p.id === item.productId);
              
              return (
                <div key={item.productId} className="neo-extruded rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-32 h-32 neo-recessed rounded-xl overflow-hidden flex-shrink-0">
                    <img className="w-full h-full object-cover" data-alt={item.name} src={productInfo?.image || ''}/>
                  </div>
                  <div className="flex-grow w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={`/catalog/${item.productId}`}>
                          <h3 className="font-headline-md text-headline-md text-on-surface hover:text-secondary transition-colors">{item.name}</h3>
                        </Link>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-1">{productInfo?.subtitle || 'Standard'}</p>
                      </div>
                      <span className="font-headline-md text-headline-md text-secondary">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center neo-recessed rounded-full px-4 py-2">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="neo-extruded rounded-full w-8 h-8 flex items-center justify-center neo-button-active hover:text-secondary"
                          >
                            <span className="material-symbols-outlined text-sm" data-icon="remove">remove</span>
                          </button>
                          <span className="px-6 font-label-md text-label-md">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="neo-extruded rounded-full w-8 h-8 flex items-center justify-center neo-button-active hover:text-secondary"
                          >
                            <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.productId)}
                        className="flex items-center gap-2 text-on-error hover:text-error transition-colors p-2 rounded-lg"
                      >
                        <span className="material-symbols-outlined" data-icon="delete">delete</span>
                        <span className="font-label-md text-label-md">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Suggested Items / Promotion */}
          <div className="mt-12">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Complete the Kit</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recommendations.map(rec => (
                <Link to={`/catalog/${rec.id}`} key={rec.id} className="neo-extruded rounded-xl p-4 group cursor-pointer block">
                  <div className="aspect-square neo-recessed rounded-lg mb-3 overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt={rec.name} src={rec.image}/>
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant truncate">{rec.name}</p>
                  <p className="font-label-md text-label-md text-on-surface">${rec.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="lg:col-span-4 lg:sticky lg:top-28">
          <div className="neo-extruded rounded-3xl p-8 space-y-6">
            <h2 className="font-headline-md text-headline-md text-on-surface">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-body-md text-body-md text-on-surface-variant">Subtotal</span>
                <span className="font-body-md text-body-md text-on-surface font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-secondary">
                  <span className="font-body-md text-body-md">Discount</span>
                  <span className="font-body-md text-body-md font-semibold">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-body-md text-body-md text-on-surface-variant">Shipping</span>
                <span className="font-body-md text-body-md text-secondary font-semibold">FREE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-md text-body-md text-on-surface-variant">Tax</span>
                <span className="font-body-md text-body-md text-on-surface font-semibold">${tax.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="h-px bg-outline-variant/30 neo-recessed py-[1px]"></div>
            
            <div className="flex justify-between items-center">
              <span className="font-headline-md text-headline-md text-on-surface">Total</span>
              <span className="font-headline-md text-headline-md text-on-surface">${finalTotal.toFixed(2)}</span>
            </div>
            
            <div className="pt-4">
              <div className="neo-recessed rounded-xl p-2 flex items-center mb-6">
                <input 
                  className="bg-transparent border-none focus:ring-0 flex-grow font-body-md text-body-md px-4 outline-none" 
                  placeholder="Promo Code" 
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button onClick={applyPromo} className="neo-extruded px-6 py-2 rounded-lg font-label-md text-label-md text-primary neo-button-active hover:text-secondary transition-colors">Apply</button>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={items.length === 0 || isProcessing}
                className={`w-full py-5 rounded-2xl font-headline-md flex items-center justify-center gap-3 transition-all ${
                  items.length === 0 
                    ? 'neo-recessed text-on-surface-variant cursor-not-allowed' 
                    : 'neo-extruded bg-secondary text-white hover:brightness-110 active:shadow-[inset_-4px_-4px_8px_#004d3e,inset_4px_4px_8px_#008a70] neo-button-active'
                }`}
              >
                <span>{isProcessing ? 'Processing...' : (!isAuthenticated ? 'Log in to Checkout' : 'Proceed to Checkout')}</span>
                {!isProcessing && <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>}
              </button>
            </div>
            
            <div className="pt-4 flex flex-col items-center gap-4">
              <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" data-icon="lock" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                Secure 256-bit SSL encrypted payment
              </p>
              <div className="flex gap-4 opacity-50 grayscale">
                <span className="material-symbols-outlined" data-icon="credit_card">credit_card</span>
                <span className="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
};
