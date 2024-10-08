import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function login(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    logger.info(`User logged in: ${user.id}`);
    return { token };
  } catch (error) {
    logger.error('Login failed', { error });
    throw new Error('Login failed');
  }
}

export async function register(userData: { email: string; password: string; name: string }) {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    logger.info(`New user registered: ${user.id}`);
    return { userId: user.id };
  } catch (error) {
    logger.error('User registration failed', { error });
    throw new Error('User registration failed');
  }
}

export async function changePassword(userId: string, oldPassword: string, newPassword: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid old password');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    logger.info(`Password changed for user: ${userId}`);
    return true;
  } catch (error) {
    logger.error('Password change failed', { error });
    throw new Error('Password change failed');
  }
}

// 他�E認証関連の関数も同様に実�
