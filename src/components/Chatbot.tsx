import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hi! my name is Iza. Ask me anything." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setError(null);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    // Add typing indicator
    setMessages(prev => [...prev, { role: 'bot', text: '...' }]);

    try {
      // Call the Supabase Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('chat', {
        body: { message: userMessage },
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to get AI response');
      }

      if (!data?.response) {
        throw new Error('No response from AI');
      }

      // Replace typing indicator with actual response
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'bot', text: data.response };
        return updated;
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      // Replace typing indicator with error message
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'bot',
          text: `Sorry, I encountered an error: ${errorMessage}. Please try again.`
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-accent-gradient hover:opacity-90 text-gray-900 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50 glow-orange"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 max-h-[calc(100vh-120px)] bg-white dark:bg-primary-800 rounded-xl shadow-2xl overflow-hidden z-50 border border-primary-200 dark:border-primary-700 flex flex-col">
          {/* Header */}
          <div className="bg-accent-gradient text-gray-900 p-4 flex-shrink-0">
            <h3 className="font-semibold">Ask me anything!</h3>
            <p className="text-sm text-gray-700">About skills, projects, experience...</p>
          </div>

          {/* Messages */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-primary-900/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-accent-gradient text-gray-900'
                      : 'bg-primary-100 dark:bg-primary-700 text-gray-900 dark:text-white'
                  } ${msg.text === '...' ? 'animate-pulse' : ''}`}
                >
                  {msg.text === '...' ? (
                    <span className="inline-flex gap-1">
                      <span className="w-2 h-2 bg-current rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    </span>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Error message */}
          {error && (
            <div className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm flex-shrink-0">
              {error}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-primary-200 dark:border-primary-700 bg-white dark:bg-primary-800 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your question..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-primary-200 dark:border-primary-600 rounded-lg bg-white dark:bg-primary-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-accent-gradient hover:opacity-90 text-gray-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
