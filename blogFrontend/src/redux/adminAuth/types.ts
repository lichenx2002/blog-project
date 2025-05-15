import { Admin } from '@/types/Admin';

export const ADMIN_LOGIN_REQUEST = 'ADMIN_LOGIN_REQUEST';
export const ADMIN_LOGIN_SUCCESS = 'ADMIN_LOGIN_SUCCESS';
export const ADMIN_LOGIN_FAILURE = 'ADMIN_LOGIN_FAILURE';
export const ADMIN_LOGOUT = 'ADMIN_LOGOUT';

export interface AdminAuthState {
    isAuthenticated: boolean;
    admin: Admin | null;
    loading: boolean;
    error: string | null;
    token: string | null;
}

// 登录响应类型
export interface LoginResponse {
    admin?: Admin;
    token?: string;
    error?: string;
}

export type AdminUser = Admin;

interface AdminLoginRequestAction {
    type: typeof ADMIN_LOGIN_REQUEST;
}
interface AdminLoginSuccessAction {
    type: typeof ADMIN_LOGIN_SUCCESS;
    payload: {
        admin: Admin;
        token: string;
    };
}
interface AdminLoginFailureAction {
    type: typeof ADMIN_LOGIN_FAILURE;
    payload: string;
}
interface AdminLogoutAction {
    type: typeof ADMIN_LOGOUT;
}

export type AdminAuthActionTypes =
    | AdminLoginRequestAction
    | AdminLoginSuccessAction
    | AdminLoginFailureAction
    | AdminLogoutAction;