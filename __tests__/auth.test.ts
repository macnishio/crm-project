import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { login, generateToken } from '../services/auth';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  describe('login', () => {
    it('should return a token when credentials are valid', async () => {
      const mockUser = { id: '1', email: 'test@example.com', password: 'hashedPassword' };
      const mockCompare = bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>;
      mockCompare.mockResolvedValue(true);

      const mockSign = jwt.sign as jest.MockedFunction<typeof jwt.sign>;
      mockSign.mockReturnValue('mockToken');

      const result = await login('test@example.com', 'password');

      expect(result).toBe('mockToken');
      expect(mockCompare).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(mockSign).toHaveBeenCalledWith({ userId: '1' }, expect.any(String), expect.any(Object));
    });

    it('should throw an error when credentials are invalid', async () => {
      const mockCompare = bcrypt.compare as jest.MockedFunction<typeof bcrypt.compare>;
      mockCompare.mockResolvedValue(false);

      await expect(login('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('generateToken', () => {
    it('should generate a token with the correct payload', () => {
      const mockSign = jwt.sign as jest.MockedFunction<typeof jwt.sign>;
      mockSign.mockReturnValue('mockToken');

      const token = generateToken('1');

      expect(token).toBe('mockToken');
      expect(mockSign).toHaveBeenCalledWith({ userId: '1' }, expect.any(String), expect.any(Object));
    });
  });
});