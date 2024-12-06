import { z } from 'zod';

export const ApiKeysSchema = z.object({
  openai: z.string().min(1, "OpenAI API key is required"),
  anthropic: z.string().min(1, "Claude API key is required")
});

export type ApiKeys = z.infer<typeof ApiKeysSchema>;

export interface ApiResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}