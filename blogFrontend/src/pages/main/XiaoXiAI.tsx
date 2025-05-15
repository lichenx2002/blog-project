import React from 'react';
import AIChat from '@/components/AIChat/AIChat';
import styles from './XiaoXiAI/XiaoXiAI.module.css';
import Head from "next/head";
import { useAuth } from '@/hooks/useAuth';
import { useContext } from 'react';
import { LoginModalContext } from '@/context/LoginModalContext';

const XiaoXiAI:React.FC = () => {
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
                    <AIChat />
                </div>
            </div>
        </div>
    );
};

export default XiaoXiAI;