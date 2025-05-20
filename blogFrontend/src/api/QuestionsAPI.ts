import { http } from '@/utils/request';
import { Question, QuestionListResponse, QuestionTagsResponse } from '@/types/Question';
import { Tag } from '@/types/Tags';

interface GetQuestionsParams {
  page?: number;
  size?: number;
  search?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  tagId?: number;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  success: boolean;
  error?: string;
}

export const QuestionsAPI = {
  // 获取面试题列表
  getQuestions: (params: GetQuestionsParams) =>
    http.get<ApiResponse<QuestionListResponse>>('/questions', { params }),

  // 获取面试题详情
  getQuestionById: (id: number) =>
    http.get<ApiResponse<Question>>(`/questions/${id}`),

  // 点赞面试题
  likeQuestion: (id: number) =>
    http.post<ApiResponse<Question>>(`/questions/${id}/like`),

  // 获取面试题的标签
  getQuestionTags: (questionId: number) =>
    http.get<ApiResponse<QuestionTagsResponse>>(`/questions/${questionId}/tags`),

  // 为面试题添加标签
  addQuestionTag: (questionId: number, tagId: number) =>
    http.post<ApiResponse<QuestionTagsResponse>>(`/questions/${questionId}/tags`, { tagId }),

  // 移除面试题的标签
  removeQuestionTag: (questionId: number, tagId: number) =>
    http.delete<ApiResponse<QuestionTagsResponse>>(`/api/questions/${questionId}/tags/${tagId}`),
}; 