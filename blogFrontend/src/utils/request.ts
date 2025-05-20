import { BASE_URL } from '../../next.config';


//定义响应数据的接口
interface ApiResponse<T> {
  data: T;
  message: string;
  code?: number;
  error?: string;
}

//定义请求配置的接口
interface RequestConfig extends RequestInit {
  params?: Record<string, any>;
}

//处理URL参数
const handleUrlParams = (url: string, params?: Record<string, any>): string => {
  if (!params) return url;
  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  return `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
}

//基础请求参数
const request = async<T>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> => {
  const { params, ...restConfig } = config;
  const finalUrl = handleUrlParams(url.startsWith('http') ? url : `${BASE_URL}${url}`, params)
  console.log('Request URL:', finalUrl);
  try {
    // 用 Headers 对象，而不是 Record<string, string>
    const headers = new Headers({
      'Content-Type': restConfig.method === 'GET' ? 'application/x-www-form-urlencoded' : 'application/json',
    });
    // 如果 restConfig.headers 是 Headers 对象，直接合并
    if (restConfig.headers instanceof Headers) {
      restConfig.headers.forEach((value, key) => headers.append(key, value));
    } else if (restConfig.headers) {
      // 如果是普通对象，手动合并
      Object.entries(restConfig.headers).forEach(([key, value]) => {
        headers.append(key, String(value));
      });
    }
    // 判断是否加 token
    if (finalUrl.includes('/api/admin/')) {
      const token = localStorage.getItem('admin_token');
      if (token) {
        headers.append('Authorization', `Bearer ${token}`);
      }
    }
    const response = await fetch(finalUrl, {
      ...restConfig,
      headers,
    });
    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      let errorMessage = '请求失败';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      return { error: errorMessage };
    }
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null as any;
    }

    // 检查响应类型
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        const data = await response.json();
        return data as T;
      } catch (e) {
        // 如果 JSON 解析失败，返回文本内容
        const text = await response.text();
        return text as T;
      }
    } else {
      // 如果不是 JSON，返回文本内容
      const text = await response.text();
      return text as T;
    }
  } catch (error: any) {
    console.error('Request error:', error);
    return { error: (error.message || '请求失败，请稍后重试') };
  }
}
//  定义请求函数
export const http = {
  get: <T>(url: string, params?: Record<string, any>) =>
    request<T>(url, {
      method: 'GET',
      params
    }),
  post: <T>(url: string, data?: any) =>
    request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  put: <T>(url: string, data?: any) =>
    request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  delete: <T>(url: string) =>
    request<T>(url, {
      method: 'DELETE'
    })
};