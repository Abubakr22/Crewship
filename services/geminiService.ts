
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateIcebreakers = async (user1Interests: string[], user2Interests: string[], user2Name: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 friendly icebreaker questions for two teens who both like ${user1Interests.join(', ')} and ${user2Interests.join(', ')}. Keep it safe, platonic, and professional. The other person's name is ${user2Name}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating icebreakers:", error);
    return [
      `Hey ${user2Name}, I saw we both like ${user2Interests[0]}! What's your favorite thing about it?`,
      "Any cool projects you're working on lately?",
      "Glad we connected! What are your goals on Crewships?"
    ];
  }
};
