import express from 'express';
import Knex from 'knex';
import axios from 'axios';
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

const emailServiceAPI = axios.create({
  baseURL: 'https://api.emailservice.com/v1',
  headers: { 'Authorization': `Bearer ${process.env.EMAIL_SERVICE_API_KEY}` }
});

// Campaign CRUD operations
app.post('/campaigns', async (req, res) => {
  try {
    const [id] = await knex('campaigns').insert(req.body).returning('id');
    res.status(201).json({ id });
  } catch (_error) {
    res.status(500).json({ error: 'Error creating campaign' });
  }
});

app.get('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await knex('campaigns').where({ id: req.params.id }).first();
    if (campaign) {
      res.json(campaign);
    } else {
      res.status(404).json({ error: 'Campaign not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error fetching campaign' });
  }
});

app.put('/campaigns/:id', async (req, res) => {
  try {
    const updated = await knex('campaigns').where({ id: req.params.id }).update(req.body);
    if (updated) {
      res.json({ message: 'Campaign updated successfully' });
    } else {
      res.status(404).json({ error: 'Campaign not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error updating campaign' });
  }
});

app.delete('/campaigns/:id', async (req, res) => {
  try {
    const deleted = await knex('campaigns').where({ id: req.params.id }).del();
    if (deleted) {
      res.json({ message: 'Campaign deleted successfully' });
    } else {
      res.status(404).json({ error: 'Campaign not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error deleting campaign' });
  }
});

// Email template CRUD operations
app.post('/email-templates', async (req, res) => {
  try {
    const [id] = await knex('email_templates').insert(req.body).returning('id');
    res.status(201).json({ id });
  } catch (_error) {
    res.status(500).json({ error: 'Error creating email template' });
  }
});

app.get('/email-templates/:id', async (req, res) => {
  try {
    const template = await knex('email_templates').where({ id: req.params.id }).first();
    if (template) {
      res.json(template);
    } else {
      res.status(404).json({ error: 'Email template not found' });
    }
  } catch (_error) {
    res.status(500).json({ error: 'Error fetching email template' });
  }
});

// Send campaign emails
app.post('/campaigns/:id/send', async (req, res) => {
  try {
    const campaign = await knex('campaigns').where({ id: req.params.id }).first();
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const template = await knex('email_templates').where({ id: campaign.email_template_id }).first();
    if (!template) {
      return res.status(404).json({ error: 'Email template not found' });
    }

    const contacts = await knex('contacts')
      .whereIn('id', function() {
        this.select('contact_id').from('campaign_contacts').where('campaign_id', req.params.id);
      });

    for (const contact of contacts) {
      try {
        await emailServiceAPI.post('/send', {
          to: contact.email,
          subject: campaign.subject,
          body: template.body.replace('{{name}}', `${contact.first_name} ${contact.last_name}`)
        });
      } catch (error) {
        console.error(`Failed to send email to ${contact.email}:`, error);
      }
    }

    res.json({ message: 'Campaign emails sent successfully' });
  } catch (_error) {
    res.status(500).json({ error: 'Error sending campaign emails' });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Marketing service running on port ${PORT}`));

export default app;
