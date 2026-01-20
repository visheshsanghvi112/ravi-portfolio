import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'luxury' }> = ({ 
  children, 
  className = "", 
  variant = 'primary', 
  ...props 
}) => {
  const baseStyle = "px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide active:scale-95";
  
  const variants = {
    primary: "bg-gold-400 text-black hover:bg-gold-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] border border-transparent",
    luxury: "bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 text-black shadow-lg hover:shadow-gold-400/50 bg-[length:200%_auto] hover:bg-right transition-[background-position]",
    secondary: "bg-surface border border-gray-800 text-white hover:border-gold-400/50 hover:bg-charcoal",
    outline: "border border-gold-400/30 text-gold-300 hover:border-gold-400 hover:bg-gold-400/10 backdrop-blur-sm",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`} {...props}>
      {children}
    </button>
  );
};

export const SectionTitle: React.FC<{ title: string; subtitle?: string; centered?: boolean }> = ({ title, subtitle, centered = true }) => (
  <div className={`mb-16 ${centered ? 'text-center' : 'text-left'}`}>
    <h2 className="text-5xl md:text-6xl font-serif text-white mb-6 tracking-tight">
      <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">{title}</span>
    </h2>
    {subtitle && (
      <p className="text-gray-400 max-w-2xl font-light text-lg leading-relaxed mx-auto">
        {subtitle}
      </p>
    )}
    <div className={`w-20 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-8 ${centered ? 'mx-auto' : ''}`}></div>
  </div>
);

export const LoadingOverlay: React.FC<{ message?: string }> = ({ message = "Processing..." }) => (
  <div className="absolute inset-0 bg-obsidian/90 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white border border-white/5 rounded-2xl">
    <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-gold-400/20 animate-spin border-t-gold-400"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-gold-400 animate-pulse" />
        </div>
    </div>
    <p className="font-light tracking-[0.2em] text-sm mt-6 text-gold-100 uppercase">{message}</p>
  </div>
);