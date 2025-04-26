import React from 'react';
import { useGame } from '../context/GameContext';

interface GhostReplayProps {
  ghost: {
    positions: { x: number; y: number }[];
    timeStamp: number;
  };
}

const GhostReplay: React.FC<GhostReplayProps> = ({ ghost }) => {
  const { state } = useGame();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  // Update ghost position over time
  React.useEffect(() => {
    if (!ghost.positions.length) return;
    
    let frameId: number;
    let lastTimestamp = 0;
    
    const advanceGhost = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      
      const elapsed = timestamp - lastTimestamp;
      
      if (elapsed > 50) {
        lastTimestamp = timestamp;
        setCurrentIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          return nextIndex < ghost.positions.length ? nextIndex : 0;
        });
      }
      
      frameId = requestAnimationFrame(advanceGhost);
    };
    
    frameId = requestAnimationFrame(advanceGhost);
    
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [ghost.positions]);
  
  if (!ghost.positions.length || currentIndex >= ghost.positions.length) {
    return null;
  }
  
  const currentPosition = ghost.positions[currentIndex];
  if (!currentPosition) return null;
  
  // Calculate ghost opacity based on how recent it is
  const calculateOpacity = () => {
    const now = Date.now();
    const ghostAge = now - ghost.timeStamp;
    
    // Make more recent ghosts more visible
    const baseOpacity = 0.8;
    const ageFactorMax = 30000; // 30 seconds
    const ageFactor = Math.min(ghostAge, ageFactorMax) / ageFactorMax;
    
    return baseOpacity - (ageFactor * 0.6);
  };
  
  return (
    <div
      className="absolute w-8 h-8 flex items-center justify-center"
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        opacity: calculateOpacity(),
      }}
    >
      <div className={`w-8 h-8 rounded-full border-2 border-white border-opacity-50 ${
        state.currentSkin === 'ninja' ? 'bg-gray-800' : 
        state.currentSkin === 'wizard' ? 'bg-purple-700' : 
        state.currentSkin === 'alien' ? 'bg-green-500' : 
        'bg-green-600'
      } bg-opacity-30`}></div>
    </div>
  );
};

export default GhostReplay;