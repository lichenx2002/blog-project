package com.example.blogbackend.service;

import com.example.blogbackend.entity.AiChatMessages;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

/**
 * <p>
 * AI对话消息表 服务类
 * </p>
 *
 * @author author
 * @since 2025-06-28
 */
public interface IAiChatMessagesService extends IService<AiChatMessages> {

    /**
     * 根据会话ID获取消息列表
     */
    List<AiChatMessages> getMessagesBySessionId(Integer sessionId);

    /**
     * 批量保存消息
     */
    boolean saveMessagesBatch(List<AiChatMessages> messages);
}