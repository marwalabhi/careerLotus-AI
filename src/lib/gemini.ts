// Gemini client config
import { GoogleGenerativeAI } from '@google/generative-ai';

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Runtime check for missing API key
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is missing from environment variables');
  throw new Error('Gemini API key is not configured');
}
interface GeminiApiError extends Error {
  status?: number;
  statusText?: string;
  message: string;
  retries: number;
}
// Rate limiting helper
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Wrapper function with rate limiting
export async function makeGeminiRequest<T>(requestFn: () => Promise<T>, retries = 3): Promise<T> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }
  try {
    return await requestFn();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('erro obj', error);

      if ((error as GeminiApiError).status === 429 && retries > 0) {
        // Exponential backoff for rate limiting
        const delayMs = Math.pow(2, 3 - retries) * 1000; // 1s, 2s, 4s
        console.log(`Rate limited. Retrying in ${delayMs}ms...`);
        await delay(delayMs);
        return makeGeminiRequest(requestFn, retries - 1);
      }
    }
    throw error;
  }
}
// Helper function to convert OpenAI-style messages to Gemini format
export function convertMessagesToGeminiFormat(messages: Array<{ role: string; content: string }>) {
  // Filter out system messages and convert to Gemini format
  const geminiMessages = messages
    .filter((msg) => msg.role !== 'system')
    .map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

  // Get system prompt from the first system message
  const systemPrompt = messages.find((msg) => msg.role === 'system')?.content || '';

  return {
    messages: geminiMessages,
    systemInstruction: systemPrompt,
  };
}
