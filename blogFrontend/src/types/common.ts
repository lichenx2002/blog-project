// common.ts
export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    total: number;
    current: number;
    size: number;
    records: T[];
}

export interface Timestamped {
    createdAt: string;
    updatedAt: string;
}

export interface Identifiable {
    id: number;
}

export interface ApiError {
    code: number;
    message: string;
    details?: Record<string, string[]>;
}