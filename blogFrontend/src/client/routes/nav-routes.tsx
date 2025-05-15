// 导入页面组件
import dynamic from 'next/dynamic';
import Home from '@/pages/main/Home';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const Gallery = dynamic(() =>import('@/pages/main/Gallery'), {
    loading:() => <LoadingSpinner/>
})
const Articles = dynamic(()=>import('@/pages/main/Articles'), {
    loading:() => <LoadingSpinner/>
})
const Tags = dynamic(()=>import('@/pages/main/Tags'), {
    loading:() => <LoadingSpinner/>
})
const XiaoXiAI = dynamic(()=>import('@/pages/main/XiaoXiAI'), {
    loading:() => <LoadingSpinner/>
})
const Archive = dynamic(()=>import('@/pages/main/Archive'), {
    loading:() => <LoadingSpinner/>
})
const Thoughts = dynamic(()=>import('@/pages/main/Thoughts'), {
    loading:() => <LoadingSpinner/>
})
const More = dynamic(()=>import('@/pages/main/More'), {
    loading:() => <LoadingSpinner/>
})
const ArticleDetail = dynamic(()=>import('@/pages/main/Articles/[id]'), {
    loading:() => <LoadingSpinner/>
})

interface Route {
    id: number;
    path: string;
    name: string;
    component: React.ComponentType;
    exact?: boolean
    ssr?: boolean // 是否启用服务端渲染
    children?: Route[]; // 新增嵌套路由支持
}
export const navRoutesItem: Route[] = [
    {
        id: 1,
        path: '/main/Home',
        name: '首页',
        component: Home,
        ssr: true
    }, {
        id: 2,
        path: '/main/Gallery',
        name: '相册',
        component: Gallery,
        ssr: true
    }, {
        id: 3,
        path: ' /main/Articles',
        name: '文章',
        component: Articles,
        ssr: true,
        children: [ // 子路由（不会出现在导航菜单）
            {
                id: 301,
                path: ':id', // 相对路径
                name: '文章详情',
                component: ArticleDetail,
                ssr: true
            }
        ]
    }, {
        id: 4,
        path: '/main/Tags',
        name: '标签',
        component: Tags,
        ssr: true
    }, {
        id: 5,
        path: '/main/Archive',
        name: '归档',
        component: Archive,
        ssr: true
    }, {
        id: 6,
        path: '/main/Thoughts',
        name: '思考',
        component: Thoughts,
        ssr: true
    }, {
        id: 7,
        path: '/main/More',
        name: '更多',
        component: More,
        ssr: true
    }, {
        id: 8,
        path: '/main/XiaoXiAI',
        name: '小熙',
        component: XiaoXiAI,
        ssr: true
    },
];