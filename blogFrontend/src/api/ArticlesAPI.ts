import { http } from '@/utils/request';
import { Article } from '@/types/Article';

interface ArticleResponse {
  data: Article[];
}

interface ViewCountResponse {
  viewCount: number;
}

export const ArticlesAPI = {
  //  获取文章列表
  getArticles: () =>
    http.get<ArticleResponse>('/articles/list'),
  //  获取文章
  getArticleById: (id: number) =>
    http.get<Article>(`/articles/${id}`),
  //  创建文章
  createArticle: (data: any) =>
    http.post<Article>('/articles', data),
  //  更新文章
  updateArticle: (id: number, data: any) =>
    http.put<Article>(`/articles/${id}`, data),
  //  删除文章
  deleteArticle: (id: number) =>
    http.delete<boolean>(`/articles/${id}`),
  //  点赞文章
  likeArticle: (id: number) =>
    http.post<Article>(`/articles/${id}/like`),
  //  增加浏览量
  incrementViewCount: (id: number) =>
    http.post<ViewCountResponse>(`/articles/${id}/view`),
};