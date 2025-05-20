import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from './Tags/Tags.module.css';
import Head from "next/head";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useLoading } from '@/hooks/useLoading';
import { TagsAPI } from '@/api/TagsAPI';
import { Tag } from "@/types/Tags";

const Tags: React.FC = () => {
    const router = useRouter();
    const [tags, setTags] = useState<Tag[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { isLoading, withLoading } = useLoading();

    // 生成随机动画参数
    const generateAnimationParams = useCallback(() => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // 随机决定标签从左边还是右边进入
        const isLeft = Math.random() > 0.5;

        // 设置起始位置（屏幕外）
        const startX = isLeft ? -200 : windowWidth + 200;

        const startY = windowHeight * 0.1 + Math.random() * windowHeight * 0.8;

        // 设置终点X坐标（在屏幕宽度的30%-70%范围内）
        const endX = windowWidth * 0.1 + Math.random() * windowWidth * 0.8;

        // 添加一些随机的浮动效果
        const floatOffset = 20 + Math.random() * 30; // 20-50px的浮动范围

        return {
            startX,
            endX,
            startY,
            floatOffset,
            duration: `${12000 + Math.random() * 8000}ms`, // 12-20秒
            delay: `${Math.random() * 30}ms` // 0-3秒的随机延迟
        };
    }, []);

    // 处理标签点击
    const handleTagClick = useCallback((tag: Tag) => {
        router.push(`/main/Articles/tag/${tag.id}`);
    }, [router]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const data = await withLoading(TagsAPI.getTags());
                setTags(data.slice(0, 100)); // 限制标签数量为100个
            } catch (err) {
                console.error('Error fetching tags:', err);
                setError('加载标签失败，请稍后重试');
            }
        };

        fetchTags();

        // 添加窗口大小变化监听
        const handleResize = () => {
            setTags(prev => [...prev]);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>标签云 | 探索知识的无限可能</title>
                <meta name="description" content="通过标签探索文章，发现更多精彩内容，让知识触手可及" />
            </Head>
            {isLoading && <LoadingSpinner />}
            {tags.map((tag) => {
                const { startX, endX, startY, floatOffset, duration, delay } = generateAnimationParams();
                const currentX = `calc(${endX}px + var(--floatX, 0px))`;
                const currentY = `calc(${startY}px + var(--floatY, 0px))`;

                return (
                    <div
                        key={tag.id}
                        className={styles.tag}
                        onClick={() => handleTagClick(tag)}
                        style={{
                            backgroundColor: `${tag.color}80`,
                            '--startX': `${startX}px`,
                            '--startY': `${startY}px`,
                            '--endX': `${endX}px`,
                            '--currentX': currentX,
                            '--currentY': currentY,
                            '--floatOffset': `${floatOffset}px`,
                            '--duration': duration,
                            '--delay': delay,
                        } as React.CSSProperties}
                        title={tag.name}
                    >
                        {tag.name}
                        {tag.count !== undefined && tag.count > 0 && (
                            <span className={styles.tagCount}>{tag.count}</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Tags;