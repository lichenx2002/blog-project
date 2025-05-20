import { Tag } from './Tags';

export interface Question {
  id: number;
  title: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  tags: Tag[];
}

export interface QuestionListResponse {
  records: Question[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export interface QuestionTagsResponse {
  tags: Tag[];
} 