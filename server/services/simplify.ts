import OpenAI from "openai";
import type { SimplifiedResult } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SIMPLIFY_SYSTEM_PROMPT = `You are an expert at transforming complex bureaucratic and legal text into simple, friendly language that anyone can understand - especially elderly people who may feel anxious about official documents.

Your job is to:
1. Read the official letter/document carefully
2. Identify the main purpose and any required actions
3. Rewrite it in warm, clear, simple language
4. Extract key points and action items

Guidelines:
- Use short sentences (max 15-20 words each)
- Avoid jargon, legal terms, and complex vocabulary
- Be reassuring - reduce anxiety, not increase it
- Use "you" and "your" to make it personal
- If there are deadlines, make them very clear
- If money is involved, be specific about amounts

Respond in JSON format with these fields:
{
  "summary": "A 1-2 sentence overview of what this letter is about",
  "simplifiedText": "The full letter rewritten in simple, friendly language",
  "actionItems": ["List of specific things the person needs to do, if any"],
  "keyPoints": ["3-5 key points from the letter in simple terms"],
  "tone": "urgent | informational | positive | neutral"
}

The tone should be:
- "urgent" if there are deadlines or required actions
- "positive" if it's good news (refund, approval, etc.)
- "informational" if it's just sharing information
- "neutral" for general notices`;

export async function simplifyText(originalText: string): Promise<SimplifiedResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      { role: "system", content: SIMPLIFY_SYSTEM_PROMPT },
      { role: "user", content: originalText },
    ],
    response_format: { type: "json_object" },
    max_completion_tokens: 2048,
  });

  const content = response.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(content);

  return {
    summary: parsed.summary || "Unable to summarize this letter.",
    simplifiedText: parsed.simplifiedText || originalText,
    actionItems: parsed.actionItems || [],
    keyPoints: parsed.keyPoints || [],
    tone: parsed.tone || "neutral",
    originalLength: originalText.length,
    simplifiedLength: (parsed.simplifiedText || originalText).length,
  };
}
