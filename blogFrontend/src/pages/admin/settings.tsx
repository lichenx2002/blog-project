    import React from 'react';
import { withAdminAuth } from '@/admin/components/withAdminAuth';
import AdminLayout from "@/admin/components/layout/AdminLayout";
import Head from "next/head";

const Settings: React.FC = () => {
    return (
        <div>
            <AdminLayout>
                <div>
                    <Head>
                        <title>管理员页面 | 系统设置</title>
                        <meta name="description" />
                    </Head>
                    <h1>系统设置</h1>
                </div>
            </AdminLayout>
        </div>
    );
};

export default withAdminAuth(Settings);