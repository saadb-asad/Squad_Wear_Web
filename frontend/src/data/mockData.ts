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

export const PRODUCTS: Product[] = [
  {
    id: 'apex-tech-hoodie',
    name: 'Apex Tech Hoodie',
    subtitle: 'Industrial Grey / Heavyweight',
    price: 120.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA8aYq6haC7i626RBAxGikRimxUIaCXW3sWd1UnyxtN_m2xiVcx8Is2fqlh-hlyJtRktD3Ob-g-R-Vpo8wvVax4TP9tcVuI9RNRQ1ys8k3i0imLsdPNfQkakzfznNpHlv33usRvykg2QhQK7EXd-6QiaWF6JUglpeNVk7q0QpQRLHeCTvkOd390S7-rxKiQdqOWboaAwMoBzUgtvFiy-xJTDcmAQ5qCR9Tf593FpCzW_uNnHqJs3kP8Q3VzTyQX-aWbawGDqA8P89g',
    badge: 'New Drop',
    hoverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7RVti_D9Ep15yDLDJkNUIeP4Gf6RDf9_ZZtTSUafk1xNSP64P35KRtO4Z7u5BxtI1k1a0QvhUW61iylcTRLCL6QFg1P3rv8vBZzMsz6yXnD1KvM3l5NhddE-NzfVVKI-GvO6cV96v0vbIehRHx1QanpK-pFJPziOYfZVNcn8sRJgasKZSxLpaxG8bFiqnpMxSF1mvdkU-2eaRx5U8BYsh4NyzGWFxpYZR-kievm4CNYMJvIKlPoiuIagRaEuw923-GgT54YbA6x-V',
    description: 'Engineered for the modern urban landscape. Our Apex Tech Hoodie features a bespoke cross-weave fleece, designed to hold its architectural shape while providing unparalleled comfort. Finished with precision-engineered hardware.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Stealth Grey', hex: '#3d3d3d' },
      { name: 'Midnight Black', hex: '#1a1a1a' },
      { name: 'Industrial Grey', hex: '#e5e5e5' }
    ],
    category: 'Outerwear'
  },
  {
    id: 'stealth-cargo-jogger',
    name: 'Stealth Cargo Jogger',
    subtitle: 'Midnight Black / Ripstop',
    price: 95.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-zGPVr8F43eZRbcgSLtL0A2cJduWP1zwq-G4IwMqnAXza-xleI70RSqL0P6pTiogXW1zJ-ta3PLQuqwnf3TznSdAlaez6WUUEv9EsQwDFleDpLJdn5DOM1pKeHHAuUn5EK8SY0Rq4wXpGEGgtX0IABus1Y6bLqMkLJHOhscJCbrVQGeG3mKLtI81Ff30v6oIkWEkUmy1fHYhtQN9-E_zeUOTQxZfrrDrGir7JgtaXfVputTsHL50suK_x7RZ0E2ezV5tDc72KkwsH',
    description: 'Modern tactical joggers in matte black, featuring reinforced knee panels and multiple functional cargo pockets with teal zipper pulls.',
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Midnight Black', hex: '#1a1a1a' }
    ],
    category: 'Outerwear'
  },
  {
    id: 'vector-core-tee',
    name: 'Vector Core Tee',
    subtitle: 'Optic White / Tech Print',
    price: 45.00,
    originalPrice: 60.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChhhWwdFkw6JeM2lQj7uHd6zHCbDlUBxlCHp2VyinovZaxAdFiIOQjYcQ0VRSRs3ANk0Un63yF84Br9sFSwh0cEsLRrewGXzQUrOZGcCHVj_mhZhj5DSTtl2q4-IDHyMU9LdI92W_VbxgiJCTMQBjv1o5FCcmnaXzE-lrO0l4c69qR_TU0M_0cleQt3Bi9V0qb9Q84fW64ubOe8SFzegttyD_EhhH3kkCWjY2wwqU7LKsXX_iXqUtDgx3aUJgVng3MWLpdkmp_hSWC',
    description: 'A crisp, white oversized graphic T-shirt with a minimalist technical diagram printed on the chest in reflective teal ink. Boxy oversized fit.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Optic White', hex: '#ffffff' }
    ],
    category: 'T-Shirts'
  },
  {
    id: 'storm-shell-v2',
    name: 'Storm Shell V2',
    subtitle: 'Forest Teal / Waterproof',
    price: 210.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeFU7BfWYTIq4feA0tS37_M_Fj_jU8r3lUwEAK36s2pZ78EOvUs8xqyyCS1epz-1MyFZ2gDDEkSDOKizsV7lDE6rHgufMzAuOoKQJZAutCy6aHF2Qkly1Y7Ok6smNsY6WgZVsnnepBwggXiq3aIpm3rLe_DeAwB_6TenruHOAnZbcs8G1wUEACw0k-FtfdZeiYlIXc0G4KgmeTdcd5WTrIfFFPpOHM5-36gX8EbTu28B-hMTukKt8CN3V7ThVck9eNL6iSnKOXwLL3',
    description: 'A futuristic technical shell jacket in a muted forest teal color, featuring waterproof zippers and an asymmetrical front closure.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Forest Teal', hex: '#0a4242' }
    ],
    category: 'Outerwear'
  },
  {
    id: 'kinetix-hi-top',
    name: 'Kinetix Hi-Top',
    subtitle: 'Stone Grey / Modular',
    price: 185.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs_tF23I_0G3NubpwVqPOSk1R2dOESOUs5jtPsrNGxC0Q4e8RwUYtAfDmJJeEVsviJEjvj8coq_Rphsiij9BpHClf5suKO81IGbSPYK3hCSdr8DPTAF9H-w5zEJaWJKOyITQjASdFZNbMZu0F36J7qF5wmEdQ5Ecm6JGoaAkUbh9OeqDBBLGIVgioolldL3otPrMY7T0JR6So_i65k2WlD7Ef52mRGBAYS9wHCnaKdU17UnKfgcqlw_peDZPAkqcwxkznkzawquk16',
    description: 'A pair of high-top techwear sneakers in multi-tonal grey and white, with complex strap systems and a chunky, sculpted sole.',
    sizes: ['8', '9', '10', '11', '12'],
    colors: [
      { name: 'Stone Grey', hex: '#8c8c8c' }
    ],
    category: 'Footwear'
  },
  {
    id: 'signal-sling-bag',
    name: 'Signal Sling Bag',
    subtitle: 'Carbon Black / Weatherproof',
    price: 65.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANW-fMLouqfrFpOy2qJROnDWOAl7x25XjxkDTGdkGw9SZpMmnLvB9XykTPfLjaOMqRykuAkOWNJpaDSHD0-oSI_Yi1MToGbxL0BLtIFaLv76PSheDhwA86lul4SIEj_q2CIULbttSvQkA0myxY02ilQIQDMH3LIFboUoN_HgYoBd8CURraAq4xPP3cPR-UFDCsuXaU7XOuQ5_6q-tN5waIgRS4xBhjR66h_h7LPy-CzuIAVQFd1Eq8r6fUtPQ_XAwRjbMOTdqHmrwQ',
    description: 'A sleek black technical crossbody bag with carbon-fiber textured panels and magnetic FIDLOCK buckles.',
    sizes: ['One Size'],
    colors: [
      { name: 'Carbon Black', hex: '#111111' }
    ],
    category: 'Accessories',
    soldOut: true
  },
  {
    id: 'core-heavyweight-hoodie',
    name: 'Core Heavyweight Hoodie',
    subtitle: 'Industrial Grey / Heavyweight',
    price: 145.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOShzYyebbEZcW7zMY2IdXnt2mN4bluylu_e_4BLg6zrYumO2u5enwq8-mQGjZPuLLgshq1TloNlmV_Be1yZ_4qXoMJm4KM8isxAHIyeelQ7dWth6SLFoBhj3fN7nSM4PTfyaTnRJm8GDtH8lCKqXRIwPQHI4XN8vgNBYEoxT1PwEKeeM0rzBbRFfbYBGeeYSivJHGsljp4A161E5-SnnC6WQZjQn_yaW0pp1VdYELKDL4AHaNzsIEyeZ4M7U5m1--DiCO5WSKebb_',
    badge: 'COLLECTION 01 / ESSENTIALS',
    description: 'Engineered for the modern urban landscape. Our Core Heavyweight Hoodie features a bespoke 500GSM cross-weave fleece, designed to hold its architectural shape while providing unparalleled comfort. Finished with precision-engineered hardware.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Stealth Grey', hex: '#3d3d3d' },
      { name: 'Midnight Black', hex: '#1a1a1a' },
      { name: 'Industrial Grey', hex: '#e5e5e5' }
    ],
    category: 'Outerwear'
  }
];
