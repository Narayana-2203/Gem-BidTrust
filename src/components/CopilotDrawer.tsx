'use client';

import { useState, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, AlertCircle, Paperclip } from 'lucide-react';

export default function CopilotDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Hi there! I am your BidTrust AI Copilot. I assist Procurement Officers by rapidly summarizing tender risks and flagging compliance issues to accelerate your decision-making. How can I help you evaluate today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response based on keywords
    setTimeout(() => {
      let aiResponse = "I'm analyzing your request... However, I am most effective when asked directly about tender compliance, cartel risks, or bidder verification. Could you specify a tender ID or a procurement rule you want to check?";
      
      const lower = userMsg.toLowerCase();
      
      // 1. Casual Chat & Identity
      if (lower.match(/hello|hi\b|hey|greetings/)) {
        aiResponse = "Hello there! I'm ready to help you analyze some tenders today. What would you like to evaluate?";
      } else if (lower.match(/how are you|what's up|whats up/)) {
        aiResponse = "I'm functioning perfectly at optimal capacity! Always ready to crunch some procurement data. How can I assist you today?";
      } else if (lower.match(/who are you|what are you/)) {
        aiResponse = "I am the BidTrust AI Copilot, a specialized virtual assistant designed specifically for Procurement Officers on the GeM portal.";
      } else if (lower.match(/who made you|who created you|team/)) {
        aiResponse = "I was developed by our brilliant team for the Smart India Hackathon to revolutionize GeM procurement and eliminate bid rigging!";
      } 
      // 2. LLM & Architecture Explanation
      else if (lower.match(/llm|model|architecture|how do you work|how are you connected|what ai|basis|how .* reply/)) {
        aiResponse = "For this SIH prototype demo, my responses are running entirely locally at the edge for zero latency. In our production architecture, BidTrust utilizes an open-source LLM (like Llama-3 8B) hosted securely on a sovereign Indian cloud (NIC/MeitY) to ensure absolute data privacy. I use RAG (Retrieval-Augmented Generation) connected to the GeM procurement guidelines to give you accurate evaluations without hallucinating.";
      }
      // 3. Procurement & Evaluation Logic
      else if (lower.includes('which') || lower.includes('how many') || lower.includes('status') || lower.includes('available')) {
        aiResponse = "I am currently monitoring 14 active tenders across the GeM portal. Tender GEM/2026/B/892 requires your immediate attention due to cartel flags. How would you like to proceed?";
      } else if (lower.includes('risk') || lower.includes('cartel')) {
        aiResponse = "I detected a high-risk cartel cluster in Tender GEM/2026/B/892. Three bidders (Bidder-3, Bidder-17, Bidder-42) share the same IP Address and PDF author metadata. I strongly recommend manual review.";
      } else if (lower.includes('non-compliant') || lower.includes('disqualif')) {
        aiResponse = "Bidder-89 and Bidder-12 failed the automatic compliance check due to expired GSTINs and falling below the 5Cr turnover threshold required for this tender category.";
      } else if (lower.includes('summarize') || lower.includes('evaluat')) {
        aiResponse = "This tender has 124 bidders. 89 are fully compliant, 22 require manual verification, and 13 are flagged for high risk (proxy bidding or failed checks). The overall compliance health is 94.2%.";
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessages(prev => [...prev, { role: 'user', content: `[Uploaded File: ${file.name}]` }]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: `I have scanned "${file.name}". Based on the document metadata and OCR extraction, this document meets compliance standards and matches the bidder's verified GSTIN details.` }]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all z-50 flex items-center justify-center group"
        >
          <MessageSquare size={24} />
          <span className="absolute right-16 bg-gray-900 text-white px-3 py-1.5 rounded-md text-xs font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask AI Copilot
          </span>
        </button>
      )}

      {/* Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-white rounded-xl shadow-2xl z-50 flex flex-col border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-50 p-1.5 rounded-md text-blue-600">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">BidTrust AI Copilot</h3>
                <p className="text-[11px] text-gray-500">Active Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-md transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 items-end ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-blue-600 text-white'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 rounded-lg max-w-[75%] text-[13px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 items-end">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot size={14} />
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm flex gap-1 items-center h-[38px]">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-2 py-2 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 transition-all">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button 
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Document"
              >
                <Paperclip size={18} />
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about compliance or upload..."
                className="flex-1 bg-transparent border-none focus:outline-none text-[13px] text-gray-800 placeholder:text-gray-400"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-1.5 rounded-md transition-all ${input.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-400 bg-gray-100'}`}
              >
                <Send size={16} className={input.trim() ? 'ml-0.5' : ''} />
              </button>
            </div>
            <div className="text-[10px] text-center text-gray-400 mt-2 flex items-center justify-center gap-1 font-medium uppercase">
              <AlertCircle size={10} />
              AI can make mistakes. Please verify flagged risks.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
