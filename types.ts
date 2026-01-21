export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface GeneratedVideo {
  uri: string;
  prompt: string;
}

export enum AspectRatio {
  SQUARE = "1:1",
  PORTRAIT_2_3 = "2:3",
  LANDSCAPE_3_2 = "3:2",
  PORTRAIT_3_4 = "3:4",
  LANDSCAPE_4_3 = "4:3",
  PORTRAIT_9_16 = "9:16",
  LANDSCAPE_16_9 = "16:9",
  CINEMATIC_21_9 = "21:9"
}

export enum ImageSize {
  SIZE_1K = "1K",
  SIZE_2K = "2K",
  SIZE_4K = "4K"
}

export enum VideoResolution {
  RES_720P = "720p",
  RES_1080P = "1080p"
}

// Type declarations for window and process
declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey?: () => Promise<boolean>;
      openSelectKey?: () => Promise<void>;
    };
  }

  namespace NodeJS {
    interface ProcessEnv {
      API_KEY?: string;
      GEMINI_API_KEY?: string;
      VITE_GEMINI_API_KEY?: string;
    }
  }

  interface Process {
    env: NodeJS.ProcessEnv;
    stdout?: {
      write: (str: string) => void;
    };
  }

  var process: Process;
}

export { };
