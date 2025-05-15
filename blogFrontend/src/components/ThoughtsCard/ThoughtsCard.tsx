import React, { useMemo } from 'react';
import { ThoughtsProps } from '@/types/Thoughts';
import styles from './ThoughtsCard.module.css';
import { FaGithub, FaInstagram, FaTwitch, FaWeixin,Fa,FaMapMarkerAlt} from 'react-icons/fa';

const moodMap: Record<string, string> = {
    happy: '😄',
    sad: '😢',
    angry: '😠',
    neutral: '😐',
    excited: '🤩',
    tired: '😪',
};

const colorList = [
    styles.tagPink,
    styles.tagBlue,
    styles.tagYellow,
    styles.tagGreen,
    styles.tagPurple,
    styles.tagLightYellow,
];

// 主题列表
const themes = ['themeA', 'themeB', 'themeC', 'themeD', 'themeE', 'themeF', 'themeG', 'themeH'];

// 根据id生成固定的主题，这样每次渲染同一个卡片都会使用相同的主题
const getThemeByThoughtId = (id: number) => {
    return themes[id % themes.length];
};

interface ThoughtsCardProps {
    data: ThoughtsProps;
    style?: React.CSSProperties;
}


const ThoughtsCard: React.FC<ThoughtsCardProps> = ({ data, style }) => {

    const theme = useMemo(() => {
        return getThemeByThoughtId(data.id);
    }, [data.id]);

    return (
        <div
            className={`${styles.card} ${styles[`${theme}-bg`]}`}
            style={style}
        >
            <div className={`${styles.headerBar} ${styles[`${theme}-header`]}`}>
                <span className={styles.date}>
                    {data.createdAt?.replace('T', ' ').slice(0, 16)}
                </span>
                <span className={styles.hole}>
                    <svg width="32" height="32">
                        <circle cx="16" cy="16" r="10" fill="#fff" />
                        <circle cx="16" cy="16" r="12" fill="none" stroke="#b5d0ff" strokeWidth="3" />
                    </svg>
                </span>
            </div>
            <div className={`${styles.noteArea} ${styles[`${theme}-line`]}`}>
                <div className={styles.mood}>
                    {moodMap[data.mood] || '🌈'}
                </div>
                <div className={styles.content}>
                    {data.content}
                </div>
                <div className={`${styles.tags} ${styles[`${theme}-tag`]}`}>
                    {data.tags &&
                        data.tags.split(',').map((tag: string, idx: number) => (
                            <span
                                key={idx}
                                className={`${styles.tag} ${colorList[idx % colorList.length]}`}
                            >
                                #{tag}
                            </span>
                        ))}
                </div>
                <div className={styles.info}>
                    <span title="地点"><FaMapMarkerAlt/></span>{data.location}
                    <span title="天气">⛅</span>{data.weather}
                    <span title="设备">💻</span>{data.device}
                </div>
            </div>
        </div>
    );
};

export default ThoughtsCard;