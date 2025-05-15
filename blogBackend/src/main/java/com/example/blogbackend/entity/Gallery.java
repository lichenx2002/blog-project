package com.example.blogbackend.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 相册表
 * </p>
 *
 * @author author
 * @since 2025-04-12
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("gallery")
public class Gallery implements Serializable {

  private static final long serialVersionUID = 1L;

  /**
   * 相册ID
   */
  @TableId(value = "id", type = IdType.AUTO)
  private Integer id;

  /**
   * 相册标题
   */
  private String title;

  /**
   * 相册描述
   */
  private String description;

  /**
   * 封面图片URL
   */
  private String coverImage;

  /**
   * 相册分类
   */
  private String category;

  private LocalDate date;

  /**
   * 创建时间
   */
  private LocalDateTime createdAt;

  /**
   * 更新时间
   */
  private LocalDateTime updatedAt;
}