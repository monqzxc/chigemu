import { CHIBI_CHARACTERS, getChibiCharacter } from './characters.js';

// Game State
const canvas = document.getElementById('arena');
const ctx = canvas.getContext('2d');

let gameState = 'MENU'; // MENU, PLAYING, GAMEOVER
let selectedCharKey = 'IRUMA';
let currentChar = getChibiCharacter(selectedCharKey);

// Fighter Objects
let player = {
    x: 100, y: 260, width: 64, height: 64,
    vx: 0, vy: 0, speed: 4, hp: 100, maxHp: 100,
    mana: 0, maxMana: 100, isAttacking: false, facing: 'right', color: '#38bdf8'
};

let enemy = {
    x: 480, y: 260, width: 64, height: 64,
    vx: 0, vy: 0, speed: 3.5, hp: 100, maxHp: 100,
    mana: 0, maxMana: 100, isAttacking: false, facing: 'left', color: '#ef4444'
};

// Input trackers
const keys = {};

// Initialize UI and Roster
function initRoster() {
    const rosterContainer = document.getElementById('roster-container');
    rosterContainer.innerHTML = '';

    Object.keys(CHIBI_CHARACTERS).forEach((key) => {
        const char = CHIBI_CHARACTERS[key];
        const btn = document.createElement('button');
        btn.className = `roster-btn ${key === selectedCharKey ? 'active' : ''}`;
        btn.innerHTML = `<img src="${char.spriteUrl}" alt="${char.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'40\' height=\'40\'><rect width=\'100%\' height=\'100%\' fill=\'%231e293b\'/></svg>'">`;
        
        btn.addEventListener('click', () => {
            selectedCharKey = key;
            currentChar = getChibiCharacter(key);
            player.speed = currentChar.speed;
            player.color = currentChar.palette.primary;
            
            document.querySelectorAll('.roster-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updatePreview();
        });

        rosterContainer.appendChild(btn);
    });
    updatePreview();
}

function updatePreview() {
    document.getElementById('preview-img').src = currentChar.spriteUrl;
    document.getElementById('preview-name').textContent = currentChar.name;
    document.getElementById('preview-meta').textContent = currentChar.title;
    document.getElementById('preview-quote').textContent = currentChar.quote;
    document.getElementById('char-mbti-tag').textContent = `[${currentChar.mbti}]`;
    document.getElementById('p-label-name').textContent = currentChar.name;
    document.getElementById('e-label-name').textContent = 'Rival AI';
}

// Event Listeners for UI Navigation
document.getElementById('btn-goto-game').addEventListener('click', () => {
    document.getElementById('main-menu').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
    startSoloGame();
});

document.getElementById('btn-side-menu').addEventListener('click', () => {
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('main-menu').classList.add('active');
    gameState = 'MENU';
});

document.getElementById('btn-quit-menu').addEventListener('click', () => {
    document.getElementById('game-over-overlay').style.display = 'none';
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('main-menu').classList.add('active');
    gameState = 'MENU';
});

document.getElementById('btn-restart').addEventListener('click', () => {
    document.getElementById('game-over-overlay').style.display = 'none';
    startSoloGame();
});

// Keyboard Controls
window.addEventListener('keydown', (e) => { keys[e.code] = true; });
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

// Touch Control Bindings
function bindTouchButton(id, code) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('touchstart', (e) => { e.preventDefault(); keys[code] = true; });
    el.addEventListener('touchend', (e) => { e.preventDefault(); keys[code] = false; });
}
bindTouchButton('t-left', 'ArrowLeft');
bindTouchButton('t-right', 'ArrowRight');
bindTouchButton('t-jump', 'ArrowUp');
bindTouchButton('t-attack', 'KeyX');
bindTouchButton('t-skill', 'KeyC');

function startSoloGame() {
    gameState = 'PLAYING';
    player.hp = 100; player.maxHp = 100; player.mana = 0; player.x = 100; player.y = 260;
    enemy.hp = 100; enemy.maxHp = 100; enemy.mana = 0; enemy.x = 480; enemy.y = 260;
}

// Core Physics & Game Loop
function update() {
    if (gameState !== 'PLAYING') return;

    // Player Movement
    if (keys['ArrowLeft'] || keys['KeyA']) {
        player.vx = -player.speed;
        player.facing = 'left';
    } else if (keys['ArrowRight'] || keys['KeyD']) {
        player.vx = player.speed;
        player.facing = 'right';
    } else {
        player.vx = 0;
    }

    // Jump
    if ((keys['ArrowUp'] || keys['KeyW']) && player.y === 260) {
        player.vy = -12;
    }

    // Gravity & Physics
    player.vy += 0.6;
    player.x += player.vx;
    player.y += player.vy;

    if (player.y > 260) {
        player.y = 260;
        player.vy = 0;
    }

    // Boundaries
    player.x = Math.max(20, Math.min(canvas.width - player.width - 20, player.x));

    // Attack Action
    if (keys['KeyX'] && !player.isAttacking) {
        player.isAttacking = true;
        player.mana = Math.min(100, player.mana + 15);
        setTimeout(() => { player.isAttacking = false; }, 250);

        // Simple Hitbox Check
        const dist = Math.abs((player.x + player.width/2) - (enemy.x + enemy.width/2));
        if (dist < 70) {
            enemy.hp = Math.max(0, enemy.hp - 10);
        }
    }

    // AI Basic Behavior for Rival
    if (enemy.x > player.x + 40) {
        enemy.x -= 2;
        enemy.facing = 'left';
    } else if (enemy.x < player.x - 40) {
        enemy.x += 2;
        enemy.facing = 'right';
    } else if (Math.random() < 0.03) {
        // AI Attack
        const dist = Math.abs((enemy.x + enemy.width/2) - (player.x + player.width/2));
        if (dist < 70) {
            player.hp = Math.max(0, player.hp - 8);
        }
    }

    // Check Win/Loss
    if (player.hp <= 0 || enemy.hp <= 0) {
        gameState = 'GAMEOVER';
        document.getElementById('overlay-title').textContent = player.hp <= 0 ? 'DEFEAT...' : 'VICTORY!';
        document.getElementById('game-over-overlay').style.display = 'flex';
    }

    // Update HUD DOM Elements
    document.getElementById('p-hp').style.width = `${Math.max(0, (player.hp / player.maxHp) * 100)}%`;
    document.getElementById('e-hp').style.width = `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%`;
    document.getElementById('p-mana-bar').style.width = `${Math.max(0, (player.mana / player.maxMana) * 100)}%`;
    document.getElementById('mana-num').textContent = `${player.mana} / 100`;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Arena Ground
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 324, canvas.width, 96);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, 324, canvas.width, 3);

    // Draw Player Placeholder / Placeholder Box if image fails
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px sans-serif';
    ctx.fillText(currentChar.name, player.x, player.y - 6);

    // Draw Enemy
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    ctx.fillText('Rival AI', enemy.x, enemy.y - 6);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize on Load
initRoster();
requestAnimationFrame(gameLoop);