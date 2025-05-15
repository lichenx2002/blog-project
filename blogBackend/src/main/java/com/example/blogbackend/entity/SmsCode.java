package com.example.blogbackend.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("sms_codes")
public class SmsCode {
  @TableId(value = "id", type = IdType.AUTO)
  private Long id;

  private String phone;
  private String code;
  private String type;
  private LocalDateTime expireTime;
  private Boolean used;
  private LocalDateTime createTime;
  private LocalDateTime updateTime;
}