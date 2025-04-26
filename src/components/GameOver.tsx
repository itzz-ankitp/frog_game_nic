import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, RotateCcw } from 'lucide-react';

interface GameOverProps {
  score: number;
  highScore: number;
}

const GameOver: React.FC<GameOverProps> = ({ score, highScore }) => {
  const { dispatch } = useGame();
  
  const handleRestart = () => {
    dispatch({ type: 'RESTART_GAME' });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg border-2 border-red-500 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-red-500 mb-4">RAGE QUIT!</h2>
        
        <div className="mb-6">
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl">🤬</span>
            </div>
          </div>
        </div>
        
        <div className="text-white mb-6">
          <p className="text-xl mb-4">The frog has had enough of your jumping skills!</p>
          
          <div className="flex justify-center items-center mb-4">
            <Trophy className="text-yellow-400 mr-2" size={24} />
            <div className="text-left">
              <div className="text-lg">Your Score: <span className="text-yellow-400">{score}</span></div>
              <div className="text-lg">High Score: <span className="text-yellow-400">{highScore}</span></div>
            </div>
          </div>
          
          <p className="text-gray-400 italic text-sm">
            "It's not the game, it's your skill level."
          </p>
        </div>
        
        <button
          onClick={handleRestart}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center w-full transition-colors"
        >
          <RotateCcw className="mr-2" size={18} />
          Try Again (Really?)
        </button>
      </div>
    </div>
  );
};

export default GameOver;