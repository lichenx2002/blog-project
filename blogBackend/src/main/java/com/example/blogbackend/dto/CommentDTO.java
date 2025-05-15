package com.example.blogbackend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentDTO {
    private Integer id;
    private String content;
    private LocalDateTime createdAt;
    private Integer userId;
    private String articleTitle;
    private String username;
    private String avatar;
    private Integer parentId;
    private Integer articleId;
}