export const TRENDING = [
  {
    id: 1,
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    rating: 4.8,
    reviews: 12400,
    price: "$$$$",
    img: "https://fimgs.net/mdimg/perfume-thumbs/375x500.33519.jpg",
    tag: "Floral · Woody",
    notes: ["Floral", "Woody", "Amber"],
  },
  {
    id: 2,
    name: "Santal 33",
    brand: "Le Labo",
    rating: 4.7,
    reviews: 9870,
    price: "$$$",
    img: "https://cms.brnstc.de/product_images/680x930_retina/cpro/media/images/product/24/5/842185115861_0_1715333945614.jpg",
    tag: "Woody · Aromatic",
    notes: ["Woody", "Leather"],
  },
  {
    id: 3,
    name: "Oud Wood",
    brand: "Tom Ford",
    rating: 4.6,
    reviews: 8340,
    price: "$$$$",
    img: "https://www.tomfordbeauty.com/cdn/shop/files/tf_sku_T1XF01_2000x2000_0.png?v=1784519770&width=2000",
    tag: "Oriental · Woody",
    notes: ["Oud", "Woody", "Amber"],
  },
  {
    id: 4,
    name: "Blanche",
    brand: "Byredo",
    rating: 4.5,
    reviews: 6120,
    price: "$$$",
    img: "https://www.byredo.com/media/catalog/product/cache/ce8f7c988c2643ead2f5aa8c72454f56/1/0/10000052_1_full_no.jpg",
    tag: "Floral · Powdery",
    notes: ["Floral", "Vanilla"],
  },
];

export const NOTES = [
  { name: "Oud", emoji: "🪵", count: "1,240", color: "#8B6F47" },
  { name: "Vanilla", emoji: "🤍", count: "2,380", color: "#D4C4A0" },
  { name: "Citrus", emoji: "🍋", count: "3,150", color: "#D4B84A" },
  { name: "Amber", emoji: "🟡", count: "1,890", color: "#C9853E" },
  { name: "Leather", emoji: "🖤", count: "980", color: "#6B5040" },
  { name: "Rose", emoji: "🌹", count: "2,640", color: "#B87087" },
  { name: "Aquatic", emoji: "💧", count: "1,320", color: "#4A8FA6" },
  { name: "Woody", emoji: "🌲", count: "2,100", color: "#5A7A5A" },
];

export const BRANDS = [
  { name: "Tom Ford", founded: "2006" },
  { name: "Chanel", founded: "1910" },
  { name: "Dior", founded: "1947" },
  { name: "Creed", founded: "1760" },
  { name: "Byredo", founded: "2006" },
  { name: "Le Labo", founded: "2006" },
  { name: "Maison Margiela", founded: "1984" },
  { name: "Guerlain", founded: "1828" },
  { name: "Hermès", founded: "1837" },
  { name: "Kilian Paris", founded: "2007" },
];

export const TOP_RATED = [
  {
    id: 1,
    name: "Aventus",
    brand: "Creed",
    rating: 4.9,
    img: "https://fimgs.net/mdimg/perfume-thumbs/375x500.9828.jpg",
    year: 2010,
    votes: "34.2k",
    notes: ["Citrus", "Woody"],
  },
  {
    id: 2,
    name: "Noir de Noir",
    brand: "Tom Ford",
    rating: 4.8,
    img: "https://fimgs.net/mdimg/perfume-thumbs/375x500.1822.jpg",
    year: 2007,
    votes: "21.7k",
    notes: ["Rose", "Oud", "Woody"],
  },
  {
    id: 3,
    name: "Portrait of a Lady",
    brand: "Frédéric Malle",
    rating: 4.8,
    img: "https://fimgs.net/mdimg/perfume-thumbs/375x500.10464.jpg",
    year: 2010,
    votes: "18.9k",
    notes: ["Rose", "Woody"],
  },
  {
    id: 4,
    name: "Tobacco Vanille",
    brand: "Tom Ford",
    rating: 4.8,
    img: "https://fimgs.net/mdimg/perfume-thumbs/375x500.1825.jpg",
    year: 2007,
    votes: "29.1k",
    notes: ["Vanilla", "Woody"],
  },
  {
    id: 5,
    name: "Neroli Portofino",
    brand: "Tom Ford",
    rating: 4.7,
    img: "https://fimgs.net/mdimg/perfume-thumbs/375x500.12192.jpg",
    year: 2011,
    votes: "15.3k",
    notes: ["Citrus", "Aquatic"],
  },
  {
    id: 6,
    name: "Encre Noire",
    brand: "Lalique",
    rating: 4.7,
    img: "https://fimgs.net/mdimg/perfume-thumbs/375x500.1834.jpg",
    year: 2006,
    votes: "11.8k",
    notes: ["Woody"],
  },
];

export const fragranceImageUrl = (image: string, width: number, height: number) =>
  image.startsWith("http")
    ? image
    : `https://images.unsplash.com/photo-${image}?w=${width}&h=${height}&fit=crop&auto=format`;

export const ALL_FRAGRANCES = [...TRENDING, ...TOP_RATED];

export const fragranceRoute = (fragrance: {
  id: number;
  name: string;
  brand: string;
}) =>
  TOP_RATED.some(
    (p) => p.name === fragrance.name && p.brand === fragrance.brand,
  )
    ? `/fragrance/top-${fragrance.id}`
    : `/fragrance/${fragrance.id}`;