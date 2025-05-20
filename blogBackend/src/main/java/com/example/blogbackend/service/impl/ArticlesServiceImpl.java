package com.example.blogbackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.blogbackend.entity.Articles;
import com.example.blogbackend.entity.ArticleTags;
import com.example.blogbackend.entity.Tags;
import com.example.blogbackend.mapper.ArticleTagsMapper;
import com.example.blogbackend.mapper.ArticlesMapper;
import com.example.blogbackend.mapper.TagsMapper;
import com.example.blogbackend.service.IArticlesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import com.example.blogbackend.dto.ArticleDTO;
import java.time.OffsetDateTime;

@Service
public class ArticlesServiceImpl extends ServiceImpl<ArticlesMapper, Articles> implements IArticlesService {

    @Autowired
    private ArticleTagsMapper articleTagsMapper;

    @Autowired
    private TagsMapper tagsMapper;

    private LocalDateTime parseDateTime(String dateTimeStr) {
        if (dateTimeStr == null || dateTimeStr.isEmpty())
            return null;
        try {
            // 尝试直接解析带时区的格式
            return OffsetDateTime.parse(dateTimeStr).toLocalDateTime();
        } catch (Exception e) {
            try {
                // 尝试解析不带时区的格式，并假设为本地时间
                return LocalDateTime.parse(dateTimeStr);
            } catch (Exception e2) {
                // 如果都失败了，返回当前时间
                return LocalDateTime.now();
            }
        }
    }

    @Override
    public Page<Articles> listWithTags(int page, int pageSize) {
        // 创建分页对象
        Page<Articles> pageParam = new Page<>(page, pageSize);

        // 执行分页查询
        Page<Articles> articlesPage = this.page(pageParam);

        // 获取文章ID列表
        List<Integer> articleIds = articlesPage.getRecords().stream()
                .map(Articles::getId)
                .collect(Collectors.toList());

        if (!articleIds.isEmpty()) {
            // 查询文章标签关联
            List<ArticleTags> articleTags = articleTagsMapper.selectList(
                    new LambdaQueryWrapper<ArticleTags>()
                            .in(ArticleTags::getArticleId, articleIds));

            // 查询标签信息
            List<Integer> tagIds = articleTags.stream()
                    .map(ArticleTags::getTagId)
                    .distinct()
                    .collect(Collectors.toList());

            List<Tags> tags = tagsMapper.selectList(
                    new LambdaQueryWrapper<Tags>()
                            .in(Tags::getId, tagIds));

            // 构建文章ID到标签列表的映射
            Map<Integer, List<Tags>> articleTagsMap = new HashMap<>();
            for (ArticleTags at : articleTags) {
                Tags tag = tags.stream()
                        .filter(t -> t.getId().equals(at.getTagId()))
                        .findFirst()
                        .orElse(null);
                if (tag != null) {
                    articleTagsMap.computeIfAbsent(at.getArticleId(), k -> new ArrayList<>())
                            .add(tag);
                }
            }

            // 设置文章标签
            for (Articles article : articlesPage.getRecords()) {
                article.setTags(articleTagsMap.getOrDefault(article.getId(), new ArrayList<>()));
            }
        }

        return articlesPage;
    }

    @Override
    public Articles saveArticleWithTags(ArticleDTO dto) {
        Articles article = new Articles();
        // 建议用 BeanUtils.copyProperties(dto, article); 也可以手动 set
        article.setTitle(dto.getTitle());
        article.setSlug(dto.getSlug());
        article.setContent(dto.getContent());
        article.setHtmlContent(dto.getHtmlContent());
        article.setExcerpt(dto.getExcerpt());
        article.setCoverImage(dto.getCoverImage());
        article.setImages(dto.getImages());
        article.setAuthorId(dto.getAuthorId());
        article.setStatus(dto.getStatus());
        article.setPostType(dto.getPostType());
        article.setCreatedAt(parseDateTime(dto.getCreatedAt()));
        article.setUpdatedAt(parseDateTime(dto.getUpdatedAt()));
        article.setPublishedAt(parseDateTime(dto.getPublishedAt()));
        article.setViewCount(dto.getViewCount());
        article.setLikeCount(dto.getLikeCount());
        article.setReadingTime(dto.getReadingTime());

        this.save(article);

        if (dto.getTagIds() != null) {
            for (Integer tagId : dto.getTagIds()) {
                ArticleTags at = new ArticleTags();
                at.setArticleId(article.getId());
                at.setTagId(tagId);
                articleTagsMapper.insert(at);
            }
        }
        return article;
    }

    @Override
    public boolean updateArticleWithTags(ArticleDTO dto) {
        if (dto.getId() == null) {
            throw new IllegalArgumentException("文章ID不能为空");
        }

        // 先查询文章是否存在
        Articles existingArticle = this.getById(dto.getId());
        if (existingArticle == null) {
            throw new IllegalArgumentException("文章不存在");
        }

        Articles article = new Articles();
        article.setId(dto.getId());
        article.setTitle(dto.getTitle());
        article.setSlug(dto.getSlug());
        article.setContent(dto.getContent());
        article.setHtmlContent(dto.getHtmlContent());
        article.setExcerpt(dto.getExcerpt());
        article.setCoverImage(dto.getCoverImage());
        article.setImages(dto.getImages());
        article.setAuthorId(dto.getAuthorId());
        article.setStatus(dto.getStatus());
        article.setPostType(dto.getPostType());
        article.setCreatedAt(parseDateTime(dto.getCreatedAt()));
        article.setUpdatedAt(parseDateTime(dto.getUpdatedAt()));
        article.setPublishedAt(parseDateTime(dto.getPublishedAt()));
        article.setViewCount(dto.getViewCount());
        article.setLikeCount(dto.getLikeCount());
        article.setReadingTime(dto.getReadingTime());

        boolean updated = this.updateById(article);
        if (!updated) {
            throw new RuntimeException("更新文章失败");
        }

        // 先删后插
        articleTagsMapper.delete(new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<ArticleTags>()
                .eq("article_id", article.getId()));
        if (dto.getTagIds() != null) {
            for (Integer tagId : dto.getTagIds()) {
                ArticleTags at = new ArticleTags();
                at.setArticleId(article.getId());
                at.setTagId(tagId);
                articleTagsMapper.insert(at);
            }
        }
        return true;
    }

    @Override
    public boolean removeById(Integer id) {
        // 1. 删除文章标签关联
        articleTagsMapper.delete(new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<ArticleTags>()
                .eq("article_id", id));

        // 2. 删除文章
        return super.removeById(id);
    }

    @Override
    public Integer likeArticle(Integer id) {
        // 先查询文章是否存在
        Articles existingArticle = this.getById(id);
        if (existingArticle == null) {
            throw new IllegalArgumentException("文章不存在");
        }

        // 增加点赞数
        existingArticle.setLikeCount(existingArticle.getLikeCount() + 1);
        boolean updated = this.updateById(existingArticle);

        if (!updated) {
            throw new RuntimeException("更新点赞数失败");
        }

        return existingArticle.getLikeCount();
    }
}