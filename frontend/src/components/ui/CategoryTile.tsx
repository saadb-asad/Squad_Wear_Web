import { Link } from 'react-router-dom';

interface CategoryTileProps {
  label: string;
  category: string;
  image: string;
}

export const CategoryTile = ({ label, category, image }: CategoryTileProps) => (
  <Link
    to={`/catalog?category=${encodeURIComponent(category)}`}
    className="group relative block aspect-[3/4] overflow-hidden border border-outline"
  >
    <img
      src={image}
      alt={label}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-on-surface/20 transition-colors group-hover:bg-on-surface/30" />
    <span className="font-display text-shout absolute bottom-6 left-6 text-display-md text-surface">{label}</span>
  </Link>
);
