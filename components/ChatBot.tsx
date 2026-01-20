import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { Button } from './Shared';
import * as GeminiService from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm Ravi's virtual assistant. Ask me about photography packages, wedding trends, or venue ideas!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Check if it's a search query
      if (userMsg.toLowerCase().includes('search') || userMsg.toLowerCase().includes('find') || userMsg.toLowerCase().includes('latest') || userMsg.toLowerCase().includes('trend')) {
         const searchRes = await GeminiService.searchWeb(userMsg);
         setMessages(prev => [...prev, { role: 'model', text: searchRes.text || "I found some info but couldn't summarize it." }]);
      } else {
         // Transform messages for history API
         const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
         const response = await GeminiService.sendChatMessage(history, userMsg);
         setMessages(prev => [...prev, { role: 'model', text: response }]);
      }
    } catch (e: any) {
      console.error("Chat Error:", e);
      let errorMsg = "I'm having trouble connecting right now. Please try again later.";
      
      // Use specific message if available
      if (e.message && (e.message.includes("Permission Denied") || e.message.includes("Quota"))) {
          errorMsg = `Error: ${e.message}`;
      }

      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-gold-400 text-black rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 z-50 w-full max-w-[350px] md:w-[400px] bg-charcoal border border-gray-700 rounded-2xl shadow-2xl transition-all duration-300 transform origin-bottom-right flex flex-col overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gold-400 to-gold-600 p-4 flex justify-between items-center text-black">
            <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-serif font-bold">Ravi's Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-1 rounded"><X className="w-5 h-5" /></button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 h-[400px] overflow-y-auto p-4 space-y-4 bg-black/50">
            {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-gold-400 text-black rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                        {m.text}
                    </div>
                </div>
            ))}
            {isTyping && (
                <div className="flex justify-start">
                     <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none flex gap-1">
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                     </div>
                </div>
            )}
        </div>

        {/* Input */}
        <div className="p-3 bg-charcoal border-t border-gray-700 flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about shoots..." 
                className="flex-1 bg-black/30 border border-gray-600 rounded-full px-4 text-sm text-white focus:border-gold-400 outline-none"
            />
            <button onClick={handleSend} className="p-2 bg-gold-400 text-black rounded-full hover:bg-gold-500 transition-colors">
                <Send className="w-4 h-4" />
            </button>
        </div>
      </div>
    </>
  );
};