import React from 'react';
import AdminLayout from "@/admin/components/layout/AdminLayout";
import { withAdminAuth } from '@/admin/components/withAdminAuth';
import Head from "next/head";
import ThoughtsManagement from "@/admin/components/ThoughtsManagement/ThoughtsManagement";

const Thoughts: React.FC = () => {
    return (
        <AdminLayout>
            <div>
                <Head>
                    <title>管理员页面 | 思考设置</title>
                    <meta name="description" />
                </Head>
                <ThoughtsManagement/>
            </div>
        </AdminLayout>
    );
};

export default withAdminAuth(Thoughts);