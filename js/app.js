// Asosiy WebApp ilovasi
class DiniyWebApp {
    constructor() {
        this.telegram = window.TelegramWebApp;
        this.user = this.telegram?.initDataUnsafe?.user;
        this.currentSection = 'main';
        this.currentContent = null;
        
        this.init();
    }
    
    async init() {
        // DOM yuklanganda
        document.addEventListener('DOMContentLoaded', () => {
            this.setupApp();
            this.loadContent();
            this.setupEventListeners();
        });
        
        // Telegram WebApp sozlamalari
        if (this.telegram) {
            this.setupTelegram();
        }
    }
    
    setupApp() {
        // Foydalanuvchi ma'lumotlari
        if (this.user) {
            this.updateUserInfo();
        }
        
        // Asosiy bo'limlarni yuklash
        this.loadFeatureCards();
        
        // Pastki menyuni yuklash
        this.loadBottomNav();
        
        // Loading ni yashirish
        setTimeout(() => {
            this.hideLoader();
        }, 1000);
    }
    
    setupTelegram() {
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
        
        console.log('Telegram WebApp ishga tushdi!');
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
        if (!featureGrid) return;
        
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
    }
    
    loadBottomNav() {
        const bottomNav = document.getElementById('bottomNav');
        if (!bottomNav) return;
        
        const navItems = [
            { id: 'main', icon: '🏠', text: 'Asosiy' },
            { id: 'lessons', icon: '📚', text: 'Darslar' },
            { id: 'bookmarks', icon: '🔖', text: 'Belgilar' },
            { id: 'search', icon: '🔍', text: 'Qidirish' },
            { id: 'profile', icon: '👤', text: 'Profilim' }
        ];
        
        bottomNav.innerHTML = navItems.map(item => `
            <a href="#" class="nav-item ${item.id === 'main' ? 'active' : ''}" 
               onclick="app.showSection('${item.id}')" id="nav-${item.id}">
                <div class="nav-icon">${item.icon}</div>
                <div class="nav-text">${item.text}</div>
            </a>
        `).join('');
    }
    
    async openSection(sectionId) {
        this.showLoader();
        
        // Haptic feedback
        if (this.telegram) {
            this.telegram.HapticFeedback.impactOccurred('light');
        }
        
        // Kontentni yuklash
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
            console.error('Error loading section:', error);
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
                content = this.getProfile
