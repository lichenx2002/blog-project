import React, { useRef } from 'react';
import styles from './Arrow.module.css';
import Image from "next/image";
import { useTheme } from '@/hooks/useTheme';
import WisdomProps from '@/types/Arrow'

const Arrow: React.FC<WisdomProps> = ({ text1, text2, onClick }) => {
    // 获取 Arrow 组件底部的 DOM 位置
    const wisdomRef = useRef<HTMLDivElement>(null);

    const { isDarkMode } = useTheme();
    const icons = {
        arrowBlack: '/images/arrowBlack.png',
        arrowWhite: '/images/arrowWhite.png',
    }

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            // 如果没有提供 onClick，使用默认的滚动行为
            if (wisdomRef.current) {
                const wisdomBottom = wisdomRef.current.offsetTop + 2 * (wisdomRef.current.offsetHeight);
                window.scrollTo({
                    top: wisdomBottom,
                    behavior: 'smooth'
                });
            }
        }
    };

    return (
        <div ref={wisdomRef} className={styles.showBottom}> {/* 用 div 包裹并添加 ref */}
            <p className={styles.wisdom1}>{text1}</p>
            <p className={styles.wisdom2}>{text2}</p>
            <p>
                <Image
                    // src={'/images/arrowBlack.png'}
                    src={isDarkMode ? icons.arrowWhite : icons.arrowBlack}
                    alt={'Arrow'}
                    width={20}
                    height={20}
                    className={styles.Arrow}
                    onClick={handleClick}
                />
            </p>
        </div>
    );
};

export default Arrow;