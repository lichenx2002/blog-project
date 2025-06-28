package com.example.blogbackend.controller;

import com.example.blogbackend.entity.AiChatSessions;
import com.example.blogbackend.entity.Result;
import com.example.blogbackend.entity.ResultCodeEnum;
import com.example.blogbackend.service.IAiChatSessionsService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * <p>
 * AI对话会话表 前端控制器
 * </p>
 *
 * @author author
 * @since 2025-06-28
 */
@RestController
@RequestMapping("/ai-chat-sessions")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class AiChatSessionsController {

    @Autowired
    private IAiChatSessionsService aiChatSessionsService;

    /**
     * 获取用户的所有会话列表
     */
    @GetMapping("/user/{userId}")
    public Result getSessionsByUserId(@PathVariable Integer userId) {
        try {
            QueryWrapper<AiChatSessions> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("user_id", userId)
                    .orderByDesc("updated_at");
            List<AiChatSessions> sessions = aiChatSessionsService.list(queryWrapper);
            return Result.ok(sessions);
        } catch (Exception e) {
            return Result.build(null, ResultCodeEnum.FAIL).message("获取会话列表失败: " + e.getMessage());
        }
    }

    /**
     * 创建新会话
     */
    @PostMapping
    public Result createSession(@RequestBody AiChatSessions session) {
        try {
            // 设置创建时间和更新时间
            LocalDateTime now = LocalDateTime.now();
            session.setCreatedAt(now);
            session.setUpdatedAt(now);

            // 如果没有设置标题，使用默认标题
            if (session.getTitle() == null || session.getTitle().trim().isEmpty()) {
                session.setTitle("新对话");
            }

            boolean saved = aiChatSessionsService.save(session);
            if (saved) {
                return Result.ok(session);
            } else {
                return Result.build(null, ResultCodeEnum.FAIL).message("创建会话失败");
            }
        } catch (Exception e) {
            return Result.build(null, ResultCodeEnum.FAIL).message("创建会话失败: " + e.getMessage());
        }
    }

    /**
     * 更新会话标题
     */
    @PutMapping("/{sessionId}")
    public Result updateSessionTitle(@PathVariable Integer sessionId, @RequestBody AiChatSessions session) {
        try {
            AiChatSessions existingSession = aiChatSessionsService.getById(sessionId);
            if (existingSession == null) {
                return Result.build(null, ResultCodeEnum.FAIL).message("会话不存在");
            }

            existingSession.setTitle(session.getTitle());
            existingSession.setUpdatedAt(LocalDateTime.now());

            boolean updated = aiChatSessionsService.updateById(existingSession);
            if (updated) {
                return Result.ok(existingSession);
            } else {
                return Result.build(null, ResultCodeEnum.FAIL).message("更新会话失败");
            }
        } catch (Exception e) {
            return Result.build(null, ResultCodeEnum.FAIL).message("更新会话失败: " + e.getMessage());
        }
    }

    /**
     * 删除会话
     */
    @DeleteMapping("/{sessionId}")
    public Result deleteSession(@PathVariable Integer sessionId) {
        try {
            boolean removed = aiChatSessionsService.removeById(sessionId);
            if (removed) {
                return Result.ok("删除成功");
            } else {
                return Result.build(null, ResultCodeEnum.FAIL).message("删除会话失败");
            }
        } catch (Exception e) {
            return Result.build(null, ResultCodeEnum.FAIL).message("删除会话失败: " + e.getMessage());
        }
    }

    /**
     * 获取单个会话详情
     */
    @GetMapping("/{sessionId}")
    public Result getSessionById(@PathVariable Integer sessionId) {
        try {
            AiChatSessions session = aiChatSessionsService.getById(sessionId);
            if (session != null) {
                return Result.ok(session);
            } else {
                return Result.build(null, ResultCodeEnum.FAIL).message("会话不存在");
            }
        } catch (Exception e) {
            return Result.build(null, ResultCodeEnum.FAIL).message("获取会话详情失败: " + e.getMessage());
        }
    }
}