import express from 'express';
import Knex from 'knex';
import { PrismaClient, Sale } from '@prisma/client';
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

const prisma = new PrismaClient();

// Lead CRUD operations
app.post('/leads', async (req, res) => {
  try {
    const [id] = await knex('leads').insert(req.body).returning('id');
    res.status(201).json({ id });
  } catch (_error) {
    res.status(500).json({ error: 'Error creating lead' });
  }
});

app.get('/leads/:id', async (req, res) => {
  try {
    const lead = await knex('leads').where({ id: req.params.id }).first();
    if (lead) {
      res.json(lead);
    } else {
      res.status(404).json({ error: 'Lead not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error fetching lead' });
  }
});

app.put('/leads/:id', async (req, res) => {
  try {
    const updated = await knex('leads').where({ id: req.params.id }).update(req.body);
    if (updated) {
      res.json({ message: 'Lead updated successfully' });
    } else {
      res.status(404).json({ error: 'Lead not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error updating lead' });
  }
});

app.delete('/leads/:id', async (req, res) => {
  try {
    const deleted = await knex('leads').where({ id: req.params.id }).del();
    if (deleted) {
      res.json({ message: 'Lead deleted successfully' });
    } else {
      res.status(404).json({ error: 'Lead not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error deleting lead' });
  }
});

// Opportunity CRUD operations
app.post('/opportunities', async (req, res) => {
  try {
    const [id] = await knex('opportunities').insert(req.body).returning('id');
    res.status(201).json({ id });
  } catch (_error) {
    res.status(500).json({ error: 'Error creating opportunity' });
  }
});

app.get('/opportunities/:id', async (req, res) => {
  try {
    const opportunity = await knex('opportunities').where({ id: req.params.id }).first();
    if (opportunity) {
      res.json(opportunity);
    } else {
      res.status(404).json({ error: 'Opportunity not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error fetching opportunity' });
  }
});

app.put('/opportunities/:id', async (req, res) => {
  try {
    const updated = await knex('opportunities').where({ id: req.params.id }).update(req.body);
    if (updated) {
      res.json({ message: 'Opportunity updated successfully' });
    } else {
      res.status(404).json({ error: 'Opportunity not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error updating opportunity' });
  }
});

app.delete('/opportunities/:id', async (req, res) => {
  try {
    const deleted = await knex('opportunities').where({ id: req.params.id }).del();
    if (deleted) {
      res.json({ message: 'Opportunity deleted successfully' });
    } else {
      res.status(404).json({ error: 'Opportunity not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error deleting opportunity' });
  }
});

// Convert lead to opportunity
app.post('/leads/:id/convert', async (req, res) => {
  const trx = await knex.transaction();

  try {
    const lead = await trx('leads').where({ id: req.params.id }).first();
    if (!lead) {
      await trx.rollback();
      return res.status(404).json({ error: 'Lead not found' });
    }

    const [accountId] = await trx('accounts').insert({
      name: lead.company,
      // Add other relevant fields
    }).returning('id');

    const [opportunityId] = await trx('opportunities').insert({
      account_id: accountId,
      name: `${lead.company} opportunity`,
      // Add other relevant fields
    }).returning('id');

    await trx('leads').where({ id: req.params.id }).del();

    await trx.commit();

    res.json({ message: 'Lead converted to opportunity successfully', accountId, opportunityId });
  } catch (_error) {
    await trx.rollback();
    res.status(500).json({ error: 'Error converting lead to opportunity' });
  }
});

export async function createSale(saleData: Omit<Sale, 'id'>): Promise<Sale> {
  try {
    const sale = await prisma.sale.create({ data: saleData });
    logger.info(`Sale created: ${sale.id}`);
    return sale;
  } catch (_error) {
    logger.error('Failed to create sale', { error: _error });
    throw new Error('Failed to create sale');
  }
}

export async function getSale(id: string): Promise<Sale | null> {
  try {
    const sale = await prisma.sale.findUnique({ where: { id } });
    if (!sale) {
      logger.warn(`Sale not found: ${id}`);
    }
    return sale;
  } catch (_error) {
    logger.error(`Failed to get sale with id ${id}`, { error: _error });
    throw new Error('Failed to get sale');
  }
}

export async function updateSale(id: string, saleData: Partial<Sale>): Promise<Sale> {
  try {
    const updatedSale = await prisma.sale.update({
      where: { id },
      data: saleData,
    });
    logger.info(`Sale updated: ${id}`);
    return updatedSale;
  } catch (_error) {
    logger.error(`Failed to update sale with id ${id}`, { error: _error });
    throw new Error('Failed to update sale');
  }
}

export async function deleteSale(id: string): Promise<void> {
  try {
    await prisma.sale.delete({ where: { id } });
    logger.info(`Sale deleted: ${id}`);
  } catch (_error) {
    logger.error(`Failed to delete sale with id ${id}`, { error: _error });
    throw new Error('Failed to delete sale');
  }
}

export async function getSalesByCustomer(customerId: string): Promise<Sale[]> {
  try {
    const sales = await prisma.sale.findMany({
      where: { customerId },
    });
    logger.info(`Retrieved ${sales.length} sales for customer ${customerId}`);
    return sales;
  } catch (_error) {
    logger.error(`Failed to get sales for customer ${customerId}`, { error: _error });
    throw new Error('Failed to get sales by customer');
  }
}

export async function getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
  try {
    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    logger.info(`Retrieved ${sales.length} sales between ${startDate} and ${endDate}`);
    return sales;
  } catch (_error) {
    logger.error('Failed to get sales by date range', { error: _error, startDate, endDate });
    throw new Error('Failed to get sales by date range');
  }
}

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Sales service running on port ${PORT}`));

export default app;
