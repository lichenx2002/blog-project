// 导入所需的类型和常量
import {
    AuthState,
    AuthActionTypes,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
} from './types';

// 定义初始状态
const initialState: AuthState = {
    isAuthenticated: false,  // 初始状态：未认证
    user: null,              // 初始状态：无用户信息
    isLoading: false,        // 初始状态：不在加载中
    error: null              // 初始状态：无错误
};

// 定义认证reducer
const authReducer = (
    state = initialState,      // 默认使用初始状态
    action: AuthActionTypes    // 接收Auth相关的action
): AuthState => {             // 返回新的AuthState
    switch (action.type) {     // 根据action类型处理不同情况
        case LOGIN_REQUEST:
            // 处理登录请求动作
            return {
                ...state,         // 保留原有状态
                isLoading: true,  // 标记为正在加载
                error: null      // 清除之前的错误
            };

        case LOGIN_SUCCESS:
            // 处理登录成功动作
            return {
                ...state,
                isAuthenticated: true,  // 标记为已认证
                user: action.payload,   // 设置用户信息
                isLoading: false,      // 加载完成
                error: null             // 清除错误
            };

        case LOGIN_FAILURE:
            // 处理登录失败动作
            return {
                ...state,
                isLoading: false,       // 加载完成
                error: action.payload   // 设置错误信息
            };

        case LOGOUT:
            // 处理注销动作
            return initialState;  // 直接返回初始状态，清空所有数据

        case REGISTER_REQUEST:
            return {
                ...state,
                isLoading: true,
                error: null
            };

        case REGISTER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null
            };

        case REGISTER_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };

        default:
            // 默认情况返回当前状态
            return state;


    }
}

export default authReducer;