import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home-page').then((m) => m.HomePage),
    title: 'Clior Pets | Todo para tu mascota',
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./products/presentation/views/product-list/product-list.view').then(
        (m) => m.ProductListView,
      ),
    title: 'Clior Pets | Catálogo',
  },
  {
    path: 'producto/:id',
    loadComponent: () =>
      import('./products/presentation/views/product-detail/product-detail.view').then(
        (m) => m.ProductDetailView,
      ),
    title: 'Clior Pets | Producto',
  },
  {
    path: 'marcas',
    loadComponent: () =>
      import('./products/presentation/views/brand-list/brand-list.view').then(
        (m) => m.BrandListView,
      ),
    title: 'Clior Pets | Marcas',
  },
  {
    path: 'carrito',
    loadComponent: () => import('./cart/cart-page').then((m) => m.CartPage),
    title: 'Clior Pets | Carrito',
  },
  {
    path: 'ayuda',
    loadComponent: () => import('./help/help-page').then((m) => m.HelpPage),
    title: 'Clior Pets | Ayuda',
  },
  {
    path: 'blog',
    loadComponent: () => import('./blog/blog-page').then((m) => m.BlogPage),
    title: 'Clior Pets | Blog',
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./contact/contact-page').then((m) => m.ContactPage),
    title: 'Clior Pets | Contáctanos',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
