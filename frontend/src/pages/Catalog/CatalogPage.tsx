import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductsContext';
import { ProductCard } from '../../components/ui/ProductCard';
import { SectionHeading } from '../../components/ui/SectionHeading';

export const CatalogPage = () => {
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Outerwear', 'T-Shirts']);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState(250);

  useEffect(() => {
    const category = searchParams.get('category');
    setSelectedCategories(category ? [category] : []);
  }, [searchParams]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const filteredProducts = products.filter(product => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;
    if (selectedSize && !product.sizes.includes(selectedSize)) return false;
    if (selectedColor && !product.colors.some(c => c.name === selectedColor)) return false;
    if (product.price > priceRange) return false;
    return true;
  });

  return (
    <main className="w-full max-w-max-width mx-auto px-margin-desktop space-y-12 py-12">
      <SectionHeading title="Shop All" subtitle="Every drop, one place." className="mb-4" />
      <div className="flex flex-col md:flex-row gap-gutter">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-72 shrink-0">
          <div className="sticky top-28 space-y-10">
            <div>
              <h3 className="font-display text-shout text-display-md mb-6 text-on-surface">Filters</h3>

              {/* Category Filter */}
              <section className="mb-8">
                <h4 className="font-ui text-shout text-xs text-outline mb-4">Category</h4>
                <div className="space-y-3">
                  {['Outerwear', 'T-Shirts', 'Accessories', 'Footwear'].map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'border-secondary' : 'border-outline group-hover:border-secondary'}`}>
                        <div className={`w-2.5 h-2.5 bg-secondary transition-opacity ${selectedCategories.includes(cat) ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>
                      <span className={`font-ui text-sm ${selectedCategories.includes(cat) ? 'text-secondary font-semibold' : ''}`}>{cat}</span>
                      <input
                        className="hidden"
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                      />
                    </label>
                  ))}
                </div>
              </section>

              {/* Size Filter */}
              <section className="mb-8">
                <h4 className="font-ui text-shout text-xs text-outline mb-4">Size</h4>
                <div className="grid grid-cols-3 gap-3">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                      className={`py-2 border font-ui text-shout text-xs transition-colors ${
                        selectedSize === size
                          ? 'border-secondary text-secondary font-bold'
                          : 'border-outline text-on-surface hover:border-secondary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </section>

              {/* Color Filter */}
              <section className="mb-8">
                <h4 className="font-ui text-shout text-xs text-outline mb-4">Color</h4>
                <div className="flex flex-wrap gap-4">
                  {[
                    { name: 'Midnight Black', color: 'bg-on-surface' },
                    { name: 'Teal Green', color: 'bg-secondary' },
                    { name: 'Industrial Grey', color: 'bg-outline' },
                    { name: 'Off-White', color: 'bg-surface-container-highest' },
                  ].map(c => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(selectedColor === c.name ? null : c.name)}
                      className={`w-8 h-8 border ${c.color} transition-colors ${
                        selectedColor === c.name ? 'border-secondary ring-2 ring-secondary ring-offset-2 ring-offset-surface' : 'border-outline'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </section>

              {/* Price Filter */}
              <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-ui text-shout text-xs text-outline">Price</h4>
                  <span className="text-secondary font-bold text-label-md">$40 - ${priceRange}</span>
                </div>
                <div className="px-2">
                  <input
                    className="w-full"
                    max="500"
                    min="40"
                    type="range"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                  />
                </div>
              </section>
            </div>
            <button
              onClick={() => {
                setSelectedCategories([]);
                setSelectedSize(null);
                setSelectedColor(null);
                setPriceRange(500);
              }}
              className="w-full border border-outline py-4 font-display text-shout text-display-md text-secondary hover:bg-secondary hover:text-on-secondary active:bg-secondary active:text-on-secondary transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-10">
            <p className="font-ui text-sm text-on-surface-variant">Showing <span className="font-bold text-on-surface">{filteredProducts.length}</span> technical pieces</p>
            <div className="relative">
              <button className="border border-outline px-6 py-3 flex items-center gap-3 font-ui text-xs">
                Sort by: Featured
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={p => addToCart({ productId: p.id, name: p.name, price: p.price, quantity: 1 })}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-20 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="border border-outline w-12 h-12 flex items-center justify-center text-outline hover:border-secondary hover:text-secondary transition-colors"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {[1, 2, 3].map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-12 h-12 border flex items-center justify-center font-bold transition-colors ${
                  currentPage === page
                    ? 'border-secondary text-secondary'
                    : 'border-outline text-on-surface hover:border-secondary'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
              className="border border-outline w-12 h-12 flex items-center justify-center text-outline hover:border-secondary hover:text-secondary transition-colors"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
