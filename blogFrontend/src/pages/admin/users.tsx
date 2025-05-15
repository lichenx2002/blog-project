import React from 'react';
import AdminLayout from "@/admin/components/layout/AdminLayout";
import UserManagement from "@/admin/components/UserManagement/UserManagement";
import { withAdminAuth } from '@/admin/components/withAdminAuth';
import Head from "next/head";

const Users: React.FC = () => {
    return (
        <AdminLayout>
            <div>
                <Head>
                    <title>管理员页面 | 用户管理</title>
                    <meta name="description" />
                </Head>
                <UserManagement/>
            </div>
        </AdminLayout>
    );
};

export default withAdminAuth(Users);