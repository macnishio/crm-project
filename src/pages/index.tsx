import React from 'react';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Dashboard from '../components/dashboard';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [accountsData, setAccountsData] = useState([]);
  const [opportunitiesData, setOpportunitiesData] = useState([]);
  const [campaignsData, setCampaignsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [accountsRes, opportunitiesRes, campaignsRes] = await Promise.all([
        fetch('/api/accounts'),
        fetch('/api/opportunities'),
        fetch('/api/campaigns')
      ]);

      const accounts = await accountsRes.json();
      const opportunities = await opportunitiesRes.json();
      const campaigns = await campaignsRes.json();

      setAccountsData(accounts);
      setOpportunitiesData(opportunities);
      setCampaignsData(campaigns);
    };

    fetchData();
  }, []);

  if (!session) {
    return <div className="p-8 text-center">サインインしてダッシュボードにアクセスしてください。</div>;
  }

  return (
    <Layout>
      <Dashboard 
        accounts={accountsData} 
        opportunities={opportunitiesData}
        campaigns={campaignsData}
      />
    </Layout>
  );
};

export default Home;