import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates a visual concept for the device shell based on user prompt.
 * Uses gemini-2.5-flash-image for generation.
 */
export const generateShellConcept = async (prompt: string, style: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // Construct a specific prompt to ensure the "Core Capsule" constraint is visualized
    const fullPrompt = `
      Design a 3D printable outer shell for a smart home device called 'HabitPod'.
      The core device is a standard black cylinder (approx 8cm tall).
      The shell must enclose this cylinder but leave a hollow cavity in the center for the hardware.
      
      Style: ${style}
      User Description: ${prompt}
      
      The image should look like a high-quality 3D render or product photo.
      Show the object clearly on a clean background.
      Make it look like a trendy art toy.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using the specified image model
      contents: {
        parts: [{ text: fullPrompt }]
      },
      config: {
          // No responseMimeType for image models as per guidelines
      }
    });

    // Check for image parts in the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData) {
         return `data:image/png;base64,${part.inlineData.data}`;
       }
    }
    
    // Fallback if no image found (should usually find one)
    return "https://picsum.photos/400/400?grayscale"; 

  } catch (error) {
    console.error("Error generating shell:", error);
    throw error;
  }
};

/**
 * Simulates the Persona Engine response based on a scenario.
 */
export const simulatePersonaResponse = async (
  persona: string, 
  userAction: string,
  ragContext: string
): Promise<string> => {
  try {
    const ai = getAiClient();
    
    const systemInstruction = `
      You are HabitPod, an AI health companion.
      Your personality mode is currently set to: ${persona}.
      
      Behavior Guidelines:
      - Strict Coach: Be harsh, direct, demand discipline.
      - Gentle Partner: Be kind, pleading, use "we" language.
      - Anime Chuuni: Use anime tropes, fantasy language, refer to calories as "dark energy".
      
      Context from Knowledge Base (RAG): ${ragContext}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `The user just attempted to: ${userAction}. React immediately.`,
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: 150,
      }
    });

    return response.text || "Connection to neural core unstable...";
  } catch (error) {
    console.error("Error simulating persona:", error);
    return "Error communicating with the Persona Engine.";
  }
};