// hadis.js - Hadis ma'lumotlari va funksiyalari

class HadisManager {
    constructor() {
        this.hadisCategories = [
            { id: 1, name: 'Iymon', count: 150, icon: '🕌' },
            { id: 2, name: 'Ibadat', count: 200, icon: '🙏' },
            { id: 3, name: 'Axloq', count: 180, icon: '❤️' },
            { id: 4, name: 'Ijtimoiy', count: 120, icon: '👥' },
            { id: 5, name: 'Tijorat', count: 80, icon: '💰' }
        ];
        
        this.hadiths = [
            {
                id: 1,
                category: 'Iymon',
                arabic: 'الإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً',
                translation: 'Imon yetmishdan ortiq shoxga ega...',
                source: 'Sahih Muslim, 35',
                explanation: 'Imonning turli darajalari va shoxlari haqida'
            },
            {
                id: 2,
                category: 'Axloq',
                arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
                translation: 'Birodaringiz yuziga tabassum qilishingiz sadaqadir.',
                source: 'Tirmiziy, 1956',
                explanation: 'Yaxshi xulq va tabassumning ahamiyati'
            },
            {
                id: 3,
                category: 'Ibadat',
                arabic: 'الصَّلَوَاتُ الْخَمْسُ وَالْجُمُعَةُ إِلَى الْجُمُعَةِ',
                translation: 'Besh vaqt namoz va juma namozidan keyingi juma gunohlarini o`chiradi.',
                source: 'Sahih Muslim, 233',
                explanation: 'Namozning gunohlarni yuvish xususiyati'
            }
        ];
    }
    
    // Kategoriyalar ro'yxati
    getCategories() {
        return this.hadisCategories;
    }
    
    // Kategoriya bo'yicha hadislar
    getHadithsByCategory(categoryId) {
        const category = this.hadisCategories.find(c => c.id === categoryId);
        if (!category) return [];
        
        return this.hadiths.filter(h => h.category === category.name);
    }
    
    // Tasodifiy hadis
    getRandomHadith() {
        const randomIndex = Math.floor(Math.random() * this.hadiths.length);
        return this.hadiths[randomIndex];
    }
    
    // Hadis HTML yaratish
    createHadithHTML(hadith) {
        return `
            <div class="hadith-container">
                <div class="hadith-header">
                    <span class="category-badge">${hadith.category}</span>
                    <span class="hadith-id">#${hadith.id}</span>
                </div>
                
                <div class="arabic-text" style="text-align: right; font-size: 1.4rem;">
                    ${hadith.arabic}
                </div>
                
                <div class="translation">
                    <strong>Tarjima:</strong> ${hadith.translation}
                </div>
                
                <div class="hadith-info">
                    <div class="source">
                        <strong>Manba:</strong> ${hadith.source}
                    </div>
                    <div class="explanation">
                        <strong>Izoh:</strong> ${hadith.explanation}
                    </div>
                </div>
                
                <div class="hadith-actions">
                    <button class="btn-small" onclick="saveHadith(${hadith.id})">
                        💾 Saqlash
                    </button>
                    <button class="btn-small" onclick="shareHadith(${hadith.id})">
                        📤 Ulashish
                    </button>
                </div>
            </div>
        `;
    }
    
    // Hadis bo'limi HTML
    getHadisSectionHTML() {
        return `
            <h2 class="content-title">📜 Hadisi Sharif</h2>
            
            <div class="intro-text">
                <p>Payg'ambarimiz Muhammad (s.a.v) ning hadislari va ularning sharhlari.</p>
            </div>
            
            <div class="category-grid">
                ${this.hadisCategories.map(cat => `
                    <div class="category-card" onclick="loadHadisCategory(${cat.id})">
                        <div class="category-icon">${cat.icon}</div>
                        <div class="category-name">${cat.name}</div>
                        <div class="category-count">${cat.count} hadis</div>
                    </div>
                `).join('')}
            </div>
            
            <h3 style="margin: 25px 0 15px; color: var(--primary-color);">
                🌟 Kun hadisi
            </h3>
            
            ${this.createHadithHTML(this.getRandomHadith())}
            
            <div class="search-box" style="margin-top: 25px;">
                <input type="text" id="hadisSearch" placeholder="Hadis qidirish..." 
                       style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                <button class="btn-action" onclick="searchHadith()" style="width: 100%; margin-top: 10px;">
                    🔍 Qidirish
                </button>
            </div>
        `;
    }
    
    // Kategoriya bo'yicha HTML
    getCategoryHTML(categoryId) {
        const category = this.hadisCategories.find(c => c.id === categoryId);
        if (!category) return '<p>Kategoriya topilmadi.</p>';
        
        const hadiths = this.getHadithsByCategory(categoryId);
        
        return `
            <h2 class="content-title">${category.icon} ${category.name}</h2>
            <p>${category.count} ta hadis mavjud</p>
            
            <div class="hadith-list">
                ${hadiths.map(hadith => `
                    <div class="hadith-item">
                        <div class="hadith-arabic">${hadith.arabic}</div>
                        <div class="hadith-translation">${hadith.translation}</div>
                        <div class="hadith-source">${hadith.source}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Global funksiyalar
function loadHadisCategory(categoryId) {
    const hadis = new HadisManager();
    
    document.getElementById('contentArea').innerHTML = 
        hadis.getCategoryHTML(categoryId);
    
    // Haptic feedback
    if (window.TelegramWebApp) {
        TelegramWebApp.HapticFeedback.impactOccurred('light');
    }
}

function searchHadith() {
    const query = document.getElementById('hadisSearch').value;
    
    if (!query.trim()) {
        if (window.TelegramWebApp) {
            TelegramWebApp.showAlert("Iltimos, qidiruv so'zini kiriting!");
        }
        return;
    }
    
    document.getElementById('contentArea').innerHTML = `
        <h2 class="content-title">🔍 Qidiruv natijalari</h2>
        <p>"${query}" so'zi bo'yicha hadislar qidirilmoqda...</p>
        
        <div class="search-results">
            <p>Haqiqiy ilova uchun hadislar bazasi kerak bo'ladi.</p>
        </div>
    `;
}

function saveHadith(hadithId) {
    if (window.TelegramWebApp) {
        TelegramWebApp.sendData(JSON.stringify({
            action: 'save_hadith',
            hadith_id: hadithId,
            timestamp: new Date().toISOString()
        }));
        
        TelegramWebApp.showAlert("✅ Hadis saqlandi!");
        TelegramWebApp.HapticFeedback.notificationOccurred('success');
    }
}

// Global export
window.HadisManager = HadisManager;
window.loadHadisCategory = loadHadisCategory;
window.searchHadith = searchHadith;
window.saveHadith = saveHadith;

// Module export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HadisManager;
}
