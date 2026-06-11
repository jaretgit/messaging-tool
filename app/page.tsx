'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type Theme = 'alberta' | 'neutral';

const QUICK_PROMPTS = [
  'What are the three key messages?',
  'How do I respond to someone who supports the immigration questions?',
  "What's our strongest argument against separation?",
  'How do I explain the economic risk in plain language?',
  "Someone says 'Alberta should control its own borders' — what do I say?",
  'How should I talk about the constitutional questions?',
  "What if someone says they just want 'proof of citizenship' to vote?",
  'Give me the bottom line on all 10 questions.',
];

const THEME_STYLES = {
  alberta: {
    bg: 'bg-[#EBF5FB]',
    header: 'bg-[#1A5276] text-white',
    toggleBtn: 'bg-white/20 hover:bg-white/30 text-white',
    userBubble: 'bg-[#1A5276] text-white',
    assistantBubble: 'bg-white text-gray-800 border border-gray-200 shadow-sm',
    chip: 'bg-white text-[#1A5276] border border-[#1A5276]/30 hover:bg-[#1A5276] hover:text-white hover:border-[#1A5276]',
    sendBtn: 'bg-[#1A5276] hover:bg-[#154360] disabled:bg-[#1A5276]/40 text-white',
    inputFocus: 'focus:ring-[#1A5276] focus:border-[#1A5276]',
    tagline: 'text-[#1A5276] font-semibold',
    dot: 'bg-[#1A5276]',
  },
  neutral: {
    bg: 'bg-gray-50',
    header: 'bg-gray-900 text-white',
    toggleBtn: 'bg-white/10 hover:bg-white/20 text-white',
    userBubble: 'bg-gray-800 text-white',
    assistantBubble: 'bg-white text-gray-800 border border-gray-200 shadow-sm',
    chip: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-800',
    sendBtn: 'bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white',
    inputFocus: 'focus:ring-gray-600 focus:border-gray-600',
    tagline: 'text-gray-600 font-semibold',
    dot: 'bg-gray-500',
  },
};

function TypingIndicator({ dotClass }: { dotClass: string }) {
  return (
    <div className="flex gap-1 items-center px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${dotClass} animate-bounce`}
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>('alberta');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const t = THEME_STYLES[theme];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = { role: 'user', content: content.trim() };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Request failed');

        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.content },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Something went wrong. Please check your connection and try again.',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  };

  return (
    <div className={`flex flex-col h-full ${t.bg}`}>
      {/* Header */}
      <header className={`${t.header} px-4 py-3 shadow-md flex-shrink-0`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-base leading-tight">
              Alberta&apos;s Voice
            </h1>
            <p className="text-xs opacity-75 mt-0.5">
              No to the Nine. Stay in Canada.
            </p>
          </div>
          <button
            onClick={() => setTheme((t) => (t === 'alberta' ? 'neutral' : 'alberta'))}
            className={`${t.toggleBtn} text-xs px-3 py-1.5 rounded-full transition-colors`}
          >
            {theme === 'alberta' ? 'Neutral theme' : "Alberta's Voice theme"}
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="py-6 text-center">
              <p className="text-gray-500 text-sm mb-1">
                Ask about our messaging, the referendum questions, or how to handle tough conversations.
              </p>
              <p className={`text-xs mb-6 ${t.tagline}`}>
                Referendum Day: October 19, 2026
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    disabled={isLoading}
                    className={`${t.chip} text-xs px-3 py-2 rounded-full transition-colors text-left disabled:opacity-50`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === 'user'
                    ? `${t.userBubble} rounded-br-sm`
                    : `${t.assistantBubble} rounded-bl-sm`
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className={`${t.assistantBubble} rounded-2xl rounded-bl-sm px-4 py-3`}>
                <TypingIndicator dotClass={t.dot} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about messaging, talking points, or how to respond…"
              rows={1}
              className={`flex-1 resize-none border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${t.inputFocus} min-h-[44px] max-h-[120px] overflow-y-auto`}
              style={{ height: '44px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`${t.sendBtn} rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shrink-0 h-[44px]`}
            >
              Send
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Based on Alberta&apos;s Voice campaign materials. For team use only.
          </p>
        </div>
      </div>
    </div>
  );
}
