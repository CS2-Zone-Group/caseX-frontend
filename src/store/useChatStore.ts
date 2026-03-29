import {create} from "zustand"
import { useAuthStore } from "./authStore";
import { getCurrentLanguage } from "@/lib/language";
import { toast } from "@/store/toastStore";

interface ChatState {
    isChatOpen:boolean;
    toggleChat:()=>void;
    openChat:()=>void;
    closeChat:()=>void
}

export const useChatStore=create<ChatState>((set)=>({
    isChatOpen:false,
    toggleChat:()=>set((state)=>({isChatOpen:!state.isChatOpen})),
    closeChat:()=>set({isChatOpen:false}),
    openChat:()=>

        {
            const language = getCurrentLanguage();
            const authState = useAuthStore.getState(); 
            const { user, hasHydrated } = authState;
    
            if (!hasHydrated || !user) {
                const message = language === 'uz' ? 'Iltimos, avval tizimga kiring' : 
                                language === 'ru' ? 'Пожалуйста, сначала войдите в систему' : 
                                'Please login first';
                toast.info(message);
                return;
              }


        set({isChatOpen:true})
    }

}))