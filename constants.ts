export const MODELS = {
  CHAT: 'gemini-3-pro-preview',
  SEARCH: 'gemini-3-flash-preview',
  MAPS: 'gemini-2.5-flash',
  IMAGE_GEN: 'gemini-3-pro-image-preview',
  IMAGE_EDIT: 'gemini-2.5-flash-image',
  VIDEO_GEN: 'veo-3.1-fast-generate-preview', // Fast generation
  VIDEO_GEN_HQ: 'veo-3.1-generate-preview',   // High quality/reference images
  ANALYSIS: 'gemini-3-pro-preview',
  FAST: 'gemini-2.5-flash-lite',
};

// Curated high-end photography for portfolio with varying aspect ratios for Masonry layout
export const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1511285560982-1356c11d4606?q=80&w=800&h=1200&auto=format&fit=crop", // Portrait
  "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1200&h=800&auto=format&fit=crop", // Landscape
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&h=1000&auto=format&fit=crop", // Square
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&h=800&auto=format&fit=crop", // Landscape
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&h=1000&auto=format&fit=crop", // Portrait
  "https://images.unsplash.com/photo-1520854221256-17451cc330e7?q=80&w=800&h=1200&auto=format&fit=crop", // Portrait
  "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?q=80&w=1200&h=600&auto=format&fit=crop", // Wide
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&h=800&auto=format&fit=crop", // Square
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&h=1200&auto=format&fit=crop"  // Portrait
];

export const SERVICE_ICONS = {
  WEDDING: "rings",
  PORTRAIT: "user",
  EVENT: "calendar",
  COMMERCIAL: "briefcase"
};