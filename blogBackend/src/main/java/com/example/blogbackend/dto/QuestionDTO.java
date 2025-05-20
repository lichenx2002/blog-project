package com.example.blogbackend.dto;

import com.example.blogbackend.entity.Questions;
import com.example.blogbackend.entity.Tags;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class QuestionDTO extends Questions {
  private List<Tags> tags;

  // 用于存储标签信息的临时字段
  private Integer tagId;
  private String tagName;
  private String tagSlug;
  private String tagColor;
}