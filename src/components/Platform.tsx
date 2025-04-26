import React from 'react';

interface PlatformProps {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'normal' | 'fake' | 'bouncy';
  visible: boolean;
}

const Platform: React.FC<PlatformProps> = ({ 
  x, y, width, height, type, visible 
}) => {
  if (!visible) return null;

  const getPlatformStyle = () => {
    switch (type) {
      case 'normal':
        return 'bg-gradient-to-r from-green-900 to-green-700 border-t-2 border-green-500';
      case 'fake':
        return 'bg-gradient-to-r from-red-900 to-red-700 border-t-2 border-red-500 opacity-90';
      case 'bouncy':
        return 'bg-gradient-to-r from-yellow-600 to-yellow-500 border-t-2 border-yellow-300 animate-bounce';
      default:
        return 'bg-green-800';
    }
  };

  return (
    <div
      className={`absolute ${getPlatformStyle()} rounded-sm shadow-md`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {type === 'fake' && (
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1 left-3 text-red-200 opacity-40 text-xs">?</div>
          <div className="absolute top-1 right-3 text-red-200 opacity-40 text-xs">?</div>
        </div>
      )}
      
      {type === 'bouncy' && (
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1 left-3 text-yellow-200 text-xs">↑</div>
          <div className="absolute top-1 right-3 text-yellow-200 text-xs">↑</div>
        </div>
      )}
    </div>
  );
};

export default Platform;