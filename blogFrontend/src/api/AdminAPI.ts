import { http } from '@/utils/request';
import { Admin } from '@/types/Admin';

export interface AdminLoginResponse {
    code: number;
    msg: string;
    token?: string;
    admin?: Admin;
}

export const AdminAPI = {
    login: async (credentials: { username: string; password: string }) => {
        console.log('Attempting admin login with credentials:', {
            username: credentials.username,
            // 出于安全考虑，不打印密码
            hasPassword: !!credentials.password
        });

        try {
            const response = await http.post<AdminLoginResponse>('/admin/login', credentials);
            if ('error' in response) {
                console.error('Admin login failed:', response.error);
                throw new Error(response.error);
            }
            return response as AdminLoginResponse;
        } catch (error) {
            console.error('Admin login error:', error);
            throw error;
        }
    }
};