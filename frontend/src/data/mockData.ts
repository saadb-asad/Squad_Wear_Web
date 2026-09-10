export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  badge?: string;
  soldOut?: boolean;
  description: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  category: string;
}
