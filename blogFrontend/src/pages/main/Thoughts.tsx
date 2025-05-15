import React, { useEffect, useState } from 'react';
import ThoughtsCard from "@/components/ThoughtsCard/ThoughtsCard";
import styles from './Thoughts/Thoughts.module.css';
import { ThoughtsAPI } from "@/api/ThoughtsAPI";
import { ThoughtsProps } from "@/types/Thoughts";

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchThoughts = async () => {
            try {
                setLoading(true);
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
                setLoading(false);
            }
        };

        fetchThoughts();
    }, []);

    if (loading) {
        return <div className={styles.wall}>加载中...</div>;
    }

    if (error) {
        return <div className={styles.wall}>{error}</div>;
    }

    if (!Array.isArray(thoughtsList)) {
        console.error('thoughtsList is not an array:', thoughtsList);
        return <div className={styles.wall}>数据格式错误</div>;
    }

    return (
        <>
            <div className={styles.top}></div>
            <div className={styles.wall}>
                {thoughtsList.length === 0 ? (
                    <div>暂无数据</div>
                ) : (
                    thoughtsList.map((item, idx) => {
                        const t = cardTransforms[idx % cardTransforms.length];
                        return (
                            <ThoughtsCard
                                key={item.id + '-' + idx}
                                data={item}
                                style={{
                                    transform: `rotate(${t.rotate}deg) translateY(${t.translateY}px)`,
                                    transition: 'transform 0.3s cubic-bezier(.4,2,.6,1)',
                                }}
                            />
                        );
                    })
                )}
            </div>
        </>
    );
};

export default Thoughts;

