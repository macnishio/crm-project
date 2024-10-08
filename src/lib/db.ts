import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export async function getConnection(tenantId: string) {
  const client = await pool.connect();
  await client.query(`SET search_path TO tenant_${tenantId}, public`);
  return client;
}
