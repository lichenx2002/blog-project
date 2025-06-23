import { Identifiable, Timestamped, PaginatedResponse, ApiResponse } from './common';

export interface Question extends Identifiable, Timestamped {
  title: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published';
  views: number;
  likes: number;
}

export interface QuestionListResponse extends PaginatedResponse<Question> {
  pages: number;
}

export interface QuestionTagsResponse extends ApiResponse<{ tags: any[] }> { } 