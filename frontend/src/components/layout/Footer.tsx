import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-surface border-t border-outline mt-20">
      <div className="max-w-max-width mx-auto px-4 lg:px-margin-desktop py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand & Mission */}
        <div className="space-y-4">
          <span className="font-heading font-black text-xl uppercase tracking-tighter text-on-surface">
            Squad Wear
          </span>
          <p className="font-sans text-xs text-on-surface-variant leading-relaxed max-w-xs">
            Architectural streetwear silhouettes and heavyweight basics. Engineered for durability, tailored for everyday fit.
          </p>
        </div>

        {/* Collections */}
        <div className="space-y-3">
          <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-on-surface">
            Collections
          </h4>
          <ul className="space-y-2.5 font-heading text-xs uppercase tracking-wider text-on-surface-variant">
            <li>
              <Link to="/catalog?category=Full%20Track%20Suits" className="hover:text-on-surface transition-colors">
                Full Track Suits
              </Link>
            </li>
            <li>
              <Link to="/catalog?category=Hoodies" className="hover:text-on-surface transition-colors">
                Hoodies
              </Link>
            </li>
            <li>
              <Link to="/catalog?category=Trousers" className="hover:text-on-surface transition-colors">
                Trousers
              </Link>
            </li>
            <li>
              <Link to="/catalog" className="hover:text-on-surface transition-colors">
                Shop All Drops
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-3">
          <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-on-surface">
            Customer Care
          </h4>
          <ul className="space-y-2.5 font-heading text-xs uppercase tracking-wider text-on-surface-variant">
            <li>
              <Link to="/about" className="hover:text-on-surface transition-colors">
                About Squad Wear
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-on-surface transition-colors">
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-on-surface transition-colors">
                Size Guide
              </Link>
            </li>
            <li>
              <Link to="/legal" className="hover:text-on-surface transition-colors">
                Terms & Privacy
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="space-y-3">
          <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-on-surface">
            Join The Squad
          </h4>
          <p className="font-sans text-xs text-on-surface-variant">
            Subscribe for early access to limited edition drops and insider discounts.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 pt-1">
            <input
              type="email"
              placeholder="Enter email..."
              className="w-full px-3 py-2 bg-surface-container-low border border-outline font-sans text-xs focus:outline-none focus:border-on-surface rounded-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-on-surface text-surface font-heading text-xs uppercase tracking-widest hover:bg-on-surface/90 transition-colors"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Legal & Payment Line */}
      <div className="border-t border-outline bg-surface-container-low px-4 lg:px-margin-desktop py-6">
        <div className="max-w-max-width mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-heading text-[11px] uppercase tracking-wider text-on-surface-variant">
            © {new Date().getFullYear()} Squad Wear Storefront. Powered by Fabric.
          </p>
          <div className="flex items-center gap-4 text-xs font-heading uppercase text-on-surface-variant">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>PayFast</span>
            <span>Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

