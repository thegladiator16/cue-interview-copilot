import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  if (!client) client = new Anthropic({ apiKey });
  return client;
}

export const ANSWER_MODEL = "claude-sonnet-4-5";
