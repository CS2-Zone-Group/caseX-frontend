"use client"
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { io, Socket } from 'socket.io-client';
import api from '@/lib/api';

interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'support';
  type?: 'message' | 'welcome' | 'close';
  createdAt: string;
}

interface SupportChatProps {
  isOpen: boolean;
  closeChat: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

type ChatState = 'loading' | 'idle' | 'starting' | 'active' | 'ending';

export const ChatUI: React.FC<SupportChatProps> = ({ isOpen, closeChat }) => {
  const t = useTranslations('Chat');
  const [state, setState] = useState<ChatState>('loading');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Reset inactivity timer — auto-close after 5 min
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(async () => {
      try {
        await api.post('/support/end');
      } catch {
        // silent
      }
      setState('idle');
      setMessages([]);
    }, INACTIVITY_TIMEOUT);
  }, []);

  // Clear timer when not active
  useEffect(() => {
    if (state !== 'active') {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    }
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [state]);

  // Fetch conversation status on open
  useEffect(() => {
    if (!isOpen) return;

    setState('loading');
    api.get('/support/status')
      .then(({ data }) => {
        if (data.active) {
          setMessages(data.messages || []);
          setState('active');
          resetInactivityTimer();
        } else {
          setState('idle');
        }
      })
      .catch(() => {
        setState('idle');
      });
  }, [isOpen, resetInactivityTimer]);

  // WebSocket connection
  useEffect(() => {
    if (!isOpen) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(`${API_BASE}/support`, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('newMessage', (msg: ChatMessage) => {
      if (msg.type === 'close') {
        setState('idle');
        setMessages([]);
        return;
      }

      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });

      // If idle and received a message (admin reopened), switch to active
      setState(prev => prev === 'idle' ? 'active' : prev);
      resetInactivityTimer();
    });

    socket.on('conversationEnded', () => {
      setState('idle');
      setMessages([]);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isOpen, resetInactivityTimer]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start conversation
  const handleStartConversation = async () => {
    setState('starting');
    try {
      const { data } = await api.post('/support/start');
      setMessages(data.messages || []);
      setState('active');
      resetInactivityTimer();
    } catch {
      setState('idle');
    }
  };

  // End conversation
  const handleEndConversation = async () => {
    setState('ending');
    try {
      await api.post('/support/end');
    } catch {
      // silent
    }
    setState('idle');
    setMessages([]);
  };

  // Send message
  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const text = input.trim();
    setInput('');
    setSending(true);

    try {
      const { data } = await api.post('/support/message', { message: text });
      if (data.message) {
        setMessages(prev => {
          if (prev.some(m => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
      }
      resetInactivityTimer();
    } catch {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        message: t('messageError'),
        sender: 'support',
        type: 'message' as const,
        createdAt: new Date().toISOString(),
      }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Tashkent',
    });
  };

  const getMessageText = (msg: ChatMessage) => {
    if (msg.type === 'welcome') return t('welcomeMessage');
    return msg.message;
  };

  return (
    <div className="fixed inset-0 sm:bottom-4 sm:right-4 sm:inset-auto z-[200]
                  w-full h-full sm:w-96 sm:h-[85vh] md:h-[90vh]
                  flex flex-col
                  bg-white dark:bg-gray-900
                  text-gray-900 dark:text-gray-100
                  border border-gray-200 dark:border-gray-800
                  sm:rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden
                  sm:max-h-[calc(100vh-2rem)]">

      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <Image src="/logo-icon.png" alt="CaseX" width={40} height={40} className="rounded-lg" />
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
              CaseX Robot
            </span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {state === 'active' && (
            <button
              onClick={handleEndConversation}
              className="text-xs px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors font-medium"
            >
              {t('endChat')}
            </button>
          )}
          <button
            onClick={closeChat}
            className="w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors text-gray-500 dark:text-white"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Body */}
      {state === 'loading' ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : state === 'idle' || state === 'starting' || state === 'ending' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
          <Image src="/logo-icon.png" alt="CaseX" width={80} height={80} className="rounded-2xl opacity-80" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              {t('supportTitle')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('supportDescription')}
            </p>
          </div>
          <button
            onClick={handleStartConversation}
            disabled={state === 'starting' || state === 'ending'}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {state === 'starting' ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <SendIcon fontSize="small" />
            )}
            {t('startChat')}
          </button>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-white dark:bg-gray-900">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col gap-0.5">
                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-sm border dark:border-gray-700 ${
                    msg.sender === 'support'
                      ? 'bg-gray-100 dark:bg-gray-800 rounded-tl-none self-start'
                      : 'bg-primary-600 text-white rounded-tr-none self-end'
                  }`}
                >
                  {getMessageText(msg)}
                </div>
                <span className={`text-[10px] text-gray-400 ${
                  msg.sender === 'user' ? 'self-end' : 'self-start'
                }`}>
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 bg-gray-50 dark:bg-gray-900">
            <div className="flex-1 relative flex items-center bg-gray-200 dark:bg-gray-800 border border-transparent focus-within:border-primary-600 dark:focus-within:border-primary-500 rounded-full transition-all">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                type="text"
                placeholder={t('inputPlaceholder')}
                className="w-full py-2 px-4 text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500"
                disabled={sending}
                autoFocus
              />
              <div className="pr-3 flex items-center justify-center min-w-[40px]">
                {input.trim() ? (
                  <button
                    onClick={handleSend}
                    disabled={sending}
                    className="hover:scale-110 transition-transform disabled:opacity-50"
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <SendIcon className="text-primary-600 dark:text-primary-500" />
                    )}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
