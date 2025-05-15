import React from 'react';
import NavbarCenter from "@/client/components/Navbar/NavbarCenter/NavbarCenter";
import NavbarLeft from "@/client/components/Navbar/NavbarLeft/NavbarLeft";
import NavbarRight from "@/client/components/Navbar/NavbarRight/NavbarRight";
import { useTheme } from '@/hooks/useTheme';
import styles from './Navbar.module.css';

const Navbar:React.FC = () => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`${styles.navbar} ${isDarkMode ? styles.dark : styles.light}`}>
            <div className={styles.navbarContainer}>
                <NavbarLeft />
                <NavbarCenter />
                <NavbarRight />
            </div>
        </div>
    );
};

export default Navbar;