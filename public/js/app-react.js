// React-compatible FitAI App - All AI/DB logic, no DOM manipulation
class FitAIAppReact {
    constructor() {
        this.gemini = null;
        this.database = null;
        this.currentTheme = getConfig('theme.default');
        this.currentFontSize = getConfig('customization.fontSizeRange.default');
        this.currentLayout = getConfig('layout.defaultWidth');
        
        this.init();
    }

    async init() {
        await this.initializeGeminiAPI();
        
        if (getConfig('debug.enabled')) {
            console.log('FitAI App (React) initialized');
        }
    }

    async initializeGeminiAPI() {
        try {
            // Initialize Gemini API
            this.gemini = new GeminiAPI();
            
            // Initialize Supabase database
            if (typeof SupabaseDB !== 'undefined') {
                this.database = new SupabaseDB();
            }
            
            if (getConfig('debug.enabled')) {
                console.log('✅ Gemini API and Database initialized for React');
            }
            
        } catch (error) {
            console.error('Failed to initialize Gemini API:', error);
        }
    }

    // Main message processing - returns response for React to handle
    async processMessage(message) {
        if (!message || !message.trim()) {
            return {
                success: false,
                response: 'Please enter a message.'
            };
        }

        try {
            if (!this.gemini || !this.gemini.validateApiKey()) {
                return {
                    success: false,
                    response: '❌ Error: Missing API key. Please set your Gemini API key in js/config.js to enable the AI chat functionality.'
                };
            }

            // Get chat context (last few messages from history)
            const context = this.gemini.getChatHistory().slice(-10);
            
            // Query database for relevant context
            let databaseContext = null;
            if (this.database && this.database.isReady()) {
                try {
                    console.log('🔍 Querying database for context with message:', message);
                    const contextData = await this.database.queryForContext(message);
                    if (contextData) {
                        databaseContext = this.database.formatContextForAI(contextData);
                        console.log('📊 Database context retrieved:', contextData);
                    }
                } catch (dbError) {
                    console.warn('Database query failed:', dbError);
                    // Continue without database context
                }
            }
            
            // Send to Gemini API with database context
            console.log('🤖 Sending to Gemini with database context...');
            const response = await this.gemini.chat(message, context, databaseContext);
            
            return {
                success: true,
                response: response
            };
            
        } catch (error) {
            console.error('Chat error:', error);
            return {
                success: false,
                response: `Sorry, I encountered an error: ${error.message}`
            };
        }
    }

    // Theme management for React
    setTheme(theme) {
        this.currentTheme = theme;
        // React will handle the actual DOM updates
        this.saveUserPreferences();
        
        if (getConfig('debug.enabled')) {
            console.log('Theme set to:', theme);
        }
    }

    // Font size management for React  
    setFontSize(size) {
        this.currentFontSize = size;
        this.saveUserPreferences();
        
        if (getConfig('debug.enabled')) {
            console.log('Font size set to:', size);
        }
    }

    // Layout management for React
    setLayout(layout) {
        this.currentLayout = layout;
        this.saveUserPreferences();
        
        if (getConfig('debug.enabled')) {
            console.log('Layout set to:', layout);
        }
    }

    // Save user preferences 
    saveUserPreferences() {
        const preferences = {
            theme: this.currentTheme,
            fontSize: this.currentFontSize,
            layout: this.currentLayout,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem(getConfig('storageKeys.preferences'), JSON.stringify(preferences));
        
        if (getConfig('debug.enabled')) {
            console.log('User preferences saved:', preferences);
        }
    }

    // Load user preferences
    loadUserPreferences() {
        try {
            const saved = localStorage.getItem(getConfig('storageKeys.preferences'));
            if (saved) {
                const preferences = JSON.parse(saved);
                
                this.currentTheme = preferences.theme || getConfig('theme.default');
                this.currentFontSize = preferences.fontSize || getConfig('customization.fontSizeRange.default');
                this.currentLayout = preferences.layout || getConfig('layout.defaultWidth');
                
                if (getConfig('debug.enabled')) {
                    console.log('User preferences loaded:', preferences);
                }
                
                return preferences;
            }
        } catch (error) {
            console.error('Failed to load user preferences:', error);
        }
        
        return null;
    }

    // Get current state for React
    getCurrentState() {
        return {
            theme: this.currentTheme,
            fontSize: this.currentFontSize,
            layout: this.currentLayout,
            isGeminiReady: this.gemini && this.gemini.validateApiKey(),
            isDatabaseReady: this.database && this.database.isReady()
        };
    }

    // Health check
    async healthCheck() {
        const status = {
            gemini: false,
            database: false,
            config: false
        };

        try {
            // Check Gemini
            if (this.gemini) {
                status.gemini = await this.gemini.healthCheck();
            }

            // Check Database  
            if (this.database) {
                status.database = await this.database.testConnection();
            }

            // Check Config
            status.config = typeof getConfig === 'function';

            return status;
        } catch (error) {
            console.error('Health check failed:', error);
            return status;
        }
    }

    // Get welcome message
    getWelcomeMessage() {
        return getConfig('ai.welcomeMessage') || 
               '💪 Hello! I\'m FitAI, your specialized fitness and nutrition assistant. How can I help you today?';
    }

    // Clear chat history
    clearChatHistory() {
        if (this.gemini) {
            this.gemini.clearChatHistory();
        }
    }

    // Get chat history
    getChatHistory() {
        if (this.gemini) {
            return this.gemini.getChatHistory();
        }
        return [];
    }
}

// Make it globally available for React
window.FitAIAppReact = FitAIAppReact;