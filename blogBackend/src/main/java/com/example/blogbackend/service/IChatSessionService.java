package com.example.blogbackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.blogbackend.entity.ChatSession;
import java.util.List;

public interface IChatSessionService extends IService<ChatSession> {
    List<ChatSession> getSessionsByUserId(Integer userId);
}