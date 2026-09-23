export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string;
  categoryId?: string;
  brandId?: string;
  stock: number;
  createdAt: Date;
}
