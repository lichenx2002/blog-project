package com.example.blogbackend.dto;

import lombok.Data;

@Data
public class TagWithCountDTO {
  private Integer id;
  private String name;
  private String slug;
  private String color;
  private Integer count;
}