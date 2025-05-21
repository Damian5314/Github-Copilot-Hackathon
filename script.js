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

// Add multiple NPCs and trees to the map
const npcs = [
    { x: 160, y: 64, size: 20, color: 'red', health: 100 },
    { x: 300, y: 200, size: 20, color: 'orange', health: 100 },
    { x: 500, y: 400, size: 20, color: 'purple', health: 100 }
];

const trees = [
    { x: 100, y: 100, size: 30, color: 'green' },
    { x: 400, y: 300, size: 30, color: 'green' },
    { x: 600, y: 150, size: 30, color: 'green' }
];

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

function toggleBattleBar(show) {
    const bottomBar = document.querySelector('.bottom-bar');
    if (show) {
        bottomBar.classList.add('active');
    } else {
        bottomBar.classList.remove('active');
    }
}

function showBattleScreen() {
    isBattleActive = true;
    toggleBattleBar(true); // Show the battle bar

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

    const npcSprite = document.createElement('img');
    npcSprite.src = enemyImage.src; // Use the updated enemy image
    npcSprite.style.width = '100px';
    npcSprite.style.height = '100px';
    npcSprite.style.borderRadius = '50%';
    middleSection.appendChild(npcSprite);

    const playerSprite = document.createElement('img');
    playerSprite.src = playerImage.src; // Use the player image
    playerSprite.style.width = '100px';
    playerSprite.style.height = '100px';
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
    bottomSection.classList.add('bottom-bar'); // Add class for toggling
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

    const moves = [
        { name: 'Tackle', damage: 10 },
        { name: 'Razor Leaf', damage: 20 }, // Changed from "Fireball" to "Razor Leaf"
        { name: 'Slash', damage: 15 }
    ]; // Removed the 'Heal' option

    for (let i = 0; i < 3; i++) {
        const move = moves[i];
        const button = document.createElement('button');
        button.textContent = move.name;
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        actionButtons.appendChild(button);

        button.addEventListener('click', () => {
            if (move.damage > 0) {
                npcHealth = Math.max(0, npcHealth - move.damage); // Player deals damage
            } else {
                playerHealth = Math.min(100, playerHealth - move.damage); // Player heals
            }
            updateHealthBars();
            checkWinCondition();
            if (npcHealth > 0 && move.damage > 0) npcAttack(); // NPC attacks if still alive
        });
    }

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
        const damage = 15; // NPC deals fixed damage
        playerHealth = Math.max(0, playerHealth - damage); // Ensure health doesn't drop below 0
        updateHealthBars();
        checkWinCondition();
    }
}

function spawnNewNPC() {
    const defeatedNPCIndex = npcs.findIndex(npc => npc.health <= 0);
    if (defeatedNPCIndex !== -1) {
        npcs[defeatedNPCIndex] = {
            x: Math.random() * (canvas.width - 20),
            y: Math.random() * (canvas.height - 20),
            size: 20,
            color: 'red', // Reset to default color
            health: 100 // Reset health
        };
    }
    npcHealth = 100; // Ensure global npcHealth is reset
    drawNPCs(); // Ensure NPCs are redrawn
}

function resetGameState() {
    // Clear the canvas and reset player position
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    isBattleActive = false;
    toggleBattleBar(false); // Hide the battle bar

    playerHealth = 100; // Reset player health to full

    drawNPCs(); // Redraw NPCs
    drawPlayer(); // Redraw player

    // Resume the game loop if it was paused
    if (!isBattleActive) {
        requestAnimationFrame(gameLoop);
    }
}

function showWelcomeScreen() {
    const welcomeScreen = document.createElement('div');
    welcomeScreen.id = 'welcomeScreen';
    welcomeScreen.style.position = 'absolute';
    welcomeScreen.style.top = '0';
    welcomeScreen.style.left = '0';
    welcomeScreen.style.width = '100%';
    welcomeScreen.style.height = '100%';
    welcomeScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    welcomeScreen.style.display = 'flex';
    welcomeScreen.style.flexDirection = 'column';
    welcomeScreen.style.justifyContent = 'center';
    welcomeScreen.style.alignItems = 'center';
    welcomeScreen.style.color = 'white';
    welcomeScreen.style.fontFamily = 'Arial, sans-serif';

    const title = document.createElement('h1');
    title.textContent = 'Welcome to the Pokémon Game!';
    title.style.marginBottom = '20px';
    welcomeScreen.appendChild(title);

    const startButton = document.createElement('button');
    startButton.textContent = 'Start Game';
    startButton.style.padding = '10px 20px';
    startButton.style.fontSize = '18px';
    startButton.style.cursor = 'pointer';
    startButton.addEventListener('click', () => {
        document.body.removeChild(welcomeScreen);
        gameLoop(); // Start the game loop
    });
    welcomeScreen.appendChild(startButton);

    document.body.appendChild(welcomeScreen);
}

// Show the welcome screen before starting the game
showWelcomeScreen();

function drawNPCs() {
    npcs.forEach(npc => {
        ctx.fillStyle = npc.color;
        ctx.fillRect(npc.x, npc.y, npc.size, npc.size);
    });
}

const playerImage = new Image();
playerImage.src = 'https://img.pokemondb.net/sprites/black-white/normal/bulbasaur.png';

const enemyImage = new Image();
enemyImage.src = 'https://img.pokemondb.net/sprites/diamond-pearl/normal/mewtwo.png'; // Updated to Mewtwo sprite

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.size, player.size);
}

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

    // Draw trees
    trees.forEach(tree => {
        ctx.fillStyle = tree.color;
        ctx.fillRect(tree.x, tree.y, tree.size, tree.size);
    });

    // Update player position with boundary checks
    if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
    if (keys.ArrowDown && player.y + player.size <= canvas.height) player.y += player.speed;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x + player.size <= canvas.width) player.x += player.speed;

    // Check for collision with any NPC
    npcs.forEach(npc => {
        if (checkCollision(player, npc)) {
            showBattleScreen();
            return;
        }
    });

    // Draw the player image
    ctx.drawImage(playerImage, player.x, player.y, player.size, player.size);

    // Draw NPCs
    npcs.forEach(npc => {
        ctx.fillStyle = npc.color;
        ctx.fillRect(npc.x, npc.y, npc.size, npc.size);
    });

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();