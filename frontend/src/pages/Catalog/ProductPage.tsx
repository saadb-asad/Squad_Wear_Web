import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { PRODUCTS } from '../../data/mockData';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProductCard } from '../../components/ui/ProductCard';

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find(p => p.id === id) || PRODUCTS[0]; // fallback to first product if not found
  const { addToCart } = useCart();
  
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0].name);

  // Get some recommendations excluding the current product
  const recommendations = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  };

  return (
    <main className="w-full max-w-max-width mx-auto px-margin-desktop space-y-16 py-12">
      {/* Product Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Product Visuals (Editorial & Product Shots) */}
        <div className="lg:col-span-7 space-y-gutter">
          {/* Hero Editorial Shot */}
          <div className="group border border-outline overflow-hidden aspect-[4/5] relative">
            <img className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0" data-alt={product.name} src={product.image}/>
            <img className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100" data-alt="" aria-hidden="true" src={product.hoverImage || product.image}/>
            {product.badge && (
              <div className="absolute bottom-8 left-8">
                <Badge variant="new">{product.badge}</Badge>
              </div>
            )}
          </div>
          {/* Secondary Detail Grid */}
          <div className="grid grid-cols-2 gap-gutter">
            <div className="border border-outline overflow-hidden aspect-square">
              <img className="w-full h-full object-cover" data-alt="Detail shot 1" src={product.image}/>
            </div>
            <div className="border border-outline overflow-hidden aspect-square">
              <img className="w-full h-full object-cover" data-alt="Detail shot 2" src={product.image}/>
            </div>
          </div>
        </div>

        {/* Product Information & CTAs */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="border border-outline p-8 space-y-6">
            <div>
              <h1 className="font-display text-shout text-display-lg text-on-surface mb-2">{product.name}</h1>
              <p className="text-secondary font-bold font-ui text-lg">${product.price.toFixed(2)}</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex items-center gap-4 py-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 border-2 border-surface overflow-hidden">
                    <img className="w-full h-full object-cover" data-alt="User avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKiPDHU9kvQInh5BTHzsrf-qizJ7hJkOkWzW-Zx07Uhf12ni53hetQ62yGhoKxZisF4huqlDrKCEDFDoIdjj0seX1UGqVgemHFhHdSIyKsfA_bIGhIHtDQRGubFC1pT-cut7fGxetwO57n9TJiH_S6-FVoHrN9_JTZFl3V6NcZp2XqUEjevC88GbBr6x2i8CQLADHI7tcWCP5VOS-OoeUf0NhfStYHgMLdU7tnVZc0TP3ZLH8IO9IWtVSAOvMDFXVS_Svr79fiCjhn"/>
                  </div>
                  <div className="w-8 h-8 border-2 border-surface overflow-hidden bg-surface-container flex items-center justify-center text-[10px] font-bold">
                    +42
                  </div>
                </div>
                <span className="font-ui text-xs text-on-surface-variant">Recommended by the Squad community</span>
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Select Size</label>
                <button className="text-label-sm font-label-sm text-secondary hover:underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-4" id="size-selector">
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-btn py-4 font-label-md text-label-md border transition-colors duration-200 ${
                      selectedSize === size
                        ? 'border-secondary text-secondary font-bold'
                        : 'border-outline text-on-surface hover:border-secondary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-4">
              <label className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Color: {selectedColor}</label>
              <div className="flex gap-4">
                {product.colors.map(color => (
                  <button 
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === color.name ? 'border-secondary' : 'border-outline'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  ></button>
                ))}
              </div>
            </div>

            {/* Add to Bag */}
            <Button
              variant="solid"
              onClick={handleAddToCart}
              disabled={product.soldOut}
              className="w-full py-4"
            >
              {product.soldOut ? 'Sold Out' : 'Add to Bag'}
            </Button>

            <div className="flex justify-between pt-4">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                <span className="text-label-sm font-label-sm">Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <span className="text-label-sm font-label-sm">Lifetime Guarantee</span>
              </div>
            </div>
          </div>

          {/* Product Features Bento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-outline p-6 space-y-2">
              <span className="material-symbols-outlined text-secondary">architecture</span>
              <h4 className="font-label-md text-label-md font-bold">Structural Fit</h4>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Double-lined hood and reinforced seams.</p>
            </div>
            <div className="border border-outline p-6 space-y-2">
              <span className="material-symbols-outlined text-secondary">eco</span>
              <h4 className="font-label-md text-label-md font-bold">100% Organic</h4>
              <p className="text-label-sm font-label-sm text-on-surface-variant">Sustainably sourced technical material.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete the Look */}
      <section className="mt-24 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="space-y-2">
            <h2 className="font-headline-lg text-headline-lg">Complete the Look</h2>
            <p className="text-on-surface-variant">Curated pairings for your new staple.</p>
          </div>
          <div className="flex gap-4">
            <button className="w-12 h-12 border border-outline flex items-center justify-center text-on-surface hover:border-secondary hover:text-secondary transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button className="w-12 h-12 border border-outline flex items-center justify-center text-on-surface hover:border-secondary hover:text-secondary transition-colors">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {recommendations.map(rec => (
            <ProductCard
              key={rec.id}
              product={rec}
              onAddToCart={p => addToCart({ productId: p.id, name: p.name, price: p.price, quantity: 1 })}
            />
          ))}
        </div>
      </section>

    </main>
  );
};
