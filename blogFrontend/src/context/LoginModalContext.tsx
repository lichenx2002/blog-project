// src/context/LoginModalContext.tsx
import React, { createContext, useState } from 'react';

// 创建登录模态框的上下文类型
type LoginModalContextType = {
    showLogin: boolean;
    setShowLogin: (show: boolean) => void;
    showAdminLogin: boolean;
    setShowAdminLogin: (show: boolean) => void;
};

// 创建登录模态框的上下文
export const LoginModalContext = createContext<LoginModalContextType>({
    showLogin: false,
    setShowLogin: () => { },
    showAdminLogin: false,
    setShowAdminLogin: () => { }
});

// 创建 Provider 组件
export const LoginModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [showLogin, setShowLogin] = useState(false);
    const [showAdminLogin, setShowAdminLogin] = useState(false);

    return (
        <LoginModalContext.Provider value={{
            showLogin,
            setShowLogin,
            showAdminLogin,
            setShowAdminLogin
        }}>
            {children}
        </LoginModalContext.Provider>
    );
};