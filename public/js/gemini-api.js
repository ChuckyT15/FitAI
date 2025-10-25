// Gemini API Integration
class GeminiAPI {
    constructor() {
        this.apiKey = null;
        this.baseUrl = getConfig('api.gemini.baseUrl');
        this.model = getConfig('api.gemini.model');
        this.temperature = getConfig('api.gemini.temperature');
        this.maxTokens = getConfig('api.gemini.maxTokens');
        this.timeout = getConfig('api.gemini.timeout');
        this.chatHistory = [];
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        // First priority: Check if API key is set in config
        const configApiKey = getConfig('api.gemini.apiKey');
        if (configApiKey && configApiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
            this.apiKey = configApiKey;
            this.isInitialized = true;
        }
        // Second priority: Try to load API key from localStorage
        else {
            this.apiKey = localStorage.getItem(getConfig('storageKeys.apiKey'));
            if (!this.apiKey) {
                this.promptForApiKey();
            } else {
                this.isInitialized = true;
            }
        }

        // Load chat history from localStorage
        this.loadChatHistory();
    }

    promptForApiKey() {
        // Just log that API key is missing, don't prompt user
        if (getConfig('debug.enabled')) {
            console.log('Gemini API key not found. Please set it in js/config.js');
        }
        // Don't prompt - let the error handling in sendMessage deal with it
    }

    requestApiKey() {
        const apiKey = prompt('Please enter your Gemini API key:');
        if (apiKey) {
            this.setApiKey(apiKey);
        }
    }

    setApiKey(apiKey) {
        this.apiKey = apiKey;
        localStorage.setItem(getConfig('storageKeys.apiKey'), apiKey);
        this.isInitialized = true;
        
        if (getConfig('debug.enabled')) {
            console.log('Gemini API key set successfully');
        }
    }

    validateApiKey() {
        return this.apiKey && this.apiKey.length > 0;
    }

    async generateContent(prompt, options = {}) {
        if (!this.validateApiKey()) {
            throw new Error('API key not set. Please configure your Gemini API key.');
        }

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: options.temperature || this.temperature,
                maxOutputTokens: options.maxTokens || this.maxTokens,
                candidateCount: 1,
                stopSequences: options.stopSequences || []
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        };

        try {
            const response = await fetch(`${this.baseUrl}${this.model}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
                signal: AbortSignal.timeout(this.timeout)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0) {
                const content = data.candidates[0].content;
                if (content && content.parts && content.parts.length > 0) {
                    return content.parts[0].text;
                }
            }
            
            throw new Error('No content generated');
            
        } catch (error) {
            if (getConfig('debug.enabled')) {
                console.error('Gemini API Error:', error);
            }
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout. Please try again.');
            }
            
            throw error;
        }
    }

    async chat(message, conversationContext = [], databaseContext = null) {
        if (!this.validateApiKey()) {
            throw new Error('API key not set. Please configure your Gemini API key.');
        }

        // Build conversation context
        let contextPrompt = '';
        if (conversationContext.length > 0) {
            contextPrompt = 'Previous conversation:\n';
            conversationContext.forEach(msg => {
                contextPrompt += `${msg.role}: ${msg.content}\n`;
            });
            contextPrompt += '\n';
        }

        // Add system instructions for focused responses
        let systemPrompt = `You are FitAI, a specialized AI fitness and nutrition assistant. You are EXCLUSIVELY focused on helping users with their health and fitness journey.

🎯 YOUR EXPERTISE AREAS (ONLY THESE TOPICS):
1. 💪 FITNESS & EXERCISE: Workouts, exercises, training programs, form, muscle groups, strength training, cardio
2. 🥗 NUTRITION & DIET: Food information, calories, macronutrients, meal planning, supplements, weight management
3. 🏃 WELLNESS & HEALTH: Recovery, sleep, hydration, flexibility, injury prevention, fitness goals
4. 📱 FITAI PRODUCT: Our fitness platform, features, database, and how to achieve fitness goals using our system

⚠️ STRICT RULES - NO EXCEPTIONS:
- You MUST ONLY discuss fitness, nutrition, wellness, and health topics
- If asked about ANYTHING else (politics, current events, entertainment, general technology, weather, etc.), immediately use the redirect response
- Always prioritize database information when available
- Keep responses SHORT and CONCISE (2-3 sentences max unless detailed explanation is specifically requested)
- Be encouraging, motivational, and provide actionable advice
- Focus on the most important points only

🚫 MANDATORY REDIRECT for off-topic questions:
"I'm FitAI - I help with fitness, nutrition, and wellness! 💪 What fitness goal can I help you with?"

🎯 RESPONSE STYLE:
- Keep answers brief and to the point
- Use bullet points for lists when appropriate
- Use fitness emojis sparingly (💪🏃🥗🏋️‍♂️)
- Provide ONE key actionable tip per response
- End with a short engaging question when relevant

`;

        // Add database context if available
        if (databaseContext) {
            systemPrompt += databaseContext;
        } else {
            systemPrompt += '\nNo specific database information found for this query. Provide general fitness/nutrition guidance.\n';
        }

        const fullPrompt = systemPrompt + contextPrompt + `User: ${message}\nAssistant:`;

        try {
            const response = await this.generateContent(fullPrompt);
            
            // Log response details for debugging
            if (getConfig('debug.enabled')) {
                console.log('✅ AI Response received:', {
                    length: response.length,
                    truncated: response.endsWith('...') || !response.trim().endsWith('.') && !response.trim().endsWith('!') && !response.trim().endsWith('?'),
                    lastChars: response.slice(-50)
                });
            }
            
            // Add to chat history
            this.addToHistory('user', message);
            this.addToHistory('assistant', response);
            
            return response;
        } catch (error) {
            console.error('Chat error details:', error);
            throw error;
        }
    }

    addToHistory(role, content) {
        this.chatHistory.push({
            role,
            content,
            timestamp: new Date().toISOString()
        });

        // Limit history size
        const maxMessages = getConfig('ai.maxMessages');
        if (this.chatHistory.length > maxMessages) {
            this.chatHistory = this.chatHistory.slice(-maxMessages);
        }

        // Save to localStorage
        this.saveChatHistory();
    }

    getChatHistory() {
        return this.chatHistory;
    }

    clearChatHistory() {
        this.chatHistory = [];
        localStorage.removeItem(getConfig('storageKeys.chatHistory'));
    }

    saveChatHistory() {
        try {
            localStorage.setItem(
                getConfig('storageKeys.chatHistory'),
                JSON.stringify(this.chatHistory)
            );
        } catch (error) {
            if (getConfig('debug.enabled')) {
                console.warn('Failed to save chat history:', error);
            }
        }
    }

    loadChatHistory() {
        try {
            const saved = localStorage.getItem(getConfig('storageKeys.chatHistory'));
            if (saved) {
                this.chatHistory = JSON.parse(saved);
            }
        } catch (error) {
            if (getConfig('debug.enabled')) {
                console.warn('Failed to load chat history:', error);
            }
            this.chatHistory = [];
        }
    }

    // Utility method for streaming responses (future enhancement)
    async streamContent(prompt, onChunk) {
        // This would implement Server-Sent Events or WebSocket streaming
        // For now, we'll simulate streaming by breaking the response into chunks
        const response = await this.generateContent(prompt);
        
        if (getConfig('ai.typing.enabled')) {
            const speed = getConfig('ai.typing.speed');
            let currentText = '';
            
            for (let i = 0; i < response.length; i++) {
                currentText += response[i];
                onChunk(currentText);
                await new Promise(resolve => setTimeout(resolve, speed));
            }
        } else {
            onChunk(response);
        }
    }

    // Health check for API
    async healthCheck() {
        if (!this.validateApiKey()) {
            return { status: 'error', message: 'API key not configured' };
        }

        try {
            await this.generateContent('Hello', { maxTokens: 10 });
            return { status: 'ok', message: 'API is working' };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    // Get API usage info (if available)
    async getUsageInfo() {
        // This would require additional API calls to get usage information
        // Implementation depends on Gemini API's usage endpoints
        return {
            message: 'Usage information not available in current API version'
        };
    }
}

// Export for global use
window.GeminiAPI = GeminiAPI;
