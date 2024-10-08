import { PrismaClient, Customer } from '@prisma/client';

const prisma = new PrismaClient();

export async function createCustomer(customerData: Omit<Customer, 'id'>): Promise<Customer> {
  return prisma.customer.create({ data: customerData });
}

export async function updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
  return prisma.customer.update({ where: { id }, data: customerData });
}

export async function deleteCustomer(id: string): Promise<Customer> {
  return prisma.customer.delete({ where: { id } });
}

// 他�E顧客関連の関数も同様に実�
