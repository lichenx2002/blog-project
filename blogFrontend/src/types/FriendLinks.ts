import { Identifiable, Timestamped, ApiResponse } from './common';

export interface FriendLinks {
    id: number;
    name: string;
    url: string;
    avatarUrl: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface FriendLinksOperationResponse extends ApiResponse<void> { }

export interface ApiResponse<T> {
    data: T;
    error?: string;
}