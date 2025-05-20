import { http } from '@/utils/request';

// 基础接口定义
export interface LoginCredentials {
    username: string;
    password: string;
}

export interface SmsCredentials {
    phone: string;
    code: string;
}

export interface BindPhoneData {
    userId: number;
    phone: string;
    code: string;
}

export interface UserDTO {
    username: string;
    password?: string;
    phone?: string;
}

export interface User {
    id: number;
    username: string;
    phone?: string;
    loginType: string;
    phoneVerified?: boolean;
    phoneBindTime?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiResponse<T> {
    code: number;
    data: T;
    message: string;
}

// API 实现
export const AuthAPI = {
    // 用户认证相关
    login: (credentials: LoginCredentials) =>
        http.post<ApiResponse<User>>('/user/login', credentials),

    register: (userData: UserDTO) =>
        http.post<ApiResponse<User>>('/user/register', userData),

    loginBySms: (credentials: SmsCredentials) =>
        http.post<ApiResponse<User>>('/sms/login', credentials),

    // 用户管理相关
    getUserList: () =>
        http.get<ApiResponse<User[]>>('/user/list'),

    getUserById: (id: number) =>
        http.get<ApiResponse<User>>(`/user/${id}`),

    updateUser: (id: number, userData: UserDTO) =>
        http.put<ApiResponse<User>>(`/user/${id}`, userData),

    deleteUser: (id: number) =>
        http.delete<ApiResponse<void>>(`/user/${id}`),

    // 手机号相关
    sendSmsCode: (phone: string, type: string) =>
        http.post<ApiResponse<void>>('/sms/send', { phone, type }),

    bindPhone: (data: BindPhoneData) =>
        http.post<ApiResponse<void>>('/sms/bind', data)
};