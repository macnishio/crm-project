import React from 'react';
import { NextPage } from 'next';
import Layout from '@/components/Layout';

const ReportsPage: NextPage = () => {
  const reports = [
    { id: 1, name: '月次売上レポート', lastUpdated: '2023-04-30' },
    { id: 2, name: 'リードコンバージョンレポート', lastUpdated: '2023-04-29' },
  ];

  return (
    <Layout>
      <h1>レポート一覧</h1>
      <ul>
        {reports.map((report) => (
          <li key={report.id}>
            {report.name} - 最終更新: {report.lastUpdated}
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default ReportsPage;