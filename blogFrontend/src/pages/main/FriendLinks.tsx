import React, { useState, useEffect } from 'react';
import { FriendLinksAPI } from '@/api/FriendLinkAPI';
import styles from './FriendLinks/FriendLinks.module.css';
import { useTheme } from '@/hooks/useTheme';
import { useLoading } from "@/hooks/useLoading";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Head from "next/head";
import PageHeader from '../../components/PageHeader/PageHeader';

interface FriendLink {
    id: number;
    name: string;
    url: string;
    description: string;
    avatarUrl: string;
    createdAt?: string;
    updatedAt?: string;
}

const SITE_INFO = {
    name: "孤芳不自赏的Blog",
    url: "https://gfbzsblog.site",
    description: "日益努力，而后风生水起",
    avatarUrl: "/images/avatar_20250520_215057.png"
};

const REQUIREMENTS = [
    "网站内容健康积极，定期更新原创内容，保持活跃度",
    "申请前请先在贵站友链专区添加本站链接（名称+网址）",
    "网站需备案且能稳定访问，无恶意弹窗/违规内容",
    "添加后请邮件告知您的网站名称、链接及简介"
];

const FriendLinks: React.FC = () => {
    const { isDarkMode } = useTheme();
    const { isLoading } = useLoading();
    const [friendLinks, setFriendLinks] = useState<FriendLink[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        description: '',
        avatarUrl: ''
    });
    const [modalOpen, setModalOpen] = useState(false);

    // 获取友链列表
    const fetchFriendLinks = async () => {
        try {
            const response = await FriendLinksAPI.getAllFriendLinks();
            if (Array.isArray(response)) {
                setFriendLinks(response as FriendLink[]);
            } else {
                setFriendLinks([]);
            }
        } catch (error) {
            setFriendLinks([]);
        }
    };

    useEffect(() => {
        fetchFriendLinks();
    }, []);

    // 处理输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 处理表单提交
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.url || !formData.description || !formData.avatarUrl) {
            alert('请填写所有必填字段');
            return;
        }
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (!urlRegex.test(formData.url)) {
            alert('请输入有效的网站地址');
            return;
        }
        try {
            await FriendLinksAPI.addFriendLinks({
                name: formData.name,
                url: formData.url,
                description: formData.description,
                avatarUrl: formData.avatarUrl
            });
            setFormData({ name: '', url: '', description: '', avatarUrl: '' });
            await fetchFriendLinks();
            setModalOpen(false);
            alert('友链申请已提交！');
        } catch (error) {
            alert('提交失败，请稍后重试');
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>友情链接 | 海内存知己，天涯若比邻</title>
                <meta name="description" content="友链交换，让我们的博客世界更加精彩" />
            </Head>
            {isLoading && <LoadingSpinner />}
            <PageHeader
                headerText="朋友们"
                introText="互联网的美好，在于让有趣的灵魂跨越山海相遇。这里是我在数字世界里遇到的宝藏创作者——他们用文字编织思想的星空，用真诚分享点亮彼此的世界。每一篇文章都是独特的礼物，每一次阅读都是一场温暖的邂逅。。"
                englishTitle="FriendLinks"
            />

            {/* 友链列表 */}
            <div className={styles.friendLinksSection}>
                {Array.isArray(friendLinks) && friendLinks.length > 0 ? (
                    <div className={styles.friendLinksGrid}>
                        {friendLinks.map((link) => (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.friendLinkCard}
                            >
                                <div className={styles.avatar}>
                                    <img src={link.avatarUrl} alt={link.name} />
                                </div>
                                <div className={styles.info}>
                                    <h3>{link.name}</h3>
                                    <p>{link.description}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <p className={styles.emptyMessage}>暂无友链，快来申请吧！</p>
                )}
            </div>

            {/* 本站信息 */}
            <section className={styles.siteInfoSection}>
                <h2 style={{ color: 'var(--text)' }}>本站信息</h2>
                <div className={styles.siteInfoCard}>
                    <div className={styles.siteInfoText}>
                        <div><b>头像链接：</b><a href={SITE_INFO.avatarUrl} target="_blank" rel="noopener noreferrer">点我获取</a></div>
                        <div><b>网站名称：</b>{SITE_INFO.name}</div>
                        <div><b>网站地址：</b><a href={SITE_INFO.url} target="_blank" rel="noopener noreferrer">{SITE_INFO.url}</a></div>
                        <div><b>网站描述：</b>{SITE_INFO.description}</div>
                    </div>
                </div>
            </section>


            {/* 申请友链按钮 */}
            <div style={{ textAlign: 'center', margin: '2.5rem 0 1.5rem 0' }}>
                <button className={styles.simpleButton} style={{ maxWidth: 180 }} onClick={() => setModalOpen(true)}>
                    申请友链
                </button>
            </div>

            {/* 友链要求 */}
            <section className={styles.requirementsSection}>
                <h3 style={{ color: 'var(--text)' }}>友链要求</h3>
                <ul className={styles.requirementsList}>
                    {REQUIREMENTS.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
            </section>



            {/* 申请友链模态框 */}
            {/* 申请友链模态框 */}
            {modalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <button className={styles.closeButton} onClick={() => setModalOpen(false)} title="关闭">×</button>
                        <form className={styles.simpleForm} onSubmit={handleSubmit} autoComplete="off">
                            <h2 className={styles.formTitle}>申请友链</h2>
                            <div className={styles.formRow}>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="网站名称"
                                    className={styles.simpleInput}
                                    required
                                />
                            </div>
                            <div className={styles.formRow}>
                                <input
                                    type="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleInputChange}
                                    placeholder="网站地址"
                                    className={styles.simpleInput}
                                    required
                                />
                            </div>
                            <div className={styles.formRow}>
                                <input
                                    type="url"
                                    name="avatarUrl"
                                    value={formData.avatarUrl}
                                    onChange={handleInputChange}
                                    placeholder="头像图片地址"
                                    className={styles.simpleInput}
                                    required
                                />
                            </div>
                            <div className={styles.formRow}>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="网站描述"
                                    className={styles.simpleTextarea}
                                    required
                                />
                            </div>
                            <div className={styles.formRow}>
                                <button type="submit" className={styles.simpleButton}>提交申请</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FriendLinks;