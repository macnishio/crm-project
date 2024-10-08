import { getConnection } from './db';

export async function getCustomers(tenantId: string) {
  const client = await getConnection(tenantId);
  try {
    const result = await client.query('SELECT * FROM customers');
    return result.rows;
  } finally {
    client.release();
  }
}

export async function createCustomer(tenantId: string, customerData: any) {
  const client = await getConnection(tenantId);
  try {
    const { name, email, phone } = customerData;
    const result = await client.query(
      'INSERT INTO customers (name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [name, email, phone]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}


import { Customer } from '@prisma/client';

export function formatCustomerData(customer: Customer): string {
  return `${customer.firstName} ${customer.lastName}`;
}

export function validateCustomerData(data: Partial<Customer>): boolean {
  // 忁EなバリチEEションロジチEを実裁E
  return true;
}

export function calculateCustomerLoyaltyScore(customer: Customer): number {
  // ロイヤルチEスコア計算ロジチEを実裁E
  return 0;
}

// 他E顧客関連のユーチEリチE関数

export async function getCustomerData(customerId: string): Promise<unknown> {
  // ...
}

export async function updateCustomerData(_data: CustomerData): Promise<void> {
  // ...
}

export async function deleteCustomer(_customer: Customer): Promise<void> {
  // ...
}
