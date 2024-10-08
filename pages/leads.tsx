import React from 'react';
import { NextPage } from 'next';
import Layout from '@/components/Layout';
import LeadForm from '@/components/LeadForm';

const LeadsPage: NextPage = () => {
  const leads = [
    { id: 1, name: '山田太郎', email: 'yamada@example.com', status: '新規' },
    { id: 2, name: '佐藤花子', email: 'sato@example.com', status: '対応中' },
  ];

  return (
    <Layout>
      <h1>リード一覧</h1>
      <LeadForm onSubmit={(lead) => console.log('New lead:', lead)} />
      <ul>
        {leads.map((lead) => (
          <li key={lead.id}>
            {lead.name} - {lead.email} - {lead.status}
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default LeadsPage;