package com.example.blogbackend.controller;

import com.example.blogbackend.entity.ChatSession;
import com.example.blogbackend.entity.ChatMessage;
import com.example.blogbackend.entity.Result;
import com.example.blogbackend.service.IChatSessionService;
import com.example.blogbackend.service.IChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "false")
public class ChatController {
    @Autowired
    private IChatSessionService chatSessionService;
    @Autowired
    private IChatMessageService chatMessageService;

    @GetMapping("/sessions/{userId}")
    public Result getSessions(@PathVariable Integer userId) {
        List<ChatSession> sessions = chatSessionService.getSessionsByUserId(userId);
        return Result.ok(sessions);
    }

    @PostMapping("/session")
    public Result createSession(@RequestBody ChatSession session) {
        chatSessionService.save(session);
        return Result.ok(session);
    }

    @GetMapping("/messages/{sessionId}")
    public Result getMessages(@PathVariable Integer sessionId) {
        List<ChatMessage> messages = chatMessageService.getMessagesBySessionId(sessionId);
        return Result.ok(messages);
    }

    @PostMapping("/message")
    public Result saveMessage(@RequestBody ChatMessage message) {
        chatMessageService.save(message);
        return Result.ok(message);
    }
}