import React from 'react';
import Image from 'next/image';
import { useTheme } from '@/hooks/useTheme';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '@/redux/theme/actions';
import styles from './ThemeToggleButton.module.css';

// 定义图标资源类型
interface ThemeIcons {
    themeDay: string;
    themeNight: string;
}

// 组件props类型
interface ThemeToggleButtonProps {
    icons: ThemeIcons;
    iconSize?: number;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({icons, iconSize = 20}) => {
    const dispatch = useDispatch();
    const { isDarkMode } = useTheme();



    return (
        <button
            className={styles.iconButton}
            onClick={() => dispatch(toggleTheme())}
            aria-label={isDarkMode ? '切换到白天模式' : '切换到夜间模式'}
            data-theme={isDarkMode ? 'dark' : 'light'}
        >
            <Image
                src={isDarkMode ? icons.themeNight : icons.themeDay}
                alt="主题切换图标"
                width={iconSize}
                height={iconSize}
                className={styles.iconImage}
                priority
            />
        </button>
    );
};

export default ThemeToggleButton;