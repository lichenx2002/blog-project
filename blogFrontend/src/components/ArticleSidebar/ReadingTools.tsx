import React, { useEffect } from 'react';
import styles from './ReadingTools.module.css';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaFont, FaCheck, FaShareAlt } from 'react-icons/fa';
import { useTheme } from '@/hooks/useTheme';
import { useAppDispatch } from '@/redux/store';
import { toggleTheme } from '@/redux/theme/actions';

interface ReadingToolsProps {
  onFontSizeChange: (size: number) => void;
  readingTime: number;
}

const ReadingTools: React.FC<ReadingToolsProps> = ({
  onFontSizeChange,
  readingTime,
}) => {
  const [fontSize, setFontSize] = React.useState(16);
  const [isCopied, setIsCopied] = React.useState(false);
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();

  // 组件卸载时重置字体大小
  useEffect(() => {
    return () => {
      const articleElements = document.querySelectorAll('.article-content-text-size');
      articleElements.forEach(element => {
        (element as HTMLElement).style.fontSize = '16px';
      });
    };
  }, []);

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setFontSize(newSize);
    // 只修改文章内容的字体大小
    const articleElements = document.querySelectorAll('.article-content-text-size');
    articleElements.forEach(element => {
      (element as HTMLElement).style.fontSize = `${newSize}px`;
    });
    onFontSizeChange(newSize);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
      });
  };

  return (
    <motion.div
      className={styles.tools}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className={styles.title}>阅读工具</h3>

      {/* 字体大小调节 */}
      <div className={styles.toolItem}>
        <div className={styles.toolHeader}>
          <FaFont className={styles.toolIcon} />
          <span>字号</span>
        </div>
        <input
          type="range"
          min="12"
          max="24"
          value={fontSize}
          onChange={handleFontSizeChange}
          className={styles.slider}
        />
        <span className={styles.fontSizeValue}>{fontSize}px</span>
      </div>

      {/* 主题切换 */}
      <div className={styles.toolItem}>
        <div className={styles.toolHeader}>
          {isDarkMode ? (
            <FaMoon className={styles.toolIcon} />
          ) : (
            <FaSun className={styles.toolIcon} />
          )}
          <span>主题</span>
        </div>
        <button
          onClick={handleThemeToggle}
          className={styles.themeButton}
        >
          {isDarkMode ? <FaMoon /> : <FaSun />}
          {isDarkMode ? '深色' : '浅色'}
        </button>
      </div>

      {/* 阅读时间 */}
      <div className={styles.toolItem}>
        <div className={styles.toolHeader}>
          <span>阅读时间</span>
        </div>
        <div className={styles.readingTime}>
          {readingTime} 分钟
        </div>
      </div>

      {/* 分享链接 */}
      <div className={styles.toolItem}>

        <button
          onClick={handleShareClick}
          className={styles.shareButton}
        >
          {isCopied ? (
            <span style={{ color: 'var(--text)' }}>
              <FaCheck className={styles.toolIcon} /> 已复制
            </span>
          ) : (
            <span style={{ color: 'var(--text)' }}>
              <FaShareAlt className={styles.toolIcon} /> 点我分享
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ReadingTools;