"use client"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface SupportChatProps {
    isOpen: boolean;
    closeChat: () => void;
  }

  export const ChatUI: React.FC<SupportChatProps> = ({ isOpen, closeChat }) => {
    const t = useTranslations('Chat');
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Array<{ id: number; text: string; sender: string; timestamp: Date }>>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const initializedRef = useRef(false);

    useEffect(() => {
      if (!initializedRef.current) {
        setMessages([
          { id: 1, text: t('welcomeMessage'), sender: "support", timestamp: new Date() }
        ]);
        initializedRef.current = true;
      }
    }, [t]);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
      if (message.trim()) {
        const newMessage = {
          id: messages.length + 1,
          text: message.trim(),
          sender: "user",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        setMessage("");

        setTimeout(() => {
          const supportResponse = {
            id: messages.length + 2,
            text: t('autoReply'),
            sender: "support",
            timestamp: new Date()
          };
          setMessages(prev => [...prev, supportResponse]);
        }, 1000);
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 sm:bottom-4 sm:right-4 sm:inset-auto z-[200]
                    w-full h-full sm:w-96 sm:h-[85vh] md:h-[90vh]
                    flex flex-col
                    bg-white dark:bg-gray-900
                    text-gray-900 dark:text-gray-100
                    border border-gray-200 dark:border-gray-800
                    sm:rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden
                    sm:max-h-[calc(100vh-2rem)]">

      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
            CaseX
          </span>
        </div>
        <div className='hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors text-gray-500 dark:text-white'>
          <button
            onClick={closeChat}
            className="w-10 h-10 "
            >
            <KeyboardArrowDownIcon />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-white dark:bg-gray-900">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-sm border dark:border-gray-700 ${
              msg.sender === 'support'
                ? 'bg-gray-100 dark:bg-gray-800 rounded-tl-none self-start'
                : 'bg-primary-600 text-white rounded-tr-none self-end'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 bg-gray-50 dark:bg-gray-900">
        <label className="cursor-pointer group">
          <input type="file" className="hidden" />
          <AttachFileIcon className="text-gray-400 group-hover:text-primary-600 transition-colors transform rotate-45" />
        </label>

        <div className="flex-1 relative flex items-center bg-gray-200 dark:bg-gray-800 border border-transparent focus-within:border-primary-600 dark:focus-within:border-primary-500 rounded-full transition-all">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            type="text"
            placeholder={t('inputPlaceholder')}
            className="w-full py-2 px-4 text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500"
          />
          <div className="pr-3 flex items-center justify-center min-w-[40px]">
            {message.trim() ? (
              <button
                onClick={handleSendMessage}
                className="animate-in fade-in zoom-in duration-200 hover:scale-110 transition-transform"
              >
                <SendIcon className="text-primary-600 dark:text-primary-500 cursor-pointer" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
    );
  };
