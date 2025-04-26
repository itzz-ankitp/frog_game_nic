import React from 'react';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';
import { Volume2, VolumeX, Music, Heart, Flame, Trophy } from 'lucide-react';

const GameHUD: React.FC = () => {
  const { state } = useGame();
  const { toggleSound, isSoundOn, toggleMusic, isMusicOn } = useSound();
  
  return (
    <div className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-start">
      <div className="flex flex-col gap-2">
        <div className="bg-black bg-opacity-50 p-2 rounded-lg flex items-center gap-2">
          <Trophy className="text-yellow-400" size={18} />
          <span className="text-white">
            Score: {state.score} | High: {state.highScore}
          </span>
        </div>
        
        <div className="bg-black bg-opacity-50 p-2 rounded-lg flex items-center gap-2">
          <Flame className="text-red-500" size={18} />
          <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${state.rageMode ? 'bg-red-600 animate-pulse' : 'bg-orange-500'}`}
              style={{ width: `${(state.rageLevel / 10) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-black bg-opacity-50 p-2 rounded-lg flex items-center gap-2">
          <Heart className="text-red-500" size={18} />
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                size={16} 
                className={i < state.livesLeft ? 'text-red-500' : 'text-gray-500'} 
                fill={i < state.livesLeft ? '#ef4444' : 'none'}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="bg-black bg-opacity-50 p-2 rounded-lg flex items-center">
          {state.weather === 'clear' && <span className="text-white text-sm">☀️ Clear</span>}
          {state.weather === 'rain' && <span className="text-white text-sm">🌧️ Rainy</span>}
          {state.weather === 'wind' && <span className="text-white text-sm">💨 Windy</span>}
          {state.weather === 'storm' && <span className="text-white text-sm">⚡ Stormy</span>}
        </div>
        
        <div className="bg-black bg-opacity-50 p-2 rounded-lg flex items-center">
          <span className="text-white text-sm mr-2">Level {state.currentLevel}</span>
        </div>
        
        <div className="bg-black bg-opacity-50 p-2 rounded-lg flex items-center gap-2">
          <button 
            onClick={toggleSound}
            className="text-white"
          >
            {isSoundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          
          <button 
            onClick={toggleMusic}
            className="text-white"
          >
            <Music size={18} className={isMusicOn ? 'text-green-400' : 'text-gray-400'} />
          </button>
        </div>
      </div>
      
      {/* Controls hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 p-2 rounded-lg">
        <p className="text-white text-sm text-center">
          <span className="px-2 py-1 bg-gray-700 rounded mr-1">←→</span> Move | 
          <span className="px-2 py-1 bg-gray-700 rounded mx-1">Space</span> Jump
        </p>
      </div>
    </div>
  );
};

export default GameHUD;