export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductBrand {
  id?: string;
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
  // category is detail-only. brand rides the listing too, but only its display
  // fields; the detail read is what loads the full brand id alongside.
  category?: ProductCategory;
  brand?: ProductBrand;
}
