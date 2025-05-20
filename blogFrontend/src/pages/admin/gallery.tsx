import React from 'react';
import { withAdminAuth } from '@/admin/components/withAdminAuth';
import AdminLayout from "@/admin/components/layout/AdminLayout";
import GalleryManagement from "@/admin/components/GalleryManagement/GalleryManagement";
import Head from "next/head";
const Gallery: React.FC = () => {
    return (
        <div>
            <AdminLayout>
                <div>
                    <Head>
                        <title>管理员页面 | 相册管理</title>
                        <meta name="description" />
                    </Head>
                    <GalleryManagement/>
                </div>
            </AdminLayout>
        </div>
    );
};

export default withAdminAuth(Gallery);