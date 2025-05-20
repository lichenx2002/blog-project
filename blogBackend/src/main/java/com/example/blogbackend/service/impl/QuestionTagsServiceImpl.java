package com.example.blogbackend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.blogbackend.entity.QuestionTags;
import com.example.blogbackend.entity.Tags;
import com.example.blogbackend.mapper.QuestionTagsMapper;
import com.example.blogbackend.mapper.TagsMapper;
import com.example.blogbackend.service.IQuestionTagsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author author
 * @since 2025-05-19
 */
@Service
public class QuestionTagsServiceImpl extends ServiceImpl<QuestionTagsMapper, QuestionTags>
    implements IQuestionTagsService {

  @Autowired
  private TagsMapper tagsMapper;

  @Override
  public List<Tags> getTagsByQuestionId(Integer questionId) {
    List<Integer> tagIds = baseMapper.getTagIdsByQuestionId(questionId);
    if (tagIds.isEmpty()) {
      return List.of();
    }
    return tagsMapper.selectBatchIds(tagIds);
  }

  @Override
  @Transactional
  public boolean addTagToQuestion(Integer questionId, Integer tagId) {
    // 检查是否已存在
    LambdaQueryWrapper<QuestionTags> wrapper = new LambdaQueryWrapper<>();
    wrapper.eq(QuestionTags::getQuestionId, questionId)
        .eq(QuestionTags::getTagId, tagId);
    if (this.count(wrapper) > 0) {
      return true; // 已存在，视为成功
    }

    // 添加新关联
    QuestionTags questionTags = new QuestionTags()
        .setQuestionId(questionId)
        .setTagId(tagId);
    return this.save(questionTags);
  }

  @Override
  @Transactional
  public boolean removeTagFromQuestion(Integer questionId, Integer tagId) {
    return baseMapper.deleteByQuestionIdAndTagId(questionId, tagId) > 0;
  }

  @Override
  @Transactional
  public boolean updateQuestionTags(Integer questionId, List<Integer> tagIds) {
    // 先删除所有现有标签
    baseMapper.deleteByQuestionId(questionId);

    // 如果没有新标签，直接返回成功
    if (tagIds == null || tagIds.isEmpty()) {
      return true;
    }

    // 批量添加新标签
    List<QuestionTags> questionTags = tagIds.stream()
        .map(tagId -> new QuestionTags()
            .setQuestionId(questionId)
            .setTagId(tagId))
        .collect(Collectors.toList());

    return this.saveBatch(questionTags);
  }

  @Override
  @Transactional
  public boolean deleteQuestionTags(Integer questionId) {
    return baseMapper.deleteByQuestionId(questionId) >= 0;
  }
}
