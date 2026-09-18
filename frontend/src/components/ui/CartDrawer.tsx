import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductsContext';
import { FREE_SHIPPING_THRESHOLD } from '../../config';
import { Button } from './Button';

export const CartDrawer = () => {
  const { items, removeFromCart, updateQuantity, total, isDrawerOpen, closeDrawer } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const progressPct = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const suggestions = products.slice(0, 3);

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-on-surface/50 backdrop-blur-xs" onClick={closeDrawer} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-surface border-l border-outline shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-on-surface">Your Cart</h2>
            <span className="text-xs text-on-surface-variant font-sans">({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
          </div>
          <button onClick={closeDrawer} aria-label="Close cart" className="p-1 text-on-surface hover:text-secondary">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="border-b border-outline bg-surface-container-low px-6 py-3.5">
          {remaining > 0 ? (
            <p className="font-sans text-xs text-on-surface-variant">
              Add <span className="font-bold text-on-surface">${remaining.toFixed(2)}</span> more for FREE shipping
            </p>
          ) : (
            <p className="font-heading text-xs font-bold uppercase tracking-wider text-on-surface flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-green-600">check_circle</span>
              Free Shipping Unlocked!
            </p>
          )}
          <div className="mt-2 h-1.5 w-full bg-outline/30 overflow-hidden">
            <div className="h-full bg-on-surface transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <p className="font-heading text-xs uppercase tracking-widest text-on-surface-variant">Your cart is currently empty</p>
              <div className="w-full">
                <span className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant mb-3 block">Popular Picks</span>
                <div className="grid w-full grid-cols-3 gap-3">
                  {suggestions.map(p => (
                    <Link key={p.id} to={`/catalog/${p.id}`} onClick={closeDrawer} className="block group">
                      <img src={p.image} alt={p.name} className="aspect-square w-full border border-outline object-cover transition-transform duration-300 group-hover:scale-105" />
                      <p className="font-heading mt-1.5 truncate text-[10px] uppercase tracking-wider text-on-surface">{p.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-outline">
              {items.map(item => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <li key={item.productId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <img
                      src={product?.image}
                      alt={item.name}
                      className="h-20 w-20 flex-shrink-0 border border-outline object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between gap-2">
                        <div>
                          <span className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant block">
                            {product?.category}
                          </span>
                          <span className="font-heading text-xs font-semibold uppercase tracking-wider text-on-surface">{item.name}</span>
                        </div>
                        <span className="font-sans text-xs font-medium text-on-surface">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-outline text-xs">
                          <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Decrease quantity" className="px-2 py-1 hover:bg-surface-container-low">-</button>
                          <span className="px-3 font-sans text-xs font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Increase quantity" className="px-2 py-1 hover:bg-surface-container-low">+</button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-on-surface underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer Subtotal and Checkout Button */}
        <div className="border-t border-outline px-6 py-6 bg-surface">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-heading text-xs uppercase tracking-widest text-on-surface-variant">Subtotal</span>
            <span className="font-sans text-lg font-bold text-on-surface">${total.toFixed(2)}</span>
          </div>
          <p className="font-sans text-[11px] text-on-surface-variant mb-4">Taxes and shipping calculated at checkout.</p>
          <Button
            variant="solid"
            disabled={items.length === 0}
            className="w-full font-heading text-xs uppercase tracking-widest py-3.5"
            onClick={() => { closeDrawer(); navigate('/checkout'); }}
          >
            Checkout — ${total.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
};

