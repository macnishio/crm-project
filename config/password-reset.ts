import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { sendEmail } from './email-service';
import { prisma } from './db'; // Prismaクライアントをインポート

const RESET_TOKEN_EXPIRY = 3600000; // 1 hour in milliseconds

export async function generatePasswordResetToken(userId: string): Promise<string> {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hash = await bcrypt.hash(resetToken, 10);

  await prisma.user.update({
    where: { id: userId },
    data: {
      resetToken: hash,
      resetTokenExpires: new Date(Date.now() + RESET_TOKEN_EXPIRY),
    },
  });

  return resetToken;
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `https://yourapp.com/reset-password?token=${resetToken}`;
  await sendEmail(email, 'Password Reset Request', `Please use the following link to reset your password: ${resetUrl}`);
}

export async function verifyPasswordResetToken(userId: string, token: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { resetToken: true, resetTokenExpires: true },
  });

  if (!user || !user.resetToken || !user.resetTokenExpires) return false;

  const isValid = await bcrypt.compare(token, user.resetToken);
  if (!isValid) return false;

  if (Date.now() > user.resetTokenExpires.getTime()) return false;

  return true;
}