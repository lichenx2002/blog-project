// 定义动作类型的常量（action types）
// 这些常量用于标识不同的Redux动作，避免硬编码字符串
//登录
export const LOGIN_REQUEST = 'LOGIN_REQUEST';       // 登录请求开始的action类型
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';      // 登录成功的action类型
export const LOGIN_FAILURE = 'LOGIN_FAILURE';      // 登录失败的action类型
export const LOGOUT = 'LOGOUT';                    // 注销的action类型

//注册
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

// 定义用户信息的接口
// 描述用户数据的结构
export interface User {
    id: number;         // 用户ID
    username: string;   // 用户名
    password: string;   // 用户密码
}

// 定义认证模块的Redux状态结构
export interface AuthState {
    isAuthenticated: boolean;    // 是否已认证（是否登录）
    user: User | null;           // 用户信息，未登录时为null
    isLoading: boolean;          // 是否正在加载（如登录请求中）
    error: string | null;        // 错误信息，无错误时为null
}

// 定义各个动作（action）的接口
// 每个接口代表一种Redux动作的结构

// 登录请求动作
interface LoginRequestAction {
    type: typeof LOGIN_REQUEST;  // 动作类型为LOGIN_REQUEST
    // 这个动作没有payload，因为它只是表示登录过程开始
}

// 登录成功动作
interface LoginSuccessAction {
    type: typeof LOGIN_SUCCESS;  // 动作类型为LOGIN_SUCCESS
    payload: User;               // 携带用户信息作为payload
}

// 登录失败动作
interface LoginFailureAction {
    type: typeof LOGIN_FAILURE;  // 动作类型为LOGIN_FAILURE
    payload: string;             // 携带错误信息作为payload
}

// 注销动作
interface LogoutAction {
    type: typeof LOGOUT;         // 动作类型为LOGOUT
    // 这个动作不需要payload，因为注销只需要把状态清空
}
// 注册请求动作
interface RegisterRequestAction {
    type: typeof REGISTER_REQUEST;
}
// 注册成功动作
interface RegisterSuccessAction {
    type: typeof REGISTER_SUCCESS;
}
// 注册失败动作
interface RegisterFailureAction {
    type: typeof REGISTER_FAILURE;
    payload: string;
}

// 导入 AppDispatch 类型
import { AppDispatch } from '../store';

// 定义认证模块的所有可能的动作类型
// 这是一个联合类型，表示Auth相关的action只能是这几种类型之一
export type AuthActionTypes =
    | LoginRequestAction
    | LoginSuccessAction
    | LoginFailureAction
    | LogoutAction
    | RegisterRequestAction
    | RegisterSuccessAction
    | RegisterFailureAction
    | ((dispatch: AppDispatch) => Promise<void>); // 添加异步action类型