import { useState } from 'react';

// Placeholder chatbot component - to be enhanced with AI integration later
export default function ChatbotPlaceholder() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi! I'm Iza. Ask me anything about my experience, skills, or anything you might need" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: input }]);
    
    // Placeholder response - replace with actual AI integration
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "Thanks for your question! I can't anmswer that right now, but I'm learning to be more helpful every day." 
      }]);
    }, 500);

    setInput('');
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
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white dark:bg-primary-800 rounded-xl shadow-2xl overflow-hidden z-50 border border-primary-200 dark:border-primary-700">
          {/* Header */}
          <div className="bg-accent-gradient text-gray-900 p-4">
            <h3 className="font-semibold">Ask me anything!</h3>
            <p className="text-sm text-gray-700">About skills, projects, experience...</p>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-white dark:bg-primary-900/50">
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
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-primary-200 dark:border-primary-700 bg-white dark:bg-primary-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 border border-primary-200 dark:border-primary-600 rounded-lg bg-white dark:bg-primary-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-accent-gradient hover:opacity-90 text-gray-900 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
