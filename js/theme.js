// ============================================
// theme.js - Mavzu boshqaruvchi
// ============================================

class ThemeManager {
    constructor() {
        // Foydalanuvchi saqlagan temani olish, yo'q bo'lsa DARK
        this.theme = localStorage.getItem('diniy_theme') || 'dark';
        
        // Elementlar
        this.themeStyle = document.getElementById('theme-style');
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.querySelector('.theme-icon');
        
        // Telegram WebApp
        this.telegram = window.TelegramWebApp;
        
        this.init();
    }
    
    init() {
        // 1. Dastlabki temani yuklash
        this.applyTheme();
        
        // 2. Tugma hodisasi
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
        
        // 3. System theme o'zgarishini kuzatish
        if (window.matchMedia) {
            const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Faqat foydalanuvchi temani o'zgartirmagan bo'lsa
            if (!localStorage.getItem('diniy_theme')) {
                darkModeMediaQuery.addEventListener('change', (e) => {
                    this.setTheme(e.matches ? 'dark' : 'light', false);
                });
                
                // Dastlabki system theme
                this.setTheme(darkModeMediaQuery.matches ? 'dark' : 'light', false);
            }
        }
        
        // 4. Telegram theme o'zgarishini kuzatish
        if (this.telegram) {
            this.telegram.onEvent('themeChanged', () => {
                this.syncWithTelegram();
            });
            
            // Dastlabki Telegram theme
            this.syncWithTelegram();
        }
        
        console.log(`✅ ThemeManager ishga tushdi: ${this.theme}`);
    }
    
    applyTheme() {
        // 1. CSS faylini o'zgartirish
        if (this.themeStyle) {
            this.themeStyle.href = `/media/style/css/${this.theme}.css`;
        }
        
        // 2. Ikonkani o'zgartirish
        if (this.themeIcon) {
            this.themeIcon.textContent = this.theme === 'dark' ? '☀️' : '🌙';
            this.themeIcon.title = this.theme === 'dark' 
                ? 'Kunduzgi rejimga o\'tish' 
                : 'Tungi rejimga o\'tish';
        }
        
        // 3. Body class qo'shish
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${this.theme}`);
        
        // 4. Telegram WebApp ga sinxronizatsiya
        this.syncWithTelegram();
        
        // 5. Debug
        console.log(`🎨 Tema o'zgartirildi: ${this.theme}`);
    }
    
    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme, true);
        
        // Haptic feedback
        if (this.telegram) {
            this.telegram.HapticFeedback.impactOccurred('light');
        }
        
        // Notification
        if (this.telegram && this.telegram.showAlert) {
            this.telegram.showAlert(
                newTheme === 'dark' 
                    ? '🌙 Tungi rejim' 
                    : '☀️ Kunduzgi rejim'
            );
        }
    }
    
    setTheme(theme, saveToStorage = true) {
        if (!['light', 'dark'].includes(theme)) return;
        
        // Tema o'zgartirish
        this.theme = theme;
        this.applyTheme();
        
        // LocalStorage ga saqlash (agar kerak bo'lsa)
        if (saveToStorage) {
            localStorage.setItem('diniy_theme', theme);
            console.log(`💾 Tema saqlandi: ${theme}`);
        }
        
        // Botga yuborish (agar Telegram orqali ochilgan bo'lsa)
        this.sendThemeToBot();
    }
    
    syncWithTelegram() {
        if (!this.telegram) return;
        
        const telegramTheme = this.telegram.colorScheme;
        
        // Faqat foydalanuvchi temani o'zgartirmagan bo'lsa
        if (!localStorage.getItem('diniy_theme')) {
            this.setTheme(telegramTheme === 'dark' ? 'dark' : 'light', false);
        }
        
        // Telegram header va background ranglarini sozlash
        if (this.theme === 'dark') {
            this.telegram.setHeaderColor('#1a1a1a');
            this.telegram.setBackgroundColor('#121212');
        } else {
            this.telegram.setHeaderColor('#ffffff');
            this.telegram.setBackgroundColor('#f5f7fa');
        }
        
        // MainButton rangini sozlash
        if (this.telegram.MainButton && this.telegram.MainButton.setParams) {
            this.telegram.MainButton.setParams({
                color: this.theme === 'dark' ? '#4a90e2' : '#2c5aa0'
            });
        }
    }
    
    sendThemeToBot() {
        if (!this.telegram) return;
        
        // Botga tema o'zgarishini yuborish
        this.telegram.sendData(JSON.stringify({
            action: 'theme_changed',
            theme: this.theme,
            timestamp: new Date().toISOString(),
            source: 'webapp'
        }));
        
        console.log(`📤 Botga tema yuborildi: ${this.theme}`);
    }
    
    getCurrentTheme() {
        return this.theme;
    }
    
    isDarkMode() {
        return this.theme === 'dark';
    }
    
    // Foydalanuvchi temani o'chirish (default ga qaytarish)
    resetTheme() {
        localStorage.removeItem('diniy_theme');
        this.theme = window.matchMedia?.('(prefers-color-scheme: dark)').matches 
            ? 'dark' 
            : 'light';
        this.applyTheme();
        console.log('🔄 Tema reset qilindi');
    }
}

// ============================================
// GLOBAL INITIALIZATION
// ============================================

// DOM yuklanganda
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM yuklandi, ThemeManager ishga tushmoqda...');
    
    // Global TelegramWebApp
    window.TelegramWebApp = window.Telegram?.WebApp;
    
    // ThemeManager yaratish
    if (!window.themeManager) {
        window.themeManager = new ThemeManager();
        
        // Global funksiyalar
        window.toggleTheme = function() {
            window.themeManager?.toggleTheme();
        };
        
        window.setTheme = function(theme) {
            window.themeManager?.setTheme(theme, true);
        };
        
        window.getTheme = function() {
            return window.themeManager?.getCurrentTheme();
        };
        
        window.resetTheme = function() {
            window.themeManager?.resetTheme();
        };
        
        // Debug
        console.log('✅ ThemeManager global qilindi');
        console.log(`📊 Joriy tema: ${window.themeManager.getCurrentTheme()}`);
        console.log(`💾 Saqlangan tema: ${localStorage.getItem('diniy_theme') || 'yo\'q (default: dark)'}`);
    }
});

// Sayt yuklanganda tekshirish
window.addEventListener('load', function() {
    console.log('📈 Sayt to\'liq yuklandi');
    
    // Tugma title ni sozlash
    const toggleBtn = document.getElementById('themeToggle');
    if (toggleBtn && window.themeManager) {
        const theme = window.themeManager.getCurrentTheme();
        toggleBtn.title = theme === 'dark' 
            ? 'Kunduzgi rejimga o\'tish' 
            : 'Tungi rejimga o\'tish';
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('❌ Theme xatosi:', e.error);
    
    // Tema xatosi bo'lsa, default dark qilish
    if (e.message.includes('theme') || e.message.includes('Theme')) {
        const style = document.getElementById('theme-style');
        if (style) {
            style.href = '/media/style/css/dark.css';
            document.body.classList.add('theme-dark');
        }
    }
});

console.log('✅ theme.js fayli yuklandi');
