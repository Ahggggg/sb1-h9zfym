import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiKeys, ApiKeysSchema } from '../types/api';

interface ApiKeyStore {
  apiKeys: Partial<ApiKeys>;
  setApiKey: (provider: keyof ApiKeys, key: string) => void;
  validateApiKeys: () => boolean;
  clearApiKeys: () => void;
}

export const useApiKeyStore = create<ApiKeyStore>()(
  persist(
    (set, get) => ({
      apiKeys: {},
      setApiKey: (provider, key) =>
        set((state) => ({
          apiKeys: { ...state.apiKeys, [provider]: key }
        })),
      validateApiKeys: () => {
        const result = ApiKeysSchema.safeParse(get().apiKeys);
        return result.success;
      },
      clearApiKeys: () => set({ apiKeys: {} })
    }),
    {
      name: 'api-keys-storage'
    }
  )
);