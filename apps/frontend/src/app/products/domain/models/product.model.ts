export interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  imageAlt: string;
  badge?: string;
  category: string;
  stock?: number;
}

export interface Category {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  linkLabel: string;
  icon: string;
}

export interface Brand {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  tags: string[];
}

export interface Testimonial {
  quote: string;
  owner: string;
  role: string;
  pet: string;
  image: string;
  imageAlt: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Review {
  author: string;
  pet: string;
  rating: number;
  date: string;
  title: string;
  text: string;
  helpful: number;
}
