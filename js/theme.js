// theme.js - TO'G'RI ISHLAYDI
console.log("✅ theme.js yuklandi");

class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('diniy_theme') || 'dark';
        console.log(`🎨 Boshlang'ich tema: ${this.theme}`);
        
        this.init();
    }
    
    init() {
        // 1. CSS yuklash
        this.loadCSS();
        
        // 2. Tugma sozlash
        this.setupButton();
        
        // 3. DOM yuklanganda
        document.addEventListener('DOMContentLoaded', () => {
            console.log("✅ DOM yuklandi");
            this.hideLoader();
        });
    }
    
    loadCSS() {
        // Avval mavjud CSS ni o'chirish
        const oldLink = document.getElementById('theme-css');
        if (oldLink) oldLink.remove();
        
        // Yangi CSS yaratish
        const link = document.createElement('link');
        link.id = 'theme-css';
        link.rel = 'stylesheet';
        link.href = `/media/style/css/${this.theme}.css`;
        
        // Head ga qo'shish
        document.head.appendChild(link);
        
        console.log(`📁 CSS yuklandi: ${this.theme}.css`);
        
        // CSS yuklanganda tekshirish
        link.onload = () => {
            console.log(`✅ ${this.theme}.css yuklandi`);
            this.updateBodyClass();
        };
        
        link.onerror = () => {
            console.error(`❌ ${this.theme}.css yuklanmadi`);
            // Default CSS
            link.href = '/media/style/css/dark.css';
        };
    }
    
    setupButton() {
        const button = document.getElementById('themeToggle') || 
                      document.getElementById('themeBtn');
        
        if (!button) {
            console.warn("⚠️ Tema tugmasi topilmadi, yaratamiz...");
            this.createButton();
            return;
        }
        
        // Ikonka
        button.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        button.title = this.theme === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim';
        
        // Click event
        button.onclick = (e) => {
            e.preventDefault();
            this.toggleTheme();
        };
        
        console.log("✅ Tugma sozlandi");
    }
    
    createButton() {
        const button = document.createElement('button');
        button.id = 'themeToggle';
        button.textContent = this.theme === 'dark' ? '☀️' : '🌙';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 15px;
            background: #2c5aa0;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
        `;
        
        button.onclick = () => this.toggleTheme();
        document.body.appendChild(button);
    }
    
    toggleTheme() {
        // Tema o'zgartirish
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        
        console.log(`🔄 Tema o'zgartirildi: ${this.theme}`);
        
        // 1. CSS yangilash
        this.loadCSS();
        
        // 2. Tugma ikonkasi
        const button = document.getElementById('themeToggle') || 
                      document.getElementById('themeBtn');
        if (button) {
            button.textContent = this.theme === 'dark' ? '☀️' : '🌙';
            button.title = this.theme === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim';
        }
        
        // 3. Saqlash
        localStorage.setItem('diniy_theme', this.theme);
        
        // 4. Notification
        alert(`🌙 Tungi rejim: ${this.theme === 'dark' ? 'ON' : 'OFF'}`);
        
        // 5. Telegram haptic
        if (window.TelegramWebApp) {
            TelegramWebApp.HapticFeedback.impactOccurred('light');
        }
    }
    
    updateBodyClass() {
        // Body class larni yangilash
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(`${this.theme}-theme`);
        
        // Inline style (zamin rangini o'zgartirish)
        if (this.theme === 'dark') {
            document.body.style.backgroundColor = '#121212';
            document.body.style.color = '#ffffff';
        } else {
            document.body.style.backgroundColor = '#f5f7fa';
            document.body.style.color = '#333333';
        }
        
        console.log(`🎨 Body yangilandi: ${this.theme}`);
    }
    
    hideLoader() {
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) {
                loader.style.display = 'none';
                console.log("✅ Loader yashirildi");
            }
        }, 500);
    }
}

// Global theme manager
window.themeManager = new ThemeManager();

// Global funksiya
window.toggleTheme = function() {
    if (window.themeManager) {
        window.themeManager.toggleTheme();
    }
};

console.log("✅ theme.js tayyor");
