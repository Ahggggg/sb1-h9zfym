import { Prompt } from '../types';
import { OpenAIService } from './api/openai';
import { AnthropicService } from './api/anthropic';
import { useApiKeyStore } from '../store/apiKeyStore';

const SYSTEM_PROMPTS = {
  judge: `You are an expert prompt evaluator. Analyze the given prompt and rate it on a scale of 1-10 for clarity, specificity, and actionability.`,
  improver: `You are an expert prompt engineer. Your task is to improve the given prompt by making it more specific, clear, and actionable.`,
  orchestrator: `You are a workflow orchestrator. Analyze the prompt and determine the best sequence of optimization steps.`,
};

export class PromptOptimizer {
  private static async validateApiKeys(): Promise<void> {
    const store = useApiKeyStore.getState();
    if (!store.validateApiKeys()) {
      throw new Error('Please provide both OpenAI and Anthropic API keys');
    }
  }

  static async optimize(inputPrompt: string): Promise<Prompt> {
    try {
      await this.validateApiKeys();
      
      const { apiKeys } = useApiKeyStore.getState();
      
      // Ensure API keys exist before creating clients
      if (!apiKeys.openai || !apiKeys.anthropic) {
        throw new Error('API keys are required');
      }

      const openai = new OpenAIService(apiKeys.openai);
      const anthropic = new AnthropicService(apiKeys.anthropic);

      try {
        // Step 1: Initial evaluation with Claude
        const evaluation = await anthropic.generateResponse(
          inputPrompt,
          SYSTEM_PROMPTS.judge
        );

        // Step 2: Improvement generation with GPT-4
        const improvement = await openai.generateResponse(
          inputPrompt,
          SYSTEM_PROMPTS.improver
        );

        // Step 3: Final orchestration with Claude
        const finalResult = await anthropic.generateResponse(
          `Original: ${inputPrompt}\nEvaluation: ${evaluation.content}\nImprovement: ${improvement.content}`,
          SYSTEM_PROMPTS.orchestrator
        );

        return {
          input: inputPrompt,
          optimizedOutput: finalResult.content,
          status: 'complete'
        };
      } catch (error) {
        // Handle API-specific errors
        const errorMessage = error instanceof Error ? error.message : 'API request failed';
        throw new Error(`Failed to optimize prompt: ${errorMessage}`);
      }
    } catch (error) {
      return {
        input: inputPrompt,
        optimizedOutput: '',
        status: 'error',
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }
}