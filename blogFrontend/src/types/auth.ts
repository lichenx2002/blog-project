export interface User {
  id: number;
  username: string;
  phone?: string;
  phoneVerified?: boolean;
  phoneBindTime?: string;
  loginType?: 'password' | 'sms';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SmsLoginCredentials {
  phone: string;
  code: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  code: number;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface SmsCodeResponse {
  code: number;
  message: string;
  data: {
    success: boolean;
  };
} 