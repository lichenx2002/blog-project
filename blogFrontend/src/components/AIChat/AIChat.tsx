import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from './AIChat.module.css';
import { motion } from 'framer-motion';
import { aiAssistantConfig, generateSystemPrompt } from '@/config/aiAssistant';

/**
 * 消息接口定义
 * @property id - 消息唯一标识
 * @property content - 消息内容
 * @property type - 消息类型：用户消息或AI回复
 * @property timestamp - 消息时间戳
 */
interface Message {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
}

/**
 * 代码块组件属性接口
 * @property className - 代码块类名
 * @property children - 代码内容
 * @property inline - 是否为行内代码
 */
interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
  inline?: boolean;
  [key: string]: any;
}

/**
 * AI聊天组件
 * 提供与AI助手的交互界面，支持Markdown渲染和代码高亮
 */
const AIChat: React.FC = () => {
  // 状态管理
  const [messages, setMessages] = useState<Message[]>([]); // 消息列表状态
  const [input, setInput] = useState(''); // 输入框内容状态
  const [isLoading, setIsLoading] = useState(false); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误信息状态
  const [streamingMessage, setStreamingMessage] = useState<string>('');

  // DOM引用
  const messagesEndRef = useRef<HTMLDivElement>(null); // 消息容器底部引用，用于滚动
  const inputRef = useRef<HTMLTextAreaElement>(null); // 输入框引用，用于高度自适应
  const messagesContainerRef = useRef<HTMLDivElement>(null); // 消息容器引用，用于滚动控制
  const isInitialMount = useRef(true); // 初始加载标志，防止首次加载时滚动

  // API配置
  const apiEndpoint = '你的地址';
  const apiKey = '你的API密钥';

  /**
   * 滚动到底部函数
   * 将消息容器滚动到最新消息位置
   */
  const scrollToBottom = () => {
    if (messagesContainerRef.current && !isInitialMount.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  // 监听消息变化，自动滚动到底部
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // 组件挂载后设置初始加载标志
  useEffect(() => {
    isInitialMount.current = false;
  }, []);

  // 输入框高度自适应
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  /**
   * 处理表单提交
   * 发送用户消息并获取AI回复
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    setStreamingMessage('');

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: generateSystemPrompt()
            },
            ...messages.map(msg => ({
              role: msg.type === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content: userMessage.content }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalContent = '';

      if (!reader) {
        throw new Error('No reader available');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              const finalMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: finalContent
                  .replace(/\r\n/g, '\n')
                  .split('\n')
                  .map(line => line.trim())
                  .filter(line => line.length > 0)
                  .join('\n'),
                type: 'ai',
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, finalMessage]);
              setStreamingMessage('');
              break;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                finalContent += content;
                setStreamingMessage(finalContent
                  .replace(/\r\n/g, '\n')
                  .split('\n')
                  .map(line => line.trim())
                  .filter(line => line.length > 0)
                  .join('\n'));
              }
            } catch (e) {
              console.error('Error parsing stream data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('AI response error:', error);
      setError('发生错误，请稍后再试');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，发生了一些错误。请稍后再试。',
        type: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理键盘事件
   * 支持Enter发送消息，Shift+Enter换行
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const renderMarkdown = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p style={{
              margin: '0.2em 0',
              lineHeight: '1.6',
              fontSize: '1rem'
            }}>
              {children}
            </p>
          ),
          code({ className, children, ...props }: CodeBlockProps) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                style={vscDarkPlus as any}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: '0.5em 0',
                  padding: '1em',
                  borderRadius: '4px',
                  background: 'rgba(0, 0, 0, 0.1)'
                }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className={className}
                style={{
                  padding: '0.2em 0.4em',
                  background: 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '3px',
                  fontSize: '0.9em'
                }}
                {...props}
              >
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote style={{
              margin: '0.5em 0',
              padding: '0.5em 1em',
              borderLeft: '4px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(0, 0, 0, 0.1)'
            }}>
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul style={{
              margin: '0.5em 0',
              paddingLeft: '1.5em'
            }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{
              margin: '0.5em 0',
              paddingLeft: '1.5em'
            }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ margin: '0.25em 0' }}>
              {children}
            </li>
          ),
          h1: ({ children }) => <h1 style={{ margin: '1em 0 0.5em', lineHeight: '1.4' }}>{children}</h1>,
          h2: ({ children }) => <h2 style={{ margin: '1em 0 0.5em', lineHeight: '1.4' }}>{children}</h2>,
          h3: ({ children }) => <h3 style={{ margin: '1em 0 0.5em', lineHeight: '1.4' }}>{children}</h3>,
          h4: ({ children }) => <h4 style={{ margin: '1em 0 0.5em', lineHeight: '1.4' }}>{children}</h4>,
          h5: ({ children }) => <h5 style={{ margin: '1em 0 0.5em', lineHeight: '1.4' }}>{children}</h5>,
          h6: ({ children }) => <h6 style={{ margin: '1em 0 0.5em', lineHeight: '1.4' }}>{children}</h6>
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div className={styles.chatContainer}>
      {/* 聊天头部 */}
      <motion.div
        className={styles.chatHeader}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          小熙的空间
        </motion.h1>
      </motion.div>

      {/* 错误提示 */}
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {/* 消息容器 */}
      <motion.div
        className={styles.messagesContainer}
        ref={messagesContainerRef}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.1
            }
          }
        }}
      >
        {/* 欢迎消息 */}
        {messages.length === 0 && (
          <motion.div
            className={styles.welcomeMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
          >
            <span>你好！欢迎来到孤芳不自赏的博客，我是小熙，有什么不懂的可以问我！</span>😊
          </motion.div>
        )}

        {/* 消息列表 */}
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.1
            }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={message.type === 'user' ? styles.userMessageContainer : styles.aiMessageContainer}
          >
            {/* 消息气泡 */}
            <motion.div
              className={`${styles.message} ${message.type === 'user' ? styles.userMessage : styles.aiMessage}`}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.messageContent}>
                {/* AI消息使用Markdown渲染 */}
                {message.type === 'ai' ? (
                  renderMarkdown(message.content)
                ) : (
                  message.content
                )}
              </div>
            </motion.div>
            {/* 消息时间戳 */}
            <motion.div
              className={styles.messageTime}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {message.timestamp.toLocaleTimeString()}
            </motion.div>
          </motion.div>
        ))}

        {isLoading && streamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={styles.aiMessageContainer}
          >
            <motion.div
              className={`${styles.message} ${styles.aiMessage}`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.messageContent}>
                {renderMarkdown(streamingMessage)}
              </div>
            </motion.div>
          </motion.div>
        )}

        {isLoading && !streamingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${styles.message} ${styles.aiMessage}`}
          >
            <div className={styles.loadingDots}>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >.</motion.span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >.</motion.span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
              >.</motion.span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </motion.div>

      {/* 输入表单 */}
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="快告诉我你的疑惑吧~😁 (按 Enter 发送，Shift + Enter 换行)"
          className={styles.input}
          disabled={isLoading}
          rows={1}
        />
        <button type="submit" className={styles.sendButton} disabled={isLoading}>
          发送
        </button>
      </form>
    </div>
  );
};

export default AIChat; 
