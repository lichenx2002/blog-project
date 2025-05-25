import React from 'react';
import AIChat from '@/components/AIChat/AIChat';
import styles from './XiaoXiAI/XiaoXiAI.module.css';
import Head from "next/head";
import { useAuth } from '@/hooks/useAuth';
import { useContext } from 'react';
import { LoginModalContext } from '@/context/LoginModalContext';
import { motion } from "framer-motion";
import PageHeader from '../../components/PageHeader/PageHeader';

const XiaoXiAI: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { setShowLogin } = useContext(LoginModalContext);

    // 如果未登录，显示提示信息和登录按钮
    if (!isAuthenticated) {
        return (
            <div className={styles.container}>
                <Head>
                    <title>小熙智能空间 | 你的专属AI助手</title>
                    <meta name="description" content="我是小熙，孤芳不自赏博客的AI助手，随时为你解答技术问题，分享知识，陪伴你的学习之旅" />
                </Head>
                <div className={styles.unauthorizedContent}>
                    <h2>小熙欢迎你！😊</h2>
                    <p style={{ color: 'var(--text)' }}>
                        快来登录与小熙畅聊吧！<br />
                        让我们一起探讨技术、分享知识~
                    </p>
                    <button
                        className={styles.loginButton}
                        onClick={() => setShowLogin(true)}
                    >
                        立即开始对话
                    </button>
                </div>
            </div>
        );
    }

    // 已登录则显示正常内容
    return (
        <div className={styles.container}>
            <Head>
                <title>小熙智能空间 | 你的专属AI助手</title>
                <meta name="description" content="我是小熙，孤芳不自赏博客的AI助手，随时为你解答技术问题，分享知识，陪伴你的学习之旅" />
            </Head>
            <div className={styles.content}>
                <div className={styles.chatSection}>
                    <PageHeader
                        headerText="小熙的空间"
                        introText="在这里，每一次对话都是一次思想的碰撞，每一次交流都是一次智慧的分享。让我成为你的知心伙伴，一起探索知识的海洋，共同成长。"
                        englishTitle="XiaoXi AI"
                    />
                    <AIChat />
                </div>
            </div>
        </div>
    );
};

export default XiaoXiAI;