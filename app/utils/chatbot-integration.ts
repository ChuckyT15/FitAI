// Utility functions to integrate with the chatbot JS files
// This bridges your existing JavaScript chatbot implementation with React

export interface ChatbotConfig {
  apiKey?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export interface ChatMessage {
  message: string;
  userId?: string;
  sessionId?: string;
}

export interface ChatResponse {
  response: string;
  success: boolean;
  error?: string;
}

// Global references to your JS classes (will be initialized)
declare global {
  interface Window {
    GeminiAPI: any;
    SupabaseDB: any;
    FitAIApp: any;
    CONFIG: any;
    getConfig: (path: string) => any;
  }
}

// Initialize your JavaScript classes
let geminiAPI: any = null;
let supabaseDB: any = null;
let fitAIApp: any = null;

// Load and initialize your JavaScript files
export async function initializeChatbotJS(): Promise<void> {
  try {
    // Load the config first
    await loadScript('/js/config.js');
    
    // Load the other JS files
    await loadScript('/js/supabase-db.js');
    await loadScript('/js/gemini-api.js');
    await loadScript('/js/app.js');

    // Wait a bit for scripts to initialize
    await new Promise(resolve => setTimeout(resolve, 100));

    // Initialize instances
    if (window.GeminiAPI) {
      geminiAPI = new window.GeminiAPI();
    }
    
    if (window.SupabaseDB) {
      supabaseDB = new window.SupabaseDB();
    }

    console.log('Chatbot JavaScript files loaded successfully');
  } catch (error) {
    console.error('Error loading chatbot JavaScript files:', error);
  }
}

// Helper function to load scripts
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

// This function will integrate with your gemini-api.js
export async function sendMessageToGemini(message: string): Promise<ChatResponse> {
  try {
    // Initialize if not already done
    if (!geminiAPI && window.GeminiAPI) {
      geminiAPI = new window.GeminiAPI();
      // Wait for initialization
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (!geminiAPI) {
      throw new Error('Gemini API not initialized');
    }

    // Use your existing chat method from your GeminiAPI class
    const response = await geminiAPI.chat(message);
    
    return {
      response: response,
      success: true
    };
  } catch (error) {
    console.error('Error communicating with Gemini API:', error);
    return {
      response: 'Sorry, I encountered an error with the AI. Please make sure your API key is configured in js/config.js',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// This function will integrate with your supabase-db.js
export async function saveChatMessage(message: ChatMessage): Promise<boolean> {
  try {
    // Initialize if not already done
    if (!supabaseDB && window.SupabaseDB) {
      supabaseDB = new window.SupabaseDB();
      // Wait for initialization
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (!supabaseDB || !supabaseDB.isReady()) {
      console.log('Supabase not configured, skipping message save');
      return true; // Don't fail if Supabase isn't configured
    }

    // Your SupabaseDB class doesn't have a saveMessage method, so we'll just log for now
    // The database functionality is mainly for querying context, not saving messages
    console.log('Chat message logged (database saving not implemented in current SupabaseDB):', message);
    return true;
    
  } catch (error) {
    console.error('Error saving chat message:', error);
    return false;
  }
}

// This function will integrate with your app.js for session management
export async function initializeChatSession(): Promise<string> {
  try {
    // Generate a session ID similar to your app.js pattern
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store session ID if needed for your app.js integration
    localStorage.setItem('fitai_session_id', sessionId);
    
    return sessionId;
  } catch (error) {
    console.error('Error initializing chat session:', error);
    return `fallback_session_${Date.now()}`;
  }
}

// Load configuration from your config.js
export async function loadChatbotConfig(): Promise<ChatbotConfig> {
  try {
    // Initialize if not already done
    if (!window.CONFIG && !window.getConfig) {
      await loadScript('/js/config.js');
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!window.getConfig) {
      throw new Error('Config not loaded');
    }

    // Use your existing config system
    return {
      apiKey: window.getConfig('api.gemini.apiKey'),
      supabaseUrl: window.getConfig('api.supabase.url'),
      supabaseAnonKey: window.getConfig('api.supabase.anonKey')
    };
  } catch (error) {
    console.error('Error loading chatbot config:', error);
    return {};
  }
}

// Get welcome message from your config
export async function getChatbotWelcomeMessage(): Promise<string> {
  try {
    if (!window.getConfig) {
      await loadScript('/js/config.js');
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return window.getConfig?.('ai.welcomeMessage') || 
           "💪 Hello! I'm FitAI, your specialized fitness and nutrition assistant. How can I help you today?";
  } catch (error) {
    return "Hello! I'm your FitAI assistant. How can I help you with your fitness goals today?";
  }
}