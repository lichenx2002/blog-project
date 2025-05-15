package com.example.blogbackend.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.blogbackend.entity.ChatMessage;
import com.example.blogbackend.mapper.ChatMessageMapper;
import com.example.blogbackend.service.IChatMessageService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatMessageServiceImpl extends ServiceImpl<ChatMessageMapper, ChatMessage> implements IChatMessageService {
    @Override
    public List<ChatMessage> getMessagesBySessionId(Integer sessionId) {
        return lambdaQuery().eq(ChatMessage::getSessionId, sessionId).orderByAsc(ChatMessage::getCreatedAt).list();
    }
}