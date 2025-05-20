import { AdminAPI } from '@/api/AdminAPI';

import {
    ADMIN_LOGIN_REQUEST,
    ADMIN_LOGIN_SUCCESS,
    ADMIN_LOGIN_FAILURE,
    ADMIN_LOGOUT,
    AdminAuthActionTypes,
    AdminUser,
    LoginResponse
} from './types';
import { createAsyncThunk } from '@reduxjs/toolkit';

// 同步 action
export const adminLoginRequest = (): AdminAuthActionTypes => ({
    type: ADMIN_LOGIN_REQUEST
});
export const adminLoginSuccess = (admin: AdminUser, token: string): AdminAuthActionTypes => ({
    type: ADMIN_LOGIN_SUCCESS,
    payload: { admin, token }
});
export const adminLoginFailure = (error: string): AdminAuthActionTypes => ({
    type: ADMIN_LOGIN_FAILURE,
    payload: error
});
export const adminLogout = (): AdminAuthActionTypes => ({
    type: ADMIN_LOGOUT
});

// 异步 action
export const adminLogin = createAsyncThunk<LoginResponse, { username: string; password: string }, { rejectValue: string }>(
    'adminAuth/login',
    async (credentials, { rejectWithValue, dispatch }) => {
        try {
            const response = await AdminAPI.login(credentials) as LoginResponse;

            // 检查返回结果是否包含错误
            if (response?.error) {
                return rejectWithValue(response.error);
            }

            // 确保返回的数据包含必要的字段
            if (!response?.token) {
                return rejectWithValue('登录失败：服务器返回数据格式错误');
            }

            // 登录成功，保存 token
            localStorage.setItem('adminToken', response.token);

            // 手动分发登录成功的 action
            dispatch({
                type: ADMIN_LOGIN_SUCCESS,
                payload: {
                    admin: response.admin,
                    token: response.token
                }
            });

            return response;
        } catch (error: any) {
            // 处理网络错误或其他异常
            return rejectWithValue(error.message || '登录失败，请稍后重试');
        }
    }
);