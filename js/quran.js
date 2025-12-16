// quran.js - Qur'on ma'lumotlari va funksiyalari

class QuranManager {
    constructor() {
        this.suras = [
            { id: 1, name: 'Al-Fotiha', ayahs: 7, arabic: 'الفاتحة' },
            { id: 2, name: 'Al-Baqara', ayahs: 286, arabic: 'البقرة' },
            { id: 3, name: 'Ali Imron', ayahs: 200, arabic: 'آل عمران' },
            { id: 4, name: 'An-Niso', ayahs: 176, arabic: 'النساء' },
            { id: 5, name: 'Al-Moida', ayahs: 120, arabic: 'المائدة' }
        ];
        
        this.sampleVerses = [
            {
                sura: 1,
                ayah: 1,
                arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                translation: 'Mehribon va rahmli Alloh nomi bilan (boshyapman).'
            },
            {
                sura: 1,
                ayah: 2,
                arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
                translation: 'Hamd olamlar rabbi Allohgadir.'
            },
            {
                sura: 2,
                ayah: 255,
                arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
                translation: 'Alloh - Udan o'zga iloh yo'q, tirik, barcha narsani qo'llab-quvvatlovchi.'
            }
        ];
    }
    
    // Sura ro'yxatini olish
    getSuraList() {
        return this.suras;
    }
    
    // Sura ma'lumotlari
    getSuraInfo(suraId) {
        return this.suras.find(s => s.id === suraId) || null;
    }
    
    // Tasodifiy oyat olish
    getRandomVerse() {
        const randomIndex = Math.floor(Math.random() * this.sampleVerses.length);
        return this.sampleVerses[randomIndex];
    }
    
    // Sura bo'yicha oyat olish
    getVersesBySura(suraId) {
        return this.sampleVerses.filter(v => v.sura === suraId);
    }
    
    // HTML kontent yaratish
    createVerseHTML(verse) {
        const suraInfo = this.getSuraInfo(verse.sura);
        
        return `
            <div class="verse-container">
                <div class="arabic-text">${verse.arabic}</div>
                <div class="translation">${verse.translation}</div>
                <div class="verse-info">
                    <span>Sura: ${suraInfo ? suraInfo.name : verse.sura}</span>
                    <span>Oyat: ${verse.ayah}</span>
                    <button class="bookmark-btn" onclick="bookmarkVerse(${verse.sura}, ${verse.ayah})">
                        🔖 Belgilash
                    </button>
                </div>
            </div>
        `;
    }
    
    // Sura ro'yxati HTML
    createSuraListHTML() {
        let html = '<div class="sura-list">';
        
        this.suras.forEach(sura => {
            html += `
                <div class="list-item" onclick="loadSura(${sura.id})">
                    <div class="item-number">${sura.id}</div>
                    <div class="item-content">
                        <div class="item-title">${sura.name} (${sura.arabic})</div>
                        <div class="item-desc">${sura.ayahs} oyat</div>
                    </div>
                    <div class="item-action">
                        <button class="btn-small" onclick="event.stopPropagation(); playSura(${sura.id})">
                            ▶️ O'qish
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
    
    // Qur'on bo'limi HTML
    getQuranSectionHTML() {
        const randomVerse = this.getRandomVerse();
        
        return `
            <h2 class="content-title">📖 Quroni Karim</h2>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">114</div>
                    <div class="stat-label">Sura</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">6,236</div>
                    <div class="stat-label">Oyat</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">30</div>
                    <div class="stat-label">Juz'</div>
                </div>
            </div>
            
            <div class="section-actions">
                <button class="btn-action" onclick="loadRandomVerse()">
                    🎲 Tasodifiy oyat
                </button>
                <button class="btn-action" onclick="searchQuran()">
                    🔍 Qidirish
                </button>
                <button class="btn-action" onclick="showBookmarks()">
                    📌 Belgilarim
                </button>
            </div>
            
            <h3 style="margin: 25px 0 15px; color: var(--primary-color);">
                🌟 Kun oyati
            </h3>
            
            ${this.createVerseHTML(randomVerse)}
            
            <h3 style="margin: 25px 0 15px; color: var(--primary-color);">
                📚 Suralar ro'yxati
            </h3>
            
            ${this.createSuraListHTML()}
        `;
    }
}

// Global funksiyalar
function loadRandomVerse() {
    const quran = new QuranManager();
    const verse = quran.getRandomVerse();
    
    document.getElementById('contentArea').innerHTML = quran.createVerseHTML(verse);
    
    // Haptic feedback
    if (window.TelegramWebApp) {
        TelegramWebApp.HapticFeedback.impactOccurred('light');
    }
}

function loadSura(suraId) {
    const quran = new QuranManager();
    const sura = quran.getSuraInfo(suraId);
    
    if (!sura) return;
    
    document.getElementById('contentArea').innerHTML = `
        <h2 class="content-title">${sura.name} (${sura.arabic})</h2>
        <p>Sura raqami: ${sura.id} | Oyatlar soni: ${sura.ayahs}</p>
        
        <div class="sura-actions">
            <button class="btn-action" onclick="playSuraAudio(${suraId})">
                🔊 Tinglash
            </button>
            <button class="btn-action" onclick="showTafsir(${suraId})">
                🔍 Tafsir
            </button>
        </div>
        
        <div style="margin-top: 20px;">
            <p>Bu yerda "${sura.name}" surasining barcha oyatlari ko'rinadi...</p>
        </div>
    `;
}

function bookmarkVerse(suraId, ayahId) {
    if (window.TelegramWebApp) {
        TelegramWebApp.sendData(JSON.stringify({
            action: 'bookmark_verse',
            sura: suraId,
            ayah: ayahId,
            timestamp: new Date().toISOString()
        }));
        
        TelegramWebApp.showAlert("✅ Oyat belgilandi!");
        TelegramWebApp.HapticFeedback.notificationOccurred('success');
    }
}

// Global export
window.QuranManager = QuranManager;
window.loadRandomVerse = loadRandomVerse;
window.loadSura = loadSura;
window.bookmarkVerse = bookmarkVerse;

// Module export (agar kerak bo'lsa)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuranManager;
}
