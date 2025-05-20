import React, { useContext } from 'react';
import Image from 'next/image';
import styles from './NavbarRight.module.css';
import ThemeToggleButton from '@/components/ThemeToggleButton/ThemeToggleButton';
import { useTheme } from '@/hooks/useTheme';
import { LoginModalContext } from '@/context/LoginModalContext';

const NavbarRight: React.FC = () => {
    const { isDarkMode } = useTheme();
    // 获取登录模态框的控制函数
    const { setShowLogin } = useContext(LoginModalContext);

    const icons = {
        search: {
            src: isDarkMode ? '/images/searchWhite.png' : '/images/searchBlack.png',
            alt: '搜索'
        },
        github: {
            src: isDarkMode ? '/images/githubWhite.png' : '/images/githubBlack.png',
            alt: 'GitHub',
            href: 'https://github.com/lichenx2002?tab=projects'
        },
        user: {
            src: isDarkMode ? '/images/userWhite.png' : '/images/userBlack.png',
            alt: '登录'
        }
    };

    const themeIcons = {
        themeDay: '/images/themeDay.svg',
        themeNight: '/images/themeNight.svg'
    }

    // 处理登录按钮点击
    const handleUserClick = () => {
        setShowLogin(true);
    };

    return (
        <div className={styles.navRight}>
            {/* 1. 搜索按钮 */}
            <button className={styles.iconButton}>
                <img
                    src={icons.search.src}
                    alt={icons.search.alt}
                    className={styles.iconImage}
                    loading="lazy"
                />
            </button>

            {/* 2. GitHub按钮 */}
            <button className={styles.iconButton}>
                <a href={icons.github.href}>
                    <img
                        src={icons.github.src}
                        alt={icons.github.alt}
                        className={styles.iconImage}
                        loading="lazy"
                    />
                </a>
            </button>

            {/* 3. 主题切换按钮 */}
            <ThemeToggleButton icons={themeIcons} />

            {/* 4. 登录按钮 */}
            <button
                className={styles.iconButton}
                onClick={handleUserClick}
            >
                <img
                    src={icons.user.src}
                    alt={icons.user.alt}
                    className={`${styles.iconImage} ${styles.iconUserImage}`}
                    loading="lazy"
                />
            </button>
        </div>
    );
};

export default NavbarRight;