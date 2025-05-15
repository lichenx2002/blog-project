import { createReducer } from '@reduxjs/toolkit';
import {
    AdminAuthState,
    ADMIN_LOGIN_SUCCESS,
    ADMIN_LOGOUT
} from './types';
import { adminLogin } from './actions';

const initialState: AdminAuthState = {
    isAuthenticated: false,
    admin: null,
    token: null,
    loading: false,
    error: null
};

const adminAuthReducer = createReducer(initialState, (builder) => {
    builder
        // 处理登录请求
        .addCase(adminLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        // 处理登录成功
        .addCase(adminLogin.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.admin = action.payload.admin || null;
            state.token = action.payload.token || null;
            state.loading = false;
            state.error = null;
        })
        // 处理登录失败
        .addCase(adminLogin.rejected, (state, action) => {
            state.isAuthenticated = false;
            state.admin = null;
            state.token = null;
            state.loading = false;
            state.error = action.payload || '登录失败，请稍后重试';
        })
        // 处理手动登录成功
        .addCase(ADMIN_LOGIN_SUCCESS, (state, action) => {
            state.isAuthenticated = true;
            state.admin = action.payload.admin;
            state.token = action.payload.token;
            state.loading = false;
            state.error = null;
        })
        // 处理登出
        .addCase(ADMIN_LOGOUT, (state) => {
            localStorage.removeItem('adminToken');
            return initialState;
        });
});

export default adminAuthReducer;