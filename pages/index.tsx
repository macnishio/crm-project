import React from 'react';
import { NextPage } from 'next';
import Layout from '@/components/Layout';
import styles from '@/styles/Dashboard.module.css';

const DashboardPage: NextPage = () => {
  return (
    <Layout>
      <div className={styles.dashboard}>
        <h1>ダッシュボード</h1>
        <div className={styles.widgets}>
          <div className={styles.widget}>
            <h2>新規リード</h2>
            <p className={styles.number}>15</p>
          </div>
          <div className={styles.widget}>
            <h2>進行中の商談</h2>
            <p className={styles.number}>8</p>
          </div>
          <div className={styles.widget}>
            <h2>今月の売上</h2>
            <p className={styles.number}>¥1,250,000</p>
          </div>
          <div className={styles.widget}>
            <h2>完了タスク</h2>
            <p className={styles.number}>23</p>
          </div>
        </div>
        {/* 他のダッシュボードコンテンツ */}
      </div>
    </Layout>
  );
};

export default DashboardPage;