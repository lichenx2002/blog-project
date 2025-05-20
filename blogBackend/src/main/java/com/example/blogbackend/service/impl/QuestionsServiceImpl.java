package com.example.blogbackend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.blogbackend.dto.QuestionDTO;
import com.example.blogbackend.entity.Questions;
import com.example.blogbackend.entity.Tags;
import com.example.blogbackend.mapper.QuestionsMapper;
import com.example.blogbackend.service.IQuestionsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author author
 * @since 2025-05-19
 */
@Slf4j
@Service
public class QuestionsServiceImpl extends ServiceImpl<QuestionsMapper, Questions> implements IQuestionsService {

  @Override
  public Page<QuestionDTO> getQuestionsWithTags(Page<QuestionDTO> page, String search, String difficulty,
      Integer tagId) {
    try {
      log.info("开始查询问题列表，页码：{}，每页大小：{}，搜索词：{}，难度：{}，标签ID：{}",
          page.getCurrent(), page.getSize(), search, difficulty, tagId);

      // 执行联合查询
      List<QuestionDTO> records = baseMapper.selectQuestionsWithTags(page, search, difficulty, tagId);
      log.info("查询到 {} 条记录", records.size());

      // 处理标签数据
      Map<Integer, QuestionDTO> questionMap = new HashMap<>();
      Map<Integer, List<Tags>> questionTagsMap = new HashMap<>();

      for (QuestionDTO record : records) {
        try {
          // 获取或创建问题DTO
          QuestionDTO question = questionMap.computeIfAbsent(record.getId(), k -> {
            QuestionDTO q = new QuestionDTO();
            q.setId(record.getId());
            q.setTitle(record.getTitle());
            q.setContent(record.getContent());
            q.setDifficulty(record.getDifficulty());
            q.setCategory(record.getCategory());
            q.setCreatedAt(record.getCreatedAt());
            q.setUpdatedAt(record.getUpdatedAt());
            q.setStatus(record.getStatus());
            q.setViews(record.getViews());
            q.setLikes(record.getLikes());
            return q;
          });

          // 处理标签
          if (record.getTagId() != null) {
            Tags tag = new Tags();
            tag.setId(record.getTagId());
            tag.setName(record.getTagName());
            tag.setSlug(record.getTagSlug());
            tag.setColor(record.getTagColor());

            questionTagsMap.computeIfAbsent(question.getId(), k -> new ArrayList<>())
                .add(tag);
          }
        } catch (Exception e) {
          log.error("处理记录时出错，记录ID：{}，错误：{}", record.getId(), e.getMessage(), e);
        }
      }

      // 设置标签到问题
      questionTagsMap.forEach((questionId, tags) -> {
        QuestionDTO question = questionMap.get(questionId);
        if (question != null) {
          question.setTags(tags);
        }
      });

      // 设置分页结果
      List<QuestionDTO> resultList = new ArrayList<>(questionMap.values());
      log.info("处理完成，最终结果数量：{}", resultList.size());
      page.setRecords(resultList);
      page.setTotal(resultList.size()); // 设置总记录数
      return page;
    } catch (Exception e) {
      log.error("获取问题列表时发生错误：{}", e.getMessage(), e);
      throw e;
    }
  }

  @Override
  public QuestionDTO getQuestionWithTagsById(Integer id) {
    try {
      log.info("开始查询问题详情，ID：{}", id);
      QuestionDTO question = baseMapper.selectQuestionWithTagsById(id);
      if (question != null && question.getTagId() != null) {
        Tags tag = new Tags();
        tag.setId(question.getTagId());
        tag.setName(question.getTagName());
        tag.setSlug(question.getTagSlug());
        tag.setColor(question.getTagColor());
        question.setTags(Collections.singletonList(tag));
      }
      log.info("查询问题详情完成，ID：{}", id);
      return question;
    } catch (Exception e) {
      log.error("获取问题详情时发生错误，ID：{}，错误：{}", id, e.getMessage(), e);
      throw e;
    }
  }

  @Override
  public Page<QuestionDTO> getQuestionsByTagId(Integer tagId, Page<QuestionDTO> page) {
    try {
      log.info("开始按标签查询问题，标签ID：{}，页码：{}，每页大小：{}", tagId, page.getCurrent(), page.getSize());
      return getQuestionsWithTags(page, null, null, tagId);
    } catch (Exception e) {
      log.error("按标签查询问题时发生错误，标签ID：{}，错误：{}", tagId, e.getMessage(), e);
      throw e;
    }
  }
}
