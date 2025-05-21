import React from 'react';

interface PlayerProps {
    position: { x: number; y: number };
}

const Player: React.FC<PlayerProps> = ({ position }) => {
    return (
        <div
            className="player"
            style={{
                left: position.x,
                top: position.y,
            }}
        />
    );
};

export default Player;