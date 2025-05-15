package com.example.blogbackend.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.blogbackend.dto.CommentDTO;
import com.example.blogbackend.entity.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface CommentMapper extends BaseMapper<Comment> {
    @Select("SELECT c.*, u.username, u.avatar, a.title as article_title " +  // 添加空格
            "FROM comments c " +  // 添加空格
            "JOIN users u ON c.user_id = u.id " +
            "JOIN articles a ON c.article_id = a.id " +  // 添加空格
            "WHERE c.article_id = #{articleId} " +
            "ORDER BY c.created_at DESC")
    List<CommentDTO> getCommentsByArticleId(Integer articleId);

    @Select("SELECT c.*, u.username, u.avatar, a.title as article_title " +
            "FROM comments c " +
            "JOIN users u ON c.user_id = u.id " +
            "JOIN articles a ON c.article_id = a.id " +
            "ORDER BY c.created_at DESC")
    List<CommentDTO> getAllComments();
}