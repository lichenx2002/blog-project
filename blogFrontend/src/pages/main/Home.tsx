import React, { useEffect, useState } from 'react';
import Head from "next/head";
import styles from './Home/Home.module.css'
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import Arrow from "@/components/Arrow/Arrow";
import Typewriter from '@/components/Typewriter/Typewriter';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { TagsAPI } from '@/api/TagsAPI';
import { GalleryAPI } from '@/api/GalleryAPI';
import Link from 'next/link';
import type { Tag } from '@/types/Tags';
import { Article } from '@/types/Article';
import { Gallery } from '@/types/Gallery';
import FlipClock from "@/components/FlipCard/FlipClock";

const Home: React.FC = () => {
    const [latestArticles, setLatestArticles] = useState<Article[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [stats, setStats] = useState({ articles: 0, tags: 0, views: 0 });
    const [recentPhotos, setRecentPhotos] = useState<Gallery[]>([]);

    // 添加滚动处理函数
    const handleArrowClick = () => {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.scrollIntoView({ behavior: 'smooth' });
        }
    };


    useEffect(() => {
        // 获取最新文章
        const fetchLatestArticles = async () => {
            try {
                const response = await ArticlesAPI.getArticles();
                if (response && Array.isArray(response.data)) {
                    // 筛选已发布的文章并按时间排序
                    const publishedArticles = response.data
                        .filter(article => article.status === 'published')
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 5);
                    setLatestArticles(publishedArticles);

                    const articlesResponse = await ArticlesAPI.getArticles();
                    const articles = articlesResponse.data as Article[];

                    setStats(prevStats => ({
                        ...prevStats,
                        articles: articles.filter(article => article.status === 'published').length,
                        views: articles.reduce((acc, article) => acc + (article.viewCount || 0), 0)
                    }));
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        // 获取最新照片
        const fetchRecentPhotos = async () => {
            try {
                const data = await GalleryAPI.getGalleries();
                const galleryData = Array.isArray(data) ? data : [];
                const transformedData = galleryData
                    .map((item: any) => ({
                        ...item,
                        coverImage: item.coverImage ? item.coverImage.replace(/\/uploads\/\/uploads\//g, '/uploads/') : '/default-image.jpg'
                    }))
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 4);
                setRecentPhotos(transformedData);
            } catch (error) {
                console.error('Error fetching photos:', error);
            }
        };

        // 获取标签
        const fetchTags = async (name = '') => {
            try {
                const response = await TagsAPI.getTagsWithCount();
                let data = response as Tag[];
                if (name) {
                    data = data.filter(tag =>
                        tag.name.toLowerCase().includes(name.toLowerCase())
                    );
                }
                setTags(data);
                setStats(prevStats => ({
                    ...prevStats,
                    tags: data.length
                }));
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchLatestArticles();
        fetchRecentPhotos();
        fetchTags();
    }, []);


    // 格式化日期
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <div className={styles.bacc}>
            <Head>
                <title>孤芳不自赏知识空间</title>
                <meta name="description" content="记录我的技术思考、设计理念和生活感悟" />
            </Head>

            <div className={styles.container}>
                <div className={styles.showTop}>
                    <div className={styles.box1}>
                        <Typewriter className={styles.typewriter1} text={'这里是孤芳不自赏的Blog'} delay={100} />
                        <br className={styles.typewriter1} />
                        <Typewriter className={styles.typewriter2} text={'日益努力，而后风生水起'} delay={200} cursorChar={'|'} />
                    </div>
                    <div className="box2">
                        <ProfileCard />
                    </div>
                </div>
                <div>
                    <Arrow
                        text1={"钥在锁先，行胜于言"}
                        text2={"Prepare the solution beforethe problem; action speaks louder."}
                        onClick={handleArrowClick}
                    />
                </div>

                <div className={styles.flipClock}>
                    <FlipClock />
                </div>

                <div id="mainContent" className={styles.mainContentArea}>
                    <div className={styles.mainContentLeft}>
                        <h2 className={styles.latestArticlesTitle}>最新文章</h2>
                        <div className={styles.articlesGrid}>
                            {latestArticles.map((article: Article) => (
                                <Link href={`/main/Articles/${article.id}`} key={article.id}>
                                    <div className={styles.articleCard}>
                                        <div>
                                            <h3 className={styles.articleTitle}>{article.title}</h3>
                                            <p className={styles.articleDescription}>
                                                {article.excerpt || article.content.slice(0, 100)}
                                            </p>
                                        </div>
                                        <div className={styles.articleMeta}>
                                            <span>{formatDate(article.createdAt)}</span>
                                            <span>{article.viewCount || 0} 阅读</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className={styles.mainContentRight}>
                        <h2 className={styles.latestArticlesTitle}>近期照片</h2>
                        <div className={styles.photosGrid}>
                            {recentPhotos.map((photo) => (
                                <Link href="/main/Gallery" key={photo.id}>
                                    <div className={styles.photoCard}>
                                        <img
                                            src={photo.coverImage}
                                            alt={photo.title}
                                            className={styles.photoImage}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/default-image.jpg';
                                            }}
                                        />
                                        <div className={styles.photoInfo}>
                                            <h3>{photo.title}</h3>
                                            <span>{photo.date}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <section className={styles.stats}>
                            <h2>博客统计</h2>
                            <div className={styles.statsGrid}>
                                <div className={styles.statItem}>
                                    <span>{stats.articles}</span>
                                    <p>文章数</p>
                                </div>
                                <div className={styles.statItem}>
                                    <span>{stats.tags}</span>
                                    <p>标签数</p>
                                </div>
                                <div className={styles.statItem}>
                                    <span>{stats.views}</span>
                                    <p>总访问量</p>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;