import React, { useState, useEffect, useCallback } from 'react';
import { Instagram, Mail, Phone, Menu, X, ArrowRight, Camera, Star, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Button, SectionTitle } from './components/Shared';
import { AIStudio } from './components/AIStudio';
import { ChatBot } from './components/ChatBot';
import { PLACEHOLDER_IMAGES, HERO_IMAGES } from './constants';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  // Navigation Items Config
  const NAV_ITEMS = [
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'Services', id: 'services' },
    { label: 'Lab', id: 'ai-studio' }, // Fixed ID mismatch
    { label: 'Contact', id: 'contact' }
  ];

  // Robust Scroll Handler
  const handleScrollTo = (id: string) => {
    console.log(`Attempting to scroll to: #${id}`);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    } else {
      console.error(`Navigation Error: Element with id '${id}' not found in DOM.`);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero Slideshow Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Prevent scroll when mobile menu or lightbox is open
  useEffect(() => {
    if (mobileMenuOpen || lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen, lightboxIndex]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      
      switch(e.key) {
        case 'Escape':
          setLightboxIndex(null);
          break;
        case 'ArrowRight':
          setLightboxIndex((prev) => (prev !== null ? (prev + 1) % PLACEHOLDER_IMAGES.length : null));
          break;
        case 'ArrowLeft':
          setLightboxIndex((prev) => (prev !== null ? (prev - 1 + PLACEHOLDER_IMAGES.length) % PLACEHOLDER_IMAGES.length : null));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % PLACEHOLDER_IMAGES.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + PLACEHOLDER_IMAGES.length) % PLACEHOLDER_IMAGES.length);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-gray-200 font-sans overflow-x-hidden selection:bg-gold-400 selection:text-black">
      
      {/* --- Header & Navigation --- */}
      <nav className={`fixed top-4 left-0 right-0 z-50 transition-all duration-500 flex justify-center px-4 md:px-6`}>
        <div className={`
            relative flex items-center justify-between
            transition-all duration-500 ease-in-out
            ${scrolled 
              ? 'bg-obsidian/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 py-3 px-6 rounded-full w-full max-w-5xl' 
              : 'bg-transparent border-transparent py-6 w-full max-w-7xl'}
        `}>
            {/* Logo */}
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xl md:text-2xl font-serif font-bold tracking-tight text-white flex items-center gap-2 z-50">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">RAVI MAURYA</span>
            </button>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10 bg-black/20 backdrop-blur-sm px-8 py-2 rounded-full border border-white/5">
                {NAV_ITEMS.map((item) => (
                    <button 
                      key={item.label} 
                      onClick={() => handleScrollTo(item.id)}
                      className="text-sm font-medium text-gray-300 hover:text-gold-400 transition-colors uppercase tracking-widest relative group"
                    >
                        {item.label}
                        <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-gold-400 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                    </button>
                ))}
            </div>

            {/* CTA / Mobile Toggle */}
            <div className="flex items-center gap-4">
                <div className="hidden md:block">
                     <Button variant="luxury" onClick={() => handleScrollTo('contact')} className="!py-2 !px-6 !text-xs !rounded-full">Book Now</Button>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                  className="md:hidden text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
                  aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>
        </div>
      </nav>

      {/* --- Mobile Menu Overlay --- */}
      <div className={`fixed inset-0 bg-obsidian z-40 transition-all duration-500 flex flex-col items-center justify-center space-y-8 md:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
             {NAV_ITEMS.map((item, i) => (
                <button 
                  key={item.label} 
                  onClick={() => handleScrollTo(item.id)} 
                  className="text-4xl font-serif text-white hover:text-gold-400 transition-all transform hover:scale-105"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                    {item.label === 'Lab' ? 'Creative Lab' : item.label}
                </button>
            ))}
            <div className="pt-8">
              <Button variant="luxury" onClick={() => handleScrollTo('contact')}>Book Your Session</Button>
            </div>
      </div>

      {/* --- Hero Section --- */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Cinematic Background Slideshow */}
        <div className="absolute inset-0 z-0 bg-obsidian">
             {HERO_IMAGES.map((img, i) => (
               <div 
                  key={i}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}
               >
                  <div 
                      className="absolute inset-0 bg-cover bg-center animate-slow-zoom opacity-60" 
                      style={{ backgroundImage: `url('${img}')` }}
                  ></div>
               </div>
             ))}
             
             {/* Gradient Overlays for readability - Lighter overlay for better visibility */}
             <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent"></div>
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#050505_100%)] opacity-80"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
          <div className="inline-block mb-6 px-4 py-1 border border-gold-400/30 rounded-full bg-gold-400/5 backdrop-blur-sm animate-fade-in opacity-0" style={{animationDelay: '0.2s'}}>
            <p className="text-gold-300 tracking-[0.3em] text-xs font-semibold uppercase">International Photographer</p>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold mb-8 leading-[1.1] md:leading-[0.9] tracking-tighter text-white animate-fade-in opacity-0" style={{animationDelay: '0.4s'}}>
            Capture The <br />
            <span className="text-transparent bg-clip-text bg-gold-gradient italic pr-2 relative inline-block">
                Untamed
                <span className="absolute -bottom-2 left-0 w-full h-2 bg-gold-400/20 blur-lg"></span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in opacity-0" style={{animationDelay: '0.6s'}}>
            Specializing in editorial wedding photography and cinematic portraiture. Creating visual legacies for the modern romantics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up opacity-0" style={{animationDelay: '0.8s'}}>
            <Button variant="luxury" onClick={() => handleScrollTo('portfolio')}>Explore Portfolio</Button>
            <Button variant="outline" onClick={() => handleScrollTo('ai-studio')}>
                <span className="flex items-center gap-2">Try AI Studio <Maximize2 className="w-3 h-3" /></span>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 animate-float opacity-70">
           <span className="text-[10px] uppercase tracking-widest text-gray-400">Scroll to explore</span>
           <div className="w-[1px] h-16 bg-gradient-to-b from-gold-400 via-gold-400/50 to-transparent"></div>
        </div>
      </header>

      {/* --- Portfolio Section (Masonry & Lightbox) --- */}
      <section id="portfolio" className="min-h-screen py-32 container mx-auto px-6 relative bg-obsidian">
        <SectionTitle title="Selected Works" subtitle="A curation of moments, emotions, and timeless beauty." />
        
        {/* Masonry Layout: Using Tailwind columns for true masonry effect */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {PLACEHOLDER_IMAGES.map((src, i) => (
            <div 
              key={i} 
              className="group relative overflow-hidden rounded-lg break-inside-avoid cursor-pointer shadow-lg hover:shadow-gold-400/10 transition-shadow duration-500 mb-6"
              onClick={() => setLightboxIndex(i)}
            >
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center">
                 <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 text-center">
                    <p className="text-gold-400 text-xs uppercase tracking-widest mb-1">View Project</p>
                    <h3 className="text-2xl font-serif text-white italic">Series No. {i+1}</h3>
                 </div>
              </div>
              <img src={src} alt={`Portfolio ${i}`} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out" />
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
            <Button variant="outline" className="mx-auto px-10 border-white/20 text-white hover:bg-white/5">View Full Archive</Button>
        </div>
      </section>

      {/* --- Lightbox Overlay --- */}
      {lightboxIndex !== null && (
        <div 
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setLightboxIndex(null)}
        >
            {/* Close Button */}
            <button className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-[102]" onClick={() => setLightboxIndex(null)}>
                <X className="w-8 h-8" />
            </button>
            
            {/* Navigation Left */}
            <button 
                className="absolute left-4 md:left-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors hidden md:flex items-center justify-center group z-[102]"
                onClick={prevImage}
            >
                <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* Main Image Container */}
            <div 
                className="relative max-h-[90vh] max-w-[95vw] md:max-w-[85vw] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()} 
            >
                <img 
                    src={PLACEHOLDER_IMAGES[lightboxIndex]} 
                    alt="Full size" 
                    className="max-h-[90vh] max-w-full object-contain shadow-2xl rounded-sm animate-fade-in select-none"
                />
            </div>

            {/* Navigation Right */}
            <button 
                className="absolute right-4 md:right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors hidden md:flex items-center justify-center group z-[102]"
                onClick={nextImage}
            >
                <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-8 left-0 right-0 text-center text-gray-400 text-sm tracking-[0.2em] font-light">
                {String(lightboxIndex + 1).padStart(2, '0')} — {String(PLACEHOLDER_IMAGES.length).padStart(2, '0')}
            </div>
        </div>
      )}

      {/* --- Services Section --- */}
      <section id="services" className="min-h-screen py-32 bg-surface/30 relative flex items-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
            <SectionTitle title="The Investment" subtitle="Bespoke photography experiences tailored to your legacy." />
            
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {[
                    { title: "The Wedding", desc: "Full day cinematic coverage. Two photographers. Fine art album included.", price: "from $3,500" },
                    { title: "Editorial Portrait", desc: "Studio or location session tailored for models, artists, and visionaries.", price: "from $800" },
                    { title: "Brand Campaign", desc: "Visual identity creation for luxury brands and commercial projects.", price: "Custom Quote" }
                ].map((s, i) => (
                    <div key={i} className="bg-charcoal/50 backdrop-blur-sm p-12 rounded-2xl border border-white/5 hover:border-gold-400/30 transition-all duration-500 hover:-translate-y-2 group flex flex-col h-full">
                        <div className="w-14 h-14 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400 mb-8 group-hover:bg-gold-400 group-hover:text-black transition-colors duration-500">
                            <Star className="w-6 h-6 fill-current" />
                        </div>
                        <h3 className="text-3xl font-serif text-white mb-4 group-hover:text-gold-400 transition-colors">{s.title}</h3>
                        <p className="text-gray-400 mb-10 leading-relaxed text-lg flex-grow">{s.desc}</p>
                        <div className="pt-8 border-t border-white/10 flex items-end justify-between">
                             <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Starting at</p>
                                <p className="text-xl text-white font-medium">{s.price}</p>
                             </div>
                             <Button variant="outline" className="!px-4 !py-2 !text-xs border-white/20 group-hover:bg-white group-hover:text-black transition-colors" onClick={() => handleScrollTo('contact')}>Inquire</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- AI Studio Section --- */}
      <AIStudio />

      {/* --- Contact Section --- */}
      <section id="contact" className="min-h-[80vh] py-32 container mx-auto px-6 relative overflow-hidden flex items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-gold-400/5 to-transparent blur-3xl pointer-events-none"></div>

        <div className="w-full">
            <SectionTitle title="Start the Conversation" subtitle="Available for commissions worldwide." />
            
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
                <div className="space-y-12">
                    <div>
                        <h3 className="text-2xl font-serif text-white mb-8">Contact Info</h3>
                        <div className="space-y-8">
                            <a href="#" className="flex items-center gap-6 text-gray-400 hover:text-gold-400 transition-colors group">
                                <div className="w-14 h-14 rounded-full bg-surface border border-white/10 flex items-center justify-center group-hover:border-gold-400 transition-colors"><Mail className="w-6 h-6" /></div>
                                <span className="text-xl font-light">hello@ravimaurya.com</span>
                            </a>
                            <a href="#" className="flex items-center gap-6 text-gray-400 hover:text-gold-400 transition-colors group">
                                <div className="w-14 h-14 rounded-full bg-surface border border-white/10 flex items-center justify-center group-hover:border-gold-400 transition-colors"><Phone className="w-6 h-6" /></div>
                                <span className="text-xl font-light">+1 (555) 123-4567</span>
                            </a>
                            <a href="#" className="flex items-center gap-6 text-gray-400 hover:text-gold-400 transition-colors group">
                                <div className="w-14 h-14 rounded-full bg-surface border border-white/10 flex items-center justify-center group-hover:border-gold-400 transition-colors"><Instagram className="w-6 h-6" /></div>
                                <span className="text-xl font-light">@ravimaurya_lens</span>
                            </a>
                        </div>
                    </div>
                    <div className="p-8 bg-surface/50 rounded-2xl border border-white/5 backdrop-blur-md">
                        <p className="text-gray-300 italic text-lg leading-relaxed">"Photography is the story I fail to put into words."</p>
                        <p className="text-gold-400 mt-6 text-sm font-bold uppercase tracking-widest">— Ravi Maurya</p>
                    </div>
                </div>

                <form className="space-y-6 bg-surface/30 p-10 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 uppercase tracking-widest pl-1">First Name</label>
                            <input type="text" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:border-gold-400 outline-none text-white transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-500 uppercase tracking-widest pl-1">Last Name</label>
                            <input type="text" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:border-gold-400 outline-none text-white transition-colors" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                        <input type="email" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:border-gold-400 outline-none text-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500 uppercase tracking-widest pl-1">Your Vision</label>
                        <textarea className="w-full bg-black/40 border border-white/10 p-4 rounded-xl focus:border-gold-400 outline-none text-white h-32 resize-none transition-colors"></textarea>
                    </div>
                    <Button variant="luxury" className="w-full text-lg py-4">Send Inquiry</Button>
                </form>
            </div>
        </div>
      </section>

      <footer className="bg-black py-12 border-t border-gray-900/50">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-serif font-bold tracking-tight text-white">RM.</div>
            <p className="text-gray-600 text-sm">&copy; 2024 Ravi Maurya. Crafted with Gemini AI.</p>
            <div className="flex gap-8">
                <a href="#" className="text-gray-600 hover:text-white transition-colors text-xs uppercase tracking-widest">Privacy</a>
                <a href="#" className="text-gray-600 hover:text-white transition-colors text-xs uppercase tracking-widest">Terms</a>
            </div>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
}

export default App;