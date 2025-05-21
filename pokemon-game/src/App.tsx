import React from 'react';
import GameCanvas from './components/GameCanvas';
import './styles/App.css';

const App: React.FC = () => {
    return (
        <div className="App">
            <h1>2D Pokémon-like Game</h1>
            <GameCanvas />
        </div>
    );
}

export default App;