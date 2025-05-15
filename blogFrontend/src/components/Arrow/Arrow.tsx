import React, { useRef } from 'react';
import styles from './Arrow.module.css';
import Image from "next/image";
import {useTheme} from '@/hooks/useTheme';
import WisdomProps from '@/types/Arrow'


const Arrow:React.FC<WisdomProps> = ({ text1, text2 }) => {
    // 获取 Arrow 组件底部的 DOM 位置
    const wisdomRef = useRef<HTMLDivElement>(null);

    const { isDarkMode } = useTheme();
    const icons ={
        arrowBlack: '/images/arrowBlack.png',
        arrowWhite: '/images/arrowWhite.png',
    }
    const handleScrollToNextSection = () => {
        if (wisdomRef.current) {
            // 计算 Arrow 组件底部的位置
            const wisdomBottom = wisdomRef.current.offsetTop +2*(wisdomRef.current.offsetHeight) ;

            // 平滑滚动到 Arrow 组件之后的位置
            window.scrollTo({
                top: wisdomBottom,
                behavior: 'smooth'
            });
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
                    onClick={handleScrollToNextSection}
                />
            </p>
        </div>
    );
};

export default Arrow;