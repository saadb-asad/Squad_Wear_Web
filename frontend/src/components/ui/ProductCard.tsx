import { Link } from 'react-router-dom';
import type { Product } from '../../data/mockData';
import { Badge } from './Badge';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const isSale = product.originalPrice != null && product.originalPrice > product.price;

  return (
    <div className="group flex flex-col border border-outline bg-surface rounded-none overflow-hidden transition-all duration-300 hover:border-on-surface/40">
      <Link to={`/catalog/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-surface-container-low">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.soldOut && <Badge variant="sold-out">Sold Out</Badge>}
          {!product.soldOut && isSale && <Badge variant="sale">Sale</Badge>}
          {!product.soldOut && !isSale && product.badge && <Badge variant="new">{product.badge}</Badge>}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-4 bg-surface">
        <div>
          <span className="font-heading text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 block">
            {product.category}
          </span>
          <Link to={`/catalog/${product.id}`}>
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-on-surface transition-colors hover:text-secondary line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 pt-3 border-t border-outline/50 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {isSale && (
              <span className="font-sans text-xs text-on-surface-variant line-through">
                ${product.originalPrice!.toFixed(2)}
              </span>
            )}
            <span className="font-sans text-sm font-medium text-on-surface">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={product.soldOut}
            aria-label={`Add ${product.name} to cart`}
            className="px-3 py-1.5 border border-on-surface font-heading text-[10px] uppercase tracking-widest text-on-surface transition-all duration-200 hover:bg-on-surface hover:text-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            Quick Add
          </button>
        </div>
      </div>
    </div>
  );
};

