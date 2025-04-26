import React, { useMemo } from 'react';
import { Frown as FrogIcon, Zap, Wand2, AlignCenter as Alien } from 'lucide-react';

interface FrogProps {
  x: number;
  y: number;
  skin: 'default' | 'ninja' | 'wizard' | 'alien';
  jumping: boolean;
  falling: boolean;
  rageMode: boolean;
}

const Frog: React.FC<FrogProps> = ({ x, y, skin, jumping, falling, rageMode }) => {
  const frogState = jumping ? 'jumping' : falling ? 'falling' : 'idle';
  
  const frogAnimation = useMemo(() => {
    switch (frogState) {
      case 'jumping':
        return 'scale-y-110 scale-x-90 -translate-y-2';
      case 'falling':
        return 'scale-y-90 scale-x-110 translate-y-1';
      case 'idle':
        return 'animate-pulse';
      default:
        return '';
    }
  }, [frogState]);
  
  const renderFrogIcon = () => {
    switch (skin) {
      case 'ninja':
        return (
          <div className="relative">
            <FrogIcon size={40} className="text-gray-800" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-red-600"></div>
            </div>
          </div>
        );
      case 'wizard':
        return (
          <div className="relative">
            <FrogIcon size={40} className="text-purple-700" />
            <Wand2 size={20} className="absolute -top-5 -right-5 rotate-45 text-yellow-400" />
          </div>
        );
      case 'alien':
        return (
          <div className="relative">
            <FrogIcon size={40} className="text-green-500" />
            <Alien size={16} className="absolute -top-2 left-3 text-gray-200" />
          </div>
        );
      default:
        return <FrogIcon size={40} className="text-green-500" />;
    }
  };
  
  return (
    <div
      className="absolute transition-transform duration-100 z-10"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `${x < 0 ? 'scaleX(-1)' : ''}`
      }}
    >
      <div
        className={`relative flex items-center justify-center transition-all duration-150 ${frogAnimation}`}
      >
        {renderFrogIcon()}
        
        {/* Eyes */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"></div>
        
        {/* Rage mode effect */}
        {rageMode && (
          <>
            <Zap
              size={16}
              className="absolute -top-3 -left-3 text-red-500 animate-pulse"
            />
            <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-50"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default Frog;