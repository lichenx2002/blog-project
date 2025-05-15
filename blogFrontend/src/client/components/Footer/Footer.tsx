import React, { useEffect, useState } from 'react';
import styles from './Footer.module.css';
import { useTheme } from '@/hooks/useTheme';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { GalleryAPI } from '@/api/GalleryAPI';
import { Article } from '@/types/Article';
import { FaGithub, FaInstagram, FaTwitch, FaWeixin,FaEnvelope,FaMapMarkerAlt} from 'react-icons/fa';
import Link from "next/link";
import {navRoutesItem} from "@/client/routes/nav-routes";

const Footer: React.FC = () => {
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();
  const [stats, setStats] = useState({
    articles: 0,
    galleries: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 获取文章数量
        const articlesResponse = await ArticlesAPI.getArticles();
        const articles = articlesResponse.data as Article[];
        // 获取相册数量
        const galleries = await GalleryAPI.getGalleries();

        setStats({
          articles: articles.filter(article => article.status === 'published').length,
          galleries: Array.isArray(galleries) ? galleries.length : 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <footer className={`${styles.footer} ${isDarkMode ? styles.dark : styles.light}`}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>关于博客</h3>
          <p>记录生活，分享技术，探索世界</p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{stats.articles}</span>
              <span className={styles.statLabel}>文章</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{stats.galleries}</span>
              <span className={styles.statLabel}>相册</span>
            </div>
          </div>
        </div>
        <div className={styles.footerSection}>
          <h3>联系方式</h3>
          <div className={styles.contactInfo}>
            <p className={styles.contactItem}><FaEnvelope/>Email: chenxili380@gmail.com</p>
            <p className={styles.contactItem}><FaWeixin/>WeChat: lichenxigk2002</p>
            <p className={styles.contactItem}><FaMapMarkerAlt/>城市: 洛阳</p>
          </div>
        </div>
        <div className={styles.footerSection}>
          <h3>友情链接</h3>
          <div className={styles.links}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaGithub className={styles.socialIcon} />
              <span>GitHub</span>
            </a>
            <a href="https://Instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaInstagram className={styles.socialIcon} />
              <span>Instagram</span>
            </a>
            <a href="https://twitch.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaTwitch className={styles.socialIcon} />
              <span>Twitch</span>
            </a>
          </div>
          <div className={styles.quickLinks}>
            {navRoutesItem.map((item) => (
                  <Link
                      href={item.path}
                  >
                    {item.name}
                  </Link>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© {currentYear} 孤芳不自赏的博客 | Powered by Next.js + TypeScript</p>
        <p className={styles.beian}>京ICP备XXXXXXXX号-1</p>
      </div>
    </footer>
  );
};

export default Footer; 