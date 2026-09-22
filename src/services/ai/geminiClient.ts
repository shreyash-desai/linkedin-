import { GoogleGenerativeAI } from '@google/generative-ai';

// In production, these should be handled strictly server-side.
// We simulate an API layer here for frontend development and demo mode.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''; 
const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-lite';

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export interface AIPostRequest {
  idea: string;
  tone: string;
  length: string;
  postType: string;
}

export interface AIGeneratedPost {
  hook: string;
  post: string;
  cta?: string;
  hashtags: string[];
  alternative_hooks: string[];
}

// Fallback deterministic responses for DEMO MODE
const DEMO_RESPONSE: AIGeneratedPost = {
  hook: "Most businesses don't have an AI problem. They have a clarity problem.",
  post: "Building products has taught me that the hardest part isn't writing code.\n\nIt's deciding what actually needs to be built.\n\nThe more I work with businesses, the more I realize that simplicity is often the biggest advantage.\n\nBuild less.\nUnderstand more.\nShip faster.",
  cta: "What's one feature you wish you hadn't built?",
  hashtags: ["#startups", "#productmanagement", "#simplicity"],
  alternative_hooks: [
    "I used to think more features meant a better product. I was wrong.",
    "The biggest mistake technical founders make has nothing to do with code."
  ]
};

export const aiService = {
  async generatePost(req: AIPostRequest): Promise<AIGeneratedPost> {
    // If no API key, return demo response
    if (!genAI) {
      console.log('DEMO MODE: Returning deterministic AI response.');
      return new Promise((resolve) => setTimeout(() => resolve(DEMO_RESPONSE), 1500));
    }

    const model = genAI.getGenerativeModel({ model: modelName });
    
    const prompt = `
      You are a LinkedIn content strategist. Write natural, human content.
      Avoid generic AI language, corporate clichés, and excessive emojis.
      
      USER IDEA: ${req.idea}
      TONE: ${req.tone}
      LENGTH: ${req.length}
      TYPE: ${req.postType}
      
      Respond ONLY with valid JSON matching this schema:
      {
        "hook": "string",
        "post": "string (the main body without the hook or cta)",
        "cta": "string (optional call to action)",
        "hashtags": ["string"],
        "alternative_hooks": ["string"]
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      // Simple parse to extract JSON block if wrapped in markdown
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
      const jsonStr = jsonMatch ? jsonMatch[0].replace(/```json\n/, '').replace(/```/, '') : text;
      
      return JSON.parse(jsonStr) as AIGeneratedPost;
    } catch (error) {
      console.error("AI Generation Error:", error);
      // Fallback to demo response on failure so UI doesn't break entirely in demo
      return DEMO_RESPONSE;
    }
  }
};
