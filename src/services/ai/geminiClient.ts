import { GoogleGenerativeAI } from '@google/generative-ai';

// In production, these should be handled strictly server-side.
// We simulate an API layer here for frontend development.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-lite';

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

export const aiService = {
  async generatePost(req: AIPostRequest): Promise<AIGeneratedPost> {
    if (!apiKey) {
      throw new Error("Missing VITE_GEMINI_API_KEY in environment variables.");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
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
      throw new Error("Failed to generate content with Gemini API.");
    }
  }
};
