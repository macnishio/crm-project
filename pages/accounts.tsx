import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../src/components/Layout'

const Accounts: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Accounts - CRM System</title>
        <meta name="description" content="Accounts page of CRM System" />
      </Head>

      <main>
        <h1 className="text-4xl font-bold">Accounts</h1>
        {/* ここにアカウント一覧や関連コンテンツを追加 */}
      </main>
    </Layout>
  )
}

export default Accounts