import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <header>
        {/* ここにメニューを追加 */}
        <nav>
          <ul>
            <li><a href="/">ホーム</a></li>
            <li><a href="/leads">リード</a></li>
            {/* 他のメニュー項目 */}
          </ul>
        </nav>
      </header>
      <main>{children}</main>
      <footer>{/* フッターの内容 */}</footer>
    </div>
  );
};

export default Layout;