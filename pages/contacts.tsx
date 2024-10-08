import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../src/components/Layout'

const Contacts: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Contacts - CRM System</title>
        <meta name="description" content="Contacts page of CRM System" />
      </Head>

      <main>
        <h1 className="text-4xl font-bold">Contacts</h1>
        {/* ここに連絡先一覧や関連コンテンツを追加 */}
      </main>
    </Layout>
  )
}

export default Contacts