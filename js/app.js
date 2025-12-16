// Asosiy WebApp ilovasi
class DiniyWebApp {
    constructor() {
        this.telegram = window.TelegramWebApp;
        this.user = this.telegram?.initDataUnsafe?.user;
        this.currentSection = 'main';
        this.currentContent = null;
        
        // Globalga qo'shish
        window.app = this;
        
        this.init();
    }
    
    async init() {
        console.log("✅ DiniyWebApp init boshladi");
        
        // Telegram WebApp sozlamalari
        if (this.telegram) {
            this.setupTelegram();
        }
        
        // DOM yuklanganda
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
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
        }, 500);
    }
    
    setupTelegram() {
        console.log("✅ Telegram WebApp sozlanmoqda");
        
        // WebApp ni to'liq ekran qilish
        this.telegram.expand();
        this.telegram.enableClosingConfirmation();
        
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
        
        // WebApp tayyor
        this.telegram.ready();
        
        console.log('✅ Telegram WebApp ishga tushdi!');
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
    
    loadFeatureCards() {
        const featureGrid = document.getElementById('featureGrid');
        if (!featureGrid) {
            console.warn("⚠️ featureGrid topilmadi");
            return;
        }
        
        console.log("✅ FeatureCards yuklanmoqda");
        
        const features = [
            {
                id: 'quran',
                icon: '🕋',
                title: 'Quroni Karim',
                desc: 'Muqaddas Quroni Karim matni, tarjimasi va o\'qilishi',
                tag: 'Asosiy manba',
                color: '#2c5aa0'
            },
            {
                id: 'hadis',
                icon: '📜',
                title: 'Hadisi Sharif',
                desc: 'Payg\'ambarimiz (s.a.v) hadislari va sharhlari',
                tag: 'Ikkinchi manba',
                color: '#4a90e2'
            },
            {
                id: 'tafsir',
                icon: '🔍',
                title: 'Tafsir Ilmi',
                desc: 'Qur\'on oyatlarining tafsiri va izohlari',
                tag: 'Tushuntirish',
                color: '#d4a017'
            },
            {
                id: 'siyrat',
                icon: '🌙',
                title: 'Siyrat',
                desc: 'Payg\'ambarimiz (s.a.v) hayoti va faoliyati',
                tag: 'Tarixiy ma\'lumot',
                color: '#28a745'
            }
        ];
        
        featureGrid.innerHTML = features.map(feature => `
            <div class="feature-card" onclick="app.openSection('${feature.id}')" 
                 style="border-color: ${feature.color}20;">
                <div class="card-icon" style="color: ${feature.color}">${feature.icon}</div>
                <h3 class="card-title">${feature.title}</h3>
                <p class="card-desc">${feature.desc}</p>
                <span class="category-tag" style="background: ${feature.color}10; color: ${feature.color}">
                    ${feature.tag}
                </span>
            </div>
        `).join('');
        
        console.log("✅ FeatureCards yuklandi");
    }
    
    loadBottomNav() {
        const bottomNav = document.getElementById('bottomNav');
        if (!bottomNav) {
            console.warn("⚠️ bottomNav topilmadi");
            return;
        }
        
        console.log("✅ BottomNav yuklanmoqda");
        
        const navItems = [
            { id: 'main', icon: '🏠', text: 'Asosiy' },
            { id: 'lessons', icon: '📚', text: 'Darslar' },
            { id: 'bookmarks', icon: '🔖', text: 'Belgilar' },
            { id: 'search', icon: '🔍', text: 'Qidirish' },
            { id: 'profile', icon: '👤', text: 'Profilim' }
        ];
        
        bottomNav.innerHTML = navItems.map(item => `
            <a href="#" class="nav-item ${item.id === 'main' ? 'active' : ''}" 
               onclick="app.showSection('${item.id}'); return false;" id="nav-${item.id}">
                <div class="nav-icon">${item.icon}</div>
                <div class="nav-text">${item.text}</div>
            </a>
        `).join('');
        
        console.log("✅ BottomNav yuklandi");
    }
    
    async openSection(sectionId) {
        console.log(`Opening section: ${sectionId}`);
        this.showLoader();
        
        // Haptic feedback
        if (this.telegram) {
            this.telegram.HapticFeedback.impactOccurred('light');
        }
        
        try {
            let content;
            
            switch(sectionId) {
                case 'quran':
                    content = await this.loadQuranContent();
                    break;
                case 'hadis':
                    content = await this.loadHadisContent();
                    break;
                case 'tafsir':
                    content = await this.loadTafsirContent();
                    break;
                case 'siyrat':
                    content = await this.loadSiyratContent();
                    break;
                default:
                    content = '<p>Bo\'lim topilmadi.</p>';
            }
            
            this.currentSection = sectionId;
            this.currentContent = content;
            
            document.getElementById('contentArea').innerHTML = content;
            
            // Pastki menyuni yangilash
            this.setActiveNav('lessons');
            
        } catch (error) {
            console.error('Xato bo\'lim yuklashda:', error);
            document.getElementById('contentArea').innerHTML = `
                <div class="error-message">
                    <h3>⚠️ Xatolik yuz berdi</h3>
                    <p>${error.message}</p>
                </div>
            `;
        } finally {
            this.hideLoader();
        }
    }
    
    async showSection(sectionId) {
        console.log(`Showing section: ${sectionId}`);
        this.currentSection = sectionId;
        
        // Haptic feedback
        if (this.telegram) {
            this.telegram.HapticFeedback.selectionChanged();
        }
        
        let content;
        
        switch(sectionId) {
            case 'main':
                content = this.getMainContent();
                break;
            case 'lessons':
                content = await this.getLessonsContent();
                break;
            case 'bookmarks':
                content = await this.getBookmarksContent();
                break;
            case 'search':
                content = this.getSearchContent();
                break;
            case 'profile':
                content = this.getProfileContent();
                break;
            default:
                content = '<p>Bo\'lim topilmadi.</p>';
        }
        
        document.getElementById('contentArea').innerHTML = content;
        this.setActiveNav(sectionId);
    }
    
    getMainContent() {
        return `
            <h2 class="content-title">🤲 Xush kelibsiz!</h2>
            <p>Diniy Bilimlar platformasiga xush kelibsiz. Quyidagi imkoniyatlar mavjud:</p>
            
            <div style="margin-top: 20px;">
                <div class="list-item" onclick="app.openSection('quran')">
                    <div class="item-number">1</div>
                    <div class="item-content">
                        <div class="item-title">Quroni Karim</div>
                        <div class="item-desc">114 sura, 6236 oyat</div>
                    </div>
                </div>
                
                <div class="list-item" onclick="app.openSection('hadis')">
                    <div class="item-number">2</div>
                    <div class="item-content">
                        <div class="item-title">Hadisi Sharif</div>
                        <div class="item-desc">Sahih hadislar to'plami</div>
                    </div>
                </div>
                
                <div class="list-item">
                    <div class="item-number">3</div>
                    <div class="item-content">
                        <div class="item-title">Kundalik dars</div>
                        <div class="item-desc">Har kungi o'qish uchun oyat</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    async loadQuranContent() {
        // Qur'on kontenti (quran.js dan foydalanadi)
        if (window.QuranManager) {
            const quran = new QuranManager();
            return quran.getQuranSectionHTML();
        }
        
        return `
            <h2 class="content-title">📖 Quroni Karim</h2>
            <p>Qur'on bo'limi yuklanmoqda...</p>
            <button onclick="app.loadQuranContent()">Qayta yuklash</button>
        `;
    }
    
    async loadHadisContent() {
        // Hadis kontenti (hadis.js dan foydalanadi)
        if (window.HadisManager) {
            const hadis = new HadisManager();
            return hadis.getHadisSectionHTML();
        }
        
        return `
            <h2 class="content-title">📜 Hadisi Sharif</h2>
            <p>Hadis bo'limi yuklanmoqda...</p>
        `;
    }
    
    async loadTafsirContent() {
        return `
            <h2 class="content-title">🔍 Tafsir Ilmi</h2>
            <p>Qur'on oyatlarining tafsiri va izohlari.</p>
            <p>Tez orada mavjud bo'ladi...</p>
        `;
    }
    
    async loadSiyratContent() {
        return `
            <h2 class="content-title">🌙 Siyrat</h2>
            <p>Payg'ambarimiz Muhammad (s.a.v) hayoti va faoliyati.</p>
            <p>Tez orada mavjud bo'ladi...</p>
        `;
    }
    
    async getLessonsContent() {
        return `
            <h2 class="content-title">📚 Darslar</h2>
            <p>Kundalik darslar va o'qish rejalari.</p>
            <p>Tez orada mavjud bo'ladi...</p>
        `;
    }
    
    async getBookmarksContent() {
        return `
            <h2 class="content-title">🔖 Belgilar</h2>
            <p>Saqlangan oyatlar va hadislar.</p>
            <p>Tez orada mavjud bo'ladi...</p>
        `;
    }
    
    getSearchContent() {
        return `
            <h2 class="content-title">🔍 Qidirish</h2>
            <input type="text" placeholder="Qidirish..." id="searchInput" 
                   style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #ccc; margin-bottom: 10px;">
            <button onclick="app.performSearch()" style="width: 100%; padding: 12px; background: #2c5aa0; color: white; border: none; border-radius: 8px;">
                Qidirish
            </button>
        `;
    }
    
    getProfileContent() {
        const userName = this.user ? this.user.first_name : 'Foydalanuvchi';
        const userInitial = this.user ? this.user.first_name[0].toUpperCase() : 'U';
        
        return `
            <h2 class="content-title">👤 Profilim</h2>
            <div style="text-align: center; padding: 20px;">
                <div style="
                    width: 80px;
                    height: 80px;
                    background: #2c5aa0;
                    border-radius: 50%;
                    margin: 0 auto 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 32px;
                    font-weight: bold;
                ">
                    ${userInitial}
                </div>
                <h3>${userName}</h3>
                <p style="color: #666; margin-top: 10px;">
                    O'qilgan oyatlar: 15<br>
                    Belgilar: 7<br>
                    Ketma-ket kunlar: 3
                </p>
            </div>
        `;
    }
    
    setActiveNav(activeItem) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNav = document.getElementById(`nav-${activeItem}`);
        if (activeNav) {
            activeNav.classList.add('active');
        }
    }
    
    showLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'flex';
        }
    }
    
    hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
    
    goBack() {
        if (this.currentSection !== 'main') {
            this.showSection('main');
        } else {
            if (this.telegram) {
                this.telegram.close();
            }
        }
    }
    
    saveCurrentContent() {
        if (this.telegram) {
            this.telegram.sendData(JSON.stringify({
                action: 'save_content',
                section: this.currentSection,
                timestamp: new Date().toISOString()
            }));
            
            this.telegram.showAlert("✅ Saqlandi!");
        }
    }
    
    performSearch() {
        const query = document.getElementById('searchInput').value;
        if (query) {
            alert(`"${query}" so'zi bo'yicha qidirilmoqda...`);
        }
    }
}

// Ilovani ishga tushirish
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM yuklandi, DiniyWebApp ishga tushmoqda...");
    
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
