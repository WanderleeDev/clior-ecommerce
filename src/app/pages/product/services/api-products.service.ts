import { Injectable } from '@angular/core';
import { Product } from '../model/Product.model';
import { generateRandomId } from '../../../shared/utils/generateRandomId';

@Injectable({
  providedIn: 'root',
})
export class ApiProductsService {
  readonly #mockProducts: Product[] = [
    {
      id: generateRandomId(),
      name: 'Omega-3 Fish Oil Complex',
      price: 29.99,
      quantity: 120,
      description:
        'High-quality fish oil supplement rich in EPA & DHA for heart and brain health. Contains 1000mg per serving.',
      thumbnail: 'assets/products/omega3.webp',
      images: [
        'assets/products/omega3-1.webp',
        'assets/products/omega3-2.webp',
      ],
      category: 'supplements',
      rating: { rate: 4.8, count: 245 },
      discount: 0.1,
    },
    {
      id: generateRandomId(),
      name: 'Vitamin D3 + K2 Drops',
      price: 24.99,
      quantity: 60,
      description:
        'Liquid vitamin D3 (5000 IU) combined with K2-MK7 for optimal calcium absorption and bone health.',
      thumbnail: 'assets/products/vitamin-d.webp',
      images: [
        'assets/products/vitamin-d-1.webp',
        'assets/products/vitamin-d-2.webp',
      ],
      category: 'supplements',
      rating: { rate: 4.7, count: 189 },
      discount: 0.1,
    },
    {
      id: generateRandomId(),
      name: 'Probiotic Complex',
      price: 34.99,
      quantity: 30,
      description:
        'Advanced probiotic formula with 50 billion CFU and 12 strains for digestive and immune health.',
      thumbnail: 'assets/products/probiotic.webp',
      images: [
        'assets/products/probiotic-1.webp',
        'assets/products/probiotic-2.webp',
      ],
      category: 'supplements',
      rating: { rate: 4.9, count: 312 },
      discount: null,
    },
    {
      id: generateRandomId(),
      name: 'Magnesium Glycinate',
      price: 27.99,
      quantity: 180,
      description:
        'Highly bioavailable magnesium form for better sleep, muscle recovery and nervous system support.',
      thumbnail: 'assets/products/magnesium.webp',
      images: [
        'assets/products/magnesium-1.webp',
        'assets/products/magnesium-2.webp',
      ],
      category: 'supplements',
      rating: { rate: 4.6, count: 178 },
      discount: null,
    },
    {
      id: generateRandomId(),
      name: 'Collagen Peptides Powder',
      price: 39.99,
      quantity: 300,
      description:
        'Grass-fed collagen protein powder for skin, hair, nails, and joint health. Unflavored and easily mixable.',
      thumbnail: 'assets/products/collagen.webp',
      images: [
        'assets/products/collagen-1.webp',
        'assets/products/collagen-2.webp',
      ],
      category: 'nutraceutics',
      rating: { rate: 4.8, count: 423 },
      discount: null,
    },
    {
      id: generateRandomId(),
      name: 'Ashwagandha Extract',
      price: 32.99,
      quantity: 90,
      description:
        'Organic KSM-66 Ashwagandha extract for stress relief, improved energy and better sleep quality.',
      thumbnail: 'assets/products/ashwagandha.webp',
      images: [
        'assets/products/ashwagandha-1.webp',
        'assets/products/ashwagandha-2.webp',
      ],
      category: 'nutraceutics',
      rating: { rate: 4.7, count: 156 },
      discount: null,
    },
    {
      id: generateRandomId(),
      name: 'Curcumin Complex',
      price: 45.99,
      quantity: 60,
      description:
        'Enhanced absorption curcumin formula with BioPerine for inflammation support and joint health.',
      thumbnail: 'assets/products/curcumin.webp',
      images: [
        'assets/products/curcumin-1.webp',
        'assets/products/curcumin-2.webp',
      ],
      category: 'nutraceutics',
      rating: { rate: 4.9, count: 289 },
      discount: null,
    },
    {
      id: generateRandomId(),
      name: 'Green Superfood Blend',
      price: 49.99,
      quantity: 240,
      description:
        'Organic greens powder with spirulina, chlorella, and wheat grass for daily nutrition support.',
      thumbnail: 'assets/products/greens.webp',
      images: [
        'assets/products/greens-1.webp',
        'assets/products/greens-2.webp',
      ],
      category: 'nutraceutics',
      rating: { rate: 4.5, count: 167 },
      discount: null,
    },
    {
      id: generateRandomId(),
      name: 'MCT Oil Powder',
      price: 29.99,
      quantity: 450,
      description:
        'Clean MCT oil powder from coconuts for mental clarity and sustained energy. Perfect for keto diet.',
      thumbnail: '',
      images: ['assets/products/mct-1.webp', 'assets/products/mct-2.webp'],
      category: 'nutraceutics',
      rating: { rate: 4.6, count: 198 },
      discount: null,
    },
    {
      id: generateRandomId(),
      name: 'Zinc Picolinate',
      price: 19.99,
      quantity: 100,
      description:
        'High absorption zinc supplement for immune support and skin health. Contains 50mg per serving.',
      thumbnail: '',
      images: ['assets/products/zinc-1.webp', 'assets/products/zinc-2.webp'],
      category: 'supplements',
      rating: { rate: 4.7, count: 145 },
      discount: null,
    },
  ];

  getProducts(): Product[] {
    return this.#mockProducts;
  }

  getProductById(id: string): Product | null {
    return this.#mockProducts.find((product) => product.id === id) ?? null;
  }
}
