import React from 'react';
import { NextPage } from 'next';
import Layout from '@/components/Layout';

const CustomersPage: NextPage = () => {
  const customers = [
    { id: 1, name: '株式会社A', contact: '田中一郎', email: 'tanaka@a.com' },
    { id: 2, name: '株式会社B', contact: '鈴木二郎', email: 'suzuki@b.com' },
  ];

  return (
    <Layout>
      <h1>顧客一覧</h1>
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.name} - 担当: {customer.contact} - {customer.email}
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default CustomersPage;