import type { Brand, Category, Product, Testimonial } from '../domain/models/product.model';

export interface ProductView {
  product: Product;
  related: Product[];
  thumbs: string[];
  showDiscount: boolean;
  savings: number | null;
  ctaEnabled: boolean;
}

export interface ProductListView {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  total: number;
}

export { type Brand, type Category, type Product, type Testimonial };
