// OpenAI client config
import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // Add timeout and retry configuration
  timeout: 30000, // 30 seconds
  maxRetries: 3,
});

// Runtime check for missing API key
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is missing from environment variables');
  throw new Error('OpenAI API key is not configured');
}

// Rate limiting helper
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Wrapper function with rate limiting
export async function makeOpenAIRequest<T>(
  requestFn: () => Promise<T>,
  retries = 3
): Promise<T> {
  try {
    return await requestFn();
  } catch (error: any) {
    if (error.status === 429 && retries > 0) {
      // Exponential backoff for rate limiting
      const delayMs = Math.pow(2, 3 - retries) * 1000; // 1s, 2s, 4s
      console.log(`Rate limited. Retrying in ${delayMs}ms...`);
      await delay(delayMs);
      return makeOpenAIRequest(requestFn, retries - 1);
    }
    throw error;
  }
}
