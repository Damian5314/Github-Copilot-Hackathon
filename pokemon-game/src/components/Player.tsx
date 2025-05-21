import React from 'react';

class Player {
    constructor(name, position) {
        this.name = name;
        this.position = position; // { x: number, y: number }
    }

    move(direction) {
        switch (direction) {
            case 'up':
                this.position.y -= 1;
                break;
            case 'down':
                this.position.y += 1;
                break;
            case 'left':
                this.position.x -= 1;
                break;
            case 'right':
                this.position.x += 1;
                break;
            default:
                break;
        }
    }

    interact() {
        // Logic for interaction with NPCs or items
    }
}

export default Player;