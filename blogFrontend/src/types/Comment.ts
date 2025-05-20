// 评论接口定义
export interface Comment {
  id: number;
  articleId: number;
  userId: number;
  username: string;
  content: string;
  parentId: number | null;
  createdAt: string;
  updatedAt?: string;
  avatar?: string;
  likes?: number;
  isLiked?: boolean;
  articleTitle: string;
  replies?: Comment[];
}

// 评论列表响应

// 评论操作响应
export interface CommentOperationResponse {
  message: string;
  error?: string;
} 