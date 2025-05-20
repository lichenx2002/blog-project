import React from 'react';
import AdminLayout from "@/admin/components/layout/AdminLayout";
import TagManagement from "@/admin/components/TagManagement/TagManagement";
import { withAdminAuth } from '@/admin/components/withAdminAuth';
import Head from "next/head";

const Tags: React.FC = () => {
    return (
            <AdminLayout>
                <div>
                    <Head>
                        <title>管理员页面 | 标签管理</title>
                        <meta name="description" />
                    </Head>
                    <TagManagement/>
                </div>
            </AdminLayout>
    );
};

export default withAdminAuth(Tags);