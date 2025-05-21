const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player properties
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    color: 'blue',
    speed: 5
};

// NPC properties
const npc = {
    x: 160,
    y: 64,
    size: 20,
    color: 'red'
};

// Key press tracking
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Initialize health values
let npcHealth = 100;
let playerHealth = 100;

// Event listeners for key presses
document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
    }
});

let isBattleActive = false;

function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.size &&
        rect1.x + rect1.size > rect2.x &&
        rect1.y < rect2.y + rect2.size &&
        rect1.y + rect1.size > rect2.y
    );
}

function showBattleScreen() {
    isBattleActive = true;

    const battleScreen = document.createElement('div');
    battleScreen.id = 'battleScreen';
    battleScreen.style.position = 'absolute';
    battleScreen.style.top = '0';
    battleScreen.style.left = '0';
    battleScreen.style.width = '100%';
    battleScreen.style.height = '100%';
    battleScreen.style.backgroundColor = 'green';
    battleScreen.style.backgroundImage = 'url("battle-background.png")'; // Add a background image
    battleScreen.style.backgroundSize = 'cover';
    battleScreen.style.display = 'flex';
    battleScreen.style.flexDirection = 'column';
    document.body.appendChild(battleScreen);

    // Top section for health bars
    const topSection = document.createElement('div');
    topSection.style.width = '100%';
    topSection.style.height = '30%';
    topSection.style.display = 'flex';
    topSection.style.justifyContent = 'space-between';
    topSection.style.alignItems = 'flex-start';
    topSection.style.padding = '20px';
    battleScreen.appendChild(topSection);

    const npcHealthContainer = document.createElement('div');
    npcHealthContainer.style.width = '40%';
    npcHealthContainer.style.height = '50px';
    npcHealthContainer.style.display = 'flex';
    npcHealthContainer.style.flexDirection = 'column';
    topSection.appendChild(npcHealthContainer);

    const npcName = document.createElement('div');
    npcName.textContent = 'Enemy NPC';
    npcName.style.fontSize = '18px';
    npcName.style.fontWeight = 'bold';
    npcHealthContainer.appendChild(npcName);

    const npcHealthBar = document.createElement('div');
    npcHealthBar.style.width = '100%';
    npcHealthBar.style.height = '20px';
    npcHealthBar.style.backgroundColor = 'red';
    npcHealthBar.style.border = '2px solid black';
    npcHealthContainer.appendChild(npcHealthBar);

    const playerHealthContainer = document.createElement('div');
    playerHealthContainer.style.width = '40%';
    playerHealthContainer.style.height = '50px';
    playerHealthContainer.style.display = 'flex';
    playerHealthContainer.style.flexDirection = 'column';
    playerHealthContainer.style.alignItems = 'flex-end';
    topSection.appendChild(playerHealthContainer);

    const playerName = document.createElement('div');
    playerName.textContent = 'Player';
    playerName.style.fontSize = '18px';
    playerName.style.fontWeight = 'bold';
    playerHealthContainer.appendChild(playerName);

    const playerHealthBar = document.createElement('div');
    playerHealthBar.style.width = '100%';
    playerHealthBar.style.height = '20px';
    playerHealthBar.style.backgroundColor = 'blue';
    playerHealthBar.style.border = '2px solid black';
    playerHealthContainer.appendChild(playerHealthBar);

    // Middle section for characters
    const middleSection = document.createElement('div');
    middleSection.style.width = '100%';
    middleSection.style.height = '40%';
    middleSection.style.display = 'flex';
    middleSection.style.justifyContent = 'space-between';
    middleSection.style.alignItems = 'center';
    battleScreen.appendChild(middleSection);

    const npcSprite = document.createElement('div');
    npcSprite.style.width = '100px';
    npcSprite.style.height = '100px';
    npcSprite.style.backgroundColor = 'red';
    npcSprite.style.borderRadius = '50%';
    middleSection.appendChild(npcSprite);

    const playerSprite = document.createElement('div');
    playerSprite.style.width = '100px';
    playerSprite.style.height = '100px';
    playerSprite.style.backgroundColor = 'blue';
    playerSprite.style.borderRadius = '50%';
    middleSection.appendChild(playerSprite);

    // Bottom section for actions
    const bottomSection = document.createElement('div');
    bottomSection.style.width = '100%';
    bottomSection.style.height = '30%';
    bottomSection.style.backgroundColor = 'white';
    bottomSection.style.borderTop = '2px solid black';
    bottomSection.style.display = 'flex';
    bottomSection.style.flexDirection = 'column';
    bottomSection.style.justifyContent = 'space-around';
    bottomSection.style.alignItems = 'center';
    battleScreen.appendChild(bottomSection);

    const actionText = document.createElement('div');
    actionText.textContent = 'What will you do?';
    actionText.style.fontSize = '20px';
    actionText.style.fontWeight = 'bold';
    bottomSection.appendChild(actionText);

    const actionButtons = document.createElement('div');
    actionButtons.style.width = '80%';
    actionButtons.style.display = 'flex';
    actionButtons.style.justifyContent = 'space-around';
    bottomSection.appendChild(actionButtons);

    const attackTackleButton = document.createElement('button');
    attackTackleButton.textContent = 'Tackle';
    attackTackleButton.style.padding = '10px 20px';
    attackTackleButton.style.fontSize = '16px';
    actionButtons.appendChild(attackTackleButton);

    const attackFireballButton = document.createElement('button');
    attackFireballButton.textContent = 'Fireball';
    attackFireballButton.style.padding = '10px 20px';
    attackFireballButton.style.fontSize = '16px';
    actionButtons.appendChild(attackFireballButton);

    function updateHealthBars() {
        npcHealthBar.style.width = `${npcHealth}%`;
        playerHealthBar.style.width = `${playerHealth}%`;
    }

    function checkWinCondition() {
        if (npcHealth <= 0) {
            alert('You have won!');
            spawnNewNPC();
            document.body.removeChild(battleScreen);
            resetGameState();
        } else if (playerHealth <= 0) {
            alert('You have lost!');
            document.body.removeChild(battleScreen);
            resetGameState();
        }
    }

    function npcAttack() {
        playerHealth = Math.max(0, playerHealth - 15); // NPC deals 15 damage
        updateHealthBars();
        checkWinCondition();
    }

    attackTackleButton.addEventListener('click', () => {
        npcHealth = Math.max(0, npcHealth - 10); // Player deals 10 damage
        updateHealthBars();
        checkWinCondition();
        if (npcHealth > 0) npcAttack(); // NPC attacks if still alive
    });

    attackFireballButton.addEventListener('click', () => {
        npcHealth = Math.max(0, npcHealth - 20); // Player deals 20 damage
        updateHealthBars();
        checkWinCondition();
        if (npcHealth > 0) npcAttack(); // NPC attacks if still alive
    });
}

function spawnNewNPC() {
    npc.x = Math.random() * (canvas.width - npc.size);
    npc.y = Math.random() * (canvas.height - npc.size);
    npcHealth = 100; // Reset NPC health for the new battle
}

function resetGameState() {
    // Clear the canvas and reset player position
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    isBattleActive = false;
}

const playerImage = new Image();
playerImage.src = 'player.png';

playerImage.onload = () => {
    // Ensure the image is loaded before starting the game loop
    gameLoop();
};

// Game loop
function gameLoop() {
    if (isBattleActive) return; // Pause movement during battle

    // Clear the canvas
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update player position with boundary checks
    if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
    if (keys.ArrowDown && player.y + player.size <= canvas.height) player.y += player.speed;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x + player.size <= canvas.width) player.x += player.speed;

    // Check for collision with NPC
    if (checkCollision(player, npc)) {
        showBattleScreen();
        return;
    }

    // Draw the player image
    ctx.drawImage(playerImage, player.x, player.y, player.size, player.size);

    // Draw the NPC
    ctx.fillStyle = npc.color;
    ctx.fillRect(npc.x, npc.y, npc.size, npc.size);

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();