import { Identifiable, ApiResponse } from './common';

export interface User extends Identifiable {
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

export interface LoginResponse extends ApiResponse<{
  token: string;
  user: User;
}> { }

export interface SmsCodeResponse extends ApiResponse<{
  success: boolean;
}> { } 