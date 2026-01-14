import { GoogleGenAI } from "@google/genai";

const geminiApiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
const geminiBaseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function getGenAIClient(): GoogleGenAI {
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

export async function extractTextFromImage(imageBuffer: Buffer, mimeType: string): Promise<string> {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Unsupported image type: ${mimeType}. Supported types: JPEG, PNG, WebP, GIF`);
  }

  const genAI = getGenAIClient();
  
  try {
    const base64Image = imageBuffer.toString("base64");
    
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Please extract all text from this image. The image contains an official document or letter. Return only the extracted text, preserving the original formatting and structure as much as possible. If the text is in Hebrew, keep it in Hebrew. If you cannot read any text, respond with an empty string.",
            },
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

    const text = response.text || "";
    return text.trim();
  } catch (error) {
    console.error("Error extracting text from image:", error);
    if (error instanceof Error && error.message.includes("API key")) {
      throw new Error("OCR service not configured properly");
    }
    throw new Error("Failed to extract text from image");
  }
}
