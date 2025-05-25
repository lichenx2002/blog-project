import React from 'react';
import {withAdminAuth} from "@/admin/components/withAdminAuth";
import Head from "next/head";
import AdminLayout from "@/admin/components/layout/AdminLayout";
import BulletinBoardManagement from "@/admin/components/BulletinBoardManagement/BulletinBoardManagement";

const Bulletinboard: React.FC = () => {
    return (
        <AdminLayout>
            <div>
                <Head>
                    <title>管理员页面 | 留言板管理</title>
                    <meta name="description" />
                </Head>
                <BulletinBoardManagement/>
            </div>
        </AdminLayout>
    );
};

export default withAdminAuth(Bulletinboard);