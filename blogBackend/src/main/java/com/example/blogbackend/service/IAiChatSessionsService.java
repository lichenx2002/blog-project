package com.example.blogbackend.service;

import com.example.blogbackend.entity.AiChatSessions;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

/**
 * <p>
 * AI对话会话表 服务类
 * </p>
 *
 * @author author
 * @since 2025-06-28
 */
public interface IAiChatSessionsService extends IService<AiChatSessions> {

    /**
     * 根据用户ID获取会话列表
     */
    List<AiChatSessions> getSessionsByUserId(Integer userId);

    /**
     * 更新会话的更新时间
     */
    boolean updateSessionTime(Integer sessionId);
}