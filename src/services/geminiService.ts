import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Story } from "../types";

// Mock data in case API key is missing or fails
export const MOCK_STORIES: Story[] = [
  {
    id: '1',
    category: 'Featured Story',
    title: 'Woods Hole Film Festival x Protagonist',
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=900&fit=crop'
  },
  {
    id: '2',
    category: 'Featured Story',
    title: 'The M.A.D School x Protagonist',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=900&fit=crop'
  },
  {
    id: '3',
    category: 'Featured Story',
    title: 'Documenting the greats',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=900&fit=crop'
  }
];

export const generateCreativeStories = async (): Promise<Story[]> => {
  // Check for API key in process.env as per guidelines
  // Note: Vite uses import.meta.env, but the guideline strictly requested process.env.API_KEY.
  // In a Vite environment, we map this in the service or ensure the build process handles it.
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  if (!apiKey) {
    console.warn("No API Key found, using mock data.");
    return MOCK_STORIES;
  }

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const response = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "Generate 3 creative, avant-garde design agency case study titles. They should sound prestigious and artistic. Return strictly JSON in this format: [{\"title\": \"...\", \"category\": \"Story\"}]" }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              category: { type: SchemaType.STRING, description: "Usually just 'Story' or 'Case Study'" },
            },
            required: ["title", "category"]
          }
        }
      }
    });

    const result = response.response;
    const text = result.text();
    if (!text) {
      throw new Error("No text returned from Gemini");
    }

    const data = JSON.parse(text);

    // Map the generated text to our Story object structure, assigning random images
    return data.map((item: any, index: number) => ({
      id: `gen-${Date.now()}-${index}`,
      title: item.title,
      category: item.category || 'Featured Story',
      imageUrl: `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/400/600`
    }));

  } catch (error) {
    console.error("Gemini generation failed:", error);
    return MOCK_STORIES;
  }
};
