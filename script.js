document.getElementById('generate-btn').addEventListener('click', generateAll);

async function generateAll() {
    const files = {
        'genre': 'resources/en/genre.txt',
        'mechanic': 'resources/en/mechanic.txt',
        'setting': 'resources/en/setting.txt',
        'world': 'resources/en/world.txt',
        'aesthetic': 'resources/en/aesthetic.txt'
    };

    for (const [key, file] of Object.entries(files)) {
        const value = await fetchRandomLine(file);
        document.getElementById(key).textContent = value;
    }
}

async function fetchRandomLine(file) {
    try {
        const response = await fetch(file);
        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim());
        return lines[Math.floor(Math.random() * lines.length)] || '-';
    } catch {
        return '-';
    }
}