"use client"
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { io, Socket } from 'socket.io-client';
import api from '@/lib/api';

interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'support';
  createdAt: string;
}

interface SupportChatProps {
  isOpen: boolean;
  closeChat: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const ChatUI: React.FC<SupportChatProps> = ({ isOpen, closeChat }) => {
  const t = useTranslations('Chat');
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = useCallback(async () => {
    try {
      const { data } = await api.get('/support/messages');
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch {
      // silent
    }
  }, []);

  // Load messages on open
  useEffect(() => {
    if (isOpen && !loaded) {
      setLoading(true);
      fetchMessages().then(() => {
        setLoaded(true);
        setLoading(false);
      });
    }
  }, [isOpen, loaded, fetchMessages]);

  // WebSocket connection
  useEffect(() => {
    if (!isOpen || !loaded) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(`${API_BASE}/support`, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('newMessage', (msg: ChatMessage) => {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isOpen, loaded]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const text = input.trim();
    setInput("");
    setSending(true);

    try {
      const { data } = await api.post('/support/message', { message: text });
      // Add sent message to local state immediately
      if (data.message) {
        setMessages(prev => {
          if (prev.some(m => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
      }
    } catch {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        message: t('messageError'),
        sender: 'support',
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
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        <button
          onClick={closeChat}
          className="w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors text-gray-500 dark:text-white"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-white dark:bg-gray-900">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="p-3 rounded-2xl max-w-[85%] text-sm shadow-sm border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-tl-none self-start">
            {t('welcomeMessage')}
          </div>
        ) : null}

        {!loading && messages.map((msg) => (
          <div key={msg.id} className="flex flex-col gap-0.5">
            <div
              className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-sm border dark:border-gray-700 ${
                msg.sender === 'support'
                  ? 'bg-gray-100 dark:bg-gray-800 rounded-tl-none self-start'
                  : 'bg-primary-600 text-white rounded-tr-none self-end'
              }`}
            >
              {msg.message}
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
        <label className="cursor-pointer group">
          <input type="file" className="hidden" />
          <AttachFileIcon className="text-gray-400 group-hover:text-primary-600 transition-colors transform rotate-45" />
        </label>

        <div className="flex-1 relative flex items-center bg-gray-200 dark:bg-gray-800 border border-transparent focus-within:border-primary-600 dark:focus-within:border-primary-500 rounded-full transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            type="text"
            placeholder={t('inputPlaceholder')}
            className="w-full py-2 px-4 text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500"
            disabled={sending}
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
    </div>
  );
};
