import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 60%)', opacity: 0.1, filter: 'blur(100px)', zIndex: -1 }}></div>
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 60%)', opacity: 0.1, filter: 'blur(100px)', zIndex: -1 }}></div>
        
        <div className="container grid grid-cols-2 gap-8 items-center" style={{ zIndex: 1 }}>
          <div className="flex flex-col gap-6">
            <span style={{ color: 'var(--color-secondary)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>New Collection 2026</span>
            <h1 className="heading-1">
              Elevate Your <br />
              <span className="text-gradient">Streetwear</span> Game.
            </h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', maxWidth: '480px' }}>
              Premium materials, cutting-edge designs, and a fit that speaks for itself. Discover the future of urban fashion.
            </p>
            <div className="flex gap-4" style={{ marginTop: '1rem' }}>
              <Link to="/catalog" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                Learn More
              </Link>
            </div>
            
            <div className="flex gap-8" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
              <div>
                <h4 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>10k+</h4>
                <p style={{ color: 'var(--color-text-muted)' }}>Customers</p>
              </div>
              <div>
                <h4 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>500+</h4>
                <p style={{ color: 'var(--color-text-muted)' }}>B2B Partners</p>
              </div>
            </div>
          </div>
          
          <div style={{ position: 'relative' }}>
            <div className="glass-panel" style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
              {/* Placeholder for Hero Image */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, #1e2130, #282c3e)', opacity: 0.8 }}></div>
              <div style={{ zIndex: 1, textAlign: 'center' }}>
                <Star size={48} color="var(--color-primary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3 className="heading-3 text-gradient">Premium Apparel</h3>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Placeholder Image</p>
              </div>
            </div>
            
            {/* Floating Cards */}
            <div className="glass-panel" style={{ position: 'absolute', bottom: '10%', left: '-10%', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', animation: 'fadeIn 1s ease-out 0.5s both' }}>
              <div style={{ background: 'var(--color-primary)', padding: '0.5rem', borderRadius: '50%' }}>
                <Truck size={20} color="white" />
              </div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '0.875rem' }}>Free Shipping</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>On orders over $150</p>
              </div>
            </div>
            
            <div className="glass-panel" style={{ position: 'absolute', top: '20%', right: '-5%', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', animation: 'fadeIn 1s ease-out 0.7s both' }}>
              <div style={{ background: 'var(--color-secondary)', padding: '0.5rem', borderRadius: '50%' }}>
                <Shield size={20} color="white" />
              </div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '0.875rem' }}>Secure Checkout</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>100% encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="container" style={{ padding: '6rem 1.5rem' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '3rem' }}>
          <h2 className="heading-2">Trending Now</h2>
          <Link to="/catalog" className="text-primary hover:text-secondary transition-fast flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="glass-panel" style={{ padding: '1rem', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ background: 'var(--color-bg-elevated)', height: '240px', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Product Image</span>
              </div>
              <div className="flex flex-col gap-1">
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Streetwear</span>
                <h4 style={{ fontWeight: 600 }}>Urban Tech Jacket</h4>
                <p style={{ color: 'var(--color-primary)', fontWeight: 700, marginTop: '0.5rem' }}>$129.00</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
