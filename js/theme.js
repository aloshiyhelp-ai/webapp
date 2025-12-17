// theme.js - Oddiy ishlaydigan versiya
console.log("✅ theme.js yuklandi");

// Tema boshqaruvi
class SimpleThemeManager {
    constructor() {
        this.theme = localStorage.getItem('diniy_theme') || 'dark';
        console.log(`🎨 Tema: ${this.theme}`);
        
        // CSS yuklash
        this.loadThemeCSS();
        
        // Tugma hodisasi
        this.setupButton();
    }
    
    loadThemeCSS() {
        // CSS faylini yaratish
        const link = document.createElement('link');
        link.id = 'theme-style';
        link.rel = 'stylesheet';
        link.href = `/media/style/css/${this.theme}.css`;
        document.head.appendChild(link);
        
        console.log(`📁 CSS yuklandi: ${this.theme}.css`);
    }
    
    setupButton() {
        const button = document.getElementById('themeToggle');
        if (!button) {
            console.warn("⚠️ themeToggle tugmasi topilmadi");
            return;
        }
        
        // Ikonkani sozlash
        button.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        
        // Click hodisasi
        button.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        console.log("✅ Tugma sozlandi");
    }
    
    toggleTheme() {
        // Tema o'zgartirish
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        
        // CSS yangilash
        const link = document.getElementById('theme-style');
        if (link) {
            link.href = `/media/style/css/${this.theme}.css`;
        }
        
        // Tugma ikonkasi
        const button = document.getElementById('themeToggle');
        if (button) {
            button.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        }
        
        // Saqlash
        localStorage.setItem('diniy_theme', this.theme);
        
        console.log(`🔄 Tema o'zgartirildi: ${this.theme}`);
        alert(`Tema: ${this.theme === 'dark' ? '🌙 Tungi' : '☀️ Kunduzgi'}`);
    }
}

// DOM yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM yuklandi, ThemeManager ishga tushmoqda");
    
    // ThemeManager yaratish
    window.themeManager = new SimpleThemeManager();
    
    // Global funksiya
    window.toggleTheme = function() {
        if (window.themeManager) {
            window.themeManager.toggleTheme();
        }
    };
    
    // Loading ni yashirish
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
        console.log("✅ Loader yashirildi");
    }, 1000);
});

console.log("✅ theme.js tayyor");
