import React from 'react';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { api } from '../../utils/api';
import OpportunityList from '../../components/OpportunityList';
import Layout from '../../components/Layout';

const OpportunitiesPage: NextPage = () => {
  const { data: session } = useSession();
  const { data: opportunitiesData, isLoading } = api.opportunity.getAll.useQuery();

  if (!session) {
    return <div>Please sign in to view opportunities.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <OpportunityList opportunities={opportunitiesData} />
    </Layout>
  );
};

export default OpportunitiesPage;