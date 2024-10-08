import express from 'express';
import Knex from 'knex';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import axios from 'axios';
import { sendEmail } from '../utils/email-service';
import logger from '../utils/logger';

const app = express();
app.use(express.json());

const knex = Knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'your_db_user',
    password: process.env.DB_PASSWORD || 'your_db_password',
    database: process.env.DB_NAME || 'your_db_name',
  },
});

// Email configuration
const _emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// SMS configuration
const _twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Push notification configuration
const _pushNotificationAPI = new PushNotificationAPI(process.env.PUSH_API_KEY);

// Send notification
export async function sendNotification(userId: string, message: string): Promise<void> {
  try {
    const userEmail = await getUserEmail(userId);
    await sendEmail(userEmail, 'Notification', message);
    logger.info(`Notification sent to user ${userId}`);
  } catch (_error) {
    logger.error(`Failed to send notification to user ${userId}`);
    throw new Error('Notification sending failed');
  }
}

export async function sendBulkNotifications(userIds: string[], message: string): Promise<void> {
  try {
    const emailPromises = userIds.map(async (userId) => {
      const userEmail = await getUserEmail(userId);
      return sendEmail(userEmail, 'Bulk Notification', message);
    });
    await Promise.all(emailPromises);
    logger.info(`Bulk notifications sent to ${userIds.length} users`);
  } catch (_error) {
    logger.error('Failed to send bulk notifications');
    throw new Error('Bulk notification sending failed');
  }
}

export async function scheduleNotification(userId: string, message: string, scheduledTime: Date): Promise<void> {
  try {
    setTimeout(async () => {
      await sendNotification(userId, message);
    }, scheduledTime.getTime() - Date.now());
    logger.info(`Notification scheduled for user ${userId} at ${scheduledTime}`);
  } catch (_error) {
    logger.error(`Failed to schedule notification for user ${userId}`);
    throw new Error('Notification scheduling failed');
  }
}

// ユーザーのメールアドレスを取得する関数E仮の実裁EE
async function getUserEmail(userId: string): Promise<string> {
  // 実際のチEEタベEスクエリに置き換える
  return `user-${userId}@example.com`;
}

// API Endpoints

// Send a notification
app.post('/notifications', async (req, res) => {
  try {
    const { userId, message, channels } = req.body;
    await sendNotification(userId, message, channels);
    res.json({ message: 'Notification sent successfully' });
  } catch (_error) {
    res.status(500).json({ error: 'Error sending notification' });
  }
});

// Get user notifications
app.get('/notifications/:userId', async (req, res) => {
  try {
    const notifications = await knex('notifications')
      .where({ user_id: req.params.userId })
      .orderBy('sent_at', 'desc')
      .limit(50);
    res.json(notifications);
  } catch (_error) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
});

// Update user notification preferences
app.put('/users/:userId/notification-preferences', async (req, res) => {
  try {
    const { email_enabled, sms_enabled, push_enabled } = req.body;
    await knex('users')
      .where({ id: req.params.userId })
      .update({ email_enabled, sms_enabled, push_enabled });
    res.json({ message: 'Notification preferences updated successfully' });
  } catch (_error) {
    res.status(500).json({ error: 'Error updating notification preferences' });
  }
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => console.log(`Notification service running on port ${PORT}`));

export default app;
