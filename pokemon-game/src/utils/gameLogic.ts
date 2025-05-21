export const checkCollision = (rect1: { x: number; y: number; width: number; height: number }, rect2: { x: number; y: number; width: number; height: number }): boolean => {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
};

export const movePlayer = (player: { x: number; y: number }, direction: string, speed: number): { x: number; y: number } => {
    switch (direction) {
        case 'up':
            return { x: player.x, y: player.y - speed };
        case 'down':
            return { x: player.x, y: player.y + speed };
        case 'left':
            return { x: player.x - speed, y: player.y };
        case 'right':
            return { x: player.x + speed, y: player.y };
        default:
            return player;
    }
};

export const updateGameState = (state: any, action: { type: string; payload?: any }): any => {
    switch (action.type) {
        case 'MOVE_PLAYER':
            return {
                ...state,
                player: movePlayer(state.player, action.payload.direction, action.payload.speed),
            };
        // Additional game state updates can be handled here
        default:
            return state;
    }
};