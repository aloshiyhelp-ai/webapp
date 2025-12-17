// theme.js - Silent Theme Switcher
console.log("🎨 Theme Manager loaded");

class SilentThemeManager {
    constructor() {
        // User saqlagan temani olish, yo'q bo'lsa dark
        this.theme = localStorage.getItem('diniy_app_theme') || 'dark';
        this.isSwitching = false;
        
        console.log(`📊 User theme: ${this.theme}`);
        
        this.init();
    }
    
    init() {
        // 1. Avval CSS yuklash
        this.loadThemeCSS();
        
        // 2. Tugma yaratish/yuklash
        this.setupThemeButton();
        
        // 3. DOM yuklanganda body class qo'shish
        document.addEventListener('DOMContentLoaded', () => {
            this.applyThemeToBody();
            
            // Loader yashirish
            setTimeout(() => {
                const loader = document.getElementById('loader');
                if (loader) loader.style.display = 'none';
            }, 300);
        });
        
        // 4. Telegram haptic
        this.setupTelegramHaptic();
    }
    
    loadThemeCSS() {
        // Eski CSS ni o'chirish
        const oldCSS = document.getElementById('dynamic-theme');
        if (oldCSS) oldCSS.remove();
        
        // Yangi CSS yaratish
        const css = document.createElement('link');
        css.id = 'dynamic-theme';
        css.rel = 'stylesheet';
        css.href = `/media/style/css/${this.theme}.css`;
        
        // CSS yuklanganda
        css.onload = () => {
            console.log(`✅ ${this.theme}.css loaded silently`);
            this.isSwitching = false;
        };
        
        css.onerror = () => {
            console.warn(`⚠️ ${this.theme}.css failed, using default`);
            css.href = '/media/style/css/dark.css';
        };
        
        document.head.appendChild(css);
    }
    
    setupThemeButton() {
        // Tugmani topish yoki yaratish
        let button = document.getElementById('themeToggle') || 
                     document.getElementById('themeBtn') ||
                     document.querySelector('.theme-toggle');
        
        if (!button) {
            button = this.createThemeButton();
        }
        
        // Ikonka
        this.updateButtonIcon(button);
        
        // Click event (silent)
        button.onclick = (e) => {
            e.preventDefault();
            if (!this.isSwitching) {
                this.switchThemeSilently();
            }
        };
        
        // Hover effekt
        button.onmouseenter = () => {
            button.style.transform = 'scale(1.1)';
            button.style.transition = 'transform 0.2s';
        };
        
        button.onmouseleave = () => {
            button.style.transform = 'scale(1)';
        };
    }
    
    createThemeButton() {
        const button = document.createElement('button');
        button.id = 'themeToggle';
        button.className = 'theme-toggle';
        button.innerHTML = this.theme === 'dark' ? '☀️' : '🌙';
        button.title = 'Tema';
        button.setAttribute('aria-label', 'Tema o\'zgartirish');
        
        button.style.cssText = `
            position: fixed;
            top: 15px;
            right: 15px;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: rgba(44, 90, 160, 0.9);
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(button);
        return button;
    }
    
    updateButtonIcon(button) {
        button.innerHTML = this.theme === 'dark' ? '☀️' : '🌙';
        
        // Ikonka animatsiyasi
        button.style.animation = 'none';
        setTimeout(() => {
            button.style.animation = 'rotateIcon 0.3s ease';
        }, 10);
    }
    
    switchThemeSilently() {
        if (this.isSwitching) return;
        this.isSwitching = true;
        
        // Tema o'zgartirish
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        
        console.log(`🔄 Switching to ${this.theme} (silent)`);
        
        // 1. CSS yangilash
        this.loadThemeCSS();
        
        // 2. Tugma ikonkasi
        const button = document.getElementById('themeToggle') || 
                      document.querySelector('.theme-toggle');
        if (button) {
            this.updateButtonIcon(button);
        }
        
        // 3. Body class yangilash
        this.applyThemeToBody();
        
        // 4. User saqlash (silent)
        localStorage.setItem('diniy_app_theme', this.theme);
        
        // 5. Telegram haptic feedback (agar bor bo'lsa)
        if (window.TelegramWebApp && TelegramWebApp.HapticFeedback) {
            TelegramWebApp.HapticFeedback.impactOccurred('light');
        }
        
        // 6. Botga yuborish (agar Telegram orqali ochilgan bo'lsa)
        if (window.TelegramWebApp && this.theme) {
            setTimeout(() => {
                TelegramWebApp.sendData(JSON.stringify({
                    action: 'theme_changed_silent',
                    theme: this.theme,
                    timestamp: Date.now()
                }));
            }, 100);
        }
    }
    
    applyThemeToBody() {
        // Eski class larni o'chirish
        document.body.classList.remove('theme-dark', 'theme-light');
        
        // Yangi class qo'shish
        document.body.classList.add(`theme-${this.theme}`);
        
        // Body inline style
        if (this.theme === 'dark') {
            document.body.style.setProperty('--theme-bg', '#121212', 'important');
            document.body.style.setProperty('--theme-text', '#ffffff', 'important');
        } else {
            document.body.style.setProperty('--theme-bg', '#f5f7fa', 'important');
            document.body.style.setProperty('--theme-text', '#333333', 'important');
        }
        
        console.log(`🎨 Body theme: ${this.theme}`);
    }
    
    setupTelegramHaptic() {
        if (!window.TelegramWebApp) return;
        
        // Telegram theme changes
        TelegramWebApp.onEvent('themeChanged', () => {
            const telegramTheme = TelegramWebApp.colorScheme;
            
            // Faqat user o'zgartirmagan bo'lsa
            if (!localStorage.getItem('diniy_app_theme')) {
                this.theme = telegramTheme === 'dark' ? 'dark' : 'light';
                this.loadThemeCSS();
                this.applyThemeToBody();
            }
        });
    }
    
    // User temani olish
    getUserTheme() {
        return this.theme;
    }
    
    // Tema o'rnatish (tashqaridan)
    setTheme(theme, silent = true) {
        if (['dark', 'light'].includes(theme) && theme !== this.theme) {
            this.theme = theme;
            
            if (!silent) {
                this.loadThemeCSS();
                this.applyThemeToBody();
                
                const button = document.getElementById('themeToggle');
                if (button) this.updateButtonIcon(button);
            }
            
            localStorage.setItem('diniy_app_theme', theme);
            return true;
        }
        return false;
    }
}

// ==================== GLOBAL INIT ====================

// Style for icon animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rotateIcon {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.2); }
        100% { transform: rotate(360deg) scale(1); }
    }
    
    .theme-toggle {
        transition: all 0.3s ease !important;
    }
    
    .theme-dark {
        --theme-bg: #121212;
        --theme-text: #ffffff;
        --theme-card: #1e1e1e;
        --theme-border: #333333;
    }
    
    .theme-light {
        --theme-bg: #f5f7fa;
        --theme-text: #333333;
        --theme-card: #ffffff;
        --theme-border: #dddddd;
    }
`;
document.head.appendChild(style);

// ThemeManager yaratish
let themeManager = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Initializing silent theme manager...");
    
    themeManager = new SilentThemeManager();
    window.themeManager = themeManager;
    
    // Global funksiyalar
    window.toggleTheme = function() {
        if (themeManager) {
            themeManager.switchThemeSilently();
        }
    };
    
    window.setTheme = function(theme) {
        if (themeManager) {
            return themeManager.setTheme(theme, true);
        }
        return false;
    };
    
    window.getTheme = function() {
        return themeManager ? themeManager.getUserTheme() : 'dark';
    };
    
    console.log("✅ Silent theme manager ready");
    console.log(`💾 Saved theme: ${localStorage.getItem('diniy_app_theme') || 'dark (default)'}`);
});

// Error handling
window.addEventListener('error', function(e) {
    if (e.message.includes('theme') || e.message.includes('Theme')) {
        console.warn('Theme error, applying dark fallback');
        document.body.classList.add('theme-dark');
        localStorage.setItem('diniy_app_theme', 'dark');
    }
});
