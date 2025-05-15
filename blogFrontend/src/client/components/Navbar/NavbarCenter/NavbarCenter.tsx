import React, { useEffect, useState } from 'react';
import Link from "next/link";
import styles from './NavbarCenter.module.css';
import { navRoutesItem } from "@/client/routes/nav-routes";
import { usePathname, useParams } from 'next/navigation';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { Article } from '@/types/Article';

const NavbarCenter: React.FC = () => {
    const pathname = usePathname();
    const params = useParams();
    const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
    const [showArticleInfo, setShowArticleInfo] = useState(false);

    // 监听滚动事件
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setShowArticleInfo(scrollPosition > 500);
        };

        // 添加滚动监听
        window.addEventListener('scroll', handleScroll);

        // 初始化时检查一次滚动位置
        handleScroll();

        // 清理监听器
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 获取文章数据
    useEffect(() => {
        const fetchArticle = async () => {
            if (pathname.startsWith('/main/Articles/') && params?.id) {
                try {
                    const article = await ArticlesAPI.getArticleById(Number(params.id));
                    setCurrentArticle(article);
                } catch (error) {
                    console.error('Error fetching article:', error);
                }
            } else {
                setCurrentArticle(null);
            }
        };

        fetchArticle();
    }, [pathname, params]);

    // 如果是文章详情页面且滚动超过500px，显示文章标题和日期
    if (currentArticle && showArticleInfo) {
        return (
            <div className={styles.articleInfo}>
                <h2 className={styles.articleTitle}>当前文章：{currentArticle.title}</h2>
                {/*<span className={styles.articleDate}>*/}
                {/*    {new Date(currentArticle.publishedAt).toLocaleDateString()}*/}
                {/*</span>*/}
                <span className={styles.articleExcerpt}>{currentArticle.excerpt}</span>
            </div>
        );
    }

    // 否则显示常规导航
    return (
        <ul className={styles.navList}>
            {navRoutesItem.map((item) => (
                <li
                    key={item.id}
                    className={styles.navItem}
                >
                    <Link
                        href={item.path}
                        className={`${styles.navLink} ${pathname === item.path ? styles.activeLink : ''}`}
                    >
                        {item.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default NavbarCenter;