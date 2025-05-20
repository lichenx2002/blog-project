import type { Gallery } from '@/types/Gallery';

// 使用相对路径，通过 Next.js 代理访问后端
const BASE_URL = '/api/gallery';  // 修改为完整的 API 路径
const BASE_IMAGE_URL = '/api';  // 图片也通过代理访问
const BACKEND_URL = 'http://localhost:8000';

// 默认请求头
const defaultHeaders = {
    'Content-Type': 'application/json',
};

// 处理图片URL的辅助函数
const processImageUrl = (gallery: any): any => {
    if (!gallery) return gallery;

    // 如果已经有完整的URL，直接返回
    if (gallery.coverImage?.startsWith('http')) {
        return gallery;
    }

    // 如果是相对路径，添加后端URL
    if (gallery.coverImage) {
        return {
            ...gallery,
            coverImage: `${BACKEND_URL}${gallery.coverImage.startsWith('/') ? '' : '/'}${gallery.coverImage}`
        };
    }

    // 如果没有封面图片，使用默认图片
    return {
        ...gallery,
        coverImage: '/default-image.jpg'
    };
};

// 处理响应数据的辅助函数
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || '请求失败');
    }
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    }
    return await response.text();
};

export const GalleryAPI = {
    // 获取所有相册
    getGalleries: async (): Promise<Gallery[]> => {
        const response = await fetch(`${BASE_URL}/list`, {
            headers: defaultHeaders,
        });
        const data = await handleResponse(response);
        if (Array.isArray(data)) {
            return data.map(processImageUrl);
        }
        throw new Error('返回数据格式错误');
    },

    // 新增相册
    addGallery: async (formData: FormData): Promise<Gallery> => {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            body: formData,
            // FormData 会自动设置正确的 Content-Type
        });
        const data = await handleResponse(response);
        return processImageUrl(data);
    },

    // 删除相册
    deleteGallery: async (id: number): Promise<string> => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: defaultHeaders,
        });
        return await handleResponse(response);
    },

    // 修改相册
    updateGallery: async (id: number, formData: FormData): Promise<Gallery> => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            body: formData,
            // FormData 会自动设置正确的 Content-Type
        });
        const data = await handleResponse(response);
        return processImageUrl(data);
    },

    // 按分类获取相册
    getGalleriesByCategory: async (category: string): Promise<Gallery[]> => {
        const response = await fetch(`${BASE_URL}/category/${category}`, {
            headers: defaultHeaders,
        });
        const data = await handleResponse(response);
        if (Array.isArray(data)) {
            return data.map(processImageUrl);
        }
        throw new Error('返回数据格式错误');
    },

    // 获取所有分类
    getCategories: async (): Promise<string[]> => {
        const response = await fetch(`${BASE_URL}/categories`, {
            headers: defaultHeaders,
        });
        const data = await handleResponse(response);
        if (Array.isArray(data)) {
            return data;
        }
        throw new Error('返回数据格式错误');
    },
};