"use client";

import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/authStore";
import { ChatUI } from "./chatUI";

export default function ChatSupport() {
  const { isChatOpen, closeChat } = useChatStore();
  const { user, hasHydrated, token } = useAuthStore();

  const isLoggedIn = hasHydrated && !!user && !!token;

  if (!isLoggedIn) return null;

  return <ChatUI isOpen={isChatOpen} closeChat={closeChat} />;
}
