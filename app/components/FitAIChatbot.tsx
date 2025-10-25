import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Arnold character poses for random selection
const CHARACTER_POSES = [
  '/assets/characters/Arnold_Exclaiming.png',
  '/assets/characters/Arnold_Explaining.png', 
  '/assets/characters/Arnold_Flexing.png',
  '/assets/characters/Arnold_Posing.png'
];

declare global {
  interface Window {
    FitAIAppReact: any;
  }
}

export default function FitAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [fitAIApp, setFitAIApp] = useState<any>(null);
  const [currentCharacterPose, setCurrentCharacterPose] = useState(CHARACTER_POSES[0]);
  const [poseIndex, setPoseIndex] = useState(0);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const [arnoldVisible, setArnoldVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load your FitAI system
  useEffect(() => {
    const loadFitAI = async () => {
      try {
        console.log('🚀 Loading your FitAI system...');
        
        // Load your files with fresh cache busting
        const timestamp = Date.now();
        console.log('🔄 Loading JS files with timestamp:', timestamp);
        await loadScript(`/js/config.js?v=${timestamp}`);
        await loadScript(`/js/supabase-db.js?v=${timestamp}`);
        await loadScript(`/js/gemini-api.js?v=${timestamp}`);
        await loadScript(`/js/app-react.js?v=${timestamp}`);
        
        // Wait for initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create FitAI app instance
        if (window.FitAIAppReact) {
          const app = new window.FitAIAppReact();
          setFitAIApp(app);
          
          // Get welcome message
          const welcomeMsg = app.getWelcomeMessage();
          
          setMessages([{
            id: '1',
            text: welcomeMsg,
            sender: 'bot',
            timestamp: new Date()
          }]);
          
          console.log('✅ FitAI React system loaded!');
          setIsReady(true);
        }
        
      } catch (error) {
        console.error('❌ Error loading FitAI:', error);
        setMessages([{
          id: '1',
          text: 'Error loading FitAI system. Check console for details.',
          sender: 'bot',
          timestamp: new Date()
        }]);
      }
    };
    
    loadFitAI();
  }, []);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load: ${src}`));
      document.head.appendChild(script);
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cycle through character poses
  const getNextCharacterPose = () => {
    const nextIndex = (poseIndex + 1) % CHARACTER_POSES.length;
    setPoseIndex(nextIndex);
    return CHARACTER_POSES[nextIndex];
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !isReady || !fitAIApp) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    
    // Show Arnold after the first user message
    if (!hasUserSentMessage) {
      setHasUserSentMessage(true);
      setTimeout(() => setArnoldVisible(true), 300); // Small delay for smooth animation
    }

    try {
      console.log('🔥 Processing message through your FitAI system:', currentMessage);
      
      // Use your React-compatible app to process the message
      // This will:
      // 1. Query your Supabase database for context
      // 2. Send to Gemini API with database context
      // 3. Return the AI response
      const result = await fitAIApp.processMessage(currentMessage);
      
      if (result.success) {
        // Change character pose when bot responds
        setCurrentCharacterPose(getNextCharacterPose());
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: result.response,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: result.response,
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
      
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing your message.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleChatToggle = () => {
    if (isOpen) {
      // Closing chat - slide Arnold out first
      setArnoldVisible(false);
      setTimeout(() => {
        setIsOpen(false);
        // Reset states when closing
        setHasUserSentMessage(false);
      }, 300); // Wait for slide-out animation
    } else {
      // Opening chat
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleChatToggle}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
        aria-label={isOpen ? 'Close FitAI' : 'Open FitAI'}
      >
        {isOpen ? (
          <svg className="w-6 h-6 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Arnold Character Interface - Perfectly aligned */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 flex flex-col items-center">
          
          {/* Arnold Character - Mirrored and positioned above chat box with slide animation */}
          <div className={`relative mb-0 transition-all duration-500 ease-in-out transform ${
            arnoldVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}>
            <img 
              src={currentCharacterPose} 
              alt="Arnold - Your FitAI Coach"
              className="w-64 h-64 object-contain transition-all duration-500 filter drop-shadow-lg transform scale-x-[-1]"
              onError={(e) => {
                // Fallback if image doesn't load
                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>';
              }}
            />
            
            {/* Arnold's Speech Bubble */}
            {arnoldVisible && (messages.filter(m => m.sender === 'bot').length > 0 || isLoading) && (
              <div className="absolute -left-78 -top-0 min-w-56 max-w-80 max-h-50 w-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-600 p-3 overflow-y-scroll scrollbar-hide after:content-[''] after:absolute after:right-[-12px] after:bottom-4 after:w-0 after:h-0 after:border-t-[12px] after:border-t-transparent after:border-b-[12px] after:border-b-transparent after:border-l-[12px] after:border-l-white dark:after:border-l-gray-800 animate-fadeIn"
                style={{
                  scrollbarWidth: 'none', /* Firefox */
                  msOverflowStyle: 'none', /* IE and Edge */
                }}>
                {isLoading ? (
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <span className="text-sm font-medium">Arnold is thinking</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                    {messages.filter(m => m.sender === 'bot').slice(-1).map(message => (
                      <div key={message.id}>
                        <div 
                          className="prose prose-sm prose-gray dark:prose-invert max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: message.text
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em>$1</em>')
                              .replace(/\n/g, '<br>')
                              .replace(/•\s/g, '• ')
                              .replace(/(\d+\.)\s/g, '<span class="font-medium">$1</span> ')
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Input Box - Speech bubble style */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-80 relative before:content-[''] before:absolute before:right-[-15px] before:top-6 before:w-0 before:h-0 before:border-t-[15px] before:border-t-transparent before:border-b-[15px] before:border-b-transparent before:border-l-[15px] before:border-l-gray-200 dark:before:border-l-gray-700 after:content-[''] after:absolute after:right-[-12px] after:top-6 after:w-0 after:h-0 after:border-t-[12px] after:border-t-transparent after:border-b-[12px] after:border-b-transparent after:border-l-[12px] after:border-l-white dark:after:border-l-gray-800">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Arnold about fitness, nutrition, gyms..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                disabled={isLoading || !isReady}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !isReady}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            {/* Status indicator */}
            <div className="mt-2 text-xs text-center">
              {!isReady && <span className="text-gray-500">Loading Arnold...</span>}
              {isReady && messages.length === 0 && <span className="text-green-600 dark:text-green-400">💪 Arnold is ready to help!</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}