import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { Request, Response } from 'express';

const app = express();

// Logging middleware
app.use(morgan('combined'));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Authentication service proxy
app.use('/auth', createProxyMiddleware({
  target: 'http://auth-service:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', // remove /auth from the URL
  },
}));

// Customer management service proxy
app.use('/customers', createProxyMiddleware({
  target: 'http://customer-service:3001',
  changeOrigin: true,
}));

// Sales management service proxy
app.use('/sales', createProxyMiddleware({
  target: 'http://sales-service:3002',
  changeOrigin: true,
}));

// Marketing automation service proxy
app.use('/marketing',  createProxyMiddleware({
  target: 'http://marketing-service:3003',
  changeOrigin: true,
}));

// Customer support service proxy
app.use('/support', createProxyMiddleware({
  target: 'http://support-service:3004',
  changeOrigin: true,
}));

// Analytics and reporting service proxy
app.use('/analytics', createProxyMiddleware({
  target: 'http://analytics-service:3005',
  changeOrigin: true,
}));

// Error handling middleware
app.use((req: Request, res: Response) => {
  res.status(404).send('Not Found');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));

export default app;
