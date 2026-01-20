import React, { useState } from 'react';
import { Wand2, MapPin, Film, Image as ImageIcon, Sparkles, Video, Loader2, ArrowRight, AlertCircle, XCircle } from 'lucide-react';
import { Button, LoadingOverlay, SectionTitle } from './Shared';
import { AspectRatio, ImageSize } from '../types';
import * as GeminiService from '../services/geminiService';

// --- Shared Error Component ---
const ErrorBanner: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
    <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-start gap-3 animate-fade-in mb-6">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div className="flex-1 text-sm leading-relaxed">{message}</div>
        <button onClick={onClose} className="hover:text-white transition-colors"><XCircle className="w-5 h-5" /></button>
    </div>
);

// --- Sub-components for different tools ---

const ToolHeader: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
    <div className="mb-6 flex items-start gap-4">
        <div className="p-3 bg-gold-400/10 rounded-xl text-gold-400 border border-gold-400/20">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-serif text-white">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
    </div>
);

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [aspect, setAspect] = useState<string>(AspectRatio.SQUARE);
  const [size, setSize] = useState<string>(ImageSize.SIZE_1K);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
        setError("Please enter a description for your image.");
        return;
    }
    setLoading(true);
    setError(null);
    try {
      await GeminiService.ensureApiKey(); 
      const images = await GeminiService.generateImage(prompt, aspect, size);
      if (images.length > 0) {
          setResult(images[0]);
      } else {
          setError("The AI generated an empty response. Please try a different prompt.");
      }
    } catch (e: any) {
      console.error("Component Error:", e);
      setError(e.message || "Failed to generate image. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ToolHeader 
        title="Concept Visualization" 
        description="Describe a scene, lighting, or mood to generate visual inspirations for your next shoot."
        icon={<Sparkles className="w-6 h-6" />}
      />
      
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

      <div className="space-y-6 flex-1">
        <div className="group">
            <label className="text-xs text-gold-400 uppercase tracking-widest mb-2 block font-semibold">The Vision</label>
            <textarea 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g. A cinematic shot of a bride standing in a gothic archway, sun rays piercing through dust, golden hour lighting..."
            className="w-full bg-surface border border-gray-800 rounded-xl p-4 text-white focus:border-gold-400/50 focus:bg-charcoal outline-none h-32 transition-all placeholder:text-gray-600 resize-none"
            />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">Format</label>
            <select value={aspect} onChange={e => setAspect(e.target.value)} className="w-full bg-surface border border-gray-800 rounded-lg p-3 text-sm text-gray-300 outline-none focus:border-gold-400/50">
                {Object.values(AspectRatio).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            </div>
            <div>
            <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">Quality</label>
            <select value={size} onChange={e => setSize(e.target.value)} className="w-full bg-surface border border-gray-800 rounded-lg p-3 text-sm text-gray-300 outline-none focus:border-gold-400/50">
                {Object.values(ImageSize).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            </div>
        </div>

        <Button onClick={handleGenerate} disabled={loading} variant="luxury" className="w-full mt-4">
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 className="w-4 h-4" />} 
            {loading ? "Dreaming..." : "Generate Concept"}
        </Button>
      </div>

      {result && (
        <div className="mt-8 relative group rounded-2xl overflow-hidden border border-gray-800 shadow-2xl animate-slide-up">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-6">
             <Button variant="secondary" className="w-full text-xs">Download Asset</Button>
          </div>
          <img src={result} alt="Generated" className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
        </div>
      )}
    </div>
  );
};

const ImageEditor = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
          setError("File is too large. Please upload an image under 5MB.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) {
        setError("Please upload an image and provide editing instructions.");
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const base64 = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];
      const images = await GeminiService.editImage(prompt, base64, mimeType);
      if (images.length > 0) setResult(images[0]);
      else setError("Could not edit the image. Try a simpler prompt.");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Edit failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToolHeader 
        title="Magic Editor" 
        description="Upload a photo and use AI to alter elements, lighting, or style instantly."
        icon={<Wand2 className="w-6 h-6" />}
      />

      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

      <div className="space-y-6">
        {!image ? (
            <div className="border border-dashed border-gray-700 bg-surface/50 rounded-2xl p-10 text-center hover:border-gold-400/50 hover:bg-surface transition-all group">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="edit-upload" />
            <label htmlFor="edit-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-charcoal flex items-center justify-center mb-4 text-gray-500 group-hover:text-gold-400 group-hover:scale-110 transition-all">
                    <ImageIcon className="w-8 h-8" />
                </div>
                <span className="text-gray-300 font-medium">Click to Upload Raw Image</span>
                <span className="text-xs text-gray-500 mt-2">Supports JPG, PNG up to 5MB</span>
            </label>
            </div>
        ) : (
            <div className="relative rounded-2xl overflow-hidden border border-gray-700">
            <img src={image} alt="Original" className="w-full h-48 object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <button onClick={() => setImage(null)} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full border border-white/20 transition-colors text-white">Change Image</button>
            </div>
            </div>
        )}
        
        <div className="flex gap-2">
             <input 
                type="text" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Make it sunset, remove the crowd..."
                className="flex-1 bg-surface border border-gray-800 rounded-full px-6 py-3 text-white focus:border-gold-400/50 outline-none"
            />
            <button onClick={handleEdit} disabled={loading || !image} className="w-12 h-12 bg-gold-400 rounded-full flex items-center justify-center text-black hover:bg-gold-300 transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>
        </div>

        {result && (
            <div className="mt-8 border border-gold-400/20 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-slide-up">
                 <div className="bg-charcoal px-4 py-2 text-xs text-gold-400 uppercase tracking-widest border-b border-gray-800">Edited Result</div>
                 <img src={result} alt="Edited" className="w-full" />
            </div>
        )}
      </div>
    </div>
  );
};

const VideoStudio = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
        setError("Please describe the video you want to create.");
        return;
    }
    setLoading(true);
    setVideoUrl(null);
    setError(null);
    try {
      await GeminiService.ensureApiKey();
      const uri = await GeminiService.generateVideo(prompt);
      if (uri) setVideoUrl(`${uri}&key=${process.env.API_KEY}`);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Video generation failed. This process can be unstable on preview models.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToolHeader 
        title="Motion Studio" 
        description="Turn text descriptions into high-definition cinematic video clips."
        icon={<Film className="w-6 h-6" />}
      />

      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

      <div className="space-y-6">
        <textarea 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Slow motion B-Roll of rain falling on a rose petal..."
            className="w-full bg-surface border border-gray-800 rounded-xl p-4 text-white focus:border-gold-400/50 focus:bg-charcoal outline-none h-24 resize-none"
        />

        <Button onClick={handleGenerate} disabled={loading} variant="luxury" className="w-full">
            {loading ? <Loader2 className="animate-spin" /> : <Video className="w-4 h-4" />} 
            {loading ? "Rendering Scene..." : "Generate Cinematic Video"}
        </Button>
        
        {loading && <div className="w-full h-1 bg-surface rounded-full overflow-hidden mt-4"><div className="h-full bg-gold-400 w-1/3 animate-[shimmer_2s_infinite_linear]"></div></div>}

        {videoUrl && (
            <div className="mt-8 rounded-xl overflow-hidden border border-gray-800 bg-black shadow-2xl animate-slide-up">
            <video src={videoUrl} controls autoPlay loop className="w-full h-auto aspect-video" />
            </div>
        )}
      </div>
    </div>
  );
};

const LocationScout = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const res = await GeminiService.findPlaces(query);
      setResults([{ text: res.text }]);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Location search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToolHeader 
        title="Location Scout" 
        description="Find the perfect backdrop for your story using AI-powered maps data."
        icon={<MapPin className="w-6 h-6" />}
      />

      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}
      
      <div className="space-y-6">
        <div className="flex gap-2 bg-surface border border-gray-800 rounded-full p-2 focus-within:border-gold-400/50 transition-colors">
            <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E.g., Abandoned industrial buildings in Brooklyn..."
            className="flex-1 bg-transparent px-4 text-white outline-none placeholder:text-gray-600"
            />
            <Button onClick={handleSearch} disabled={loading} variant="primary" className="!py-2 !px-6">
                Search
            </Button>
        </div>
        
        <div className="bg-surface/30 p-6 rounded-2xl min-h-[150px] border border-white/5">
            {loading ? (
                <div className="flex items-center gap-2 text-gold-400 text-sm">
                    <Loader2 className="animate-spin w-4 h-4" /> Scouting area...
                </div>
            ) : results.map((r, i) => (
                <div key={i} className="prose prose-invert prose-sm max-w-none text-gray-300">
                    <div className="whitespace-pre-wrap leading-relaxed">{r.text}</div>
                </div>
            ))}
            {!loading && results.length === 0 && <p className="text-gray-600 italic text-sm text-center mt-10">AI results will appear here</p>}
        </div>
      </div>
    </div>
  );
};

export const AIStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'concept' | 'edit' | 'video' | 'places'>('concept');

  const tabs = [
      { id: 'concept', label: 'Concept', icon: Sparkles },
      { id: 'edit', label: 'Magic Edit', icon: Wand2 },
      { id: 'video', label: 'Motion', icon: Video },
      { id: 'places', label: 'Scout', icon: MapPin },
  ];

  return (
    <section id="ai-studio" className="py-32 bg-obsidian relative overflow-hidden">
        {/* Ambient Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle 
            title="The Creative Lab" 
            subtitle="An experimental playground where Artificial Intelligence enhances artistic vision. Powered by Gemini Pro & Veo." 
        />
        
        <div className="max-w-7xl mx-auto mt-12 bg-charcoal border border-white/5 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row h-auto lg:h-[700px]">
          
          {/* Sidebar */}
          <div className="lg:w-80 bg-surface/50 border-r border-white/5 p-6 flex flex-col gap-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pl-4">Tools</div>
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full text-left px-6 py-4 rounded-xl flex items-center gap-4 transition-all duration-300 ${activeTab === tab.id ? 'bg-gold-400 text-black shadow-lg shadow-gold-400/20 font-medium scale-105' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-black' : 'text-gray-500'}`} />
                    <span>{tab.label}</span>
                </button>
            ))}
          </div>

          {/* Canvas Area */}
          <div className="flex-1 p-8 lg:p-12 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
            <div className="max-w-3xl mx-auto glass-panel p-8 rounded-3xl h-full shadow-2xl">
                {activeTab === 'concept' && <ImageGenerator />}
                {activeTab === 'edit' && <ImageEditor />}
                {activeTab === 'video' && <VideoStudio />}
                {activeTab === 'places' && <LocationScout />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};