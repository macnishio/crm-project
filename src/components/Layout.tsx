import React, { ReactNode } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import styles from '@/styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session } = useSession();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link href="/" className={styles.navLink}>ダッシュボード</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/leads" className={styles.navLink}>リード</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/customers" className={styles.navLink}>顧客</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/sales" className={styles.navLink}>売上</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/campaigns" className={styles.navLink}>キャンペーン</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/reports" className={styles.navLink}>レポート</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/tasks" className={styles.navLink}>タスク</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/settings" className={styles.navLink}>設定</Link>
            </li>
            {session ? (
              <li className={styles.navItem}>
                <button onClick={() => signOut()} className={styles.navLink}>ログアウト</button>
              </li>
            ) : (
              <li className={styles.navItem}>
                <Link href="/api/auth/signin" className={styles.navLink}>ログイン</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>&copy; 2023 CRM Project. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;