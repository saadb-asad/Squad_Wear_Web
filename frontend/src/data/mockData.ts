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

export const mockProducts: Product[] = [
  {
    id: "sqd-hd-blk-350",
    name: "Squad Black Hoodie",
    subtitle: "Midnight Black / 350 GSM Cotton Fleece",
    price: 2800.0,
    image: "/products/winter26/SQD-HD-BLK-350_front.jpeg",
    hoverImage: "/products/winter26/SQD-HD-BLK-350_back.jpeg",
    badge: "Winter '26 Drop",
    description: "Premium 350 GSM heavyweight cotton fleece hoodie in Midnight Black. Features plush interior lining, drop-shoulder athletic cut, double-lined hood, and high-density Squad logo detailing.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Midnight Black", hex: "#121212" }],
    category: "Hoodies"
  },
  {
    id: "sqd-hd-gry-350",
    name: "Squad Grey Hoodie",
    subtitle: "Heather Grey / 350 GSM Cotton Fleece",
    price: 2800.0,
    image: "/products/winter26/SQD-HD-GRY-350_front.jpeg",
    hoverImage: "/products/winter26/SQD-HD-GRY-350_back.jpeg",
    badge: "Winter '26 Drop",
    description: "Signature 350 GSM heavyweight cotton fleece hoodie in Heather Grey. Engineered with ribbed cuffs, deep front kangaroo pocket, and breathable warmth for cold weather.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Heather Grey", hex: "#8e8e8e" }],
    category: "Hoodies"
  },
  {
    id: "sqd-hd-olv-350",
    name: "Squad Olive Hoodie",
    subtitle: "Tactical Olive / 350 GSM Cotton Fleece",
    price: 2800.0,
    image: "/products/winter26/SQD-HD-OLV-350_front.jpeg",
    hoverImage: "/products/winter26/SQD-HD-OLV-350_back.jpeg",
    badge: "Winter '26 Drop",
    description: "Heavyweight 350 GSM cotton fleece hoodie in Tactical Olive. Structured fit with reinforced seam construction, ergonomic hood, and subtle brand labeling.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Tactical Olive", hex: "#4b5320" }],
    category: "Hoodies"
  },
  {
    id: "sqd-ts-blk-350",
    name: "Squad Black Tracksuit",
    subtitle: "Midnight Black / 350 GSM 2-Piece Set",
    price: 5200.0,
    image: "/products/winter26/SQD-TS-BLK-350_front.jpeg",
    hoverImage: "/products/winter26/SQD-TS-BLK-350_2.jpeg",
    badge: "Winter '26 Drop",
    description: "Complete 2-piece heavyweight tracksuit set in Midnight Black. Includes fleece pullover hoodie and matching tapered track trousers with custom drawstring hardware.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Midnight Black", hex: "#121212" }],
    category: "Tracksuits"
  },
  {
    id: "sqd-ts-gry-350",
    name: "Squad Grey Tracksuit",
    subtitle: "Heather Grey / 350 GSM 2-Piece Set",
    price: 5200.0,
    image: "/products/winter26/SQD-TS-GRY-350_front.jpeg",
    hoverImage: "/products/winter26/SQD-TS-GRY-350_2.jpeg",
    badge: "Winter '26 Drop",
    description: "Full 2-piece athletic tracksuit in Heather Grey. Crafted from ultra-soft 350 GSM fleece for effortless daily style and comfort.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Heather Grey", hex: "#8e8e8e" }],
    category: "Tracksuits"
  },
  {
    id: "sqd-ts-olv-350",
    name: "Squad Olive Tracksuit",
    subtitle: "Tactical Olive / 350 GSM 2-Piece Set",
    price: 5200.0,
    image: "/products/winter26/SQD-TS-OLV-350_front.jpeg",
    hoverImage: "/products/winter26/SQD-TS-OLV-350_2.jpeg",
    badge: "Winter '26 Drop",
    description: "Urban utility 2-piece tracksuit set in Tactical Olive. Designed with deep side pockets, durable waistband elastic, and premium fleece structure.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Tactical Olive", hex: "#4b5320" }],
    category: "Tracksuits"
  },
  {
    id: "sqd-tr-blk-350",
    name: "Squad Black Trousers",
    subtitle: "Midnight Black / 350 GSM Fleece Trousers",
    price: 2500.0,
    image: "/products/winter26/SQD-TR-BLK-350_front.jpeg",
    hoverImage: "/products/winter26/SQD-TR-BLK-350_hover.jpeg",
    badge: "Winter '26 Drop",
    description: "Tapered heavyweight fleece trousers in Midnight Black. Features zippered back pocket, ankle cuffs, and adjustable metal-tipped drawstring.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Midnight Black", hex: "#121212" }],
    category: "Trousers"
  },
  {
    id: "sqd-tr-gry-350",
    name: "Squad Grey Trousers",
    subtitle: "Heather Grey / 350 GSM Fleece Trousers",
    price: 2500.0,
    image: "/products/winter26/SQD-TR-GRY-350_front.jpeg",
    hoverImage: "/products/winter26/SQD-TR-GRY-350_hover.jpeg",
    badge: "Winter '26 Drop",
    description: "Essential streetwear fleece trousers in Heather Grey. Tapered fit with heavy elastic ribbed waist and deep side entry pockets.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Heather Grey", hex: "#8e8e8e" }],
    category: "Trousers"
  },
  {
    id: "sqd-tr-olv-350",
    name: "Squad Olive Trousers",
    subtitle: "Tactical Olive / 350 GSM Fleece Trousers",
    price: 2500.0,
    image: "/products/winter26/SQD-TR-OLV-350_front.jpeg",
    hoverImage: "/products/winter26/SQD-TR-OLV-350_hover.jpeg",
    badge: "Winter '26 Drop",
    description: "Clean tactical fleece trousers in Tactical Olive. Built for durability with heavy 350 GSM brushed cotton blend.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Tactical Olive", hex: "#4b5320" }],
    category: "Trousers"
  }
];
