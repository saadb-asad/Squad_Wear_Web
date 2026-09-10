import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductsContext';
import { CategoryTile } from '../../components/ui/CategoryTile';
import { SectionHeading } from '../../components/ui/SectionHeading';
import { ProductCard } from '../../components/ui/ProductCard';
import { BrandMessageBlock } from '../../components/ui/BrandMessageBlock';
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
    { label: 'Outerwear', category: 'Outerwear', image: products[0]?.image ?? '' },
    { label: 'T-Shirts', category: 'T-Shirts', image: products.find(p => p.category === 'T-Shirts')?.image ?? '' },
    { label: 'Footwear', category: 'Footwear', image: products.find(p => p.category === 'Footwear')?.image ?? '' },
    { label: 'Accessories', category: 'Accessories', image: products.find(p => p.category === 'Accessories')?.image ?? '' },
  ];

  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop space-y-16 lg:space-y-section-y py-section-y-mobile lg:py-section-y">
      <h1 className="sr-only">Squad Wear</h1>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categoryTiles.map(tile => (
          <CategoryTile key={tile.category} {...tile} />
        ))}
      </section>

      <section className="space-y-10">
        <SectionHeading title="New Drops" subtitle="Freshly stocked. Shop before they're gone." />
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

      <BrandMessageBlock
        heading="Streetwear That Doesn't Cost a Fortune"
        body="We don't restrict good fits to a big budget. Squad Wear is built for everyday wear, priced for everyday people."
      />

      <section className="space-y-10">
        <SectionHeading title="From the Squad" subtitle="Real feedback from real customers." />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map(t => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </section>
    </main>
  );
};
