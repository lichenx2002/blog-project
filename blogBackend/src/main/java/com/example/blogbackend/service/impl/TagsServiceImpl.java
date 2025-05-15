package com.example.blogbackend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.blogbackend.entity.ArticleTags;
import com.example.blogbackend.entity.Articles;
import com.example.blogbackend.entity.Tags;
import com.example.blogbackend.mapper.ArticleTagsMapper;
import com.example.blogbackend.mapper.ArticlesMapper;
import com.example.blogbackend.mapper.TagsMapper;
import com.example.blogbackend.service.ITagsService;
import com.example.blogbackend.dto.TagWithCountDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagsServiceImpl extends ServiceImpl<TagsMapper, Tags> implements ITagsService {

  @Autowired
  private TagsMapper tagsMapper;

  @Autowired
  private ArticleTagsMapper articleTagsMapper;

  @Autowired
  private ArticlesMapper articlesMapper;

  @Override
  public List<Articles> getArticlesByTagId(Integer tagId) {
    // 1. 查询所有包含该标签的文章ID
    QueryWrapper<ArticleTags> queryWrapper = new QueryWrapper<>();
    queryWrapper.eq("tag_id", tagId);
    List<ArticleTags> articleTags = articleTagsMapper.selectList(queryWrapper);

    // 2. 提取文章ID列表
    List<Integer> articleIds = articleTags.stream()
        .map(ArticleTags::getArticleId)
        .collect(Collectors.toList());

    // 3. 如果没有任何文章，返回空列表
    if (articleIds.isEmpty()) {
      return List.of();
    }

    // 4. 查询这些文章
    QueryWrapper<Articles> articlesQueryWrapper = new QueryWrapper<>();
    articlesQueryWrapper.in("id", articleIds)
        .orderByDesc("published_at");
    return articlesMapper.selectList(articlesQueryWrapper);
  }

  @Override
  public List<TagWithCountDTO> getAllTagsWithCount() {
    return tagsMapper.selectAllWithCount();
  }
}