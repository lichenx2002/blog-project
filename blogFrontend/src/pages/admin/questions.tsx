import React from 'react';
import {withAdminAuth} from "@/admin/components/withAdminAuth";
import Head from "next/head";
import AdminLayout from "@/admin/components/layout/AdminLayout";
import QuestionsManagement from "@/admin/components/QuestionsManagement/QuestionsManagement";

const Questions: React.FC = () => {
    return (
        <AdminLayout>
            <div>
                <Head>
                    <title>管理员页面 | 面试题管理</title>
                    <meta name="description" />
                </Head>
                <QuestionsManagement/>
            </div>
        </AdminLayout>
    );
};

export default withAdminAuth(Questions);