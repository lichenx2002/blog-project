package com.example.blogbackend.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.blogbackend.common.Result;
import com.example.blogbackend.dto.QuestionDTO;
import com.example.blogbackend.service.IQuestionsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author author
 * @since 2025-05-19
 */
@Slf4j
@RestController
@RequestMapping("/questions")
public class QuestionsController {

  @Autowired
  private IQuestionsService questionsService;

  /**
   * 获取面试题列表
   *
   * @param size       每页大小
   * @param search     搜索关键词
   * @param difficulty 难度等级
   * @param tagId      标签ID
   * @return 面试题列表
   */
  @GetMapping
  public Result<Page<QuestionDTO>> getQuestions(
      @RequestParam(defaultValue = "1") Integer current,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(required = false) String search,
      @RequestParam(required = false) String difficulty,
      @RequestParam(required = false) Integer tagId) {
    try {
      log.info("获取问题列表，页码：{}，每页大小：{}，搜索词：{}，难度：{}，标签ID：{}",
          current, size, search, difficulty, tagId);

      Page<QuestionDTO> page = new Page<>(current, size);
      Page<QuestionDTO> result = questionsService.getQuestionsWithTags(page, search, difficulty, tagId);

      log.info("查询成功，总记录数：{}", result.getTotal());
      return Result.success(result);
    } catch (Exception e) {
      log.error("获取问题列表失败：{}", e.getMessage(), e);
      return Result.error("获取问题列表失败：" + e.getMessage());
    }
  }

  /**
   * 获取面试题详情
   * 
   * @param id 面试题ID
   * @return 面试题详情
   */
  @GetMapping("/{id}")
  public Result<QuestionDTO> getQuestionById(@PathVariable Integer id) {
    try {
      log.info("获取问题详情，ID：{}", id);
      QuestionDTO question = questionsService.getQuestionWithTagsById(id);
      if (question == null) {
        return Result.error("问题不存在");
      }
      return Result.success(question);
    } catch (Exception e) {
      log.error("获取问题详情失败，ID：{}，错误：{}", id, e.getMessage(), e);
      return Result.error("获取问题详情失败：" + e.getMessage());
    }
  }

  /**
   * 获取面试题列表
   * 
   * @param tagId   标签ID
   * @param current 页码
   * @param size    每页大小
   * @return 面试题列表
   */
  @GetMapping("/tag/{tagId}")
  public Result<Page<QuestionDTO>> getQuestionsByTagId(
      @PathVariable Integer tagId,
      @RequestParam(defaultValue = "1") Integer current,
      @RequestParam(defaultValue = "10") Integer size) {
    try {
      log.info("按标签获取问题列表，标签ID：{}，页码：{}，每页大小：{}", tagId, current, size);
      Page<QuestionDTO> page = new Page<>(current, size);
      Page<QuestionDTO> result = questionsService.getQuestionsByTagId(tagId, page);
      return Result.success(result);
    } catch (Exception e) {
      log.error("按标签获取问题列表失败，标签ID：{}，错误：{}", tagId, e.getMessage(), e);
      return Result.error("按标签获取问题列表失败：" + e.getMessage());
    }
  }
}
