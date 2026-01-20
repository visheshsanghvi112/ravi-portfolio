import { GoogleGenAI, Type } from "@google/genai";
import { MODELS } from "../constants";

// --- Helpers ---

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("DEBUG: API Key is missing in process.env");
    throw new Error("API Key is missing. Please ensure you have selected a key.");
  }
  return new GoogleGenAI({ apiKey });
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic retry wrapper for API calls
async function retryWrapper<T>(operation: () => Promise<T>, retries = 3, delayMs = 2000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    const msg = error.message || JSON.stringify(error);
    const isQuota = msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota');
    const isPermission = msg.includes('403') || msg.includes('PERMISSION_DENIED');

    if (isPermission) {
      console.error("DEBUG: Permission Denied (403).");
      throw new Error("Permission Denied: Your API key does not have access to this feature. Please check your Google Cloud project settings or try a different key.");
    }

    if (isQuota && retries > 0) {
      console.warn(`DEBUG: Quota Hit (429). Retrying in ${delayMs}ms... (${retries} retries left)`);
      await wait(delayMs);
      return retryWrapper(operation, retries - 1, delayMs * 2); // Exponential backoff
    }

    // Re-throw if it's not a retriable error or out of retries
    throw error;
  }
}

// --- Chat & Text ---

export const sendChatMessage = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  console.group("DEBUG: sendChatMessage");
  
  return retryWrapper(async () => {
    try {
      const ai = getAI();
      const chat = ai.chats.create({
        model: MODELS.CHAT,
        history: history,
        config: {
          systemInstruction: "You are an AI assistant for Ravi Maurya's photography portfolio. You are helpful, creative, and knowledgeable about photography, weddings, and visual arts.",
        }
      });
      const result = await chat.sendMessage({ message: newMessage });
      console.log("Response:", result.text);
      console.groupEnd();
      return result.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("FAILED:", error);
      console.groupEnd();
      throw error;
    }
  });
};

export const searchWeb = async (query: string) => {
  console.group("DEBUG: searchWeb");
  
  return retryWrapper(async () => {
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: MODELS.SEARCH,
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
        }
      });
      console.log("Response Text:", response.text);
      console.groupEnd();
      return {
        text: response.text,
        chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      };
    } catch (error) {
      console.error("FAILED:", error);
      console.groupEnd();
      throw error;
    }
  });
};

export const findPlaces = async (query: string, location?: { lat: number; lng: number }) => {
  console.group("DEBUG: findPlaces");
  
  return retryWrapper(async () => {
    try {
      const ai = getAI();
      const config: any = {
        tools: [{ googleMaps: {} }],
      };

      if (location) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: location.lat,
              longitude: location.lng
            }
          }
        };
      }

      const response = await ai.models.generateContent({
        model: MODELS.MAPS,
        contents: query,
        config: config
      });
      
      console.log("Response:", response.text);
      console.groupEnd();
      return {
        text: response.text,
        chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      };
    } catch (error) {
      console.error("FAILED:", error);
      console.groupEnd();
      throw error;
    }
  });
};

// --- Image ---

export const generateImage = async (prompt: string, aspectRatio: string, size: string) => {
  console.group("DEBUG: generateImage");
  
  return retryWrapper(async () => {
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: MODELS.IMAGE_GEN,
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
            imageSize: size
          }
        }
      });

      const images: string[] = [];
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            images.push(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
          }
        }
      }
      
      console.log(`Generated ${images.length} images`);
      console.groupEnd();
      return images;
    } catch (error) {
      console.error("FAILED:", error);
      console.groupEnd();
      throw error;
    }
  });
};

export const editImage = async (prompt: string, imageBase64: string, mimeType: string) => {
  console.group("DEBUG: editImage");
  
  return retryWrapper(async () => {
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: MODELS.IMAGE_EDIT,
        contents: {
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType
              }
            },
            { text: prompt }
          ]
        }
      });

      const images: string[] = [];
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            images.push(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
          }
        }
      }
      
      console.log(`Generated ${images.length} edits`);
      console.groupEnd();
      return images;
    } catch (error) {
      console.error("FAILED:", error);
      console.groupEnd();
      throw error;
    }
  });
};

// --- Video (Veo) ---

export const generateVideo = async (prompt: string, aspectRatio: string = "16:9") => {
  console.group("DEBUG: generateVideo");
  
  return retryWrapper(async () => {
    try {
      const ai = getAI();
      console.log("Starting generation operation...");
      
      // Step 1: Start Operation
      let operation = await ai.models.generateVideos({
        model: MODELS.VIDEO_GEN,
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: aspectRatio as any
        }
      });

      console.log("Operation started, polling for completion...");
      
      // Step 2: Poll with retry logic specifically for the polling calls
      while (!operation.done) {
        await wait(5000); // Wait 5s between polls
        process.stdout.write("."); 
        
        // Wrap the polling call itself in a mini-retry to handle 429s during polling
        operation = await retryWrapper(async () => {
           return await ai.operations.getVideosOperation({ operation: operation });
        }, 3, 2000);
      }
      console.log("Operation done.");

      const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!videoUri) throw new Error("Video generation failed - no URI returned");
      
      console.log("Video URI:", videoUri);
      console.groupEnd();
      return videoUri; 
    } catch (error) {
      console.error("FAILED:", error);
      console.groupEnd();
      throw error;
    }
  });
};

// --- Helpers ---

export const ensureApiKey = async () => {
    console.log("DEBUG: Checking API Key availability...");
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            console.log("DEBUG: Key not selected, opening dialog...");
            await window.aistudio.openSelectKey();
        } else {
            console.log("DEBUG: Key already selected.");
        }
        return true;
    }
    console.warn("DEBUG: window.aistudio not found. Relying on env vars.");
    return false;
}