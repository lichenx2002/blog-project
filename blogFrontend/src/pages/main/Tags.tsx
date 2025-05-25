import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Tags/Tags.module.css';
import Head from "next/head";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { useLoading } from '@/hooks/useLoading';
import { TagsAPI } from '@/api/TagsAPI';
import { Tag } from "@/types/Tags";
import PageHeader from '../../components/PageHeader/PageHeader';
import TagCloudBackground from "@/components/TagCloudBackground/TagCloudBackground";
import { motion } from 'framer-motion';

const Tags: React.FC = () => {
    const router = useRouter();
    const [tags, setTags] = useState<Tag[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { isLoading, withLoading } = useLoading();
    const getStaggerDelay = (index: number) => index * 0.1;

    // 处理标签点击
    const handleTagClick = (tag: Tag) => {
        router.push(`/main/Articles/tag/${tag.id}`);
    };

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
            <PageHeader
                headerText="标签云"
                introText="知识如繁星点点，标签似云卷云舒。在这里，每一个标签都是一扇门，打开它，就能遇见一片新的天地。让我们在标签的海洋中遨游，探索知识的无限可能。"
                englishTitle="Tags"
            />
            {isLoading && <LoadingSpinner />}

            <div className={styles.tagsGrid}>
                {tags.map((tag, index) => (
                    <motion.div
                        key={tag.id}
                        initial={{
                            opacity: 0,
                            y: 20,
                            scale: 0.8,
                            rotate: -5
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            rotate: 0
                        }}
                        whileHover={{
                            scale: 1.05,
                            rotate: 2,
                            transition: { duration: 0.2 }
                        }}
                        transition={{
                            delay: index * 0.1,
                            duration: 0.5,
                            ease: [0.34, 1.56, 0.64, 1]
                        }}
                    >
                        <div
                            className={styles.tag}
                            onClick={() => handleTagClick(tag)}
                            style={{
                                borderColor: tag.color,
                                color: tag.color,
                                backgroundColor: `color-mix(in srgb, var(--tag-background) 90%, ${tag.color})`
                            }}
                            title={tag.name}
                        >
                            {tag.name}
                            {tag.count !== undefined && tag.count > 0 && (
                                <span className={styles.tagCount} style={{ color: tag.color }}>
                                    {tag.count}
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
            <TagCloudBackground tags={tags.map(({ name, color }) => ({ name, color }))} />
        </div>
    );
};

export default Tags;