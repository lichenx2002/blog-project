package com.example.blogbackend.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.blogbackend.entity.Result;
import com.example.blogbackend.entity.SmsCode;
import com.example.blogbackend.mapper.SmsCodeMapper;
import com.example.blogbackend.service.ISmsService;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class SmsServiceImpl extends ServiceImpl<SmsCodeMapper, SmsCode> implements ISmsService {

  private static final int CODE_LENGTH = 6;
  private static final int EXPIRE_MINUTES = 5;

  @Override
  public Result sendCode(String phone, String type) {
    // 生成6位随机验证码
    String code = generateCode();

    // 创建验证码记录
    SmsCode smsCode = new SmsCode();
    smsCode.setPhone(phone);
    smsCode.setCode(code);
    smsCode.setType(type);
    smsCode.setExpireTime(LocalDateTime.now().plusMinutes(EXPIRE_MINUTES));
    smsCode.setUsed(false);

    // 保存验证码记录
    this.save(smsCode);

    // TODO: 这里需要集成实际的短信发送服务
    // 模拟发送短信
    System.out.println("发送验证码到手机号: " + phone + ", 验证码: " + code);

    return Result.ok("验证码已发送");
  }

  @Override
  public Result verifyCode(String phone, String code, String type) {
    // 查询最新的未使用的验证码记录
    LambdaQueryWrapper<SmsCode> queryWrapper = new LambdaQueryWrapper<>();
    queryWrapper.eq(SmsCode::getPhone, phone)
        .eq(SmsCode::getCode, code)
        .eq(SmsCode::getType, type)
        .eq(SmsCode::getUsed, false)
        .gt(SmsCode::getExpireTime, LocalDateTime.now())
        .orderByDesc(SmsCode::getCreateTime)
        .last("LIMIT 1");

    SmsCode smsCode = this.getOne(queryWrapper);

    if (smsCode == null) {
      return Result.build(null, 400, "验证码无效或已过期");
    }

    // 标记验证码为已使用
    smsCode.setUsed(true);
    this.updateById(smsCode);

    return Result.ok("验证成功");
  }

  private String generateCode() {
    Random random = new Random();
    StringBuilder code = new StringBuilder();
    for (int i = 0; i < CODE_LENGTH; i++) {
      code.append(random.nextInt(10));
    }
    return code.toString();
  }
}