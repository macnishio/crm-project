import React from 'react';
import { NextPage } from 'next';
import Layout from '@/components/Layout';

const SalesPage: NextPage = () => {
  const sales = [
    { id: 1, customer: '株式会社A', amount: 1000000, date: '2023-04-01' },
    { id: 2, customer: '株式会社B', amount: 1500000, date: '2023-04-15' },
  ];

  return (
    <Layout>
      <h1>売上一覧</h1>
      <ul>
        {sales.map((sale) => (
          <li key={sale.id}>
            {sale.customer} - ¥{sale.amount.toLocaleString()} - {sale.date}
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default SalesPage;