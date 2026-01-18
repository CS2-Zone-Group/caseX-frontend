"use client";

import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/authStore";
import { ChatUI } from "./chatUI";

export default function ChatSupport() {
  const { isChatOpen, openChat, closeChat } = useChatStore();
  const { user, hasHydrated, token } = useAuthStore();
  
  const isLoggedIn = hasHydrated && !!user && !!token;

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Chat Support Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[100] group print:hidden">
        <button
          onClick={openChat}
          className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105 border-2 border-white dark:border-gray-800 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          title="Support Chat"
          aria-label="Open support chat"
        >
          {/* Pulse animation ring */}
          <div className="absolute inset-0 rounded-full bg-primary-600 animate-ping opacity-20"></div>
          
          <svg 
            className="relative w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
        </button>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-3 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg z-10">
          Support Chat
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      </div>

      {/* Chat UI */}
      <ChatUI isOpen={isChatOpen} closeChat={closeChat} />
    </>
  );
}