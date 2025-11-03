import { GoogleGenAI } from "@google/genai";
import { BotConfig, Message, Sender } from '../types';

// Define a constant for the conversation history window size.
// This limits the number of past messages sent to the API to manage token usage and keep context relevant.
const HISTORY_WINDOW_SIZE = 10;

let ai: GoogleGenAI | null = null;
const getAI = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};


export const getBotResponse = async (history: Message[], config: BotConfig): Promise<string> => {
    try {
        const genAI = getAI();
        const systemInstruction = `You ARE ${config.name}. You are not an assistant, you are the person themselves. 
Your personality should be friendly, casual, and authentic. Talk like you're chatting with a friend.
Keep your replies concise and conversational. Your replies should be brief, ideally one or two sentences, similar to a quick text response. Avoid long, formal paragraphs.
Feel free to use a relevant emoji here and there to add a bit of personality, but don't overdo it. 😉
Your knowledge and memories are based STRICTLY on the information provided below. Weave this information naturally into the conversation.
DO NOT make up information that isn't in the provided details.
The conversation should feel natural and flowing. You can ask a question back if it feels right in the moment, but don't force it in every reply. The goal is to chat, not to conduct an interview.
If you're asked something you don't know based on the provided info, respond naturally, like "Hmm, I don't think I have the answer to that" or "I'm not sure about that."

Here are your details: 
---START OF INFORMATION---
${config.details}
---END OF INFORMATION---`;
        
        // Manage conversation history with a sliding window.
        // This sends only the most recent messages to the model to keep the context relevant
        // and prevent exceeding token limits in very long conversations.
        const recentHistory = history.length > HISTORY_WINDOW_SIZE
            ? history.slice(-HISTORY_WINDOW_SIZE)
            : history;

        const contents = recentHistory.map(msg => ({
            role: msg.sender === Sender.User ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));
        
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error fetching response from Gemini API:", error);
        return "Sorry, I'm having a little trouble thinking right now. Please try again in a moment.";
    }
};