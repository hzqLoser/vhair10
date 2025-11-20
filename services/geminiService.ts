import { GoogleGenAI, Modality } from "@google/genai";

// Initialization: Use process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GenerateHairstyleParams {
  originalImageBase64: string; // Base64 string
  hairstyleDescription: string;
}

/**
 * Generates a new hairstyle on the provided user image using Gemini 2.5 Flash Image.
 */
export const generateHairstyleAI = async ({ originalImageBase64, hairstyleDescription }: GenerateHairstyleParams): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image';
    
    const prompt = `
      Detailed instructions:
      You are an expert hair stylist editor. 
      I am providing an image of a person. 
      Please edit the image to change their hairstyle to: ${hairstyleDescription}.
      Keep the face, skin tone, lighting, and background as close to the original as possible.
      Only change the hair. Make it look photorealistic.
    `;

    // Strip prefix if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = originalImageBase64.split(',')[1] || originalImageBase64;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', // Assuming jpeg, in prod detect from file
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Parse response
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && parts.length > 0) {
        const part = parts[0];
        if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    
    throw new Error("No image data in response");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};