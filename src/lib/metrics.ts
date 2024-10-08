import client from 'prom-client';
import express from 'express';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 500]
});

export function metricsMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.path, res.statusCode.toString())
      .observe(duration);
  });
  next();
}

export async function getMetrics(req: express.Request, res: express.Response) {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
}
