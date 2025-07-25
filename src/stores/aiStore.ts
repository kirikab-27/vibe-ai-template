import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIStore {
  // State
  messages: ChatMessage[];
  isProcessing: boolean;
  currentModel: string;
  apiKey: string;
  
  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setProcessing: (processing: boolean) => void;
  setModel: (model: string) => void;
  setApiKey: (apiKey: string) => void;
  
  // Computed
  getLastUserMessage: () => ChatMessage | null;
  getLastAssistantMessage: () => ChatMessage | null;
}

export const useAIStore = create<AIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      messages: [],
      isProcessing: false,
      currentModel: 'claude-3-opus-20240229',
      apiKey: '',
      
      // Actions
      addMessage: (message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        };
        
        set((state) => ({
          messages: [...state.messages, newMessage]
        }));
      },
      
      clearMessages: () => set({ messages: [] }),
      
      setProcessing: (processing) => set({ isProcessing: processing }),
      
      setModel: (model) => set({ currentModel: model }),
      
      setApiKey: (apiKey) => set({ apiKey }),
      
      // Computed
      getLastUserMessage: () => {
        const { messages } = get();
        const userMessages = messages.filter(m => m.role === 'user');
        return userMessages[userMessages.length - 1] || null;
      },
      
      getLastAssistantMessage: () => {
        const { messages } = get();
        const assistantMessages = messages.filter(m => m.role === 'assistant');
        return assistantMessages[assistantMessages.length - 1] || null;
      },
    }),
    {
      name: 'ai-store',
      partialize: (state) => ({ 
        messages: state.messages,
        currentModel: state.currentModel,
        apiKey: state.apiKey,
      }),
    }
  )
);