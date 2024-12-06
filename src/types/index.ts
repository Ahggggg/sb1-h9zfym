export interface Prompt {
  input: string;
  optimizedOutput: string;
  status: 'idle' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface PromptHistory {
  id: string;
  timestamp: number;
  prompt: Prompt;
}