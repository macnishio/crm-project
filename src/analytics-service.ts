import express from 'express';
import { Knex } from 'knex';
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

const chartingAPI = axios.create({
  baseURL: 'https://api.chartingservice.com/v1',
  headers: { 'Authorization': `Bearer ${process.env.CHARTING_API_KEY}` }
});

// Sales performance report
app.get('/reports/sales-performance', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const salesData = await knex('opportunities')
      .whereBetween('close_date', [startDate, endDate])
      .select(knex.raw('DATE_TRUNC(\'month\', close_date) as month'))
      .sum('amount as total_amount')
      .groupBy('month')
      .orderBy('month');

    const chartData = {
      labels: salesData.map(d => d.month),
      datasets: [{
        label: 'Sales Amount',
        data: salesData.map(d => d.total_amount)
      }]
    };

    const chartResponse = await chartingAPI.post('/generate', {
      type: 'line',
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    res.json({
      rawData: salesData,
      chartUrl: chartResponse.data.url
    });
  } catch (_error) {
    // エラーを無視する理由をコメントで説明
  }
});

// Customer acquisition report
app.get('/reports/customer-acquisition', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const acquisitionData = await knex('accounts')
      .whereBetween('created_at', [startDate, endDate])
      .select(knex.raw('DATE_TRUNC(\'month\', created_at) as month'))
      .count('* as new_customers')
      .groupBy('month')
      .orderBy('month');

    const chartData = {
      labels: acquisitionData.map(d => d.month),
      datasets: [{
        label: 'New Customers',
        data: acquisitionData.map(d => d.new_customers)
      }]
    };

    const chartResponse = await chartingAPI.post('/generate', {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    res.json({
      rawData: acquisitionData,
      chartUrl: chartResponse.data.url
    });
  } catch (_error) {
    console.error('エラーが発生しました:', _error);
  }
});

// Support ticket analysis
app.get('/reports/support-tickets', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const ticketData = await knex('tickets')
      .whereBetween('created_at', [startDate, endDate])
      .select('status')
      .count('* as count')
      .groupBy('status');

    const chartData = {
      labels: ticketData.map(d => d.status),
      datasets: [{
        label: 'Ticket Count',
        data: ticketData.map(d => d.count)
      }]
    };

    const chartResponse = await chartingAPI.post('/generate', {
      type: 'pie',
      data: chartData
    });

    res.json({
      rawData: ticketData,
      chartUrl: chartResponse.data.url
    });
  } catch (_error) {
    console.error('エラーが発生しました:', _error);
    res.status(500).json({ error: 'Error generating support ticket report' });
  }
});

// Custom report generator
app.post('/reports/custom', async (req, res) => {
  try {
    const { query, chartType, chartOptions } = req.body;
    const rawData = await knex.raw(query);

    const chartData = {
      labels: rawData.rows.map(row => row.label),
      datasets: [{
        label: 'Value',
        data: rawData.rows.map(row => row.value)
      }]
    };

    const chartResponse = await chartingAPI.post('/generate', {
      type: chartType,
      data: chartData,
      options: chartOptions
    });

    res.json({
      rawData: rawData.rows,
      chartUrl: chartResponse.data.url
    });
  } catch (_error) {
    console.error('エラーが発生しました:', _error);
    res.status(500).json({ error: 'Error generating custom report' });
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Analytics service running on port ${PORT}`));

export default app;