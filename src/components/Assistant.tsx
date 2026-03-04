import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function Assistant() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Olá! Sou seu assistente cirúrgico. Como posso ajudar hoje? Posso tirar dúvidas sobre protocolos, doses de antibióticos ou condutas cirúrgicas.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "Você é um assistente especializado em Cirurgia Geral para o Hospital Metropolitano de João Pessoa. Forneça informações baseadas em evidências médicas, protocolos do hospital e seja conciso. Se não souber algo, recomende consultar o preceptor ou o protocolo oficial. Responda em Português do Brasil.",
        },
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.text || 'Desculpe, não consegui processar sua solicitação.' }]);
    } catch (error) {
      console.error('Error calling Gemini:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erro ao conectar com o assistente. Verifique sua conexão.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-bottom border-slate-100 bg-slate-50 flex items-center gap-2">
        <Bot className="w-5 h-5 text-hospital-primary" />
        <h2 className="font-semibold text-slate-700">Assistente Cirúrgico AI</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-hospital-primary text-white" : "bg-slate-100 text-slate-600"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={cn(
              "max-w-[80%] p-3 rounded-2xl text-sm",
              msg.role === 'user' ? "bg-hospital-primary text-white rounded-tr-none" : "bg-slate-100 text-slate-800 rounded-tl-none"
            )}>
              <div className="markdown-body">
                <Markdown>{msg.content}</Markdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre protocolos, doses..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hospital-primary/20"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-hospital-primary text-white p-2 rounded-xl hover:bg-hospital-primary/90 transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
