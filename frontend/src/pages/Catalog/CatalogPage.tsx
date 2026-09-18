import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductsContext';
import { ProductCard } from '../../components/ui/ProductCard';

const CATEGORIES = ['Full Track Suits', 'Hoodies', 'Trousers'];

export const CatalogPage = () => {
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState(500);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategories([category]);
    }
  }, [searchParams]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const filteredProducts = products.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery) && !product.category.toLowerCase().includes(searchQuery)) {
      return false;
    }
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
    if (selectedSize && !product.sizes.includes(selectedSize)) return false;
    if (selectedColor && !product.colors.some(c => c.name === selectedColor)) return false;
    if (product.price > priceRange) return false;
    return true;
  });

  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop space-y-10 py-10">
      <div className="border-b border-outline pb-4">
        <span className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant block mb-1">
          Catalog
        </span>
        <h1 className="font-heading font-black text-3xl uppercase tracking-tight text-on-surface">
          All Collections
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-8 border border-outline p-5 bg-surface">
            <div className="flex items-center justify-between border-b border-outline pb-3">
              <h3 className="font-heading font-bold text-xs uppercase tracking-widest text-on-surface">Filters</h3>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedSize(null);
                  setSelectedColor(null);
                  setPriceRange(500);
                }}
                className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-on-surface underline"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <section className="space-y-3">
              <h4 className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant">Category</h4>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                      className="accent-on-surface h-3.5 w-3.5"
                    />
                    <span className={`font-heading text-xs uppercase tracking-wider ${selectedCategories.includes(cat) ? 'text-on-surface font-bold' : 'text-on-surface-variant group-hover:text-on-surface'}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* Size Filter */}
            <section className="space-y-3">
              <h4 className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant">Size</h4>
              <div className="grid grid-cols-4 gap-2">
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                    className={`py-1.5 border font-heading text-[10px] uppercase tracking-wider transition-colors ${
                      selectedSize === size
                        ? 'border-on-surface bg-on-surface text-surface font-bold'
                        : 'border-outline text-on-surface hover:border-on-surface'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </section>

            {/* Price Filter */}
            <section className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant">Max Price</h4>
                <span className="font-sans text-xs font-semibold text-on-surface">${priceRange}</span>
              </div>
              <input
                className="w-full accent-on-surface cursor-pointer"
                max="500"
                min="30"
                type="range"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
            </section>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center border-b border-outline pb-3">
            <p className="font-heading text-xs uppercase tracking-wider text-on-surface-variant">
              Showing <span className="font-bold text-on-surface">{filteredProducts.length}</span> pieces
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-4 border border-outline bg-surface-container-low">
              <p className="font-heading text-xs uppercase tracking-widest text-on-surface-variant">No products found matching your filters</p>
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedSize(null);
                  setSelectedColor(null);
                  setPriceRange(500);
                }}
                className="px-6 py-2.5 border border-on-surface font-heading text-xs uppercase tracking-widest hover:bg-on-surface hover:text-surface transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={p => addToCart({ productId: p.id, name: p.name, price: p.price, quantity: 1 })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

