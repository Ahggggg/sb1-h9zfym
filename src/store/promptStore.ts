import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Prompt, PromptHistory } from '../types';
import { PromptOptimizer } from '../services/promptOptimizer';

interface PromptStore {
  history: PromptHistory[];
  currentPrompt: string;
  isProcessing: boolean;
  error: string | null;
  setCurrentPrompt: (prompt: string) => void;
  addToHistory: (promptHistory: PromptHistory) => void;
  setProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
  optimizePrompt: () => Promise<void>;
  clearHistory: () => void;
}

export const usePromptStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      history: [],
      currentPrompt: '',
      isProcessing: false,
      error: null,
      setCurrentPrompt: (prompt) => set({ currentPrompt: prompt, error: null }),
      addToHistory: (promptHistory) =>
        set((state) => ({ history: [promptHistory, ...state.history] })),
      setProcessing: (processing) => set({ isProcessing: processing }),
      setError: (error) => set({ error }),
      optimizePrompt: async () => {
        const { currentPrompt } = get();
        if (!currentPrompt.trim()) return;

        set({ isProcessing: true, error: null });

        try {
          const result = await PromptOptimizer.optimize(currentPrompt);
          
          const historyEntry: PromptHistory = {
            id: nanoid(),
            timestamp: Date.now(),
            prompt: result
          };

          set((state) => ({
            history: [historyEntry, ...state.history],
            isProcessing: false,
            currentPrompt: '',
            error: result.status === 'error' ? result.error : null
          }));
        } catch (error) {
          set({
            isProcessing: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
          });
        }
      },
      clearHistory: () => set({ history: [] })
    }),
    {
      name: 'prompt-storage'
    }
  )
);