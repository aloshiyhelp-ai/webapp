// app.js - Oddiy ishlaydigan versiya
console.log("✅ app.js yuklandi");

class SimpleApp {
    constructor() {
        console.log("🚀 SimpleApp ishga tushmoqda");
        
        // DOM yuklanganda
        document.addEventListener('DOMContentLoaded', () => {
            this.init();
        });
    }
    
    init() {
        console.log("✅ SimpleApp init");
        
        // Kartalarni yaratish
        this.createCards();
        
        // Menyuni yaratish
        this.createNav();
        
        // Kontentni ko'rsatish
        this.showContent();
    }
    
    createCards() {
        const grid = document.getElementById('featureGrid');
        if (!grid) {
            console.warn("⚠️ featureGrid topilmadi");
            return;
        }
        
        const cards = [
            { icon: '🕋', title: 'Quroni Karim', desc: '114 sura' },
            { icon: '📜', title: 'Hadisi Sharif', desc: 'Hadis to\'plami' },
            { icon: '🔍', title: 'Tafsir Ilmi', desc: 'Oyat tafsirlari' },
            { icon: '🌙', title: 'Siyrat', desc: 'Payg\'ambar hayoti' }
        ];
        
        grid.innerHTML = cards.map(card => `
            <div class="feature-card" onclick="app.openCard('${card.title}')">
                <div class="card-icon">${card.icon}</div>
                <h3>${card.title}</h3>
                <p>${card.desc}</p>
            </div>
        `).join('');
        
        console.log("✅ Kartalar yaratildi");
    }
    
    createNav() {
        const nav = document.getElementById('bottomNav');
        if (!nav) {
            console.warn("⚠️ bottomNav topilmadi");
            return;
        }
        
        const items = [
            { icon: '🏠', text: 'Asosiy' },
            { icon: '📚', text: 'Darslar' },
            { icon: '🔖', text: 'Belgilar' },
            { icon: '🔍', text: 'Qidirish' },
            { icon: '👤', text: 'Profil' }
        ];
        
        nav.innerHTML = items.map(item => `
            <a href="#" class="nav-item" onclick="app.navClick('${item.text}')">
                <div class="nav-icon">${item.icon}</div>
                <div class="nav-text">${item.text}</div>
            </a>
        `).join('');
        
        console.log("✅ Menyu yaratildi");
    }
    
    showContent() {
        const content = document.getElementById('contentArea');
        if (!content) return;
        
        content.innerHTML = `
            <h2 class="content-title">🤲 Diniy Bilimlar</h2>
            <p>Python dasturlash platformasiga xush kelibsiz!</p>
            
            <div style="margin-top: 20px; padding: 15px; background: #f0f7ff; border-radius: 10px;">
                <h3>🎯 Imkoniyatlar:</h3>
                <ul>
                    <li>Quroni Karim o'qish</li>
                    <li>Hadislarni o'rganish</li>
                    <li>Tafsir bilimlari</li>
                    <li>Siyrat haqida ma'lumot</li>
                </ul>
            </div>
            
            <button onclick="app.testButton()" style="margin-top: 15px; padding: 10px 20px; background: #2c5aa0; color: white; border: none; border-radius: 5px;">
                Test Tugmasi
            </button>
        `;
        
        console.log("✅ Kontent ko'rsatildi");
    }
    
    openCard(title) {
        alert(`"${title}" bo'limi ochilmoqda...`);
        console.log(`📂 Bo'lim ochildi: ${title}`);
    }
    
    navClick(item) {
        alert(`"${item}" menyusi bosildi`);
        console.log(`📱 Menyu: ${item}`);
    }
    
    testButton() {
        alert("✅ Test tugmasi ishlayapti!");
        console.log("✅ Test tugmasi bosildi");
    }
}

// Global app
window.app = new SimpleApp();

// Global funksiyalar
window.openCard = function(title) {
    window.app.openCard(title);
};

window.navClick = function(item) {
    window.app.navClick(item);
};

console.log("✅ app.js tayyor");
