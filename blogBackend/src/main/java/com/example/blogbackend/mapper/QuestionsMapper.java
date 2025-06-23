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
            "SELECT q.*",
            "FROM questions q",
            "WHERE q.status = 'published'",
            "<if test='search != null and search != \"\"'>",
            "  AND (q.title LIKE CONCAT('%', #{search}, '%') OR q.content LIKE CONCAT('%', #{search}, '%'))",
            "</if>",
            "<if test='difficulty != null and difficulty != \"\"'>",
            "  AND q.difficulty = #{difficulty}",
            "</if>",
            "ORDER BY q.updated_at DESC",
            "</script>"
    })
    List<QuestionDTO> selectQuestionsWithTags(
            Page<QuestionDTO> page,
            @Param("search") String search,
            @Param("difficulty") String difficulty);

    @Select({
            "SELECT q.*",
            "FROM questions q",
            "WHERE q.id = #{id}"
    })
    QuestionDTO selectQuestionWithTagsById(@Param("id") Integer id);
}
