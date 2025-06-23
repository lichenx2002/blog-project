import React, { useState, useEffect } from 'react';
import AdminLayout from '@/admin/components/layout/AdminLayout';
import AdminRouteGuard from '@/admin/components/AdminRouteGuard/AdminRouteGuard';
import { ArticlesAPI } from '@/api/ArticlesAPI';
import { TagsAPI } from '@/api/TagsAPI';
import styles from './index.module.css';
import Head from "next/head";

interface Article {
  id: number;
  title: string;
  status: string;
  viewCount: number;
  createdAt: string;
}

interface Tag {
  id: number;
  name: string;
  color: string;
  count: number;
}

interface ArticlesResponse {
  data: Article[];
  error?: string;
}

interface TagsResponse {
  data: Tag[];
  error?: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalTags: 0,
    totalViews: 0,
    recentArticles: [] as Article[],
    popularTags: [] as Tag[]
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 获取文章列表
      const articlesResponse = await ArticlesAPI.getArticles() as ArticlesResponse;

      // 获取带文章数量的标签列表
      const tagsResponse = await TagsAPI.getTagsWithCount();
      const tags = Array.isArray(tagsResponse) ? tagsResponse : [];

      if (!articlesResponse || !tagsResponse) {
        console.error('Failed to fetch dashboard data: No response');
        return;
      }

      if (articlesResponse.error || tagsResponse.error) {
        console.error('Failed to fetch dashboard data:', articlesResponse.error || tagsResponse.error);
        return;
      }

      const articles = articlesResponse.data || [];

      if (!Array.isArray(articles) || !Array.isArray(tags)) {
        console.error('Failed to fetch dashboard data: Invalid response format');
        return;
      }

      // 计算总浏览量
      const totalViews = articles.reduce((sum, article) => sum + (article.viewCount || 0), 0);

      // 获取最近的文章
      const recentArticles = [...articles]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      // 获取热门标签（按使用次数排序）
      const popularTags = [...tags]
          .sort((a, b) => (b.count || 0) - (a.count || 0))
          .slice(0, 5);

      setStats({
        totalArticles: articles.length,
        totalTags: tags.length,
        totalViews,
        recentArticles,
        popularTags
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  return (
    <AdminRouteGuard>
      <AdminLayout>
        <div className={styles.dashboard}>
          <Head>
            <title>管理员页面 | 仪表盘</title>
            <meta name="description" />
          </Head>
          <h1 className={styles.title}>仪表盘</h1>

          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div className={styles.statContent}>
                <h3>文章总数</h3>
                <div className={styles.statValue}>{stats.totalArticles}</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
              </div>
              <div className={styles.statContent}>
                <h3>标签总数</h3>
                <div className={styles.statValue}>{stats.totalTags}</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <div className={styles.statContent}>
                <h3>总浏览量</h3>
                <div className={styles.statValue}>{stats.totalViews}</div>
              </div>
            </div>
          </div>

          <div className={styles.contentRow}>
            <div className={styles.recentArticles}>
              <h2>最近文章</h2>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>标题</div>
                  <div className={styles.tableCell}>状态</div>
                  <div className={styles.tableCell}>浏览量</div>
                  <div className={styles.tableCell}>创建时间</div>
                </div>
                <div className={styles.tableBody}>
                  {stats.recentArticles.map((article) => (
                    <div key={article.id} className={styles.tableRow}>
                      <div className={styles.tableCell}>{article.title}</div>
                      <div className={styles.tableCell}>
                        <span className={`${styles.statusTag} ${article.status === 'draft' ? styles.draft : article.status === 'published' ? styles.published : styles.archived}`}>
                          {article.status === 'draft' ? '草稿' : article.status === 'published' ? '已发布' : '已归档'}
                        </span>
                      </div>
                      <div className={styles.tableCell}>{article.viewCount}</div>
                      <div className={styles.tableCell}>{new Date(article.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.popularTags}>
              <h2>热门标签</h2>
              <div className={styles.tagList}>
                {stats.popularTags && stats.popularTags.length > 0 ? (
                  stats.popularTags.map((tag) => (
                    <div key={tag.id} className={styles.tagItem}>
                      <span className={styles.tagName} style={{ color: tag.color }}>{tag.name}</span>
                      <span className={styles.tagCount}>{tag.count || 0} 篇文章</span>
                    </div>
                  ))
                ) : (
                  <div className={styles.noTags}>暂无标签数据</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminRouteGuard>
  );
};

export default AdminDashboard; 