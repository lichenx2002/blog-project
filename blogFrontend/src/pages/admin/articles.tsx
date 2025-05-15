import React from 'react';
import AdminLayout from '@/admin/components/layout/AdminLayout';
import ArticleManagement from '@/admin/components/ArticleManagement/ArticleManagement';
import { withAdminAuth } from '@/admin/components/withAdminAuth';
import Head from "next/head";

const AdminArticles: React.FC = () => {
  return (
    <AdminLayout>
      <div>
          <Head>
              <title>管理员页面 | 文章管理</title>
              <meta name="description" />
          </Head>
        <ArticleManagement />
      </div>
    </AdminLayout>
  );
};

export default withAdminAuth(AdminArticles); 