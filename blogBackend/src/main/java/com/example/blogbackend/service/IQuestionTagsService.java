package com.example.blogbackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.blogbackend.entity.QuestionTags;
import com.example.blogbackend.entity.Tags;

import java.util.List;

/**
 * <p>
 * 服务类
 * </p>
 *
 * @author author
 * @since 2025-05-19
 */
public interface IQuestionTagsService extends IService<QuestionTags> {

  /**
   * 获取面试题的所有标签
   */
  List<Tags> getTagsByQuestionId(Integer questionId);

  /**
   * 为面试题添加标签
   */
  boolean addTagToQuestion(Integer questionId, Integer tagId);

  /**
   * 从面试题移除标签
   */
  boolean removeTagFromQuestion(Integer questionId, Integer tagId);

  /**
   * 更新面试题的标签
   */
  boolean updateQuestionTags(Integer questionId, List<Integer> tagIds);

  /**
   * 删除面试题的所有标签
   */
  boolean deleteQuestionTags(Integer questionId);
}
