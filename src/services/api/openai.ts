import OpenAI from 'openai';
import { ApiResponse } from '../../types/api';
import { RateLimiter } from '../utils/rateLimiter';

const rateLimiter = new RateLimiter(3, 1000); // 3 requests per second

export class OpenAIService {
  private client: OpenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.client = new OpenAI({ 
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  async generateResponse(
    prompt: string,
    systemPrompt: string
  ): Promise<ApiResponse> {
    try {
      await rateLimiter.waitForToken();

      const response = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      });

      const completion = response.choices[0]?.message?.content;
      if (!completion) {
        throw new Error('No completion received from OpenAI');
      }

      return {
        content: completion,
        model: response.model,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`OpenAI API error: ${error.message}`);
      }
      throw new Error('Unknown error occurred while calling OpenAI API');
    }
  }
}