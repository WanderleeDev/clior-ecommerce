export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  thumbnail: string;
  images: string[];
  category: string;
  rating: Rating;
  discount: number | null;
}

export interface Rating {
  rate: number;
  count: number;
}
