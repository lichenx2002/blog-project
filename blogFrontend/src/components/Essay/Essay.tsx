import React, { useEffect, useRef } from 'react';
import styles from './Essay.module.css';
import { Article } from '@/types/Article';

interface EssayProps {
    articles: Article[];
}

const Essay: React.FC<EssayProps> = ({ articles }) => {
    const componentRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        componentRefs.current.forEach((el) => {
            if (!el) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        el.classList.add(styles.animateIn);
                        observer.unobserve(el);
                    }
                },
                { threshold: 0.1 }
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach(obs => obs.disconnect());
    }, [articles]);

    // 解析 images 字符串为数组
    const parseImages = (imagesString: string[]): string[] => {
        try {
            // @ts-ignore
            return JSON.parse(imagesString);
        } catch {
            return [];
        }
    };

    return (
        <div className={styles.container}>
            {articles.map((article, index) => {
                const images = parseImages(article.images);

                return (
                    <div
                        key={article.id}
                        ref={el => (componentRefs.current[index] = el)}
                        className={styles.card}
                    >
                        {article.coverImage && (
                            <img
                                src={article.coverImage}
                                alt={article.title}
                                className={styles.coverImage}
                            />
                        )}
                        <h2 className={styles.cardHeader}>{article.title}</h2>
                        <div className={styles.metaInfo}>
                            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                            <span>👁️ {article.viewCount}</span>
                            <span>❤️ {article.likeCount}</span>
                            <span>⏱️ {article.readingTime}分钟</span>
                        </div>
                        <p className={styles.excerpt}>{article.excerpt}</p>
                        {images.length > 0 && (
                            <div className={styles.imageGallery}>
                                {images.map((img, i) => (
                                    <img key={i} src={img} alt="" className={styles.thumbnail} />
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Essay;