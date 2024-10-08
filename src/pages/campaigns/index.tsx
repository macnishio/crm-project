import React from 'react';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { api } from '../../utils/api';
import CampaignList from '../../components/CampaignList';
import Layout from '../../components/Layout';

const CampaignsPage: NextPage = () => {
  const { data: session } = useSession();
  const { data: campaignsData, isLoading } = api.campaign.getAll.useQuery();

  if (!session) {
    return <div>Please sign in to view campaigns.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <CampaignList campaigns={campaignsData} />
    </Layout>
  );
};

export default CampaignsPage;