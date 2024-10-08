import express from 'express';
import Knex from 'knex';
import { PrismaClient, _Ticket } from '@prisma/client';
import _logger from '../utils/logger';

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

const _prisma = new PrismaClient();

// Ticket CRUD operations
app.post('/tickets', async (req, res) => {
  try {
    const [id] = await knex('tickets').insert(req.body).returning('id');
    res.status(201).json({ id });
  } catch (_error) {
    res.status(500).json({ error: 'Error creating ticket' });
  }
});

app.get('/tickets/:id', async (req, res) => {
  try {
    const ticket = await knex('tickets').where({ id: req.params.id }).first();
    if (ticket) {
      res.json(ticket);
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error fetching ticket' });
  }
});

app.put('/tickets/:id', async (req, res) => {
  try {
    const updated = await knex('tickets').where({ id: req.params.id }).update(req.body);
    if (updated) {
      res.json({ message: 'Ticket updated successfully' });
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error updating ticket' });
  }
});

app.delete('/tickets/:id', async (req, res) => {
  try {
    const deleted = await knex('tickets').where({ id: req.params.id }).del();
    if (deleted) {
      res.json({ message: 'Ticket deleted successfully' });
    } else {
      res.status(404).json({ error: 'Ticket not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error deleting ticket' });
  }
});

// Knowledge Base Article CRUD operations
app.post('/kb-articles', async (req, res) => {
  try {
    const [id] = await knex('kb_articles').insert(req.body).returning('id');
    res.status(201).json({ id });
  } catch (_error) {
    res.status(500).json({ error: 'Error creating knowledge base article' });
  }
});

app.get('/kb-articles/:id', async (req, res) => {
  try {
    const article = await knex('kb_articles').where({ id: req.params.id }).first();
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ error: 'Knowledge base article not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error fetching knowledge base article' });
  }
});

app.put('/kb-articles/:id', async (req, res) => {
  try {
    const updated = await knex('kb_articles').where({ id: req.params.id }).update(req.body);
    if (updated) {
      res.json({ message: 'Knowledge base article updated successfully' });
    } else {
      res.status(404).json({ error: 'Knowledge base article not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error updating knowledge base article' });
  }
});

app.delete('/kb-articles/:id', async (req, res) => {
  try {
    const deleted = await knex('kb_articles').where({ id: req.params.id }).del();
    if (deleted) {
      res.json({ message: 'Knowledge base article deleted successfully' });
    } else {
      res.status(404).json({ error: 'Knowledge base article not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error deleting knowledge base article' });
  }
});

// Search knowledge base
app.get('/kb-articles/search', async (req, res) => {
  const { query } = req.query;
  try {
    const articles = await knex('kb_articles')
      .where('title', 'ilike', `%${query}%`)
      .orWhere('content', 'ilike', `%${query}%`)
      .select('id', 'title', 'content');
    res.json(articles);
  } catch (_error) {
    res.status(500).json({ error: 'Error searching knowledge base' });
  }
});

// SLA tracking
app.get('/tickets/:id/sla', async (req, res) => {
  try {
    const ticket = await knex('tickets').where({ id: req.params.id }).first();
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const sla = await knex('slas').where({ priority: ticket.priority }).first();
    if (!sla) {
      return res.status(404).json({ error: 'SLA not found for this ticket priority' });
    }

    const createdAt = new Date(ticket.created_at);
    const now = new Date();
    const elapsedTime = now.getTime() - createdAt.getTime();
    const remainingTime = sla.resolution_time * 60 * 60 * 1000 - elapsedTime;

    res.json({
      ticketId: ticket.id,
      priority: ticket.priority,
      elapsedTime: Math.floor(elapsedTime / (60 * 1000)), // in minutes
      remainingTime: Math.max(0, Math.floor(remainingTime / (60 * 1000))), // in minutes
      isBreached: remainingTime <= 0
    });
  } catch (_error) {
    res.status(500).json({ error: 'Error calculating SLA' });
  }
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Support service running on port ${PORT}`));

export default app;
