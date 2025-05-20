package com.example.blogbackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.blogbackend.entity.Articles;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.blogbackend.dto.ArticleDTO;

/**
 * <p>
 * 博客文章表 服务类
 * </p>
 *
 * @author author
 * @since 2025-04-12
 */
public interface IArticlesService extends IService<Articles> {

    Page<Articles> listWithTags(int page, int pageSize);

    Articles saveArticleWithTags(ArticleDTO dto);

    boolean updateArticleWithTags(ArticleDTO dto);

    boolean removeById(Integer id);

    Integer likeArticle(Integer id);
}
