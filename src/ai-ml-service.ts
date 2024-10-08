import express from 'express';
import Knex from 'knex';
import * as tf from '@tensorflow/tfjs-node';

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

// Lead Scoring Model
let leadScoringModel;

async function trainLeadScoringModel() {
  const leadData = await knex('leads')
    .select('industry', 'employee_count', 'annual_revenue', 'is_converted')
    .whereNotNull('is_converted');

  const features = leadData.map(lead => [
    lead.industry,
    lead.employee_count,
    lead.annual_revenue
  ]);
  const labels = leadData.map(lead => lead.is_converted ? 1 : 0);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [3] }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

  const xs = tf.tensor2d(features);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  await model.fit(xs, ys, { epochs: 100 });

  leadScoringModel = model;
}

// Opportunity Prediction Model
let opportunityPredictionModel;

async function trainOpportunityPredictionModel() {
  const opportunityData = await knex('opportunities')
    .select('amount', 'stage', 'close_date', 'is_won')
    .whereNotNull('is_won');

  const features = opportunityData.map(opp => [
    opp.amount,
    opp.stage,
    new Date(opp.close_date).getTime()
  ]);
  const labels = opportunityData.map(opp => opp.is_won ? 1 : 0);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [3] }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

  const xs = tf.tensor2d(features);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  await model.fit(xs, ys, { epochs: 100 });

  opportunityPredictionModel = model;
}

// Customer Churn Prediction Model
let churnPredictionModel;

async function trainChurnPredictionModel() {
  const customerData = await knex('accounts')
    .select('industry', 'annual_revenue', 'last_activity_date', 'is_churned')
    .whereNotNull('is_churned');

  const features = customerData.map(customer => [
    customer.industry,
    customer.annual_revenue,
    new Date(customer.last_activity_date).getTime()
  ]);
  const labels = customerData.map(customer => customer.is_churned ? 1 : 0);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [3] }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

  const xs = tf.tensor2d(features);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  await model.fit(xs, ys, { epochs: 100 });

  churnPredictionModel = model;
}

// Train all models on service start
(async () => {
  await trainLeadScoringModel();
  await trainOpportunityPredictionModel();
  await trainChurnPredictionModel();
  console.log('All models trained successfully');
})();

// Lead Scoring API
app.post('/predict/lead-score', (req, res) => {
  const { industry, employee_count, annual_revenue } = req.body;
  const input = tf.tensor2d([[industry, employee_count, annual_revenue]]);
  const prediction = leadScoringModel.predict(input);
  const score = prediction.dataSync()[0];
  res.json({ score });
});

// Opportunity Prediction API
app.post('/predict/opportunity', (req, res) => {
  const { amount, stage, close_date } = req.body;
  const input = tf.tensor2d([[amount, stage, new Date(close_date).getTime()]]);
  const prediction = opportunityPredictionModel.predict(input);
  const probability = prediction.dataSync()[0];
  res.json({ probability });
});

// Customer Churn Prediction API
app.post('/predict/churn', (req, res) => {
  const { industry, annual_revenue, last_activity_date } = req.body;
  const input = tf.tensor2d([[industry, annual_revenue, new Date(last_activity_date).getTime()]]);
  const prediction = churnPredictionModel.predict(input);
  const churnProbability = prediction.dataSync()[0];
  res.json({ churnProbability });
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => console.log(`AI/ML service running on port ${PORT}`));

export default app;
