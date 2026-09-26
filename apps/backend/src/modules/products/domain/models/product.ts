export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductBrand {
  id: string;
  name: string;
  slug: string;
}

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
  // Loaded by the detail read only. The catalog listing selects neither the
  // foreign keys nor the relations, so a listing item has neither.
  category?: ProductCategory;
  brand?: ProductBrand;
}
