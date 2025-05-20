package com.example.blogbackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.blogbackend.entity.ChatSession;
import com.example.blogbackend.mapper.ChatSessionMapper;
import com.example.blogbackend.service.IChatSessionService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatSessionServiceImpl extends ServiceImpl<ChatSessionMapper, ChatSession> implements IChatSessionService {
    @Override
    public List<ChatSession> getSessionsByUserId(Integer userId) {
        return lambdaQuery().eq(ChatSession::getUserId, userId).list();
    }
}