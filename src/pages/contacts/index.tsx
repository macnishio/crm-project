import React from 'react';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { api } from '../../utils/api';
import ContactList from '../../components/ContactList';
import Layout from '../../components/Layout';

const ContactsPage: NextPage = () => {
  const { data: session } = useSession();
  const { data: contactsData, isLoading } = api.contact.getAll.useQuery();

  if (!session) {
    return <div>Please sign in to view contacts.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <ContactList contacts={contactsData} />
    </Layout>
  );
};

export default ContactsPage;