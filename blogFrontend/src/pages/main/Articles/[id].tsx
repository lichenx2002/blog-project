// 导入必要的库和组件
import { useRouter } from 'next/router';          // Next.js路由库，用于获取路由参数
import React, { useEffect, useState, useRef } from 'react'; // React核心钩子
import { Article } from '@/types/Article';    // 文章类型定义
import styles from './[id].module.css';       // CSS模块样式
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';       // Markdown渲染组件
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw';              // 支持HTML标签的插件
import Link from 'next/link';                     // Next.js客户端导航组件
import ArticleToc from '@/components/ArticleToc/ArticleToc'; // 文章目录组件
import { motion } from 'framer-motion';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import CodeBlock from '@/components/Code/CodeBlock';
import Comments from '@/components/Comments/Comments';
import { FaArrowLeft } from "react-icons/fa";
import Image from 'next/image';
import Head from "next/head";
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import RecentArticles from "@/components/RecentArticles/RecentArticles";
import SequenceDiagram from '@/components/SequenceDiagram/SequenceDiagram';
import ArticleSidebar from '@/components/ArticleSidebar/ArticleSidebar';
import {useLoading} from "@/hooks/useLoading";


// 定义标题对象的类型
interface Heading {
    id: string;     // 标题的锚点ID（用于跳转）
    text: string;   // 标题文本内容
    level: number;  // 标题级别（1-6对应h1-h6）
}

const ArticleDetail: React.FC = () => {
    // 使用路由钩子获取路由参数
    const router = useRouter();
    const { id } = router.query; // 从URL中获取文章ID

    // 状态管理
    const [article, setArticle] = useState<Article | null>(null); // 存储文章数据
    const [error, setError] = useState<string | null>(null); // 错误信息
    const [headings, setHeadings] = useState<Heading[]>([]); // 文章标题列表
    const [contentHeight, setContentHeight] = useState(0); // 文章内容高度
    const [contentTop, setContentTop] = useState(0);       // 文章内容顶部位置
    const [likeCount, setLikeCount] = useState<number>();// 点赞数
    const [isMobile, setIsMobile] = useState(false);
    const { isLoading } = useLoading();

    // 使用ref获取文章内容DOM元素的引用
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 点赞操作
    const handleLike = async () => {
        if (!id) return;
        try {
            console.log('Sending like request for article:', id); // 添加日志
            const response = await ArticlesAPI.likeArticle(Number(id));
            console.log('Like response:', response); // 添加日志

            if (!response) {
                throw new Error('点赞失败');
            }

            // 更新文章状态
            setArticle(prevArticle => {
                if (!prevArticle) return null;
                return {
                    ...prevArticle,
                    likeCount: response.likeCount
                };
            });

            // 更新点赞数
            setLikeCount(response.likeCount);
        } catch (err) {
            console.error('点赞失败:', err);
            // 添加错误提示
            alert('点赞失败，请稍后重试');
        }
    }

    // 数据获取的副作用钩子
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                if (!id) return;
                setError(null);

                // 使用 ArticlesAPI 获取特定文章
                const response = await ArticlesAPI.getArticleById(Number(id));
                console.log('Article API Response:', response);

                if (!response) {
                    console.error('Invalid response:', response);
                    throw new Error('文章数据不存在');
                }

                // 更新文章状态
                setArticle(response);
                setLikeCount(response.likeCount || 0);

                // 提取标题
                const headingRegex = /^(#{1,6})\s+(.+)$/gm;
                const matches = Array.from(response.content.matchAll(headingRegex));
                const extractedHeadings = matches.map(match => ({
                    id: match[2].toLowerCase().replace(/\s+/g, '-'),
                    text: match[2],
                    level: match[1].length
                }));
                setHeadings(extractedHeadings);
            } catch (err) {
                console.error('获取数据错误:', err);
                const errorMessage = err instanceof Error ? err.message : '未知错误';
                setError(errorMessage);
            }
        };

        fetchArticle();
    }, [id]);

    const routerBack = useRouter();

    // 测量文章内容尺寸的副作用钩子
    useEffect(() => {
        const measureContent = () => {
            if (contentRef.current) {
                // 获取内容区域的实际高度和位置
                const rect = contentRef.current.getBoundingClientRect();
                setContentHeight(rect.height);
                setContentTop(contentRef.current.offsetTop);
            }
        };

        // 初始测量
        measureContent();
        // 添加窗口大小变化监听
        window.addEventListener('resize', measureContent);
        // 清除监听器
        return () => window.removeEventListener('resize', measureContent);
    }, [article]); // 当文章内容更新时重新测量

    const handleFontSizeChange = (size: number) => {
        // 不再设置全局字体大小
        // document.documentElement.style.fontSize = `${size}px`;
    };

    const handleThemeChange = (theme: 'light' | 'dark') => {
        // 实现主题切换逻辑
        document.documentElement.setAttribute('data-theme', theme);
    };

    const handleExportOutline = (format: 'markdown' | 'pdf') => {
        // 实现导出大纲逻辑
        console.log(`Exporting outline in ${format} format`);
    };

    const handleResultClick = (index: number) => {
        // 实现搜索结果点击逻辑
        const element = document.querySelector(`[data-index="${index}"]`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // 加载状态UI
    if (isLoading) return (
        <LoadingSpinner/>
    );

    // 错误状态UI
    if (error) return (
        <motion.div
            className={styles.error}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <p>{error}</p>
            <Link href="/main/Articles" className={styles.backLink}>
                返回文章列表
            </Link>
        </motion.div>
    );

    // 文章不存在状态UI
    if (!article) return (
        <motion.div
            className={styles.empty}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <p>文章不存在</p>
            <Link href="/main/Articles" className={styles.backLink}>
                返回文章列表
            </Link>
        </motion.div>
    );

    // 主渲染内容
    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Head>
                <title>{article.title}</title>
            </Head>
            {isMobile ? null : <div
                onClick={() => routerBack.back()}
                className={styles.backLinkButton}>
                <FaArrowLeft style={{ color: "var(--text)" }} />
            </div>}

            <motion.h1
                className={styles.articleTitle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {article.title}
            </motion.h1>

            <ArticleSidebar
                articleContent={article.content}
                onFontSizeChange={handleFontSizeChange}
                readingTime={article.readingTime}
                onExportOutline={handleExportOutline}
                onResultClick={handleResultClick}
            />

            <motion.div
                className={styles.articleDetail}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <motion.div
                    className={styles.articleMeta}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <span className={styles.date}>
                        发布时间: {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                    <span className={styles.status}>
                        文章状态: {
                            article.status === 'published'
                                ? '已发布'
                                : article.status === 'archived'
                                    ? '已归档'
                                    : '草稿'
                        }
                    </span>
                    <motion.span
                        className={styles.likeButton}
                        whileHover={{ scale: 1.05 }}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleLike();
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <motion.div
                            className={styles.heartWrapper}
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, -10, 10, 0],
                            }}
                            transition={{
                                duration: 0.5,
                                ease: "easeInOut",
                                times: [0, 0.2, 0.4, 1]
                            }}
                        >
                            <FaHeart className={styles.heartIcon} />
                        </motion.div>
                        <motion.span
                            className={styles.likeCount}
                            animate={{
                                scale: [1, 1.2, 1],
                                y: [0, -10, 0]
                            }}
                            transition={{
                                duration: 0.5,
                                ease: "easeInOut"
                            }}
                        >
                            {likeCount}
                        </motion.span>
                    </motion.span>
                </motion.div>
                <motion.div
                    className={styles.articleContent}
                    ref={contentRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <ReactMarkdown
                        rehypePlugins={[[rehypeRaw], [remarkGfm]]}
                        components={{
                            // 自定义标题渲染，添加锚点ID和样式
                            h1: ({ node, ...props }) => (
                                <h1
                                    id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                    className={styles.heading}
                                    style={{ fontFamily: "'等线', sans-serif" }}
                                    {...props}
                                />
                            ),
                            h2: ({ node, ...props }) => (
                                <h2
                                    id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                    className={styles.heading}
                                    style={{ fontFamily: "'ZiHun', sans-serif" }}
                                    {...props}
                                />
                            ),
                            h3: ({ node, ...props }) => (
                                <h3
                                    id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                    className={styles.heading}
                                    style={{ fontFamily: "'ZiHun', sans-serif" }}
                                    {...props}
                                />
                            ),
                            h4: ({ node, ...props }) => (
                                <h4
                                    id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                    className={styles.heading}
                                    style={{ fontFamily: "'ZiHun', sans-serif" }}
                                    {...props}
                                />
                            ),
                            h5: ({ node, ...props }) => (
                                <h5
                                    id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                    className={styles.heading}
                                    style={{ fontFamily: "'ZiHun', sans-serif" }}
                                    {...props}
                                />
                            ),
                            h6: ({ node, ...props }) => (
                                <h6
                                    id={props.children?.toString().toLowerCase().replace(/\s+/g, '-')}
                                    className={styles.heading}
                                    style={{ fontFamily: "'ZiHun', sans-serif" }}
                                    {...props}
                                />
                            ),
                            // 段落样式
                            p: ({ node, ...props }) => <p className="article-content-text-size" {...props} />,

                            //列表样式
                            ul: ({ node, ...props }) => <ul className={styles.list} style={{ fontFamily: "'幼圆', sans-serif" }} {...props} />,
                            ol: ({ node, ...props }) => <ol className={styles.list} style={{ fontFamily: "'幼圆', sans-serif" }} {...props} />,
                            li: ({ node, ...props }) => <li className="article-content-text-size" {...props} />,

                            // 引用样式
                            blockquote: ({ node, ...props }) => <blockquote className="article-content-text-size" {...props} />,

                            // 代码块处理
                            code: ({ node, className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '');
                                const language = match ? match[1] : 'text';

                                // 处理序列图
                                if (language === 'sequence') {
                                    return (
                                        <SequenceDiagram diagram={String(children).replace(/\n$/, '')} />
                                    );
                                }

                                // 行内代码
                                if (!match) {
                                    return (
                                        <code className={styles.inlineCode} {...props}>
                                            {children}
                                        </code>
                                    );
                                }

                                // 代码块
                                return (
                                    <CodeBlock
                                        language={language}
                                        value={String(children).replace(/\n$/, '')}
                                    />
                                );
                            },
                            // 预格式化标签样式
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            pre: ({ node, ...props }) => <pre className={styles.pre} {...props} />,

                            // 添加表格相关组件
                            table: ({ node, ...props }) => (
                                <div className={styles.tableContainer}>
                                    <table className={styles.table} {...props} />
                                </div>
                            ),
                            thead: ({ node, ...props }) => <thead className={styles.tableHead} {...props} />,
                            tbody: ({ node, ...props }) => <tbody className={styles.tableBody} {...props} />,
                            tr: ({ node, ...props }) => <tr className={styles.tableRow} {...props} />,
                            th: ({ node, ...props }) => <th className={styles.tableHeader} {...props} />,
                            td: ({ node, ...props }) => <td className={styles.tableCell} {...props} />,

                            // 添加图片渲染组件
                            // img: ({ node, src, alt, ...props }) => {
                            //     // 检查是否是相对路径
                            //     const isRelativePath = src?.startsWith('/');
                            //     // 如果是相对路径，添加基础URL
                            //     const imageUrl = isRelativePath ? `${process.env.NEXT_PUBLIC_API_URL}/api/images${src}` : src;
                            //
                            //     return (
                            //         <div className={styles.imageWrapper}>
                            //             <Image
                            //                 src={imageUrl || ''}
                            //                 alt={alt || ''}
                            //                 width={800}
                            //                 height={400}
                            //                 className={styles.markdownImage}
                            //                 style={{
                            //                     maxWidth: '100%',
                            //                     height: 'auto',
                            //                     borderRadius: '8px',
                            //                     margin: '1rem 0'
                            //                 }}
                            //                 {...props}
                            //             />
                            //             {alt && <p className={styles.imageCaption}>{alt}</p>}
                            //         </div>
                            //     );
                            // },
                        }}
                    >
                        {article.content}
                    </ReactMarkdown>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Link href="/main/Articles" className={styles.backLink}>
                        ←返回文章列表
                    </Link>
                </motion.div>
            </motion.div>

            {headings.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <ArticleToc
                        headings={headings}
                        title={article.title}
                        contentHeight={contentHeight}
                        contentTop={contentTop}
                    />
                </motion.div>
            )}
            <RecentArticles />
            <Comments articleId={article.id} />

        </motion.div>

    );
}
export default ArticleDetail;