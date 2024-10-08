import React from 'react';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { api } from '../../utils/api';
import AccountList from '../../components/AccountList';
import Layout from '../../components/Layout';

const AccountsPage: NextPage = () => {
  const { data: session } = useSession();
  const { data: accountsData, isLoading } = api.account.getAll.useQuery();

  if (!session) {
    return <div>Please sign in to view accounts.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <AccountList accounts={accountsData} />
    </Layout>
  );
};

export default AccountsPage;