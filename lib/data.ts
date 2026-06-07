import { Category, Product } from "@/lib/types";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`;

export const categories: Category[] = [
  {
    name: "South Indian Groceries",
    slug: "south-indian-groceries",
    description: "Pantry foundations sourced from trusted southern makers.",
    image: img("photo-1596040033229-a9821ebd058d"),
    accent: "from-amber-900/80 to-amber-500/20"
  },
  {
    name: "Namkeen & Snacks",
    slug: "namkeen-snacks",
    description: "Crunchy, nostalgic recipes made in small batches.",
    image: img("photo-1601050690597-df0568f70950"),
    accent: "from-orange-950/80 to-orange-400/20"
  },
  {
    name: "Sweets",
    slug: "sweets",
    description: "Celebration-ready classics with authentic ingredients.",
    image: "/images/southaura-festival-gifting.webp",
    accent: "from-rose-950/80 to-rose-400/20"
  },
  {
    name: "Sarees & Garments",
    slug: "sarees-garments",
    description: "Handpicked weaves and elegant everyday textiles.",
    image: img("photo-1610189012906-4c0aa9b9781e"),
    accent: "from-fuchsia-950/80 to-fuchsia-400/20"
  },
  {
    name: "Pooja Items",
    slug: "pooja-items",
    description: "Meaningful essentials for daily rituals and festivals.",
    image: img("photo-1604608672516-f1b9b1d37076"),
    accent: "from-yellow-950/80 to-yellow-400/20"
  },
  {
    name: "Ayurvedic Products",
    slug: "ayurvedic-products",
    description: "Time-honoured wellness for modern routines.",
    image: img("photo-1608571423902-eed4a5ad8108"),
    accent: "from-emerald-950/80 to-emerald-400/20"
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Thoughtful craft for the soulful Indian home.",
    image: img("photo-1556911220-bff31c812dba"),
    accent: "from-stone-950/80 to-stone-400/20"
  },
  {
    name: "Spices & Masala",
    slug: "spices-masala",
    description: "Fragrant blends ground for unmistakable depth.",
    image: img("photo-1596040033229-a9821ebd058d"),
    accent: "from-red-950/80 to-red-400/20"
  },
  {
    name: "Pickles & Papad",
    slug: "pickles-papad",
    description: "Sun-cured, slow-made accompaniments with real character.",
    image: "/images/southaura-hero-marketplace.png",
    accent: "from-lime-950/80 to-lime-400/20"
  },
  {
    name: "Coffee & Tea",
    slug: "coffee-tea",
    description: "Estate-grown brews from the hills of the South.",
    image: img("photo-1495474472287-4d71bcdd2085"),
    accent: "from-neutral-950/80 to-neutral-400/20"
  }
];

export const products: Product[] = [
  {
    id: 1,
    name: "Coorg Estate Filter Coffee",
    slug: "coorg-estate-filter-coffee",
    category: "coffee-tea",
    description: "A rich 80:20 coffee-chicory blend with cocoa and caramel notes.",
    longDescription:
      "Slow-roasted in small batches using shade-grown beans from Coorg. This classic South Indian blend delivers a full-bodied decoction, a lingering chocolate finish, and the unmistakable comfort of a steel tumbler morning.",
    price: 449,
    originalPrice: 525,
    rating: 4.9,
    reviewCount: 286,
    image: img("photo-1447933601403-0c6688de566e"),
    badge: "Bestseller",
    stock: 34,
    weight: "500 g",
    origin: "Coorg, Karnataka",
    tags: ["coffee", "estate", "vegetarian"],
    featured: true
  },
  {
    id: 2,
    name: "Madras Murukku Trio",
    slug: "madras-murukku-trio",
    category: "namkeen-snacks",
    description: "Three heritage recipes: butter, pepper and ribbon pakoda.",
    longDescription:
      "An addictive trio made with rice flour, cold-pressed oil and freshly cracked spices. Packed for freshness and ideal for gifting, travel, or a proper evening chai ritual.",
    price: 599,
    originalPrice: 699,
    rating: 4.8,
    reviewCount: 174,
    image: img("photo-1601050690117-94f5f6fa8bd7"),
    badge: "Curator's pick",
    stock: 21,
    weight: "3 x 200 g",
    origin: "Chennai, Tamil Nadu",
    tags: ["snacks", "savory", "gift"],
    featured: true
  },
  {
    id: 3,
    name: "Temple Town Mysore Pak",
    slug: "temple-town-mysore-pak",
    category: "sweets",
    description: "Silken, ghee-rich squares made with gram flour and patience.",
    longDescription:
      "A melt-in-the-mouth Mysore Pak with a delicate grain and generous aroma of pure ghee. Prepared fresh in limited batches and packed in a premium keepsake box.",
    price: 699,
    originalPrice: 799,
    rating: 4.9,
    reviewCount: 321,
    image: img("photo-1589119908995-c6837fa14848"),
    badge: "Fresh batch",
    stock: 12,
    weight: "500 g",
    origin: "Mysuru, Karnataka",
    tags: ["sweet", "ghee", "gift"],
    featured: true,
    newArrival: true
  },
  {
    id: 4,
    name: "Kanchipuram Silk Stole",
    slug: "kanchipuram-silk-stole",
    category: "sarees-garments",
    description: "A jewel-toned pure silk stole with a traditional zari border.",
    longDescription:
      "Woven by a family-led atelier using time-honoured Kanchipuram techniques. The compact format makes this lustrous silk an elegant layer for festive and contemporary wardrobes.",
    price: 3490,
    originalPrice: 4200,
    rating: 4.7,
    reviewCount: 68,
    image: img("photo-1610030469983-98e550d6193c"),
    badge: "Artisan made",
    stock: 7,
    weight: "One size",
    origin: "Kanchipuram, Tamil Nadu",
    tags: ["silk", "handloom", "gift"],
    featured: true
  },
  {
    id: 5,
    name: "Brass Nilavilakku",
    slug: "brass-nilavilakku",
    category: "pooja-items",
    description: "A finely balanced Kerala lamp hand-finished by metal artisans.",
    longDescription:
      "A timeless ceremonial lamp cast in solid brass and polished by hand. Its elegant proportions bring a warm, grounded presence to entrances, altars, and festive tables.",
    price: 1890,
    originalPrice: 2190,
    rating: 4.8,
    reviewCount: 95,
    image: img("photo-1605379399642-870262d3d051"),
    badge: "Heirloom",
    stock: 9,
    weight: "1.2 kg",
    origin: "Mannarsala, Kerala",
    tags: ["brass", "pooja", "decor"],
    featured: true
  },
  {
    id: 6,
    name: "Nalpamaradi Body Oil",
    slug: "nalpamaradi-body-oil",
    category: "ayurvedic-products",
    description: "A traditional botanical ritual for luminous, nourished skin.",
    longDescription:
      "A balanced blend inspired by Kerala Ayurveda, made with turmeric, sesame oil and bark extracts. Use as a pre-bath body ritual for visibly nourished, supple skin.",
    price: 875,
    rating: 4.6,
    reviewCount: 143,
    image: img("photo-1608248543803-ba4f8c70ae0b"),
    badge: "Ritual",
    stock: 26,
    weight: "200 ml",
    origin: "Thrissur, Kerala",
    tags: ["ayurveda", "wellness", "body"],
    newArrival: true
  },
  {
    id: 7,
    name: "Chettinad Spice Caddy",
    slug: "chettinad-spice-caddy",
    category: "home-kitchen",
    description: "A warm acacia wood masala box with seven removable cups.",
    longDescription:
      "Designed for everyday cooking and beautiful enough for an open shelf. The rotating lid and seven metal cups keep your essential spices fresh and close at hand.",
    price: 1590,
    originalPrice: 1790,
    rating: 4.7,
    reviewCount: 88,
    image: img("photo-1532336414038-cf19250c5757"),
    stock: 18,
    weight: "9 inch",
    origin: "Karaikudi, Tamil Nadu",
    tags: ["kitchen", "wood", "spice"],
    newArrival: true
  },
  {
    id: 8,
    name: "Malabar Garam Masala",
    slug: "malabar-garam-masala",
    category: "spices-masala",
    description: "A deeply aromatic house blend with pepper, fennel and mace.",
    longDescription:
      "Whole spices are sourced close to harvest, gently roasted, and stone-ground for a rounded blend with exceptional bloom. Add at the finish for fragrant curries and roasts.",
    price: 299,
    rating: 4.8,
    reviewCount: 208,
    image: img("photo-1596040033229-a9821ebd058d"),
    badge: "Single origin",
    stock: 52,
    weight: "150 g",
    origin: "Wayanad, Kerala",
    tags: ["spice", "masala", "pantry"],
    featured: true
  },
  {
    id: 9,
    name: "Avakaya Mango Pickle",
    slug: "avakaya-mango-pickle",
    category: "pickles-papad",
    description: "Fiery Andhra mango pickle matured in cold-pressed sesame oil.",
    longDescription:
      "Raw mango, mustard, chilli and sesame oil come together in this bold family recipe. Matured naturally for a punchy, savoury pickle with satisfying texture.",
    price: 425,
    rating: 4.9,
    reviewCount: 412,
    image: "/images/southaura-hero-marketplace.png",
    badge: "Cult favourite",
    stock: 40,
    weight: "400 g",
    origin: "Guntur, Andhra Pradesh",
    tags: ["pickle", "mango", "spicy"],
    featured: true
  },
  {
    id: 10,
    name: "Kerala Matta Rice",
    slug: "kerala-matta-rice",
    category: "south-indian-groceries",
    description: "Nutty, robust red parboiled rice from Palakkad farms.",
    longDescription:
      "Known for its rosy hue, substantial texture and naturally nutty flavour. This everyday staple is cleaned, graded and packed close to source for better freshness.",
    price: 625,
    rating: 4.6,
    reviewCount: 127,
    image: img("photo-1586201375761-83865001e31c"),
    stock: 61,
    weight: "2 kg",
    origin: "Palakkad, Kerala",
    tags: ["rice", "grocery", "vegan"]
  },
  {
    id: 11,
    name: "Kumbakonam Degree Coffee",
    slug: "kumbakonam-degree-coffee",
    category: "coffee-tea",
    description: "A dark, velvety roast built for frothy filter coffee.",
    longDescription:
      "A classic Tamil Nadu roast made for a strong decoction that holds beautifully with milk. Expect toasted hazelnut, dark cocoa and a clean, lingering finish.",
    price: 389,
    rating: 4.7,
    reviewCount: 196,
    image: img("photo-1497515114629-f71d768fd07c"),
    stock: 46,
    weight: "500 g",
    origin: "Kumbakonam, Tamil Nadu",
    tags: ["coffee", "dark roast", "daily"]
  },
  {
    id: 12,
    name: "Banana Chips Reserve",
    slug: "banana-chips-reserve",
    category: "namkeen-snacks",
    description: "Thin Nendran banana crisps fried in fresh coconut oil.",
    longDescription:
      "A benchmark Kerala snack: ripe enough for flavour, firm enough for crunch, and seasoned with mineral salt. Sealed immediately after frying for exceptional crispness.",
    price: 349,
    rating: 4.8,
    reviewCount: 264,
    image: img("photo-1601050690597-df0568f70950"),
    badge: "Small batch",
    stock: 39,
    weight: "250 g",
    origin: "Kozhikode, Kerala",
    tags: ["chips", "coconut oil", "snack"],
    newArrival: true
  },
  {
    id: 13,
    name: "Rosewood Serving Board",
    slug: "rosewood-serving-board",
    category: "home-kitchen",
    description: "A sculptural, hand-finished board for elegant hosting.",
    longDescription:
      "Carved from responsibly sourced hardwood with softly rounded edges. Each board has a distinctive grain and arrives finished with food-safe oil.",
    price: 1290,
    rating: 4.5,
    reviewCount: 44,
    image: img("photo-1556911220-e15b29be8c8f"),
    stock: 14,
    weight: "38 x 18 cm",
    origin: "Mysuru, Karnataka",
    tags: ["wood", "serveware", "home"],
    newArrival: true
  },
  {
    id: 14,
    name: "Rasam Powder No. 4",
    slug: "rasam-powder-no-4",
    category: "spices-masala",
    description: "Pepper-forward heirloom rasam blend with roasted lentils.",
    longDescription:
      "A bright, warming spice blend with coriander, cumin, black pepper and toasted dal. Designed for a deeply satisfying rasam in minutes.",
    price: 245,
    rating: 4.7,
    reviewCount: 182,
    image: img("photo-1596040033229-a9821ebd058d"),
    stock: 73,
    weight: "150 g",
    origin: "Madurai, Tamil Nadu",
    tags: ["rasam", "masala", "pantry"]
  },
  {
    id: 15,
    name: "Handloom Cotton Saree",
    slug: "handloom-cotton-saree",
    category: "sarees-garments",
    description: "Airy organic cotton with a restrained temple border.",
    longDescription:
      "A soft, breathable weave made for long days and repeat wear. The understated temple border lends a quiet graphic quality without overpowering the fabric.",
    price: 2890,
    rating: 4.8,
    reviewCount: 73,
    image: img("photo-1610189012906-4c0aa9b9781e"),
    stock: 6,
    weight: "6.2 m",
    origin: "Coimbatore, Tamil Nadu",
    tags: ["saree", "cotton", "handloom"],
    newArrival: true
  },
  {
    id: 16,
    name: "Sandalwood Incense Set",
    slug: "sandalwood-incense-set",
    category: "pooja-items",
    description: "Low-smoke incense rolled by hand with Mysore sandalwood.",
    longDescription:
      "A calm, woody fragrance made without synthetic dyes. Each box includes incense, a brass holder and a compact ritual card for a thoughtful housewarming gift.",
    price: 549,
    rating: 4.6,
    reviewCount: 117,
    image: img("photo-1603006905003-be475563bc59"),
    stock: 31,
    weight: "60 sticks",
    origin: "Mysuru, Karnataka",
    tags: ["incense", "sandalwood", "ritual"]
  }
];

export const reviews = [
  {
    name: "Meera Khanna",
    location: "Gurugram",
    quote:
      "The coffee arrived beautifully packed and tasted exactly like mornings at my grandmother's home in Coorg.",
    rating: 5
  },
  {
    name: "Arjun Malhotra",
    location: "Toronto",
    quote:
      "International delivery was transparent, quick, and the curation feels genuinely special rather than mass-market.",
    rating: 5
  },
  {
    name: "Naina Kapoor",
    location: "New Delhi",
    quote:
      "I ordered a festive hamper for clients. The presentation was impeccable and every item felt considered.",
    rating: 5
  }
];

export const blogPosts = [
  {
    slug: "perfect-filter-coffee",
    title: "The quiet art of perfect South Indian filter coffee",
    excerpt: "A measured guide to roast, decoction, milk and the iconic metre pour.",
    category: "Rituals",
    date: "May 18, 2026",
    image: img("photo-1495474472287-4d71bcdd2085")
  },
  {
    slug: "southern-pantry",
    title: "Seven essentials for a deeply stocked southern pantry",
    excerpt: "The grains, spices and preserves that make weeknight cooking sing.",
    category: "Food",
    date: "May 10, 2026",
    image: img("photo-1596040033229-a9821ebd058d")
  },
  {
    slug: "weaves-of-kanchipuram",
    title: "How to recognise an enduring Kanchipuram weave",
    excerpt: "A closer look at silk, zari, borders and the hands behind the loom.",
    category: "Craft",
    date: "April 27, 2026",
    image: img("photo-1610030469983-98e550d6193c")
  }
];

export const getProduct = (slug: string) =>
  products.find((product) => product.slug === slug);

export const getCategory = (slug: string) =>
  categories.find((category) => category.slug === slug);
