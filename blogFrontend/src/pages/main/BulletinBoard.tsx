import React, { useState, useEffect, useRef } from 'react';
import { BulletinBoardAPI } from '@/api/BulletinBoardAPI';
import type { BulletinBoardProps } from '@/types/BulletinBoard';
import styles from './BulletinBoard/BulletinBoard.module.css';
import { useTheme } from '@/hooks/useTheme';
import { useLoading } from "@/hooks/useLoading";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Head from "next/head";
import PageHeader from '../../components/PageHeader/PageHeader';
import registerStyles from '@/components/Register/Register.module.css';
import { http } from '@/utils/request';
import { ApiResponse } from '@/types/common';

const BulletinBoard: React.FC = () => {
    const { isDarkMode } = useTheme();
    const { isLoading, withLoading } = useLoading();
    const [messages, setMessages] = useState<BulletinBoardProps[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<BulletinBoardProps>({
        id: 0,
        name: '',
        email: '',
        content: '',
        gender: '小哥哥' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });

    // 获取留言列表
    const fetchMessages = async () => {
        try {
            const response = await withLoading(BulletinBoardAPI.getMessages(1));

            if (response && response.records) {
                setMessages(response.records);
            } else {
                setMessages([]);
            }
        } catch (error: any) {
            console.error('获取留言失败:', error);
            alert(error.message || '获取留言失败');
        }
    };

    // 初始加载留言
    useEffect(() => {
        fetchMessages();
    }, []);

    // 处理输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 处理性别选择
    const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            gender: e.target.value as '小哥哥' | '小姐姐'
        }));
    };

    // 处理头像上传
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // 处理表单提交
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 表单验证
        if (!formData.name || !formData.email || !formData.content) {
            alert('请填写所有必填字段');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('请输入有效的邮箱地址');
            return;
        }

        try {
            let avatarUrl = '';
            if (avatarFile) {
                const formData = new FormData();
                formData.append('file', avatarFile);
                const response = await http.post<{ url: string }>('/bulletinboard/upload-avatar', formData);
                if (response && response.url) {
                    avatarUrl = response.url;
                } else {
                    throw new Error('头像上传失败');
                }
            }

            const messageData = {
                ...formData,
                avatar: avatarUrl
            };
            const response = await BulletinBoardAPI.createMessage(messageData);

            if (response) {
                alert('留言成功！');
                setIsModalOpen(false);
                setFormData({
                    id: 0,
                    name: '',
                    email: '',
                    content: '',
                    gender: '小哥哥',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                setAvatarFile(null);
                setAvatarPreview('');
                await fetchMessages();
            } else {
                throw new Error('留言失败');
            }
        } catch (error: any) {
            console.error('提交留言失败:', error);
            alert(error.message || '留言失败，请稍后重试');
        }
    };

    // 渲染头像
    const renderAvatar = (item: BulletinBoardProps) => {
        if (item.avatar) {
            return <img src={item.avatar} alt={item.name} className={styles.avatarImage} />;
        }
        return (
            <div className={`${styles.avatarText} ${item.gender === '小姐姐' ? styles.female : styles.male}`}>
                {item.name.charAt(0)}
            </div>
        );
    };

    // 渲染回复部分
    const renderReply = (item: BulletinBoardProps) => {
        if (!item.reply) return null;
        return (
            <div className={styles.replySection}>
                <div className={styles.replyHeader}>
                    <span className={styles.replyIcon}>💌</span>
                    <span>孤芳不自赏的回复</span>
                </div>
                <div className={styles.replyContent}>{item.reply}</div>
                {item.replyTime && (
                    <div className={styles.replyTime}>
                        {new Date(item.replyTime).toLocaleString()}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>浮世三千，难得一见 | 在此镌刻你的心语</title>
                <meta name="description" content="在这里，每一句留言都是一次心灵的对话，每一次交流都是一次情感的共鸣。让我们以文字为媒，以真诚为笔，共同书写属于我们的故事。" />
            </Head>
            {isLoading && <LoadingSpinner />}
            <PageHeader
                headerText="留言板"
                introText="浮世三千，难得一见。在这里，每一句留言都是一次心灵的对话，每一次交流都是一次情感的共鸣。让我们以文字为媒，以真诚为笔，共同书写属于我们的故事。"
                englishTitle="Bulletin Board"
            />
            {/* 留言列表 */}
            <div className={styles.messageList}>
                {messages.length === 0 ? (
                    <p className={styles.emptyMessage}>暂无留言</p>
                ) : (
                    <div className={styles.messagesGrid}>
                        {messages
                            .filter(item => item.status === 'approved')
                            .sort((a, b) => {
                                // 首先按置顶状态排序
                                if (a.isPinned && !b.isPinned) return -1;
                                if (!a.isPinned && b.isPinned) return 1;
                                // 然后按创建时间排序
                                return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
                            })
                            .map((item, index) => (
                                <div
                                    key={index}
                                    className={`${styles.messageItem} ${item.gender === '小姐姐' ? styles.female : styles.male} ${item.isPinned ? (item.gender === '小姐姐' ? styles.pinned : styles.pinnedBlue) : ''}`}
                                >
                                    <div className={styles.messageHeader}>
                                        <div className={`${styles.avatar} ${item.gender === '小姐姐' ? styles.female : styles.male}`}>
                                            {renderAvatar(item)}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                            <span className={styles.messageName}>
                                                {item.name}
                                                {item.isPinned && <span className={styles.pinIcon}>📌</span>}
                                            </span>
                                            <span className={`${styles.messageGender} ${item.gender === '小姐姐' ? styles.female : styles.male}`}>
                                                {item.gender}
                                            </span>
                                        </div>
                                        <span className={styles.messageTime}>
                                            🗓️{new Date(item.createdAt!).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className={styles.messageContent}>{item.content}</p>
                                    {renderReply(item)}
                                </div>
                            ))}
                    </div>
                )}
            </div>

            <button
                className={styles.addMessageButton}
                onClick={() => setIsModalOpen(true)}
            >
                {isDarkMode ? (<svg className="icon" viewBox="0 0 1073 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="25" height="25">
                    <path d="M160.256 973.824c-63.488 0-133.12-76.288-133.12-145.408V364.544c0-1.536-0.512-39.936 13.312-65.024 12.288-22.016 39.424-37.888 40.448-38.4l76.288-43.52V130.048c3.584-39.424 26.112-61.44 61.44-61.44h633.344c27.136 0 58.88 25.088 61.44 61.44v88.064l63.488 37.376c1.024 0.512 29.696 16.384 47.104 44.032 17.408 28.16 19.456 69.632 19.456 71.168v464.384c0 94.72-80.896 138.752-135.68 138.752h-747.52z m720.896-60.416h6.144c12.8 0 45.568-2.56 69.632-27.648 26.112-27.136 26.112-64 26.112-64.512V389.632L581.12 624.64c-14.336 8.704-28.672 12.8-44.032 12.8-13.824 0-28.672-3.584-45.056-11.264L87.04 388.608v424.448c1.536 45.056 40.96 97.792 90.624 100.352h703.488z m-377.856-350.72c0.512 0 13.312 8.704 31.232 9.216h1.024c18.432 0 32.768-11.264 32.768-11.264l283.136-168.448V150.016c0-16.384-5.632-22.016-22.016-22.016H239.616c-16.384 0-22.016 5.632-22.016 22.016v242.176l285.696 170.496z m410.624-199.68l56.32-36.352-56.32-38.912v75.264z m-756.736-2.048V288.256l-54.272 35.84 54.272 36.864z m182.784 22.016c-14.336 0-26.624-16.384-26.624-29.696s12.288-29.696 26.624-29.696h286.72c14.336 0 25.6 15.872 25.6 29.696 0 13.824-10.752 29.696-25.6 29.696h-286.72z m-5.632-118.272c-14.336 0-26.624-16.384-26.624-29.696s12.288-29.696 26.624-29.696h401.92c14.336 0 25.6 15.872 25.6 29.696s-11.264 29.696-25.6 29.696H334.336z" fill="#ffffff"></path>
                </svg>) : (<svg className="icon" viewBox="0 0 1073 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="25" height="25">
                    <path d="M160.256 973.824c-63.488 0-133.12-76.288-133.12-145.408V364.544c0-1.536-0.512-39.936 13.312-65.024 12.288-22.016 39.424-37.888 40.448-38.4l76.288-43.52V130.048c3.584-39.424 26.112-61.44 61.44-61.44h633.344c27.136 0 58.88 25.088 61.44 61.44v88.064l63.488 37.376c1.024 0.512 29.696 16.384 47.104 44.032 17.408 28.16 19.456 69.632 19.456 71.168v464.384c0 94.72-80.896 138.752-135.68 138.752h-747.52z m720.896-60.416h6.144c12.8 0 45.568-2.56 69.632-27.648 26.112-27.136 26.112-64 26.112-64.512V389.632L581.12 624.64c-14.336 8.704-28.672 12.8-44.032 12.8-13.824 0-28.672-3.584-45.056-11.264L87.04 388.608v424.448c1.536 45.056 40.96 97.792 90.624 100.352h703.488z m-377.856-350.72c0.512 0 13.312 8.704 31.232 9.216h1.024c18.432 0 32.768-11.264 32.768-11.264l283.136-168.448V150.016c0-16.384-5.632-22.016-22.016-22.016H239.616c-16.384 0-22.016 5.632-22.016 22.016v242.176l285.696 170.496z m410.624-199.68l56.32-36.352-56.32-38.912v75.264z m-756.736-2.048V288.256l-54.272 35.84 54.272 36.864z m182.784 22.016c-14.336 0-26.624-16.384-26.624-29.696s12.288-29.696 26.624-29.696h286.72c14.336 0 25.6 15.872 25.6 29.696 0 13.824-10.752 29.696-25.6 29.696h-286.72z m-5.632-118.272c-14.336 0-26.624-16.384-26.624-29.696s12.288-29.696 26.624-29.696h401.92c14.336 0 25.6 15.872 25.6 29.696s-11.264 29.696-25.6 29.696H334.336z" fill="#515151"></path>
                </svg>)}
            </button>

            {/* 留言表单模态框 */}
            <div className={`${registerStyles.modalOverlay} ${isModalOpen ? registerStyles.active : ''}`}>
                <div className={registerStyles.registerCard}>
                    <button
                        className={registerStyles.closeButton}
                        onClick={() => setIsModalOpen(false)}
                        title="关闭"
                    >
                        ×
                    </button>
                    <form onSubmit={handleSubmit} className={registerStyles.form}>
                        <div className={registerStyles.inputGroup}>
                            <label className={registerStyles.label}>头像</label>
                            <div className={styles.avatarUpload}>
                                <div
                                    className={`${styles.avatarPreview} ${formData.gender === '小姐姐' ? styles.female : styles.male}`}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="预览" />
                                    ) : (
                                        <span>点击上传</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                        <div className={registerStyles.inputGroup}>
                            <label className={registerStyles.label}>你的名字</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="请输入你的名字"
                                className={registerStyles.input}
                                required
                            />
                        </div>
                        <div className={registerStyles.inputGroup}>
                            <label className={registerStyles.label}>你的邮箱</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="请输入你的邮箱"
                                className={registerStyles.input}
                                required
                            />
                        </div>
                        <div className={registerStyles.inputGroup}>
                            <label className={registerStyles.label}>选择你的身份</label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <label className={registerStyles.label}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="小哥哥"
                                        checked={formData.gender === '小哥哥'}
                                        onChange={handleGenderChange}
                                        style={{ marginRight: 4 }}
                                    />
                                    小哥哥
                                </label>
                                <label className={registerStyles.label}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="小姐姐"
                                        checked={formData.gender === '小姐姐'}
                                        onChange={handleGenderChange}
                                        style={{ marginRight: 4 }}
                                    />
                                    小姐姐
                                </label>
                            </div>
                        </div>
                        <div className={registerStyles.inputGroup}>
                            <label className={registerStyles.label}>留言内容</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                placeholder="写下你想说的话..."
                                className={registerStyles.input}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className={registerStyles.submitButton}
                        >
                            提交留言
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BulletinBoard;