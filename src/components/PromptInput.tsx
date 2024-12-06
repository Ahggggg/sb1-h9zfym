import React from 'react';
import { Send, Trash2 } from 'lucide-react';
import { usePromptStore } from '../store/promptStore';

export const PromptInput: React.FC = () => {
  const { 
    currentPrompt, 
    setCurrentPrompt, 
    isProcessing, 
    optimizePrompt,
    error,
    clearHistory 
  } = usePromptStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPrompt.trim() || isProcessing) return;
    await optimizePrompt();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <textarea
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full min-h-[120px] p-4 pr-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-y"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!currentPrompt.trim() || isProcessing}
            className="absolute right-3 bottom-3 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={clearHistory}
          className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
          <span>Clear History</span>
        </button>
      </div>
    </div>
  );
};