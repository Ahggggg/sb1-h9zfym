import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { usePromptStore } from '../store/promptStore';

export const PromptHistory: React.FC = () => {
  const { history } = usePromptStore();

  if (history.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Clock className="mx-auto mb-2" size={24} />
        <p>No prompt history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">
              {new Date(item.timestamp).toLocaleString()}
            </div>
            <div className="flex items-center space-x-2">
              {item.prompt.status === 'complete' ? (
                <CheckCircle className="text-green-500" size={16} />
              ) : (
                <XCircle className="text-red-500" size={16} />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-medium">Original Prompt:</div>
            <div className="text-gray-700 bg-gray-50 p-3 rounded">
              {item.prompt.input}
            </div>
            <div className="font-medium">Optimized Output:</div>
            <div className="text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
              {item.prompt.optimizedOutput || item.prompt.error}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};