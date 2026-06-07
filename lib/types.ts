export type Category = {
  name: string;
  slug: string;
  description: string;
  image: string;
  accent: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  stock: number;
  weight: string;
  origin: string;
  tags: string[];
  featured?: boolean;
  newArrival?: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
