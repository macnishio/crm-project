import React from 'react';
import { NextPage } from 'next';
import Layout from '@/components/Layout';

const CampaignsPage: NextPage = () => {
  const campaigns = [
    { id: 1, name: 'Campaign 1', status: 'Active' },
    { id: 2, name: 'Campaign 2', status: 'Completed' },
  ];

  return (
    <Layout>
      <h1>キャンペーン</h1>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            {campaign.name} - {campaign.status}
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default CampaignsPage;