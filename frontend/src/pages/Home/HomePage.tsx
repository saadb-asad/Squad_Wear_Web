import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductsContext';
import { CategoryTile } from '../../components/ui/CategoryTile';
import { ProductCard } from '../../components/ui/ProductCard';
import { MarqueeTicker } from '../../components/ui/MarqueeTicker';
import { TestimonialCard } from '../../components/ui/TestimonialCard';

const TESTIMONIALS = [
  { name: 'Ahmed R.', date: 'Aug 2026', quote: 'Fit is exactly as pictured and the fabric feels heavyweight. Reordering already.' },
  { name: 'Sana K.', date: 'Jul 2026', quote: 'Exchange process was painless — sized up a hoodie in two days flat.' },
  { name: 'Bilal M.', date: 'Jul 2026', quote: "Best oversized tee I've bought locally. Squad Wear gets the streetwear fit right." },
];

export const HomePage = () => {
  const { addToCart } = useCart();
  const { products } = useProducts();

  const categoryTiles = [
    {
      label: 'Full Track Suits',
      category: 'Full Track Suits',
      image: products.find(p => p.category === 'Full Track Suits')?.image ?? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000'
    },
    {
      label: 'Hoodies',
      category: 'Hoodies',
      image: products.find(p => p.category === 'Hoodies')?.image ?? 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000'
    },
    {
      label: 'Trousers',
      category: 'Trousers',
      image: products.find(p => p.category === 'Trousers')?.image ?? 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=1000'
    },
  ];

  return (
    <div className="w-full space-y-16 lg:space-y-24 pb-16">
      {/* Editorial Hero Banner */}
      <section className="relative bg-on-surface text-surface py-20 lg:py-28 px-4 lg:px- margin-desktop overflow-hidden">
        <div className="max-w-max-width mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl space-y-6 text-center md:text-left">
            <span className="font-heading text-xs uppercase tracking-widest text-surface/70 border border-surface/30 px-3 py-1 inline-block">
              2026 Drop 03 Collection
            </span>
            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tighter leading-none">
              Uncompromising Apparel Silhouettes
            </h1>
            <p className="font-sans text-sm md:text-base text-surface/80 max-w-lg">
              Heavyweight cotton blends, structured tailoring, and minimalist streetwear designed for durability and comfort.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                to="/catalog"
                className="px-8 py-3.5 bg-surface text-on-surface font-heading text-xs uppercase tracking-widest font-semibold hover:bg-surface/90 transition-colors"
              >
                Shop Full Collection
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2 aspect-[4/3] relative border border-surface/20 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200"
              alt="Squad Wear Editorial Campaign"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <MarqueeTicker items={['HEAVYWEIGHT COTTON', 'FREE SHIPPING ON ORDERS OVER $150', 'PREMIUM FULL TRACK SUITS', 'CUSTOM TAILORED TROUSERS', 'URBAN STREETWEAR ESSENTIALS']} />

      {/* 3 Core Collections Grid */}
      <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop space-y-16">
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-outline pb-4">
            <div>
              <span className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
                Explore Categories
              </span>
              <h2 className="font-heading font-bold text-2xl uppercase tracking-wider text-on-surface">
                Featured Collections
              </h2>
            </div>
            <Link to="/catalog" className="font-heading text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface flex items-center gap-1">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryTiles.map(tile => (
              <CategoryTile key={tile.category} {...tile} />
            ))}
          </div>
        </section>

        {/* New Drops Grid */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-outline pb-4">
            <div>
              <span className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
                Fresh Inventory
              </span>
              <h2 className="font-heading font-bold text-2xl uppercase tracking-wider text-on-surface">
                Latest Drops
              </h2>
            </div>
            <Link to="/catalog" className="font-heading text-xs uppercase tracking-widest text-on-surface-variant hover:text-on-surface flex items-center gap-1">
              Shop All Drops <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={p => addToCart({ productId: p.id, name: p.name, price: p.price, quantity: 1 })}
              />
            ))}
          </div>
        </section>

        {/* Editorial Story Section */}
        <section className="border border-outline bg-surface-container-low grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="p-8 lg:p-12 space-y-6">
            <span className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant border border-outline px-3 py-1 inline-block">
              Craft & Quality
            </span>
            <h2 className="font-heading font-black text-3xl uppercase tracking-tight text-on-surface">
              Crafted For Everyday Durability
            </h2>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              We design streetwear essentials focused on clean lines, heavy fabrics, and timeless fits. 
              No fast-fashion gimmicks — just high-spec Track Suits, Hoodies, and Trousers built for continuous wear.
            </p>
            <div className="pt-2">
              <Link
                to="/catalog"
                className="inline-block px-6 py-3 border border-on-surface font-heading text-xs uppercase tracking-widest font-semibold hover:bg-on-surface hover:text-surface transition-colors"
              >
                Discover The Gear
              </Link>
            </div>
          </div>
          <div className="aspect-[4/3] relative h-full">
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000"
              alt="Heavyweight apparel detail"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Testimonials */}
        <section className="space-y-6">
          <div className="border-b border-outline pb-4">
            <span className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
              Feedback
            </span>
            <h2 className="font-heading font-bold text-2xl uppercase tracking-wider text-on-surface">
              From The Squad
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map(t => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

