import React from 'react';
import { NextPage } from 'next';
import Layout from '@/components/Layout';

const SettingsPage: NextPage = () => {
  return (
    <Layout>
      <h1>設定</h1>
      <ul>
        <li>ユーザー設定</li>
        <li>通知設定</li>
        <li>セキュリティ設定</li>
        <li>データ管理</li>
      </ul>
    </Layout>
  );
};

export default SettingsPage;