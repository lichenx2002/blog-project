package com.example.blogbackend.dto;

import com.example.blogbackend.entity.Questions;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class QuestionDTO extends Questions {
  // 确保这些字段有默认值
  public QuestionDTO() {
    super();
    this.setViews(0);
    this.setLikes(0);
  }
}