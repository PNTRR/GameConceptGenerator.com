// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileNav.classList.toggle('active');
        });
        
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
            });
        });
        
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.nav')) {
                mobileNav.classList.remove('active');
            }
        });
    }

    // Load game data and initialize generator
    loadGameData().then(() => {
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', generateConcept);
            generateBtn.disabled = false;
            generateBtn.textContent = '🎲 GENERATE';
        }
    }).catch(error => {
        console.error('Failed to load game data:', error);
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.textContent = '❌ Load Failed';
        }
    });
});

// Game data storage - УБИРАЕМ VISUAL
let gameData = {
    genre: [],
    mechanic: [],  // МЕНЯЕМ ПОРЯДОК - теперь второй
    setting: [], 
    world: [],
    aesthetic: []
};

// Load data from TXT files - УБИРАЕМ VISUAL
async function loadGameData() {
    const categories = ['genre', 'mechanic', 'setting', 'world', 'aesthetic']; // БЕЗ VISUAL
    
    const loadPromises = categories.map(async (category) => {
        try {
            const response = await fetch(`resources/${category}.txt`);
            if (!response.ok) {
                throw new Error(`Failed to load ${category}.txt: ${response.status}`);
            }
            const text = await response.text();
            
            // Parse TXT file - split by new lines and filter empty lines
            gameData[category] = text.split('\n')
                .map(line => line.trim())
                .filter(line => line && line.length > 0);
            
            console.log(`Loaded ${gameData[category].length} ${category} items`);
            
            return true;
        } catch (error) {
            console.error(`Error loading ${category}:`, error);
            // Use empty array as fallback
            gameData[category] = [];
            return false;
        }
    });

    await Promise.all(loadPromises);
    console.log('All game data loaded successfully');
}

function getRandomItem(array) {
    if (!array || array.length === 0) {
        return "No data available";
    }
    return array[Math.floor(Math.random() * array.length)];
}

function generateConcept() {
    const generateBtn = document.getElementById('generate-btn');
    const resultElements = {
        genre: document.getElementById('genre'),
        mechanic: document.getElementById('mechanic'),  // ВТОРОЙ
        setting: document.getElementById('setting'),
        world: document.getElementById('world'),
        aesthetic: document.getElementById('aesthetic')  // БЕЗ VISUAL
    };

    // Check if data is loaded
    const hasData = Object.values(gameData).every(arr => arr.length > 0);
    if (!hasData) {
        alert('Data still loading or files are empty. Please check your TXT files.');
        return;
    }

    // Блокируем кнопку на время анимации
    generateBtn.disabled = true;
    generateBtn.classList.add('jump');
    
    // Сразу меняем все тексты с простой анимацией
    Object.keys(resultElements).forEach((key) => {
        const element = resultElements[key];
        const newValue = getRandomItem(gameData[key]);
        
        // Убираем старую анимацию
        element.classList.remove('fade-in');
        
        // Меняем текст
        element.textContent = newValue;
        
        // Добавляем простую анимацию fade
        setTimeout(() => {
            element.classList.add('fade-in');
        }, 10);
    });
    
    // Разблокируем кнопку после завершения анимации (1 секунда)
    setTimeout(() => {
        generateBtn.classList.remove('jump');
        generateBtn.disabled = false;
    }, 1000);
}