import { GoogleGenAI } from "@google/genai";
import type { SimplifiedResult } from "@shared/schema";

const geminiApiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
const geminiBaseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

function getGeminiClient(): GoogleGenAI {
  if (!geminiApiKey) {
    throw new Error("Gemini API key not configured");
  }
  return new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      apiVersion: "",
      baseUrl: geminiBaseUrl,
    },
  });
}

function getSystemPrompt(language: "he" | "en"): string {
  const isHebrew = language === "he";
  
  return `You are an expert at transforming complex bureaucratic and legal text into simple, friendly language that anyone can understand - especially elderly people who may feel anxious about official documents.

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
${isHebrew ? "- IMPORTANT: You MUST respond in Hebrew. All text in the JSON response MUST be in Hebrew." : "- Respond in English."}

Respond in JSON format with these fields:
{
  "summary": "${isHebrew ? "סיכום של 1-2 משפטים על מה המכתב הזה" : "A 1-2 sentence overview of what this letter is about"}",
  "simplifiedText": "${isHebrew ? "המכתב המלא מנוסח מחדש בשפה פשוטה וידידותית" : "The full letter rewritten in simple, friendly language"}",
  "actionItems": ["${isHebrew ? "רשימת דברים ספציפיים שהאדם צריך לעשות, אם יש" : "List of specific things the person needs to do, if any"}"],
  "keyPoints": ["${isHebrew ? "3-5 נקודות עיקריות מהמכתב במילים פשוטות" : "3-5 key points from the letter in simple terms"}"],
  "tone": "urgent | informational | positive | neutral"
}

The tone should be:
- "urgent" if there are deadlines or required actions
- "positive" if it's good news (refund, approval, etc.)
- "informational" if it's just sharing information
- "neutral" for general notices`;
}

export async function simplifyText(originalText: string, language: "he" | "en" = "he"): Promise<SimplifiedResult> {
  const genAI = getGeminiClient();
  const isHebrew = language === "he";
  
  const prompt = `${getSystemPrompt(language)}

Here is the letter/document to simplify:

${originalText}`;

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const content = response.text || "{}";
  const cleanedContent = content.replace(/```json\n?|\n?```/g, "").trim();
  const parsed = JSON.parse(cleanedContent);

  const fallbackSummary = isHebrew 
    ? "לא הצלחנו לסכם את המכתב הזה." 
    : "Unable to summarize this letter.";
  
  return {
    summary: parsed.summary || fallbackSummary,
    simplifiedText: parsed.simplifiedText || originalText,
    actionItems: parsed.actionItems || [],
    keyPoints: parsed.keyPoints || [],
    tone: parsed.tone || "neutral",
    originalLength: originalText.length,
    simplifiedLength: (parsed.simplifiedText || originalText).length,
  };
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function simplifyImage(
  imageBuffer: Buffer,
  mimeType: string,
  language: "he" | "en" = "he"
): Promise<SimplifiedResult> {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Unsupported image type: ${mimeType}. Supported types: JPEG, PNG, WebP, GIF`);
  }

  const genAI = getGeminiClient();
  const isHebrew = language === "he";
  const base64Image = imageBuffer.toString("base64");

  const prompt = `You are an expert at analyzing official documents and bureaucratic letters. Look at this image of an official document and:

1. Read and understand the document content
2. Identify the main purpose and any required actions
3. Explain it in warm, clear, simple language that elderly people can understand

Guidelines:
- Use short sentences (max 15-20 words each)
- Avoid jargon, legal terms, and complex vocabulary
- Be reassuring - reduce anxiety, not increase it
- If there are deadlines, make them very clear
- If money is involved, be specific about amounts
${isHebrew ? "- IMPORTANT: You MUST respond in Hebrew. All text in the JSON response MUST be in Hebrew." : "- Respond in English."}

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "summary": "${isHebrew ? "סיכום של 1-2 משפטים על מה המסמך הזה" : "A 1-2 sentence overview of what this document is about"}",
  "simplifiedText": "${isHebrew ? "ההסבר המלא של המסמך בשפה פשוטה וידידותית" : "The full document explained in simple, friendly language"}",
  "actionItems": ["${isHebrew ? "רשימת דברים ספציפיים שהאדם צריך לעשות" : "List of specific things the person needs to do"}"],
  "keyPoints": ["${isHebrew ? "3-5 נקודות עיקריות מהמסמך במילים פשוטות" : "3-5 key points from the document in simple terms"}"],
  "tone": "urgent | informational | positive | neutral"
}`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const content = response.text || "{}";
    const cleanedContent = content.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleanedContent);

    const fallbackSummary = isHebrew 
      ? "לא הצלחנו לנתח את המסמך הזה." 
      : "Unable to analyze this document.";

    return {
      summary: parsed.summary || fallbackSummary,
      simplifiedText: parsed.simplifiedText || (isHebrew ? "לא נמצא תוכן במסמך" : "No content found in document"),
      actionItems: parsed.actionItems || [],
      keyPoints: parsed.keyPoints || [],
      tone: parsed.tone || "neutral",
      originalLength: 0,
      simplifiedLength: (parsed.simplifiedText || "").length,
    };
  } catch (error) {
    console.error("Error analyzing image:", error);
    if (error instanceof Error && error.message.includes("API key")) {
      throw new Error("Image analysis service not configured properly");
    }
    throw new Error("Failed to analyze the document image");
  }
}
