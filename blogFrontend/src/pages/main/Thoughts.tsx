import React, { useEffect, useState } from 'react';
import ThoughtsCard from "@/components/ThoughtsCard/ThoughtsCard";
import styles from './Thoughts/Thoughts.module.css';
import { ThoughtsAPI } from "@/api/ThoughtsAPI";
import { ThoughtsProps } from "@/types/Thoughts";
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import Head from "next/head";
import { useLoading } from "@/hooks/useLoading";
import PageHeader from '../../components/PageHeader/PageHeader';

const cardTransforms = [
    { rotate: -12, translateY: 0 },
    { rotate: 5, translateY: 8 },
    { rotate: -8, translateY: -6 },
    { rotate: 12, translateY: 4 },
    { rotate: -6, translateY: 10 },
    { rotate: 8, translateY: -4 },
    { rotate: -4, translateY: 6 },
    { rotate: 6, translateY: -8 },
    // ...可继续扩展
];

const Thoughts: React.FC = () => {
    const [thoughtsList, setThoughtsList] = useState<ThoughtsProps[]>([]);
    const { isLoading, withLoading } = useLoading();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchThoughts = async () => {
            try {
                const response = await ThoughtsAPI.getAllThoughts();
                if (Array.isArray(response)) {
                    setThoughtsList(response);
                } else {
                    console.warn('API response is not an array:', response);
                    setThoughtsList([]);
                }
            } catch (err) {
                setError('获取数据失败，请稍后重试');
                console.error('Error fetching thoughts:', err);
                setThoughtsList([]);
            } finally {
            }
        };

        fetchThoughts();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className={styles.wall}>{error}</div>;
    }

    if (!Array.isArray(thoughtsList)) {
        console.error('thoughtsList is not an array:', thoughtsList);
        return <div className={styles.wall}>数据格式错误</div>;
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>灵光一瞬 | 捕捉思想的流星</title>
                <meta name="description" />
            </Head>
            <PageHeader
                headerText="灵光一瞬"
                introText="思绪如流星划过夜空，转瞬即逝。在这里，我们捕捉那些闪光的瞬间，记录下思想的火花。每一张卡片都是一次灵感的绽放，每一次记录都是一次思维的沉淀。"
                englishTitle="Thoughts"
            />
            <div className={styles.wall}>
                {thoughtsList.length === 0 ? (
                    <div><LoadingSpinner /></div>
                ) : (
                    thoughtsList.map((item, idx) => {
                        return (
                            <ThoughtsCard
                                key={item.id + '-' + idx}
                                data={item}
                                style={{
                                    transition: 'transform 0.3s cubic-bezier(.4,2,.6,1)',
                                }}
                                className={styles.cardAnimation}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Thoughts;

