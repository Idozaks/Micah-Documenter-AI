import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

const IMAGE_STYLE_PROMPT = `Create a simple, calming illustration in a professional, friendly style. 
The image should be:
- Clean and minimalist
- Use soft, muted colors (blues, greens, warm neutrals)
- Suitable for explaining official documents to elderly people
- Professional but approachable
- No text in the image
- Simple iconographic style`;

export async function generateExplanationImage(keyPoint: string): Promise<string | null> {
  try {
    const prompt = `${IMAGE_STYLE_PROMPT}

Illustrate this concept: "${keyPoint}"

Create a simple, friendly illustration that helps explain this point visually.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const candidate = response.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find(
      (part: { inlineData?: { data?: string; mimeType?: string } }) => part.inlineData
    );

    if (!imagePart?.inlineData?.data) {
      console.log("No image data in response for:", keyPoint);
      return null;
    }

    const mimeType = imagePart.inlineData.mimeType || "image/png";
    return `data:${mimeType};base64,${imagePart.inlineData.data}`;
  } catch (error) {
    console.error("Error generating image for key point:", keyPoint, error);
    return null;
  }
}

export async function generateImagesForKeyPoints(keyPoints: string[]): Promise<string[]> {
  const limitedPoints = keyPoints.slice(0, 3);
  
  const imagePromises = limitedPoints.map((point) => generateExplanationImage(point));
  const results = await Promise.all(imagePromises);
  
  return results.filter((img): img is string => img !== null);
}
