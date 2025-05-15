package com.example.blogbackend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.blogbackend.entity.Tags;
import com.example.blogbackend.dto.TagWithCountDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * <p>
 * Mapper 接口
 * </p>
 *
 * @author author
 * @since 2025-04-12
 */
@Mapper
public interface TagsMapper extends BaseMapper<Tags> {

  @Select("SELECT t.id, t.name, t.slug, t.color, COUNT(at.tag_id) AS count FROM tags t LEFT JOIN article_tags at ON t.id = at.tag_id GROUP BY t.id, t.name, t.slug, t.color ORDER BY t.id")
  java.util.List<TagWithCountDTO> selectAllWithCount();

}
