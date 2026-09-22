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
  },
  
  async generateConnectionNote(req: { target: string, reason: string }): Promise<string> {
    if (!apiKey) {
      throw new Error("Missing VITE_GEMINI_API_KEY in environment variables.");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const prompt = `
      You are an expert networker on LinkedIn. Write a highly personalized, non-spammy, and concise connection request note (maximum 300 characters).
      Do not include placeholders like [Your Name]. Just write the message body itself.
      
      I want to connect with: ${req.target}
      Because: ${req.reason}
      
      Respond with ONLY the text of the message.
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text.trim();
    } catch (error) {
      console.error("AI Generation Error:", error);
      throw new Error("Failed to generate connection note with Gemini API.");
    }
  },

  async analyzeProfile(bioText: string): Promise<{ role: string, tone: string, topics: string[], audience: string }> {
    if (!apiKey) {
      throw new Error("Missing VITE_GEMINI_API_KEY in environment variables.");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const prompt = `
      You are an expert LinkedIn profile analyzer. Read the following bio/resume text and deduce the person's professional writing identity.
      
      TEXT:
      ${bioText}
      
      Respond ONLY with valid JSON matching this schema exactly:
      {
        "role": "string (Short professional title, e.g. 'Software Engineer' or 'Founder')",
        "tone": "string (1-2 words describing their voice, e.g. 'Direct & Professional' or 'Conversational')",
        "topics": ["string (2-3 main topics they likely talk about)"],
        "audience": "string (Who they are speaking to, e.g. 'Other founders' or 'Tech community')"
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
      const jsonStr = jsonMatch ? jsonMatch[0].replace(/```json\n/, '').replace(/```/, '') : text;
      
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      throw new Error("Failed to analyze profile with Gemini API.");
    }
  }
};
