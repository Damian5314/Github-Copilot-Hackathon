import React from 'react';

class NPC {
    constructor(name, position) {
        this.name = name;
        this.position = position; // { x: number, y: number }
    }

    move(newPosition) {
        this.position = newPosition;
    }

    interact() {
        console.log(`${this.name} says: Hello!`);
    }

    render() {
        return (
            <div style={{ position: 'absolute', left: this.position.x, top: this.position.y }}>
                <img src={`path/to/sprites/${this.name}.png`} alt={this.name} />
            </div>
        );
    }
}

export default NPC;