import Head from 'next/head';
import Navbar from "@/client/components/Navbar/Navbar";
import Background from "@/components/Background/Background";
import Footer from "@/client/components/Footer/Footer";
import React from "react";
import { useTheme } from '@/hooks/useTheme';
import AppLayoutProps from './types';

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const { isDarkMode } = useTheme();
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Background />

            <Navbar />
            <main
                className={`container mx-auto ${isDarkMode ? 'dark-theme' : 'light-theme'}`}
                style={{
                    marginTop: '60px',       // 确保内容在导航栏下方
                    minHeight: 'calc(100vh - 60px - 300px)' // 内容至少占满剩余视口，减去导航栏和底部高度
                }}>
                {children}
            </main>
            <Footer />
        </>
    );
}

export default AppLayout;