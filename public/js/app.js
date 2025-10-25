// Main Application Logic
class FitAIApp {
    constructor() {
        this.gemini = null;
        this.currentTheme = getConfig('theme.default');
        this.currentFontSize = getConfig('customization.fontSizeRange.default');
        this.currentLayout = getConfig('layout.defaultWidth');
        this.chatOpen = false;
        this.settingsOpen = false;
        
        this.init();
    }

    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.initializeElements();
        this.loadUserPreferences();
        this.setupEventListeners();
        this.initializeGeminiAPI();
        this.populateNavigation();
        this.setupAccessibility();
        
        if (getConfig('debug.enabled')) {
            console.log('FitAI App initialized');
        }
    }

    initializeElements() {
        // Cache DOM elements for better performance
        this.elements = {
            body: document.body,
            themeToggle: document.getElementById('theme-toggle'),
            settingsBtn: document.getElementById('settings-btn'),
            settingsPanel: document.getElementById('settings-panel'),
            closeSettings: document.getElementById('close-settings'),
            aiToggle: document.getElementById('ai-toggle'),
            aiChat: document.getElementById('ai-chat'),
            closeChat: document.getElementById('close-chat'),
            chatMessages: document.getElementById('chat-messages'),
            chatInput: document.getElementById('chat-input'),
            sendChat: document.getElementById('send-chat'),
            colorScheme: document.getElementById('color-scheme'),
            fontSize: document.getElementById('font-size'),
            fontSizeValue: document.getElementById('font-size-value'),
            layoutWidth: document.getElementById('layout-width'),
            navItems: document.getElementById('nav-items'),
            siteTitle: document.getElementById('site-title'),
            pageTitle: document.getElementById('page-title'),
            footerText: document.getElementById('footer-text')
        };
    }

    setupEventListeners() {
        // Theme toggle
        if (this.elements.themeToggle) {
            this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Settings panel
        if (this.elements.settingsBtn) {
            this.elements.settingsBtn.addEventListener('click', () => this.openSettings());
        }
        if (this.elements.closeSettings) {
            this.elements.closeSettings.addEventListener('click', () => this.closeSettings());
        }

        // AI Chat
        if (this.elements.aiToggle) {
            this.elements.aiToggle.addEventListener('click', () => this.toggleChat());
        }
        if (this.elements.closeChat) {
            this.elements.closeChat.addEventListener('click', () => this.closeChat());
        }

        // Chat input
        if (this.elements.chatInput) {
            this.elements.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
        if (this.elements.sendChat) {
            this.elements.sendChat.addEventListener('click', () => this.sendMessage());
        }

        // Settings controls
        if (this.elements.colorScheme) {
            this.elements.colorScheme.addEventListener('change', (e) => this.changeTheme(e.target.value));
        }
        if (this.elements.fontSize) {
            this.elements.fontSize.addEventListener('input', (e) => this.changeFontSize(e.target.value));
        }
        if (this.elements.layoutWidth) {
            this.elements.layoutWidth.addEventListener('change', (e) => this.changeLayout(e.target.value));
        }

        // Close panels when clicking outside
        document.addEventListener('click', (e) => {
            if (this.settingsOpen && !this.elements.settingsPanel.contains(e.target) && e.target !== this.elements.settingsBtn) {
                this.closeSettings();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        this.toggleChat();
                        break;
                    case ',':
                        e.preventDefault();
                        this.openSettings();
                        break;
                }
            }
            if (e.key === 'Escape') {
                if (this.chatOpen) this.closeChat();
                if (this.settingsOpen) this.closeSettings();
            }
        });
    }

    async initializeGeminiAPI() {
        if (getConfig('ai.enabled')) {
            this.gemini = new GeminiAPI();
            
            // Clear chat history every time the website loads
            this.clearChatMessages();
            
            // Initialize Supabase database
            if (getConfig('api.supabase.enabled')) {
                this.database = new SupabaseDB();
            }
            
            // Show welcome message if chat is enabled
            if (getConfig('ai.autoStart')) {
                this.addChatMessage('assistant', getConfig('ai.welcomeMessage'));
            }
        }
    }

    populateNavigation() {
        const navItems = getConfig('navigation.items');
        if (navItems && this.elements.navItems) {
            this.elements.navItems.innerHTML = '';
            navItems.forEach(item => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = item.href;
                a.textContent = item.text;
                if (item.active) a.classList.add('active');
                li.appendChild(a);
                this.elements.navItems.appendChild(li);
            });
        }

        // Set site title
        const siteTitle = getConfig('site.title');
        if (siteTitle) {
            if (this.elements.siteTitle) this.elements.siteTitle.textContent = siteTitle;
            if (this.elements.pageTitle) this.elements.pageTitle.textContent = siteTitle;
        }

        // Set footer text
        const footerText = getConfig('content.footer.text');
        if (footerText && this.elements.footerText) {
            this.elements.footerText.textContent = footerText;
        }
    }

    setupAccessibility() {
        // Add ARIA labels and roles
        if (this.elements.themeToggle) {
            this.elements.themeToggle.setAttribute('aria-label', 'Toggle theme');
        }
        if (this.elements.settingsBtn) {
            this.elements.settingsBtn.setAttribute('aria-label', 'Open settings');
        }
        if (this.elements.aiToggle) {
            this.elements.aiToggle.setAttribute('aria-label', 'Toggle AI assistant');
        }
    }

    // Theme Management
    toggleTheme() {
        const themes = ['light', 'dark', 'blue', 'green', 'purple'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.changeTheme(themes[nextIndex]);
    }

    changeTheme(theme) {
        this.currentTheme = theme;
        this.elements.body.setAttribute('data-theme', theme);
        
        // Update theme toggle icon
        if (this.elements.themeToggle) {
            const icons = { light: '🌙', dark: '☀️', blue: '🔵', green: '🟢', purple: '🟣' };
            this.elements.themeToggle.textContent = icons[theme] || '🌙';
        }

        // Update settings UI
        if (this.elements.colorScheme) {
            this.elements.colorScheme.value = theme;
        }

        this.saveUserPreferences();
        
        if (getConfig('debug.enabled')) {
            console.log(`Theme changed to: ${theme}`);
        }
    }

    // Font Size Management
    changeFontSize(size) {
        this.currentFontSize = parseInt(size);
        this.elements.body.style.setProperty('--font-size-base', `${size}px`);
        
        if (this.elements.fontSizeValue) {
            this.elements.fontSizeValue.textContent = `${size}px`;
        }

        this.saveUserPreferences();
    }

    // Layout Management
    changeLayout(layout) {
        this.currentLayout = layout;
        this.elements.body.setAttribute('data-layout', layout);
        
        this.saveUserPreferences();
        
        if (getConfig('debug.enabled')) {
            console.log(`Layout changed to: ${layout}`);
        }
    }

    // Settings Panel
    openSettings() {
        this.settingsOpen = true;
        this.elements.settingsPanel.classList.remove('hidden');
        
        // Update settings values
        if (this.elements.colorScheme) this.elements.colorScheme.value = this.currentTheme;
        if (this.elements.fontSize) this.elements.fontSize.value = this.currentFontSize;
        if (this.elements.fontSizeValue) this.elements.fontSizeValue.textContent = `${this.currentFontSize}px`;
        if (this.elements.layoutWidth) this.elements.layoutWidth.value = this.currentLayout;
    }

    closeSettings() {
        this.settingsOpen = false;
        this.elements.settingsPanel.classList.add('hidden');
    }

    // Chat Management
    toggleChat() {
        if (this.chatOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.chatOpen = true;
        this.elements.aiChat.classList.remove('hidden');
        this.elements.aiToggle.style.display = 'none';
        
        // Focus chat input
        if (this.elements.chatInput) {
            this.elements.chatInput.focus();
        }

        // Load chat history (restored normal behavior)
        this.loadChatHistory();
    }

    closeChat() {
        this.chatOpen = false;
        this.elements.aiChat.classList.add('hidden');
        this.elements.aiToggle.style.display = 'block';
    }

    async sendMessage() {
        const input = this.elements.chatInput;
        const message = input.value.trim();
        
        if (!message) return;

        // Clear input
        input.value = '';

        // Add user message to chat
        this.addChatMessage('user', message);

        // Show typing indicator
        this.showTypingIndicator();

        try {
            if (!this.gemini || !this.gemini.validateApiKey()) {
                this.hideTypingIndicator();
                this.addChatMessage('assistant', '❌ Error: Missing API key. Please set your Gemini API key in js/config.js to enable the AI chat functionality.');
                return;
            }

            // Get chat context (last few messages)
            const context = this.gemini.getChatHistory().slice(-10);
            
            // Query database for relevant context
            let databaseContext = null;
            if (this.database && this.database.isReady()) {
                try {
                    const contextData = await this.database.queryForContext(message);
                    if (contextData) {
                        databaseContext = this.database.formatContextForAI(contextData);
                    }
                } catch (dbError) {
                    console.warn('Database query failed:', dbError);
                    // Continue without database context
                }
            }
            
            // Send to Gemini API with database context
            const response = await this.gemini.chat(message, context, databaseContext);
            
            this.hideTypingIndicator();
            this.addChatMessage('assistant', response);
            
        } catch (error) {
            this.hideTypingIndicator();
            this.addChatMessage('assistant', `Sorry, I encountered an error: ${error.message}`);
            
            if (getConfig('debug.enabled')) {
                console.error('Chat error:', error);
            }
        }
    }

    addChatMessage(sender, message) {
        const messagesContainer = this.elements.chatMessages;
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Format message with better typography for AI responses
        if (sender === 'assistant') {
            // Convert basic markdown-like formatting to HTML
            let formattedMessage = message
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
                .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
                .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
                .replace(/\n\n/g, '</p><p>') // Paragraphs
                .replace(/\n/g, '<br>'); // Line breaks
            
            // Wrap in paragraph if not already formatted
            if (!formattedMessage.includes('<p>')) {
                formattedMessage = '<p>' + formattedMessage + '</p>';
            }
            
            messageContent.innerHTML = formattedMessage;
        } else {
            messageContent.textContent = message;
        }
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        messagesContainer.appendChild(messageDiv);
        
        // Smooth scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = '<div class="spinner"></div> AI is typing...';
        indicator.id = 'typing-indicator';
        this.elements.chatMessages.appendChild(indicator);
        this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    clearChatMessages() {
        // Clear all chat messages from the UI
        if (this.elements.chatMessages) {
            this.elements.chatMessages.innerHTML = '';
        }
        
        // Also clear the chat history from the Gemini API
        if (this.gemini) {
            this.gemini.clearChatHistory();
        }
    }

    loadChatHistory() {
        if (this.gemini) {
            const history = this.gemini.getChatHistory();
            this.elements.chatMessages.innerHTML = '';
            
            history.forEach(msg => {
                this.addChatMessage(msg.role, msg.content);
            });
        }
    }

    // User Preferences
    saveUserPreferences() {
        if (getConfig('customization.savePreferences')) {
            const preferences = {
                theme: this.currentTheme,
                fontSize: this.currentFontSize,
                layout: this.currentLayout,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem(getConfig('storageKeys.userPreferences'), JSON.stringify(preferences));
        }
    }

    loadUserPreferences() {
        if (getConfig('customization.savePreferences')) {
            try {
                const saved = localStorage.getItem(getConfig('storageKeys.userPreferences'));
                if (saved) {
                    const preferences = JSON.parse(saved);
                    
                    if (preferences.theme) this.changeTheme(preferences.theme);
                    if (preferences.fontSize) this.changeFontSize(preferences.fontSize);
                    if (preferences.layout) this.changeLayout(preferences.layout);
                }
            } catch (error) {
                if (getConfig('debug.enabled')) {
                    console.warn('Failed to load user preferences:', error);
                }
            }
        }
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        // Create a simple notification system
        const notification = document.createElement('div');
        notification.className = `notification alert-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 12px 16px;
            border-radius: 4px;
            animation: fadeIn 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Performance monitoring (if enabled)
    measurePerformance(name, fn) {
        if (getConfig('debug.showPerformanceMetrics')) {
            const start = performance.now();
            const result = fn();
            const end = performance.now();
            console.log(`${name} took ${end - start} milliseconds`);
            return result;
        }
        return fn();
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FitAIApp();
});

// Export for global access
window.FitAIApp = FitAIApp;