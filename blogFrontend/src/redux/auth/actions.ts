import { AuthAPI } from '@/api/AuthAPI';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    AuthActionTypes,
    User,
    LOGOUT
} from './types';
import { AppDispatch, AppThunk } from '../store';
import {UnknownAction} from "redux";

/* 同步action创建函数 */

// 登录请求action
export const loginRequest = (): AuthActionTypes => ({
    type: LOGIN_REQUEST  // 只包含type，表示登录请求开始
});

// 登录成功action
export const loginSuccess = (user: User): AuthActionTypes => ({
    type: LOGIN_SUCCESS,
    payload: user  // 携带用户数据
});

// 登录失败action
export const loginFailure = (error: string): AuthActionTypes => ({
    type: LOGIN_FAILURE,
    payload: error  // 携带错误信息
});

// 注销action
export const logout = (): AuthActionTypes => ({
    type: LOGOUT  // 只需要type，不需要payload
});

export const registerRequest = (): AuthActionTypes => ({
    type: REGISTER_REQUEST
});

export const registerSuccess = (): AuthActionTypes => ({
    type: REGISTER_SUCCESS
});

export const registerFailure = (error: string): AuthActionTypes => ({
    type: REGISTER_FAILURE,
    payload: error
});

/* 异步action创建函数 */

// 登录异步操作（使用Redux Thunk中间件）
export const login = (credentials: { username: string; password: string }): AppThunk => {
    return async (dispatch: AppDispatch) => {
        dispatch(<UnknownAction>loginRequest());
        try {
            const data = await AuthAPI.login(credentials);
            if (data.code === 200) {
                dispatch(<UnknownAction>loginSuccess(data.data));
            } else {
                dispatch(<UnknownAction>loginFailure(data.message || '登录失败'));
            }
        } catch (error) {
            dispatch(<UnknownAction>loginFailure('网络请求失败'));
        }
    };
};

export const register = (credentials: { username: string; password: string }): AppThunk => {
    return async (dispatch: AppDispatch) => {
        dispatch(<UnknownAction>registerRequest());
        try {
            const data = await AuthAPI.register(credentials);
            if (data.code === 200) {
                dispatch(<UnknownAction>registerSuccess());
                // 注册成功后自动登录
                dispatch(login(credentials));
            } else {
                dispatch(<UnknownAction>registerFailure(data.message || '注册失败'));
            }
        } catch (error) {
            dispatch(<UnknownAction>registerFailure('网络请求失败'));
        }
    };
};