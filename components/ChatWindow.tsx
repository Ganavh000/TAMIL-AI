
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { UI_TEXT } from '../constants';
import { chatWithGemini } from '../services/geminiService';

interface MessageWithGrounding extends Message {
  grounding?: any[];
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<MessageWithGrounding[]>([
    { id: '1', role: 'model', text: UI_TEXT.ta.welcome, timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: MessageWithGrounding = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role as 'user' | 'model',
        parts: [{ text: m.text }]
      }));
      
      const { text, grounding } = await chatWithGemini(input, history);
      
      const modelMsg: MessageWithGrounding = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: text || UI_TEXT.ta.error,
        timestamp: Date.now(),
        grounding
      };
      
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-stone-50 overflow-hidden border-x border-stone-200 shadow-inner">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-red-800 text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none border border-stone-200'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed font-serif text-lg">{msg.text}</p>
              
              {msg.grounding && msg.grounding.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500">
                  <p className="font-bold mb-1">{UI_TEXT.ta.sources}</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.grounding.map((chunk, idx) => chunk.web && (
                      <a key={idx} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="bg-stone-100 px-2 py-1 rounded hover:bg-red-100 hover:text-red-700 transition-colors">
                        {chunk.web.title || 'ஆதாரக் கட்டுரை'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border border-stone-100 flex items-center gap-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
              <span className="text-stone-400 font-medium">{UI_TEXT.ta.loading}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-stone-200 bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={UI_TEXT.ta.inputPlaceholder}
          className="flex-1 p-4 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-red-500 bg-stone-50 text-lg"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-red-800 text-white px-6 rounded-xl hover:bg-red-900 transition-colors disabled:opacity-50 flex items-center justify-center shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
