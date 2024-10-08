import request from 'supertest';
import app from '../app';
import { createCustomer, getCustomer } from '../services/customer';

jest.mock('../services/customer');

describe('Customer API', () => {
  describe('POST /api/customers', () => {
    it('should create a new customer', async () => {
      const mockCustomer = { id: '1', name: 'Test Customer', email: 'test@example.com' };
      (createCustomer as jest.Mock).mockResolvedValue(mockCustomer);

      const response = await request(app)
        .post('/api/customers')
        .send({ name: 'Test Customer', email: 'test@example.com' })
        .expect(201);

      expect(response.body).toEqual(mockCustomer);
      expect(createCustomer).toHaveBeenCalledWith({ name: 'Test Customer', email: 'test@example.com' });
    });
  });

  describe('GET /api/customers/:id', () => {
    it('should return a customer by id', async () => {
      const mockCustomer = { id: '1', name: 'Test Customer', email: 'test@example.com' };
      (getCustomer as jest.Mock).mockResolvedValue(mockCustomer);

      const response = await request(app)
        .get('/api/customers/1')
        .expect(200);

      expect(response.body).toEqual(mockCustomer);
      expect(getCustomer).toHaveBeenCalledWith('1');
    });

    it('should return 404 if customer is not found', async () => {
      (getCustomer as jest.Mock).mockResolvedValue(null);

      await request(app)
        .get('/api/customers/999')
        .expect(404);
    });
  });
});