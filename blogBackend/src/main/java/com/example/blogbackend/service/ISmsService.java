package com.example.blogbackend.service;

import com.example.blogbackend.entity.Result;

public interface ISmsService {
  /**
   * 发送验证码
   * 
   * @param phone 手机号
   * @param type  验证码类型：login/register/reset
   * @return 发送结果
   */
  Result sendCode(String phone, String type);

  /**
   * 验证验证码
   * 
   * @param phone 手机号
   * @param code  验证码
   * @param type  验证码类型
   * @return 验证结果
   */
  Result verifyCode(String phone, String code, String type);
}