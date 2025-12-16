// Asosiy WebApp ilovasi
class DiniyWebApp {
    constructor() {
        // Telegram WebApp
        this.telegram = window.TelegramWebApp;
        this.user = this.telegram?.initDataUnsafe?.user;
        
        // Theme ma'lumotlari
        this.userTheme = localStorage.getItem('diniy_theme') || 'dark';
        
        // App holatlari
        this.currentSection = 'main';
        this.currentContent = null;
        
        // Globalga qo'shish
        window.app = this;
        
        this.init();
    }
    
    async init() {
        console.log("✅ DiniyWebApp init boshladi");
        console.log(`🎨 Foydalanuvchi temasi: ${this.userTheme}`);
        
        // Telegram WebApp sozlamalari
        if (this.telegram) {
            await this.setupTelegram();
        }
        
        // DOM yuklanganda
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }
    
    async setupTelegram() {
        console.log("✅ Telegram WebApp sozlanmoqda");
        
        // WebApp ni to'liq ekran qilish
        this.telegram.expand();
        this.telegram.enableClosingConfirmation();
        
        // ========== FOTOALANUVCHI TEMASIGA MOSLASHTIRISH ==========
        // User theme bo'yicha Telegram ranglarini sozlash
        if (this.userTheme === 'dark') {
            this.telegram.setHeaderColor('#1a1a1a');
            this.telegram.setBackgroundColor('#121212');
        } else {
            this.telegram.setHeaderColor('#ffffff');
            this.telegram.setBackgroundColor('#f5f7fa');
        }
        
        // Telegram theme events
        this.telegram.onEvent('themeChanged', () => {
            console.log('🔁 Telegram temasi o\'zgardi');
            this.syncThemeWithTelegram();
        });
        // ========================================================
        
        // Orqaga tugmasi
        this.telegram.BackButton.show();
        this.telegram.BackButton.onClick(() => {
            this.goBack();
        });
        
        // Asosiy tugma
        this.telegram.MainButton.setText('💾 Saqlash');
        this.telegram.MainButton.show();
        this.telegram.MainButton.onClick(() => {
            this.saveCurrentContent();
        });
        
        // Asosiy tugma rangini temaga moslashtirish
        if (this.userTheme === 'dark') {
            this.telegram.MainButton.setParams({ color: '#4a90e2' });
        } else {
            this.telegram.MainButton.setParams({ color: '#2c5aa0' });
        }
        
        // WebApp tayyor
        this.telegram.ready();
        
        console.log(`✅ Telegram WebApp ishga tushdi! (Theme: ${this.userTheme})`);
        
        // Botga kirish haqida ma'lumot yuborish
        this.sendUserDataToBot();
    }
    
    syncThemeWithTelegram() {
        if (!this.telegram) return;
        
        const telegramTheme = this.telegram.colorScheme;
        const userTheme = localStorage.getItem('diniy_theme');
        
        // Agar foydalanuvchi temani o'zgartirmagan bo'lsa
        if (!userTheme && window.themeManager) {
            window.themeManager.setTheme(
                telegramTheme === 'dark' ? 'dark' : 'light', 
                false
            );
        }
    }
    
    sendUserDataToBot() {
        if (!this.telegram || !this.user) return;
        
        this.telegram.sendData(JSON.stringify({
            action: 'user_entered',
            user_id: this.user.id,
            username: this.user.username,
            first_name: this.user.first_name,
            theme: this.userTheme,
            timestamp: new Date().toISOString(),
            app_version: '1.0.0'
        }));
        
        console.log('📤 Botga foydalanuvchi ma\'lumotlari yuborildi');
    }
    
    setupApp() {
        console.log("✅ setupApp ishga tushdi");
        
        // Foydalanuvchi ma'lumotlari
        if (this.user) {
            this.updateUserInfo();
        }
        
        // Asosiy bo'limlarni yuklash
        this.loadFeatureCards();
        
        // Pastki menyuni yuklash
        this.loadBottomNav();
        
        // Dastlabki kontent
        this.showSection('main');
        
        // Loading ni yashirish
        setTimeout(() => {
            this.hideLoader();
            
            // Welcome notification
            if (this.telegram && this.user) {
                setTimeout(() => {
                    this.telegram.showAlert(`👋 Xush kelibsiz, ${this.user.first_name}!`);
                }, 300);
            }
        }, 500);
    }
    
    updateUserInfo() {
        const title = document.getElementById('app-title');
        const avatar = document.querySelector('.user-avatar');
        
        if (title) {
            title.textContent = `📖 Salom, ${this.user.first_name}!`;
        }
        
        if (avatar) {
            avatar.textContent = this.user.first_name[0].toUpperCase();
        }
    }
    
    // ... (qolgan funksiyalar o'zgarmaydi) ...
}

// Ilovani ishga tushirish
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM yuklandi, DiniyWebApp ishga tushmoqda...");
    console.log(`💾 Saqlangan tema: ${localStorage.getItem('diniy_theme') || 'dark (default)'}`);
    
    // Global TelegramWebApp o'zgaruvchisi
    window.TelegramWebApp = window.Telegram?.WebApp;
    
    // Ilovani ishga tushirish
    if (!window.app) {
        window.app = new DiniyWebApp();
        console.log("✅ DiniyWebApp ishga tushdi");
    }
});

// Global funksiyalar
window.openSection = function(sectionId) {
    if (window.app) {
        window.app.openSection(sectionId);
    }
};

window.showSection = function(sectionId) {
    if (window.app) {
        window.app.showSection(sectionId);
    }
};

console.log("✅ app.js fayli yuklandi");
