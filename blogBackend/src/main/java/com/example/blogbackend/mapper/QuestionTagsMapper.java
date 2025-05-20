package com.example.blogbackend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.blogbackend.entity.QuestionTags;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * <p>
 * Mapper 接口
 * </p>
 *
 * @author author
 * @since 2025-05-19
 */
@Mapper
public interface QuestionTagsMapper extends BaseMapper<QuestionTags> {

  @Select("SELECT tag_id FROM question_tags WHERE question_id = #{questionId}")
  List<Integer> getTagIdsByQuestionId(@Param("questionId") Integer questionId);

  @Delete("DELETE FROM question_tags WHERE question_id = #{questionId}")
  int deleteByQuestionId(@Param("questionId") Integer questionId);

  @Delete("DELETE FROM question_tags WHERE question_id = #{questionId} AND tag_id = #{tagId}")
  int deleteByQuestionIdAndTagId(@Param("questionId") Integer questionId, @Param("tagId") Integer tagId);
}
