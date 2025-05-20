import React, { useEffect, useState } from 'react';
import styles from './Footer.module.css';
import { useTheme } from '@/hooks/useTheme';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { GalleryAPI } from '@/api/GalleryAPI';
import { Article } from '@/types/Article';
import { FaGithub, FaWeixin, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { SiBilibili, SiTiktok } from 'react-icons/si';
import Link from "next/link";
import { navRoutesItem } from "@/client/routes/nav-routes";

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
          <p>用文字定格时光，以技术点亮灵感，在笔尖与代码间探索无限可能</p>
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
          <h3>联系我</h3>
          <div className={styles.contactInfo}>
            <a href="mailto:chenxili380@gmail.com" className={styles.contactItem}>
              <FaEnvelope />Email: chenxili380@gmail.com
            </a>
            <p className={styles.contactItem}><FaWeixin />WeChat: lichenxigk2002</p>
            <a
              href="https://map.baidu.com/search/洛阳/@12663647.325,4107550.88,12z?querytype=s&da_src=shareurl&wd=洛阳&c=131&src=0&pn=0&sug=0&l=12&b=(12663247.325,4107550.88;12664047.325,4107550.88)&from=webmap&biz_forward=%7B%22scaler%22:2,%22styles%22:%22pl%22%7D&device_ratio=2"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
            >
              <FaMapMarkerAlt />城市: 洛阳
            </a>
          </div>
        </div>
        <div className={styles.footerSection}>
          <h3>其他社交方式</h3>
          <div className={styles.links}>
            <a href="https://github.com/lichenx2002/blog-project" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FaGithub className={styles.socialIcon} />
              <span>GitHub</span>
            </a>
            <a href="https://b23.tv/BZ0L6Gu" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <SiBilibili className={styles.socialIcon} />
              <span>Bilibili</span>
            </a>
            <a href="https://v.douyin.com/x3B6KXOh924/ 7@2.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <SiTiktok className={styles.socialIcon} />
              <span>抖音</span>
            </a>
          </div>
          <div className={styles.quickLinks}>
            {navRoutesItem
              .filter(item => item.id !== 8)
              .map((item) => (
                <Link
                  key={item.id}
                  href={item.path}
                >
                  {item.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© {currentYear} 孤芳不自赏的博客 | Powered by Next.js + Spring Boot</p>
        <a href="https://beian.miit.gov.cn"
          className={styles.beian}
          target="_blank"
          rel="noopener noreferrer"
        >京ICP备XXXXXXXX号-1</a>
      </div>
    </footer>
  );
};

export default Footer; 