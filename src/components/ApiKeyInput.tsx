import React from 'react';
import { Key } from 'lucide-react';
import { useApiKeyStore } from '../store/apiKeyStore';

export const ApiKeyInput: React.FC = () => {
  const { apiKeys, setApiKey } = useApiKeyStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Key className="text-blue-500" size={20} />
        <h3 className="text-lg font-medium">API Keys</h3>
      </div>

      <div className="grid gap-4">
        <div>
          <label htmlFor="openai-key" className="block text-sm font-medium text-gray-700 mb-1">
            OpenAI API Key
          </label>
          <input
            id="openai-key"
            type="password"
            value={apiKeys.openai || ''}
            onChange={(e) => setApiKey('openai', e.target.value)}
            placeholder="sk-..."
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="anthropic-key" className="block text-sm font-medium text-gray-700 mb-1">
            Anthropic API Key
          </label>
          <input
            id="anthropic-key"
            type="password"
            value={apiKeys.anthropic || ''}
            onChange={(e) => setApiKey('anthropic', e.target.value)}
            placeholder="sk-ant-..."
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          />
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Your API keys are stored securely in your browser's local storage.
      </p>
    </div>
  );
};