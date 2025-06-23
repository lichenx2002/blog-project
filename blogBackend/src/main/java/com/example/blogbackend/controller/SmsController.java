package com.example.blogbackend.controller;

import com.example.blogbackend.entity.Result;
import com.example.blogbackend.service.ISmsService;
import com.example.blogbackend.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sms")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class SmsController {

  @Autowired
  private ISmsService smsService;

  @Autowired
  private IUserService userService;

  /**
   * 发送验证码
   * 
   * @param phone 手机号
   * @param type  验证码类型：login/register/reset
   * @return 发送结果
   */
  @PostMapping("/send")
  public Result sendCode(@RequestParam String phone, @RequestParam String type) {
    return smsService.sendCode(phone, type);
  }

  /**
   * 验证码登录
   * 
   * @param phone 手机号
   * @param code  验证码
   * @return 登录结果
   */
  @PostMapping("/login")
  public Result loginByPhone(@RequestParam String phone, @RequestParam String code) {
    return userService.loginByPhone(phone, code);
  }

  /**
   * 绑定手机号
   * 
   * @param userId 用户ID
   * @param phone  手机号
   * @param code   验证码
   * @return 绑定结果
   */
  @PostMapping("/bind")
  public Result bindPhone(@RequestParam Integer userId, @RequestParam String phone, @RequestParam String code) {
    return userService.bindPhone(userId, phone, code);
  }
}