import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import styles from './ArticleToc.module.css';


interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ArticleTocProps {
  headings: Heading[];
  title: string;
  contentHeight: number;
  contentTop: number;
}

const ArticleToc: React.FC<ArticleTocProps> = ({ headings, contentHeight, contentTop }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeId, setActiveId] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      // 计算阅读进度
      const calculateProgress = () => {
        if (contentHeight <= viewportHeight) {
          return 100; // 如果文章不超过视口高度，直接返回100%
        }

        // 考虑顶部导航栏的高度
        const nav = document.querySelector('nav') as HTMLElement;
        const navHeight = nav?.offsetHeight || 0;
        const adjustedScrollTop = scrollTop - navHeight;
        const adjustedContentTop = contentTop - navHeight;

        const progress = ((adjustedScrollTop - adjustedContentTop) / (contentHeight - viewportHeight)) * 100;
        return Math.min(100, Math.max(0, progress));
      };

      setReadingProgress(calculateProgress());

      // 检测当前激活的标题
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let currentActiveId = '';
      let minDistance = Infinity;

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        const distance = Math.abs(rect.top - 100); // 距离视口顶部的距离

        if (rect.top <= 100 && distance < minDistance) {
          minDistance = distance;
          currentActiveId = heading.id;
        }
      });


      setActiveId(currentActiveId);
    };

    // 添加滚动和调整大小事件监听
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    // 初始计算一次
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [contentHeight, contentTop]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const nav = document.querySelector('nav') as HTMLElement;
      const navHeight = nav?.offsetHeight || 60; // 默认60px
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
      <div className={`${styles.tocContainer} ${isExpanded ? styles.expanded : ''}`}>
        <div className={styles.tocHeader}>
          <div className={styles.tocTitle}>
            <span className={styles.progressText}>{Math.round(readingProgress)}%</span>
            <span className={styles.progressText}>目录</span>
          </div>
          <button
              className={styles.toggleButton}
              onClick={handleToggle}
              aria-label={isExpanded ? '收起目录' : '展开目录'}
          >
            <IoIosArrowDown className={styles.toggleIcon} />
          </button>
        </div>
        <div className={styles.toc}>
          <ul className={styles.tocList}>
            {headings.map((heading) => (
                <li
                    key={heading.id}
                    className={`${styles.tocItem} ${styles[`level${heading.level}`]} ${activeId === heading.id ? styles.active : ''}`}
                >
                  <a
                      href={`#${heading.id}`}
                      className={styles.tocLink}
                      onClick={(e) => handleLinkClick(e, heading.id)}
                  >
                    {heading.text}
                  </a>
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
}

export default ArticleToc;