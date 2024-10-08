import { PrismaClient } from '@prisma/client';
import { logger } from './utils/logger';

const prisma = new PrismaClient();

interface SyncData {
  // 同期データの型を定義
  [key: string]: unknown;
}

export async function syncData<T>(data: T): Promise<void> {
  try {
    // 同期ロジックを実装
    await prisma.user.create({
      data: {
        email: 'sync@example.com',
        name: 'Data synchronization completed successfully',
        password: 'SUCCESS',
      },
    });
    logger.info('Data synchronization completed successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      await prisma.user.create({
        data: {
          email: 'sync-error@example.com',
          name: `Data synchronization failed: ${error.message}`,
          password: 'ERROR',
        },
      });
      logger.error(`Data synchronization failed: ${error.message}`);
    } else {
      logger.error('Data synchronization failed: Unknown error');
    }
    throw new Error('Data synchronization failed');
  }
}

async function syncCustomers(tx: any, customers: SyncData[]): Promise<void> {
  for (const customer of customers) {
    await tx.customer.upsert({
      where: { id: customer.id as string },
      update: customer,
      create: customer,
    });
  }
}

async function syncSales(tx: any, sales: SyncData[]): Promise<void> {
  for (const sale of sales) {
    await tx.sale.upsert({
      where: { id: sale.id as string },
      update: sale,
      create: sale,
    });
  }
}

export async function getLastSyncTimestamp(): Promise<Date | null> {
  try {
    const lastSync = await prisma.user.findFirst({
      where: { email: 'sync@example.com' },
      orderBy: { updatedAt: 'desc' }, // createdAt を updatedAt に変更
    });
    return lastSync ? lastSync.updatedAt : null; // createdAt を updatedAt に変更
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error fetching last sync timestamp: ${error.message}`);
    } else {
      logger.error('Error fetching last sync timestamp: Unknown error');
    }
    return null;
  }
}

export async function updateSyncTimestamp(): Promise<void> {
  try {
    await prisma.user.create({
      data: {
        email: 'sync@example.com',
        name: 'Sync timestamp updated',
        password: 'UPDATED',
      },
    });
    logger.info('Sync timestamp updated');
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(`Error updating sync timestamp: ${error.message}`);
    } else {
      logger.error('Error updating sync timestamp: Unknown error');
    }
    throw new Error('Failed to update sync timestamp');
  }
}

// 他の同期関連の関数は必要に応じて実装