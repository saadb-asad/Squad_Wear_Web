import { Link } from 'react-router-dom';

interface CategoryTileProps {
  label: string;
  category: string;
  image: string;
}

export const CategoryTile = ({ label, category, image }: CategoryTileProps) => (
  <Link
    to={`/catalog?category=${encodeURIComponent(category)}`}
    className="group relative block aspect-[3/4] overflow-hidden border border-outline bg-surface-container-low"
  >
    <img
      src={image}
      alt={label}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
    <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
      <div>
        <span className="font-heading text-[10px] uppercase tracking-widest text-surface/70 block mb-1">
          Collection
        </span>
        <h3 className="font-heading font-bold text-lg md:text-xl uppercase tracking-wider text-surface">
          {label}
        </h3>
      </div>
      <span className="font-heading text-xs uppercase tracking-widest text-surface flex items-center gap-1 group-hover:translate-x-1 transition-transform">
        Explore <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </span>
    </div>
  </Link>
);

