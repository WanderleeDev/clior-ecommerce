import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'producto/:id',
    renderMode: RenderMode.Server,
  },
  {
    // The verification token is single-use: rendering this route on the server
    // (or prerendering it) would spend it before the customer's browser runs.
    path: 'verificar',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
