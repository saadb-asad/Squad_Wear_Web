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
      <div className="absolute inset-0 bg-on-surface/40" onClick={closeDrawer} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-surface">
        <div className="flex items-center justify-between border-b border-outline px-6 py-5">
          <h2 className="font-display text-shout text-display-md text-on-surface">Your Locker</h2>
          <button onClick={closeDrawer} aria-label="Close cart" className="p-2 text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="border-b border-outline px-6 py-4">
          {remaining > 0 ? (
            <p className="font-ui text-xs text-on-surface-variant">
              You're <span className="font-bold text-on-surface">${remaining.toFixed(2)}</span> away from FREE shipping
            </p>
          ) : (
            <p className="font-ui text-xs font-bold text-secondary">✓ FREE SHIPPING UNLOCKED</p>
          )}
          <div className="mt-2 h-2 w-full bg-surface-container-low">
            <div className="h-full bg-secondary transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <h3 className="font-display text-shout text-display-md text-on-surface">Locker's Empty — Time to Gear Up</h3>
              <div className="grid w-full grid-cols-3 gap-3">
                {suggestions.map(p => (
                  <Link key={p.id} to={`/catalog/${p.id}`} onClick={closeDrawer} className="block">
                    <img src={p.image} alt={p.name} className="aspect-square w-full border border-outline object-cover" />
                    <p className="font-ui mt-1 truncate text-xs text-on-surface">{p.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map(item => (
                <li key={item.productId} className="flex gap-4">
                  <img
                    src={products.find(p => p.id === item.productId)?.image}
                    alt={item.name}
                    className="h-20 w-20 flex-shrink-0 border border-outline object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <span className="font-ui text-sm font-semibold text-on-surface">{item.name}</span>
                      <span className="font-ui text-sm text-on-surface">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 border border-outline px-2 py-1">
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} aria-label="Decrease quantity">-</button>
                        <span className="font-ui text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} aria-label="Increase quantity">+</button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="font-ui text-xs text-on-surface-variant underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-outline px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-ui text-sm text-on-surface-variant">Subtotal</span>
            <span className="font-display text-display-md text-on-surface">${total.toFixed(2)}</span>
          </div>
          <Button
            variant="solid"
            disabled={items.length === 0}
            className="w-full"
            onClick={() => { closeDrawer(); navigate('/checkout'); }}
          >
            Go to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};
