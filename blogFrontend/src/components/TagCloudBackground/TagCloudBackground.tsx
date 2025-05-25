import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Bookmark, FileText, Hash, Link, Paperclip, Type, LucideIcon } from 'lucide-react';
import { TagsAPI } from '@/api/TagsAPI';
import { Tag } from "@/types/Tags";
import styles from './TagCloudBackground.module.css';

interface TagItem {
    name: string;
    color?: string;
}

interface TagItemProps extends TagItem {
    icon: LucideIcon;
    isLeft: boolean;
    delay: number;
}

interface TagRowProps {
    isLeft: boolean;
    rowIndex: number;
    tags: TagItem[];
}

interface Row {
    isLeft: boolean;
    index: number;
}

interface TagCloudBackgroundProps {
    tags: TagItem[]; // 接收TagItem数组作为props
}

const icons: LucideIcon[] = [Book, Bookmark, FileText, Hash, Link, Paperclip, Type];
const getRandomIcon = (): LucideIcon => icons[Math.floor(Math.random() * icons.length)];

// 添加默认标签
const defaultTag: TagItem = {
    name: "标签",
    color: "#666666"
};

const getRandomTag = (tags: TagItem[]): TagItem => {
    if (!tags || tags.length === 0) {
        return defaultTag;
    }
    return tags[Math.floor(Math.random() * tags.length)];
};

const TagItem: React.FC<TagItemProps> = ({ icon: Icon, isLeft, delay, name }) => (

    <motion.div

        initial={{ opacity: 0, x: isLeft ? 100 : -100 }}//初始化位置
        animate={{//动画效果
            opacity: [0, 0.8, 0],
            x: isLeft ? [-100, 0, 100] : [100, 0, -100],
            y: [0, -(Math.random() * 2 + 1), 0, (Math.random() + 2), 0],
        }}
        transition={{
            duration: 5,
            delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear'
        }}
    >
        <div className={styles.badge}>
            <Icon size={14} style={{ color: 'var(--tag-color)' }} />
            <span>{name}</span>
        </div>

    </motion.div>
);

const TagRow: React.FC<TagRowProps> = ({ isLeft, tags, rowIndex }) => {
    const rowTags = Array.from({ length: 8 }, (_, num) => {
        const randomTag = getRandomTag(tags);
        return {
            icon: getRandomIcon(),
            name: randomTag.name,
            color: randomTag.color,
            delay: num * 0.5 + rowIndex * 0.2
        };
    });

    return (
        <div className={`${styles.row} ${isLeft ? styles.rowLeft : styles.rowRight}`}>
            {rowTags.map((tag, index) => (
                <TagItem key={`${index}-${rowIndex}`}
                    {...tag}
                    isLeft={isLeft} />
            ))}
        </div>
    )
}


const TagCloudBackground: React.FC<TagCloudBackgroundProps> = ({ tags }) => {

    const [rows, setRows] = useState<Row[]>([]);

    useEffect(() => {
        const numberOfRows = Math.ceil(window.innerHeight / 50);
        setRows(Array.from({ length: numberOfRows }, (_, i) => ({
            isLeft: i % 2 === 0,
            index: i
        })));
    }, []);

    return (
        <div className={styles.container}>
            {rows.map((row, index) => (
                <TagRow
                    key={index}
                    isLeft={row.isLeft}
                    rowIndex={row.index}
                    tags={tags} />
            ))}
        </div>
    );
};

export default TagCloudBackground;