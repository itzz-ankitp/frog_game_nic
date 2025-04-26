import React from 'react';

interface WeatherEffectsProps {
  weather: 'clear' | 'rain' | 'wind' | 'storm';
}

const WeatherEffects: React.FC<WeatherEffectsProps> = ({ weather }) => {
  // Render different particles based on weather type
  const renderParticles = () => {
    switch (weather) {
      case 'rain':
        return Array.from({ length: 100 }).map((_, i) => {
          const left = `${Math.random() * 100}%`;
          const animationDuration = `${Math.random() * 1 + 0.5}s`;
          const animationDelay = `${Math.random() * 1}s`;
          
          return (
            <div
              key={i}
              className="absolute top-0 bg-blue-300 opacity-70 w-[1px] h-[10px]"
              style={{
                left,
                animationName: 'rain',
                animationDuration,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                animationDelay,
              }}
            />
          );
        });
      
      case 'wind':
        return Array.from({ length: 30 }).map((_, i) => {
          const top = `${Math.random() * 100}%`;
          const opacity = Math.random() * 0.3 + 0.1;
          const width = `${Math.random() * 50 + 20}px`;
          const animationDuration = `${Math.random() * 3 + 3}s`;
          const animationDelay = `${Math.random() * 5}s`;
          
          return (
            <div
              key={i}
              className="absolute left-0 bg-white h-[1px]"
              style={{
                top,
                width,
                opacity,
                animationName: 'wind',
                animationDuration,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
                animationDelay,
              }}
            />
          );
        });
      
      case 'storm':
        return (
          <>
            {/* Rain particles */}
            {Array.from({ length: 150 }).map((_, i) => {
              const left = `${Math.random() * 100}%`;
              const animationDuration = `${Math.random() * 0.5 + 0.3}s`;
              const animationDelay = `${Math.random() * 1}s`;
              
              return (
                <div
                  key={`rain-${i}`}
                  className="absolute top-0 bg-blue-300 opacity-70 w-[1px] h-[15px] rotate-[20deg]"
                  style={{
                    left,
                    animationName: 'rain',
                    animationDuration,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationDelay,
                  }}
                />
              );
            })}
            
            {/* Lightning flashes */}
            <div 
              className="absolute inset-0 bg-white opacity-0 pointer-events-none"
              style={{
                animationName: 'lightning',
                animationDuration: '10s',
                animationTimingFunction: 'ease-out',
                animationIterationCount: 'infinite',
              }}
            />
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <>
      <style jsx>{`
        @keyframes rain {
          0% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        
        @keyframes wind {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(100vw);
          }
        }
        
        @keyframes lightning {
          0%, 96%, 98%, 100% {
            opacity: 0;
          }
          97%, 97.5% {
            opacity: 0.8;
          }
        }
      `}</style>
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {renderParticles()}
        
        {/* Weather overlay effects */}
        {weather === 'rain' && (
          <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
        )}
        
        {weather === 'storm' && (
          <div className="absolute inset-0 bg-indigo-900 opacity-30"></div>
        )}
      </div>
    </>
  );
};

export default WeatherEffects;