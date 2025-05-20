package com.example.blogbackend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.blogbackend.dto.QuestionDTO;
import com.example.blogbackend.entity.Questions;
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
public interface QuestionsMapper extends BaseMapper<Questions> {

  @Select({
      "<script>",
      "SELECT DISTINCT q.*, t.id as tag_id, t.name as tag_name, t.slug as tag_slug, t.color as tag_color",
      "FROM questions q",
      "LEFT JOIN question_tags qt ON q.id = qt.question_id",
      "LEFT JOIN tags t ON qt.tag_id = t.id",
      "WHERE q.status = 'published'",
      "<if test='search != null and search != \"\"'>",
      "  AND (q.title LIKE CONCAT('%', #{search}, '%') OR q.content LIKE CONCAT('%', #{search}, '%'))",
      "</if>",
      "<if test='difficulty != null and difficulty != \"\"'>",
      "  AND q.difficulty = #{difficulty}",
      "</if>",
      "<if test='tagId != null'>",
      "  AND EXISTS (SELECT 1 FROM question_tags qt2 WHERE qt2.question_id = q.id AND qt2.tag_id = #{tagId})",
      "</if>",
      "ORDER BY q.updated_at DESC",
      "</script>"
  })
  List<QuestionDTO> selectQuestionsWithTags(
      Page<QuestionDTO> page,
      @Param("search") String search,
      @Param("difficulty") String difficulty,
      @Param("tagId") Integer tagId);

  @Select({
      "SELECT DISTINCT q.*, t.id as tag_id, t.name as tag_name, t.slug as tag_slug, t.color as tag_color",
      "FROM questions q",
      "LEFT JOIN question_tags qt ON q.id = qt.question_id",
      "LEFT JOIN tags t ON qt.tag_id = t.id",
      "WHERE q.id = #{id}"
  })
  QuestionDTO selectQuestionWithTagsById(@Param("id") Integer id);
}
