import { create } from 'zustand';
import type { Conversation, Message } from '../types';
import { initialConversations, generateId } from '../data/mockData';

interface MessageStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string) => void;
  markAsRead: (conversationId: string) => void;
}

const getTimeString = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const useMessageStore = create<MessageStore>((set) => ({
  conversations: initialConversations,
  activeConversationId: null,
  setActiveConversation: (id) => set({ activeConversationId: id }),
  sendMessage: (conversationId, text) =>
    set((state) => {
      const newMsg: Message = {
        id: generateId(),
        conversationId,
        sender: 'user',
        text,
        timestamp: getTimeString(),
      };
      return {
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [...c.messages, newMsg],
                lastMessage: text,
                lastMessageTime: 'Just now',
              }
            : c
        ),
      };
    }),
  markAsRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unread: false } : c
      ),
    })),
}));
