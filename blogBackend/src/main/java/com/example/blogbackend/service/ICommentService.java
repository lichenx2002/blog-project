package com.example.blogbackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.blogbackend.entity.Comment;
import com.example.blogbackend.dto.CommentDTO;
import java.util.List;

public interface ICommentService extends IService<Comment> {
    List<CommentDTO> getCommentsByArticleId(Integer articleId);

    List<CommentDTO> getAllComments();

    boolean addComment(Comment comment);

    boolean deleteComment(Integer id);

    boolean updateComment(Comment comment);
}