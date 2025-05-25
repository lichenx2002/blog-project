'use client';

import React, { useState } from 'react';
import styles from './AdminLayout.module.css';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { adminRoutes } from '@/admin/routes/admin-routes';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = router.pathname;

  const getIcon = (path: string) => {
    switch (path) {
      case '/admin':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        );
      case '/admin/articles':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
      case '/admin/tags':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        );
      case '/admin/comments':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        );
      case '/admin/gallery':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        );
      case '/admin/users':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            <path d="M12 12v4"></path>
            <path d="M12 16h4"></path>
          </svg>
        );
      case '/admin/thoughts':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.5 6.5h7l-5.5 4 2 6.5-5.5-4-5.5 4 2-6.5-5.5-4h7z" />
            <path d="M12 2c-2 0-4 1-5 2" />
            <path d="M12 22c2 0 4-1 5-2" />
            <path d="M2 12c0-2 1-4 2-5" />
            <path d="M22 12c0 2-1 4-2 5" />
          </svg>
        );
        case '/admin/questions':
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            );
        case '/admin/bulletinboard':
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                    <path d="M12 12h4" />
                    <path d="M12 16h4" />
                </svg>
            );
      case '/admin/settings':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.layout}>
      {/* 侧边栏 */}
      <aside className={`${styles.sider} ${collapsed ? styles.collapsed : ''}`}>
        <div className={styles.logo}>
          <h1>{collapsed ? 'B' : 'Blog Admin'}</h1>
          <img
            src="/images/avatar_20250520_215057.png"
            alt="管理员头像"
            className={styles.sidebarAvatar}
          />
        </div>
        <nav className={styles.menu}>
          <ul>
            {adminRoutes.map((route) => (
              <li
                key={route.id}
                className={`${styles.menuItem} ${pathname === route.path ? styles.active : ''}`}
              >
                <Link
                  href={route.path}
                  className={styles.menuLink}
                >
                  {getIcon(route.path)}
                  <span>{route.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* 主内容区 */}
      <div className={styles.main}>
        {/* 顶部导航 */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={styles.collapseBtn}
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "展开菜单" : "收起菜单"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {collapsed ? (
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                ) : (
                  <path d="M4 6h16M4 12h8M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
          <div className={styles.headerRight}>
            <span>
              <img
                src="/images/avatar_20250520_215057.png"
                alt="管理员头像"
                className={styles.avatar}
              />
              管理员
            </span>
            <button className={styles.logoutBtn} onClick={() => window.location.href = '/main/Home'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              退出
            </button>
          </div>
        </header>

        {/* 内容区 */}
        <main className={styles.content}>
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* 底部 */}
        <footer className={styles.footer}>
          <p>© 孤芳不自赏的博客管理系统 | 技术支持：Next.js + TypeScript</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;