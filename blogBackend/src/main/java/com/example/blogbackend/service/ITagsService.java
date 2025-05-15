package com.example.blogbackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.blogbackend.entity.Articles;
import com.example.blogbackend.entity.Tags;
import com.example.blogbackend.dto.TagWithCountDTO;

import java.util.List;

/**
 * <p>
 * 服务类
 * </p>
 *
 * @author author
 * @since 2025-04-12
 */
public interface ITagsService extends IService<Tags> {
  List<Articles> getArticlesByTagId(Integer tagId);

  List<TagWithCountDTO> getAllTagsWithCount();
}
