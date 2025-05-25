import { Identifiable, Timestamped, ApiResponse } from './common';

// 评论接口定义
export interface Comment extends Identifiable, Timestamped {
  articleId: number;
  userId: number;
  username: string;
  content: string;
  parentId: number | null;
  avatar?: string;
  likes?: number;
  isLiked?: boolean;
  articleTitle: string;
  replies?: Comment[];
}

// 评论列表响应

// 评论操作响应
export interface CommentOperationResponse extends ApiResponse<void> { } 