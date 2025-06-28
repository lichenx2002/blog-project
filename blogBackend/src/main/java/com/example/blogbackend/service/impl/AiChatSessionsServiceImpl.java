package com.example.blogbackend.service.impl;

import com.example.blogbackend.entity.AiChatSessions;
import com.example.blogbackend.mapper.AiChatSessionsMapper;
import com.example.blogbackend.service.IAiChatSessionsService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * AI对话会话表 服务实现类
 * </p>
 *
 * @author author
 * @since 2025-06-28
 */
@Service
public class AiChatSessionsServiceImpl extends ServiceImpl<AiChatSessionsMapper, AiChatSessions> implements IAiChatSessionsService {

    @Override
    public List<AiChatSessions> getSessionsByUserId(Integer userId) {
        QueryWrapper<AiChatSessions> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userId)
                .orderByDesc("updated_at");
        return this.list(queryWrapper);
    }

    @Override
    public boolean updateSessionTime(Integer sessionId) {
        AiChatSessions session = this.getById(sessionId);
        if (session != null) {
            session.setUpdatedAt(LocalDateTime.now());
            return this.updateById(session);
        }
        return false;
    }
}