package com.example.blogbackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.blogbackend.entity.Result;
import com.example.blogbackend.entity.User;
import com.example.blogbackend.dto.UserDTO;

/**
 * @author Junjun
 * @description 针对表【news_user】的数据库操作Service
 * @createDate 2025-04-06 16:24:18
 */
public interface IUserService extends IService<User> {

    Result login(User user);

    Result register(UserDTO userDTO);

    /**
     * 使用手机号登录
     * 
     * @param phone 手机号
     * @param code  验证码
     * @return 登录结果
     */
    Result loginByPhone(String phone, String code);

    /**
     * 绑定手机号
     * 
     * @param userId 用户ID
     * @param phone  手机号
     * @param code   验证码
     * @return 绑定结果
     */
    Result bindPhone(Integer userId, String phone, String code);

    Result getUserList();

    Result getUserById(Integer id);

    Result updateUser(Integer id, UserDTO userDTO);

    Result deleteUser(Integer id);
}
