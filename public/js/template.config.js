// Configuration file for easy customization
const CONFIG = {
    // Site Information
    site: {
        title: 'FitAI',
        description: 'A customizable AI-powered fitness application',
        author: 'FitAI Team',
        version: '1.0.0',
        logo: null // Set to image path if you have a logo
    },

    // Theme Settings
    theme: {
        default: 'light', // 'light', 'dark', 'blue', 'green', 'purple'
        allowUserThemeChange: true,
        rememberUserPreference: true
    },

    // Layout Settings
    layout: {
        defaultWidth: 'container', // 'full', 'container', 'narrow'
        showHeader: true,
        showFooter: true,
        headerSticky: true
    },

    // Navigation Configuration
    navigation: {
        items: [
            { text: 'Home', href: '#home', active: true },
            { text: 'About', href: '#about', active: false },
            { text: 'Features', href: '#features', active: false },
            { text: 'Contact', href: '#contact', active: false }
        ],
        showLogo: true,
        showThemeToggle: true,
        showSettings: true
    },

    // AI/Gemini Configuration
    ai: {
        enabled: true,
        autoStart: false,
        showFloatingButton: true,
        welcomeMessage: '💪 Hello! I\'m FitAI, your specialized fitness and nutrition assistant. I can help you with exercises, nutrition, workout plans, and wellness questions. What fitness goal can I help you achieve today?',
        placeholder: 'Ask about fitness, nutrition, or wellness...',
        maxMessages: 50, // Maximum messages to keep in chat history
        typing: {
            enabled: true,
            speed: 50 // milliseconds per character
        }
    },

    // API Configuration
    api: {
        gemini: {
            // Add your Gemini API key here
            // For team development: Each person should add their own key here
            apiKey: '<YOUR_GEMINI_API_KEY>', // Replace with your actual API key
            model: 'gemini-2.5-flash',
            baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/',
            temperature: 0.7,
            maxTokens: 2000,
            timeout: 30000 // 30 seconds
        },
        supabase: {
            url: 'https://cqobrwvrysnjeewloxrw.supabase.co', // Replace with your Supabase project URL
            anonKey: '<YOUR_SUPABASE_ANON_KEY>', // Replace with your Supabase anon key
            enabled: true,
            timeout: 10000 // 10 seconds
        }
    },

    // Customization Settings
    customization: {
        allowFontSizeChange: true,
        allowLayoutChange: true,
        allowColorSchemeChange: true,
        fontSizeRange: { min: 12, max: 24, default: 16 },
        savePreferences: true // Save to localStorage
    },

    // Feature Flags
    features: {
        chatInterface: true,
        settingsPanel: true,
        themeSwitch: true,
        responsiveDesign: true,
        animations: true,
        accessibility: true,
        printStyles: true
    },

    // Performance Settings
    performance: {
        lazyLoading: true,
        debounceDelay: 300, // milliseconds
        cacheResponses: true,
        maxCacheSize: 100 // number of responses to cache
    },

    // Debug Settings
    debug: {
        enabled: true, // Set to true for development
        logLevel: 'info', // 'error', 'warn', 'info', 'debug'
        showPerformanceMetrics: false
    },

    // Content Settings
    content: {
        homepage: {
            title: 'Welcome to your customizable template',
            subtitle: 'This is a blank canvas ready for your creativity.',
            showWelcomeMessage: true
        },
        footer: {
            text: '© 2024 FitAI. Powered by Gemini AI.',
            showYear: true,
            showPoweredBy: true
        }
    },

    // Storage Keys (for localStorage)
    storageKeys: {
        theme: 'fitai_theme',
        fontSize: 'fitai_font_size',
        layout: 'fitai_layout',
        chatHistory: 'fitai_chat_history',
        userPreferences: 'fitai_user_preferences',
        apiKey: 'fitai_api_key'
    },

    // Animation Settings
    animations: {
        duration: 300, // milliseconds
        easing: 'ease-in-out',
        fadeIn: true,
        slideIn: true,
        hover: true
    },

    // Responsive Breakpoints
    breakpoints: {
        mobile: 480,
        tablet: 768,
        desktop: 1024,
        wide: 1200
    }
};

// Utility function to get nested config values
function getConfig(path, defaultValue = null) {
    const keys = path.split('.');
    let value = CONFIG;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }
    
    return value;
}

// Utility function to set nested config values
function setConfig(path, newValue) {
    const keys = path.split('.');
    let target = CONFIG;
    
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in target) || typeof target[key] !== 'object') {
            target[key] = {};
        }
        target = target[key];
    }
    
    target[keys[keys.length - 1]] = newValue;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, getConfig, setConfig };
}