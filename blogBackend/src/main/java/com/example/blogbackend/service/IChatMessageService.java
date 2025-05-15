package com.example.blogbackend.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.blogbackend.entity.ChatMessage;
import java.util.List;

public interface IChatMessageService extends IService<ChatMessage> {
    List<ChatMessage> getMessagesBySessionId(Integer sessionId);
}