import React from 'react';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { api } from '../../utils/api';
import LeadList from '../../components/LeadList';
import Layout from '../../components/Layout';

const LeadsPage: NextPage = () => {
  const { data: session } = useSession();
  const { data: leadsData, isLoading } = api.lead.getAll.useQuery();

  if (!session) {
    return <div>Please sign in to view leads.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <LeadList leads={leadsData} />
    </Layout>
  );
};

export default LeadsPage;