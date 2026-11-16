import express from 'express';
import request from 'supertest';
import { applyProxyTrust } from './proxy-trust';

function probeApp() {
  const app = express();
  applyProxyTrust(app);
  app.get('/probe', (req, res) => {
    res.json({ protocol: req.protocol });
  });
  return app;
}

describe('applyProxyTrust', () => {
  it('resolves https from X-Forwarded-Proto behind the TLS-terminating tunnel', async () => {
    const res = await request(probeApp())
      .get('/probe')
      .set('Host', 'clior-dev.wanderlee.site')
      .set('X-Forwarded-Proto', 'https');

    expect(res.body.protocol).toBe('https');
  });

  it('keeps http for direct local requests without proxy headers', async () => {
    const res = await request(probeApp()).get('/probe').set('Host', '127.0.0.1:3001');

    expect(res.body.protocol).toBe('http');
  });
});