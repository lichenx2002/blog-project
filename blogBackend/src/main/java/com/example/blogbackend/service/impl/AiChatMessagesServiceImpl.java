package com.example.blogbackend.service.impl;

import com.example.blogbackend.entity.AiChatMessages;
import com.example.blogbackend.mapper.AiChatMessagesMapper;
import com.example.blogbackend.service.IAiChatMessagesService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * AI对话消息表 服务实现类
 * </p>
 *
 * @author author
 * @since 2025-06-28
 */
@Service
public class AiChatMessagesServiceImpl extends ServiceImpl<AiChatMessagesMapper, AiChatMessages> implements IAiChatMessagesService {

    @Override
    public List<AiChatMessages> getMessagesBySessionId(Integer sessionId) {
        QueryWrapper<AiChatMessages> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("session_id", sessionId)
                .orderByAsc("created_at");
        return this.list(queryWrapper);
    }

    @Override
    public boolean saveMessagesBatch(List<AiChatMessages> messages) {
        return this.saveBatch(messages);
    }
}