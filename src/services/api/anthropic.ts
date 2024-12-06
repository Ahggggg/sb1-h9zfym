import { Anthropic } from '@anthropic-ai/sdk';
import { ApiResponse } from '../../types/api';
import { RateLimiter } from '../utils/rateLimiter';

const rateLimiter = new RateLimiter(3, 1000); // 3 requests per second

export class AnthropicService {
  private client: Anthropic;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Anthropic API key is required');
    }

    this.client = new Anthropic({
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

      const response = await this.client.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${prompt}` }
        ],
      });

      if (!response.content[0]?.text) {
        throw new Error('No response received from Anthropic');
      }

      return {
        content: response.content[0].text,
        model: response.model,
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Anthropic API error: ${error.message}`);
      }
      throw new Error('Unknown error occurred while calling Anthropic API');
    }
  }
}