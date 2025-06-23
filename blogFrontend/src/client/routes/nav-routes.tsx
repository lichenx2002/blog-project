// 导入页面组件
import dynamic from 'next/dynamic';
import Home from '@/pages/main/Home';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import React from "react";

const Gallery = dynamic(() => import('@/pages/main/Gallery'), {
    loading: () => <LoadingSpinner />
})
const Articles = dynamic(() => import('@/pages/main/Articles'), {
    loading: () => <LoadingSpinner />
})
const Tags = dynamic(() => import('@/pages/main/Tags'), {
    loading: () => <LoadingSpinner />
})
const XiaoXiAI = dynamic(() => import('@/pages/main/XiaoXiAI'), {
    loading: () => <LoadingSpinner />
})
const Archive = dynamic(() => import('@/pages/main/Archive'), {
    loading: () => <LoadingSpinner />
})
const Thoughts = dynamic(() => import('@/pages/main/Thoughts'), {
    loading: () => <LoadingSpinner />
})
const More = dynamic(() => import('@/pages/main/More'), {
    loading: () => <LoadingSpinner />
})
const ArticleDetail = dynamic(() => import('@/pages/main/Articles/[id]'), {
    loading: () => <LoadingSpinner />
})
const WritingStats = dynamic(() => import('@/pages/main/WritingStats'), {
    loading: () => <LoadingSpinner />
})
const BulletinBoard = dynamic(() => import('@/pages/main/BulletinBoard'), {
    loading: () => <LoadingSpinner />
})
const FriendLinks = dynamic(() => import('@/pages/main/FriendLinks'), {
    loading: () => <LoadingSpinner />
})
const Questions = dynamic(() => import('@/pages/main/Questions'), {
    loading: () => <LoadingSpinner />
})

interface Route {
    id: number;
    path: string;
    name: string;
    component: React.ComponentType;
    exact?: boolean
    ssr?: boolean // 是否启用服务端渲染
    children?: Route[]; // 新增嵌套路由支持
    showInNav: boolean;
}
export const navRoutesItem: Route[] = [
    {
        id: 1,
        path: '/main/Home',
        name: '首页',
        component: Home,
        ssr: true,
        showInNav: true
    }, {
        id: 2,
        path: ' /main/Articles',
        name: '文章',
        component: Articles,
        ssr: true,
        showInNav: true,
        children: [ // 子路由（不会出现在导航菜单）
            {
                id: 301,
                path: ':id', // 相对路径
                name: '文章详情',
                component: ArticleDetail,
                ssr: true,
                showInNav: false
            }
        ]
    }, {
        id: 3,
        path: '/main/Tags',
        name: '标签',
        component: Tags,
        ssr: true,
        showInNav: true
    }, {
        id: 4,
        path: '/main/Gallery',
        name: '相册',
        component: Gallery,
        ssr: true,
        showInNav: true
    }, {
        id: 5,
        path: '/main/Archive',
        name: '归档',
        component: Archive,
        ssr: true,
        showInNav: true
    }, {
        id: 6,
        path: '/main/Thoughts',
        name: '灵感',
        component: Thoughts,
        ssr: true,
        showInNav: true
    }, {
        id: 7,
        path: '/main/XiaoXiAI',
        name: '小熙',
        component: XiaoXiAI,
        ssr: true,
        showInNav: true
    }, {
        id: 8,
        path: '/main/More',
        name: '更多',
        component: More,
        ssr: true,
        showInNav: true,
        children: [
            {
                id: 801,
                path: '/main/BulletinBoard',
                name: '留言板',
                component: BulletinBoard,
                ssr: true,
                showInNav: false
            }, {
                id: 802,
                path: '/main/FriendLinks',
                name: '友链',
                component: FriendLinks,
                ssr: true,
                showInNav: false
            }, {
                id: 803,
                path: '/main/WritingStats',
                name: '创作统计',
                component: WritingStats,
                ssr: true,
                showInNav: false
            },{
                id: 804,
                path: '/main/Questions',
                name: '面试题汇总',
                component:Questions,
                ssr: true,
                showInNav: false
            }

        ]
    }
];