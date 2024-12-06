import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { usePromptStore } from '../store/promptStore';

export const OptimizationStatus: React.FC = () => {
  const { isProcessing } = usePromptStore();

  if (!isProcessing) return null;

  return (
    <div className="flex items-center justify-center space-x-2 text-blue-600 my-4">
      <LoadingSpinner size={20} />
      <span>Optimizing your prompt...</span>
    </div>
  );
};