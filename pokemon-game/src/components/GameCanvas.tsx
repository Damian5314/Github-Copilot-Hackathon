import React, { useState, useEffect, useRef } from 'react';
import Player from './Player';

const GameCanvas: React.FC = () => {
    const [playerPosition, setPlayerPosition] = useState({ x: 100, y: 100 });
    const speed = 10;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowUp':
                setPlayerPosition((prev) => ({ ...prev, y: prev.y - speed }));
                break;
            case 'ArrowDown':
                setPlayerPosition((prev) => ({ ...prev, y: prev.y + speed }));
                break;
            case 'ArrowLeft':
                setPlayerPosition((prev) => ({ ...prev, x: prev.x - speed }));
                break;
            case 'ArrowRight':
                setPlayerPosition((prev) => ({ ...prev, x: prev.x + speed }));
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                // Set canvas dimensions
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                // Game rendering logic goes here
                const render = () => {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    // Draw game elements
                    requestAnimationFrame(render);
                };

                render();
            }
        }
    }, []);

    return (
        <div id="gameCanvas">
            <Player position={playerPosition} />
            <canvas ref={canvasRef} />
        </div>
    );
};

export default GameCanvas;