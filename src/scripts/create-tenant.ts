import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function createTenant(tenantId: string, tenantName: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create schema for new tenant
    await client.query(`CREATE SCHEMA tenant_${tenantId}`);

    // Set search path to new schema
    await client.query(`SET search_path TO tenant_${tenantId}`);

    // Create tables for new tenant
    await client.query(`
      CREATE TABLE customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20)
      )
    `);

    await client.query(`
      CREATE TABLE leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL
      )
    `);

    await client.query(`
      CREATE TABLE opportunities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        stage VARCHAR(50) NOT NULL
      )
    `);

    // Insert tenant info into a global tenants table
    await client.query(`
      INSERT INTO public.tenants (id, name, created_at)
      VALUES ($1, $2, NOW())
    `, [tenantId, tenantName]);

    await client.query('COMMIT');
    console.log(`Tenant ${tenantName} (ID: ${tenantId}) created successfully.`);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error creating tenant:', e);
    throw e;
  } finally {
    client.release();
  }
}

// Usage example
if (require.main === module) {
  const tenantId = process.argv[2];
  const tenantName = process.argv[3];
  if (!tenantId || !tenantName) {
    console.error('Usage: node create-tenant.js <tenantId> <tenantName>');
    process.exit(1);
  }
  createTenant(tenantId, tenantName)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
