// 使用 SHA-256 进行加密
export const encryptPassword = async (password: string): Promise<string> => {
    // 使用更复杂的盐值
    const salt = process.env.NEXT_PUBLIC_PASSWORD_SALT || 'default-complex-salt-123!@#';
    const text = password + salt;

    // 使用 Web Crypto API 进行加密
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    try {
        const hash = await window.crypto.subtle.digest('SHA-256', data);
        // 将 ArrayBuffer 转换为十六进制字符串
        const hashArray = Array.from(new Uint8Array(hash));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
        console.error('Encryption failed:', error);
        throw new Error('Password encryption failed');
    }
};