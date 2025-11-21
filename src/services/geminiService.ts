import { GoogleGenAI, Modality } from '@google/genai'

/**
 * Thin wrapper around the Gemini image generation endpoint.
 *
 * The UI consumes this function like a backend call. When swapping to a real
 * API server, keep the same signature and move the invocation there so Taro
 * builds remain unchanged.
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })

export interface GenerateHairstyleParams {
  /** Base64 string of the source user photo. */
  originalImageBase64: string
  /** Natural language description of the target hairstyle. */
  hairstyleDescription: string
}

/**
 * Generates a new hairstyle on the provided user image using Gemini 2.5 Flash
 * Image.
 */
export const generateHairstyleAI = async ({ originalImageBase64, hairstyleDescription }: GenerateHairstyleParams): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image'
    const prompt = `
      Detailed instructions:
      You are an expert hair stylist editor.
      I am providing an image of a person.
      Please edit the image to change their hairstyle to: ${hairstyleDescription}.
      Keep the face, skin tone, lighting, and background as close to the original as possible.
      Only change the hair. Make it look photorealistic.
    `

    // Strip prefix if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = originalImageBase64.split(',')[1] || originalImageBase64

    const response = await ai.models.generateContent({
      model,
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
    })

    // Parse response
    const parts = response.candidates?.[0]?.content?.parts
    if (parts && parts.length > 0) {
      const part = parts[0]
      if (part.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`
      }
    }

    throw new Error('No image data in Gemini response')
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw error
  }
}
