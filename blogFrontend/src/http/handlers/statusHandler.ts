import { httpError } from "@/http/core/error";
import { HTTP_STATUS } from "@/http/core/status";
import { Response } from '../core/types';


export class StatusHandler {
    static async handle<T>(response: Response, url: string): Promise<T> {
        const status = response.status;
        if (status >= 100 && status < 200) return this.handleInformational(response, url);
        if (status >= 200 && status < 300) return this.handleSuccess(response, url);
        if (status >= 300 && status < 400) return this.handleRedirect(response, url);
        if (status >= 400 && status < 500) return this.handleClientError(response, url);
        if (status >= 500) return this.handleServerError(response, url);


        throw new httpError('未知的HTTP状态码', status, url);
    }

    private static async handleInformational<T>(response: Response, url: string): Promise<T> {
        switch (response.status) {
            case HTTP_STATUS.CONTINUE:
            case HTTP_STATUS.SWITCHING_PROTOCOLS:
            case HTTP_STATUS.PROCESSING:
                return null as any;
            default:
                throw new httpError('未处理的信息性状态码', response.status, url);
        }
    }

    private static async handleSuccess<T>(response: Response, url: string): Promise<T> {
        try {
            switch (response.status) {
                case HTTP_STATUS.OK:
                    // 检查响应体是否为空
                    if (response.headers.get('content-length') === '0') {
                        return null as T;
                    }
                    // 检查响应类型
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        try {
                            return await response.json();
                        } catch (e) {
                            // 如果JSON解析失败，返回文本内容
                            const text = await response.text();
                            return text as T;
                        }
                    } else {
                        // 如果不是JSON，返回文本内容
                        const text = await response.text();
                        return text as T;
                    }
                case HTTP_STATUS.CREATED:
                case HTTP_STATUS.ACCEPTED:
                    return await response.json();
                case HTTP_STATUS.NO_CONTENT:
                    return null as T;
                case HTTP_STATUS.PARTIAL_CONTENT:
                    return await this.handlePartialContent(response);
                default:
                    return await response.json();
            }
        } catch (error) {
            throw new httpError(
                '响应数据解析错误',
                response.status,
                url,
                { originalError: error }
            );
        }
    }

    private static async handlePartialContent<T>(response: Response): Promise<T> {
        const contentRange = response.headers.get('Content-Range');
        const data = await response.json();
        return {
            data,
            range: contentRange
        } as T;
    }

    private static async handleRedirect<T>(response: Response, url: string): Promise<T> {
        const location = response.headers.get('Location');

        switch (response.status) {
            case HTTP_STATUS.MOVED_PERMANENTLY:
            case HTTP_STATUS.FOUND:
            case HTTP_STATUS.SEE_OTHER:
            case HTTP_STATUS.TEMPORARY_REDIRECT:
            case HTTP_STATUS.PERMANENT_REDIRECT:
                throw new httpError(
                    '需要重定向',
                    response.status,
                    url,
                    { redirectUrl: location }
                );
            case HTTP_STATUS.NOT_MODIFIED:
                return null as T;
            default:
                throw new httpError('未处理的重定向状态码', response.status, url);
        }
    }

    private static async handleClientError<T>(response: Response, url: string): Promise<T> {
        const errorData = await this.getErrorData(response);

        const errorMessages: Record<number, string> = {
            [HTTP_STATUS.BAD_REQUEST]: '错误的请求',
            [HTTP_STATUS.UNAUTHORIZED]: '未授权',
            [HTTP_STATUS.FORBIDDEN]: '禁止访问',
            [HTTP_STATUS.NOT_FOUND]: '资源未找到',
            [HTTP_STATUS.METHOD_NOT_ALLOWED]: '方法不允许'
        };

        const message = errorData.message || errorMessages[response.status] || '客户端错误';

        throw new httpError(message, response.status, url, errorData);
    }

    private static async handleServerError<T>(response: Response, url: string): Promise<T> {
        const errorData = await this.getErrorData(response);

        const errorMessages: Record<number, string> = {
            [HTTP_STATUS.INTERNAL_SERVER_ERROR]: '服务器内部错误',
            [HTTP_STATUS.BAD_GATEWAY]: '网关错误',
            [HTTP_STATUS.SERVICE_UNAVAILABLE]: '服务不可用',
            [HTTP_STATUS.GATEWAY_TIMEOUT]: '网关超时'
        };

        const message = errorData.message || errorMessages[response.status] || '服务器错误';

        throw new httpError(message, response.status, url, errorData);
    }

    // 获取错误数据的辅助方法
    private static async getErrorData(response: Response): Promise<any> {
        try {
            return await response.json();
        } catch {
            return {};
        }
    }
}

