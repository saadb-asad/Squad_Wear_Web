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
    <div className="group flex flex-col border border-outline">
      <Link to={`/catalog/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-surface-container-low">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        <img
          src={product.hoverImage || product.image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.soldOut && <Badge variant="sold-out">Sold Out</Badge>}
          {!product.soldOut && isSale && <Badge variant="sale">Sale</Badge>}
          {!product.soldOut && !isSale && product.badge && <Badge variant="new">{product.badge}</Badge>}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <Link to={`/catalog/${product.id}`}>
          <h3 className="font-ui text-sm font-semibold text-on-surface transition-colors hover:text-secondary">
            {product.name}
          </h3>
        </Link>
        <p className="font-ui text-xs text-on-surface-variant">{product.subtitle}</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {isSale && (
              <span className="font-ui text-xs text-on-surface-variant line-through">
                ${product.originalPrice!.toFixed(2)}
              </span>
            )}
            <span className="font-ui text-sm font-bold text-on-surface">${product.price.toFixed(2)}</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.soldOut}
            aria-label={`Add ${product.name} to cart`}
            className="border border-on-surface p-2 text-on-surface transition-colors hover:bg-on-surface hover:text-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
