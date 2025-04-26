import React from 'react';
import { useGame } from '../context/GameContext';
import { X, Check, Lock } from 'lucide-react';

interface SkinSelectorProps {
  onClose: () => void;
}

const SkinSelector: React.FC<SkinSelectorProps> = ({ onClose }) => {
  const { state, dispatch } = useGame();
  
  const skinInfo = {
    default: {
      name: 'Default Frog',
      description: 'Your standard, everyday frog.',
      color: 'green-500',
      unlockMethod: 'Available from the start'
    },
    ninja: {
      name: 'Ninja Frog',
      description: 'Silent, deadly, and still terrible at jumping.',
      color: 'gray-800',
      unlockMethod: 'Reach level 3'
    },
    wizard: {
      name: 'Wizard Frog',
      description: 'Has magical powers, but not for jumping better.',
      color: 'purple-700',
      unlockMethod: 'Reach level 5'
    },
    alien: {
      name: 'Alien Frog',
      description: 'From another planet, where jumping physics are just as bad.',
      color: 'green-500',
      unlockMethod: 'Reach level 8'
    }
  };
  
  const handleSelectSkin = (skin: 'default' | 'ninja' | 'wizard' | 'alien') => {
    if (state.unlockedSkins.includes(skin)) {
      dispatch({ type: 'SELECT_SKIN', payload: skin });
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Frog Skins</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {(Object.keys(skinInfo) as Array<keyof typeof skinInfo>).map((skin) => {
            const isUnlocked = state.unlockedSkins.includes(skin);
            const isSelected = state.currentSkin === skin;
            const info = skinInfo[skin];
            
            return (
              <div 
                key={skin}
                className={`relative rounded-lg p-4 border-2 transition-all cursor-pointer ${
                  isSelected 
                    ? `border-${info.color} bg-${info.color} bg-opacity-20` 
                    : isUnlocked 
                      ? 'border-gray-700 hover:border-gray-500' 
                      : 'border-gray-800 opacity-60'
                }`}
                onClick={() => handleSelectSkin(skin)}
              >
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold text-${info.color}`}>{info.name}</h3>
                  
                  {isSelected ? (
                    <div className="bg-green-500 rounded-full p-1">
                      <Check size={14} />
                    </div>
                  ) : !isUnlocked ? (
                    <div className="bg-gray-700 rounded-full p-1">
                      <Lock size={14} />
                    </div>
                  ) : null}
                </div>
                
                <p className="text-sm text-gray-400 mt-2">{info.description}</p>
                
                {!isUnlocked && (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    Unlock: {info.unlockMethod}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkinSelector;