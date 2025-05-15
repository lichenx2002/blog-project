package com.example.blogbackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.blogbackend.entity.Comment;
import com.example.blogbackend.dto.CommentDTO;
import com.example.blogbackend.mapper.CommentMapper;
import com.example.blogbackend.service.ICommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommentServiceImpl extends ServiceImpl<CommentMapper, Comment> implements ICommentService {

    @Autowired
    private CommentMapper commentMapper;

    @Override
    public List<CommentDTO> getCommentsByArticleId(Integer articleId) {
        return commentMapper.getCommentsByArticleId(articleId);
    }

    @Override
    public boolean addComment(Comment comment) {
        return save(comment);
    }

    @Override
    public boolean deleteComment(Integer id) {
        return removeById(id);
    }

    @Override
    public boolean updateComment(Comment comment) {
        return updateById(comment);
    }
    @Override
    public List<CommentDTO> getAllComments() {
        return commentMapper.getAllComments();
    }
}