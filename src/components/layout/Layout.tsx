import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '매물 목록', icon: '\uD83D\uDCCB' },
    { path: '/property/new', label: '매물 등록', icon: '\u2795' },
  ];

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>{'\uD83C\uDFE0'}</span>
          <h1 className={styles.appTitle}>부동산 매물 관리</h1>
        </div>
      </header>
      <div className={styles.body}>
        <nav className={styles.sidebar}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => {
                    const active =
                      item.path === '/'
                        ? location.pathname === '/'
                        : isActive;
                    return `${styles.navLink} ${active ? styles.navLinkActive : ''}`;
                  }}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
