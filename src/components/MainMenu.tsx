import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';
import { Frown as Frog, Play, Info, X, Volume2, VolumeX, Music, User } from 'lucide-react';
import SkinSelector from './SkinSelector';

interface MainMenuProps {
  onStartGame: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const { state } = useGame();
  const { toggleSound, isSoundOn, toggleMusic, isMusicOn } = useSound();
  const [showHelp, setShowHelp] = useState(false);
  const [showSkins, setShowSkins] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Title with animation */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <Frog size={48} className="text-green-400 mr-2 animate-bounce" />
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
            FROG JUMP
          </h1>
          <Frog size={48} className="text-green-400 ml-2 animate-bounce" style={{ animationDelay: '0.5s' }} />
        </div>
        <h2 className="text-2xl font-bold text-red-500 animate-pulse">RAGE GAME</h2>
      </div>
      
      {/* Main menu buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={onStartGame}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-lg font-bold flex items-center justify-center transition-all transform hover:scale-105"
        >
          <Play className="mr-2" size={24} />
          Start Game
        </button>
        
        <button
          onClick={() => setShowSkins(true)}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 rounded-lg font-bold flex items-center justify-center transition-all transform hover:scale-105"
        >
          <User className="mr-2" size={24} />
          Skins ({state.unlockedSkins.length}/4)
        </button>
        
        <button
          onClick={() => setShowHelp(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-lg font-bold flex items-center justify-center transition-all transform hover:scale-105"
        >
          <Info className="mr-2" size={24} />
          How to Play
        </button>
        
        <div className="flex justify-center gap-4 mt-2">
          <button
            onClick={toggleSound}
            className={`p-3 rounded-full ${isSoundOn ? 'bg-green-600' : 'bg-gray-700'}`}
          >
            {isSoundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
          
          <button
            onClick={toggleMusic}
            className={`p-3 rounded-full ${isMusicOn ? 'bg-green-600' : 'bg-gray-700'}`}
          >
            <Music size={24} />
          </button>
        </div>
      </div>
      
      {/* High score display */}
      {state.highScore > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-400">High Score</p>
          <p className="text-2xl font-bold text-yellow-400">{state.highScore}</p>
        </div>
      )}
      
      {/* How to play modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">How to Play</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="font-bold text-green-400 mb-1">Controls</h3>
                <p><span className="px-2 py-1 bg-gray-800 rounded mr-1">←→</span> or <span className="px-2 py-1 bg-gray-800 rounded mx-1">A/D</span> - Move left/right</p>
                <p><span className="px-2 py-1 bg-gray-800 rounded mx-1">Space</span> - Jump</p>
              </div>
              
              <div>
                <h3 className="font-bold text-yellow-400 mb-1">Platforms</h3>
                <p><span className="text-green-500">■</span> Normal - Safe to land on</p>
                <p><span className="text-red-500">■</span> Fake - Will collapse when touched</p>
                <p><span className="text-yellow-500">■</span> Bouncy - Gives extra jump height</p>
              </div>
              
              <div>
                <h3 className="font-bold text-red-400 mb-1">Rage Meter</h3>
                <p>The more you fail, the more the frog rages! At max rage, controls become even more difficult!</p>
              </div>
              
              <div>
                <h3 className="font-bold text-purple-400 mb-1">Weather</h3>
                <p>Different weather effects will change how your frog jumps:</p>
                <p>☀️ Clear - Normal jumping</p>
                <p>🌧️ Rain - Slippery platforms</p>
                <p>💨 Wind - Random sideways push</p>
                <p>⚡ Storm - Strong random gusts</p>
              </div>
              
              <div className="italic text-sm text-gray-500 mt-4">
                Remember: This game is INTENTIONALLY difficult! Don't blame the game... blame your skills! 😈
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Skins selector modal */}
      {showSkins && (
        <SkinSelector onClose={() => setShowSkins(false)} />
      )}
    </div>
  );
};

export default MainMenu;