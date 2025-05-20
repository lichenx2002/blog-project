package com.example.blogbackend.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.example.blogbackend.dto.QuestionDTO;
import com.example.blogbackend.entity.Questions;

/**
 * <p>
 * 服务类
 * </p>
 *
 * @author author
 * @since 2025-05-19
 */
public interface IQuestionsService extends IService<Questions> {
  /**
   * 获取问题列表（带标签）
   *
   * @param page       分页参数
   * @param search     搜索关键词
   * @param difficulty 难度级别
   * @param tagId      标签ID
   * @return 分页的问题列表
   */
  Page<QuestionDTO> getQuestionsWithTags(Page<QuestionDTO> page, String search, String difficulty, Integer tagId);

  /**
   * 获取问题详情（带标签）
   *
   * @param id 问题ID
   * @return 问题详情
   */
  QuestionDTO getQuestionWithTagsById(Integer id);

  /**
   * 按标签获取问题列表
   *
   * @param tagId 标签ID
   * @param page  分页参数
   * @return 分页的问题列表
   */
  Page<QuestionDTO> getQuestionsByTagId(Integer tagId, Page<QuestionDTO> page);
}
