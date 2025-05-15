import React from 'react';
import { withAdminAuth } from '@/admin/components/withAdminAuth';
import AdminLayout from "@/admin/components/layout/AdminLayout";
import Head from "next/head";
import CommentManagement from "@/admin/components/CommentManagement/CommentManagement";

const Comments: React.FC = () => {
    return (
            <AdminLayout>
                <div>
                    <Head>
                        <title>管理员页面 | 评论管理</title>
                        <meta name="description" />
                    </Head>
                    <CommentManagement/>
                </div>
            </AdminLayout>
    );
};

export default withAdminAuth(Comments);