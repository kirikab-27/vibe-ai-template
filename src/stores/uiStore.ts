import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  // State
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // Initial state
      theme: 'light',
      sidebarOpen: true,
      isLoading: false,
      error: null,
      
      // Actions
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      reset: () => set({ 
        isLoading: false, 
        error: null 
      }),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({ 
        theme: state.theme, 
        sidebarOpen: state.sidebarOpen 
      }),
    }
  )
);