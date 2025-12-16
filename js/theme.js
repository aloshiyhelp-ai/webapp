// Theme Management
class ThemeManager {
    constructor() {
        // DARK ni default qilish
        this.theme = localStorage.getItem('theme') || 'dark'; // ← DARK
        this.themeStyle = document.getElementById('theme-style');
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle?.querySelector('.theme-icon');
        
        this.init();
    }
    
    init() {
        // Dastlabki mavzuni yuklash
        this.applyTheme();
        
        // Tugma hodisasi
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // System theme o'zgarishini kuzatish
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
        
        // Telegram theme o'zgarishini kuzatish
        if (window.TelegramWebApp) {
            TelegramWebApp.onEvent('themeChanged', () => {
                this.syncWithTelegram();
            });
        }
    }
    
    applyTheme() {
        // CSS faylini o'zgartirish
        if (this.themeStyle) {
            this.themeStyle.href = `/media/style/css/${this.theme}.css`;
        }
        
        // Ikonkani o'zgartirish (agar mavjud bo'lsa)
        if (this.themeIcon) {
            this.themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        }
        
        // Body class qo'shish
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${this.theme}`);
        
        // LocalStorage da saqlash
        localStorage.setItem('theme', this.theme);
        
        // Telegram WebApp ga sinxronizatsiya
        this.syncWithTelegram();
        
        console.log(`Theme changed to: ${this.theme}`);
    }
    
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        
        // Haptic feedback
        if (window.TelegramWebApp) {
            TelegramWebApp.HapticFeedback.impactOccurred('light');
        }
    }
    
    setTheme(theme) {
        if (['light', 'dark'].includes(theme)) {
            this.theme = theme;
            this.applyTheme();
        }
    }
    
    syncWithTelegram() {
        if (!window.TelegramWebApp) return;
        
        const telegramTheme = TelegramWebApp.colorScheme;
        
        // Agar foydalanuvchi mavzuni qo'lda o'zgartirmagan bo'lsa
        if (!localStorage.getItem('theme')) {
            this.setTheme(telegramTheme === 'dark' ? 'dark' : 'light');
        }
        
        // Telegram header va background ranglarini sozlash
        if (this.theme === 'dark') {
            TelegramWebApp.setHeaderColor('#1a1a1a');
            TelegramWebApp.setBackgroundColor('#121212');
        } else {
            TelegramWebApp.setHeaderColor('#ffffff');
            TelegramWebApp.setBackgroundColor('#f5f7fa');
        }
    }
    
    getCurrentTheme() {
        return this.theme;
    }
    
    isDarkMode() {
        return this.theme === 'dark';
    }
}

// Global theme manager
window.themeManager = new ThemeManager();

// Tezkor funktsiyalar
window.toggleTheme = function() {
    window.themeManager?.toggleTheme();
};

window.setTheme = function(theme) {
    window.themeManager?.setTheme(theme);
};

window.getTheme = function() {
    return window.themeManager?.getCurrentTheme();
};

// DOM yuklanganda tekshirish
document.addEventListener('DOMContentLoaded', function() {
    if (!window.themeManager) {
        window.themeManager = new ThemeManager();
    }
});
