import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{ marginTop: 'auto', padding: '4rem 0', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
      <div className="container grid grid-cols-4 gap-8">
        <div>
          <h3 className="heading-3 text-gradient mb-4" style={{ marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>SquadGear</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Premium streetwear for individuals and businesses.</p>
        </div>
        
        <div className="flex flex-col gap-2">
          <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Shop</h4>
          <Link to="/catalog?category=shirts" style={{ color: 'var(--color-text-secondary)' }}>Shirts</Link>
          <Link to="/catalog?category=trousers" style={{ color: 'var(--color-text-secondary)' }}>Trousers</Link>
          <Link to="/catalog?category=accessories" style={{ color: 'var(--color-text-secondary)' }}>Accessories</Link>
        </div>

        <div className="flex flex-col gap-2">
          <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Company</h4>
          <Link to="/about" style={{ color: 'var(--color-text-secondary)' }}>About Us</Link>
          <Link to="/about#b2b" style={{ color: 'var(--color-text-secondary)' }}>B2B Portal</Link>
          <Link to="/contact" style={{ color: 'var(--color-text-secondary)' }}>Contact</Link>
        </div>

        <div className="flex flex-col gap-2">
          <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Legal</h4>
          <Link to="/privacy" style={{ color: 'var(--color-text-secondary)' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: 'var(--color-text-secondary)' }}>Terms of Service</Link>
        </div>
      </div>
      <div className="container" style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>
        &copy; {new Date().getFullYear()} SquadGear. All rights reserved.
      </div>
    </footer>
  );
};
