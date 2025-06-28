import { useState, useEffect, useCallback } from 'react';
import { AIChatAPI } from '@/api/AIChatAPI';
import { Message, AiChatSession } from '@/types/AIChat';
import { convertBackendMessagesToFrontend, convertFrontendMessageToBackend } from '@/utils/aiChatUtils';

interface UseAIChatProps {
    userId: number;
}

interface UseAIChatReturn {
    // 状态
    sessions: AiChatSession[];
    currentSession: AiChatSession | null;
    messages: Message[];
    isLoading: boolean;
    error: string | null;

    // 会话管理
    loadSessions: () => Promise<void>;
    createNewSession: () => Promise<AiChatSession | null>;
    selectSession: (sessionId: number) => Promise<void>;
    deleteSession: (sessionId: number) => Promise<void>;
    updateSessionTitle: (sessionId: number, title: string) => Promise<void>;

    // 消息管理
    loadSessionMessages: (sessionId: number) => Promise<void>;
    saveMessage: (message: Message) => Promise<void>;
    saveMessagesBatch: (messages: Message[]) => Promise<void>;
    clearSessionMessages: (sessionId: number) => Promise<void>;
}

export const useAIChat = ({ userId }: UseAIChatProps): UseAIChatReturn => {
    const [sessions, setSessions] = useState<AiChatSession[]>([]);
    const [currentSession, setCurrentSession] = useState<AiChatSession | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 加载用户会话列表
    const loadSessions = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await AIChatAPI.getSessionsByUserId(userId);
            if (response.code === 200) {
                setSessions(response.data);
            } else {
                setError(response.message || '加载会话列表失败');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '加载会话列表失败');
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    // 创建新会话
    const createNewSession = useCallback(async (): Promise<AiChatSession | null> => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await AIChatAPI.createSession({
                userId,
                title: '新对话'
            });

            if (response.code === 200) {
                const newSession = response.data;
                setSessions(prev => [newSession, ...prev]);
                setCurrentSession(newSession);
                setMessages([]);
                return newSession;
            } else {
                setError(response.message || '创建会话失败');
                return null;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '创建会话失败');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    // 选择会话
    const selectSession = useCallback(async (sessionId: number) => {
        try {
            setIsLoading(true);
            setError(null);

            // 查找会话
            const session = sessions.find(s => s.id === sessionId);
            if (!session) {
                setError('会话不存在');
                return;
            }

            setCurrentSession(session);

            // 加载会话消息
            await loadSessionMessages(sessionId);
        } catch (err) {
            setError(err instanceof Error ? err.message : '选择会话失败');
        } finally {
            setIsLoading(false);
        }
    }, [sessions]);

    // 删除会话
    const deleteSession = useCallback(async (sessionId: number) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await AIChatAPI.deleteSession(sessionId);

            if (response.code === 200) {
                setSessions(prev => prev.filter(s => s.id !== sessionId));

                // 如果删除的是当前会话，清空当前会话
                if (currentSession?.id === sessionId) {
                    setCurrentSession(null);
                    setMessages([]);
                }
            } else {
                setError(response.message || '删除会话失败');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '删除会话失败');
        } finally {
            setIsLoading(false);
        }
    }, [currentSession]);

    // 更新会话标题
    const updateSessionTitle = useCallback(async (sessionId: number, title: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await AIChatAPI.updateSessionTitle(sessionId, { title });

            if (response.code === 200) {
                const updatedSession = response.data;
                setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));

                // 如果更新的是当前会话，更新当前会话
                if (currentSession?.id === sessionId) {
                    setCurrentSession(updatedSession);
                }
            } else {
                setError(response.message || '更新会话标题失败');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '更新会话标题失败');
        } finally {
            setIsLoading(false);
        }
    }, [currentSession]);

    // 加载会话消息
    const loadSessionMessages = useCallback(async (sessionId: number) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await AIChatAPI.getMessagesBySessionId(sessionId);

            if (response.code === 200) {
                const frontendMessages = convertBackendMessagesToFrontend(response.data);
                setMessages(frontendMessages);
            } else {
                setError(response.message || '加载消息失败');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '加载消息失败');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 保存单条消息
    const saveMessage = useCallback(async (message: Message) => {
        if (!currentSession) {
            setError('没有选择会话');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const backendMessage = convertFrontendMessageToBackend(message, currentSession.id);
            const response = await AIChatAPI.saveMessage(backendMessage);

            if (response.code === 200) {
                // 消息已保存到后端，前端状态保持不变
                console.log('消息保存成功');
            } else {
                setError(response.message || '保存消息失败');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '保存消息失败');
        } finally {
            setIsLoading(false);
        }
    }, [currentSession]);

    // 批量保存消息
    const saveMessagesBatch = useCallback(async (messagesToSave: Message[]) => {
        if (!currentSession) {
            setError('没有选择会话');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const backendMessages = messagesToSave.map(msg =>
                convertFrontendMessageToBackend(msg, currentSession.id)
            );

            const response = await AIChatAPI.saveMessagesBatch({ messages: backendMessages });

            if (response.code === 200) {
                console.log('批量保存消息成功');
            } else {
                setError(response.message || '批量保存消息失败');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '批量保存消息失败');
        } finally {
            setIsLoading(false);
        }
    }, [currentSession]);

    // 清空会话消息
    const clearSessionMessages = useCallback(async (sessionId: number) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await AIChatAPI.clearSessionMessages(sessionId);

            if (response.code === 200) {
                setMessages([]);
            } else {
                setError(response.message || '清空消息失败');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '清空消息失败');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 初始化时加载会话列表
    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    return {
        // 状态
        sessions,
        currentSession,
        messages,
        isLoading,
        error,

        // 会话管理
        loadSessions,
        createNewSession,
        selectSession,
        deleteSession,
        updateSessionTitle,

        // 消息管理
        loadSessionMessages,
        saveMessage,
        saveMessagesBatch,
        clearSessionMessages
    };
};