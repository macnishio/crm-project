import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../src/components/Layout'
import { useData } from '../src/hooks/useData'

interface Opportunity {
  id: number;
  name: string;
  value: number;
  stage: string;
}

const Opportunities: NextPage = () => {
  const { data: opportunities, loading, error } = useData<Opportunity[]>('/api/opportunities');

  return (
    <Layout>
      <Head>
        <title>Opportunities - CRM System</title>
        <meta name="description" content="Opportunities page of CRM System" />
      </Head>

      <main>
        <h1 className="text-4xl font-bold mb-4">Opportunities</h1>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {opportunities && (
          <ul>
            {opportunities.map((opportunity) => (
              <li key={opportunity.id} className="mb-2">
                {opportunity.name} - ${opportunity.value} - {opportunity.stage}
              </li>
            ))}
          </ul>
        )}
      </main>
    </Layout>
  )
}

export default Opportunities