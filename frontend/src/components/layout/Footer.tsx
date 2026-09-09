import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full mt-24 py-12 px-4 lg:px-margin-desktop bg-surface border-t border-outline">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full max-w-max-width mx-auto gap-8 lg:gap-gutter">
        <div className="space-y-4">
          <div className="font-display text-shout text-display-md text-on-surface">Squad Wear</div>
          <p className="font-ui max-w-xs text-sm text-on-surface-variant">
            Building a community-driven streetwear brand that's in-trend, affordable, and keeps you geared up for the next drop.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
          <div className="space-y-4">
            <h4 className="font-ui text-shout text-xs font-bold text-on-surface">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="font-ui text-sm text-on-surface-variant hover:text-secondary transition-colors">About</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-ui text-shout text-xs font-bold text-on-surface">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/shipping" className="font-ui text-sm text-on-surface-variant hover:text-secondary transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="font-ui text-sm text-on-surface-variant hover:text-secondary transition-colors">Returns</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-ui text-shout text-xs font-bold text-on-surface">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="font-ui text-sm text-on-surface-variant hover:text-secondary transition-colors">Terms</Link></li>
              <li><Link to="/privacy" className="font-ui text-sm text-on-surface-variant hover:text-secondary transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-max-width mx-auto mt-12 pt-8 border-t border-outline text-center md:text-left">
        <p className="font-ui text-sm text-on-surface-variant">© {new Date().getFullYear()} Squad Wear Streetwear. All rights reserved.</p>
      </div>
    </footer>
  );
};
