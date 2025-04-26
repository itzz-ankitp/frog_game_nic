import React from 'react';
import { GameProvider } from './context/GameContext';
import GameContainer from './components/GameContainer';
import MainMenu from './components/MainMenu';
import { SoundProvider } from './context/SoundContext';

function App() {
  const [gameStarted, setGameStarted] = React.useState(false);

  return (
    <SoundProvider>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a20] to-[#182a34] text-white overflow-hidden relative">
          {!gameStarted ? (
            <MainMenu onStartGame={() => setGameStarted(true)} />
          ) : (
            <GameContainer />
          )}
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#0a3e00] to-transparent z-10"></div>
        </div>
      </GameProvider>
    </SoundProvider>
  );
}

export default App;