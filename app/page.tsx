'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

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

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#003754] animate-bounce"
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    <div className="flex flex-col h-full bg-[#EBF2F7]">
      {/* Header */}
      <header className="bg-[#003754] px-4 py-3 shadow-md flex-shrink-0">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <img
            src="https://albertasvoice.ca/assets/logo.png"
            alt="Alberta's Voice"
            className="h-9 w-9 rounded-full"
          />
          <div>
            <h1 className="font-bold text-base leading-tight text-white">
              Alberta&apos;s Voice
            </h1>
            <p className="text-xs text-white/75 mt-0.5">
              No to the Nine. Stay in Canada.
            </p>
          </div>
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
              <p className="text-xs mb-6 text-[#003754] font-semibold">
                Referendum Day: October 19, 2026
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    disabled={isLoading}
                    className="bg-white text-[#003754] border border-[#003754]/30 hover:bg-[#003754] hover:text-white hover:border-[#003754] text-xs px-3 py-2 rounded-full transition-colors text-left disabled:opacity-50"
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
                    ? 'bg-[#003754] text-white rounded-br-sm'
                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-sm'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border border-gray-200 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">
                <TypingIndicator />
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
              className="flex-1 resize-none border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#003754] focus:border-[#003754] min-h-[44px] max-h-[120px] overflow-y-auto"
              style={{ height: '44px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-[#003754] hover:bg-[#002a40] disabled:bg-[#003754]/40 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors shrink-0 h-[44px]"
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
