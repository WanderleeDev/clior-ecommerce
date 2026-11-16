import type { Express } from 'express';

// The Cloudflare tunnel terminates TLS one hop away; trust that hop so
// request.protocol reflects X-Forwarded-Proto and the refresh-cookie policy
// sees the real https origin (D-11).
export function applyProxyTrust(app: Express): void {
  app.set('trust proxy', 1);
}