// Type definitions for @google/genai module
declare module '@google/genai' {
    export interface ChatConfig {
        model: string;
        history?: Array<{ role: string; parts: { text: string }[] }>;
        config?: {
            systemInstruction?: string;
            [key: string]: any;
        };
    }

    export interface Chat {
        sendMessage: (config: { message: string }) => Promise<{ text: string }>;
    }

    export class GoogleGenAI {
        constructor(config: { apiKey: string });
        chats: {
            create: (config: ChatConfig) => Chat;
        };
        models: {
            generateContent: (config: any) => Promise<any>;
            generateVideos: (config: any) => Promise<any>;
        };
        operations: {
            getVideosOperation: (config: any) => Promise<any>;
        };
    }

    export const Type: any;
}
