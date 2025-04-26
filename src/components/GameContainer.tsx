import React, { useEffect, useRef, useState } from 'react';
import Frog from './Frog';
import Platform from './Platform';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';
import GameHUD from './GameHUD';
import GameOver from './GameOver';
import WeatherEffects from './WeatherEffects';
import GhostReplay from './GhostReplay';

const GameContainer: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playSound, playAngrySound } = useSound();
  const [keys, setKeys] = useState<Record<string, boolean>>({});
  const gameLoopRef = useRef<number | null>(null);
  const ghostPositionsRef = useRef<{ x: number; y: number }[]>([]);
  const lastJumpTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [cameraOffset, setCameraOffset] = useState(0);

  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
      
      // Jump on space
      if (e.key === ' ' && !state.jumping && !state.falling && !state.gameOver) {
        dispatch({ type: 'JUMP' });
        playSound('jump');
        lastJumpTimeRef.current = Date.now();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [dispatch, playSound, state.jumping, state.falling, state.gameOver]);

  // Initialize container width
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Game loop
  useEffect(() => {
    if (state.gameOver) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    // Record ghost positions
    ghostPositionsRef.current.push({ ...state.frogPosition });
    if (ghostPositionsRef.current.length > 300) {
      ghostPositionsRef.current.shift();
    }

    const gameLoop = () => {
      // Apply horizontal movement
      let xVelocity = state.frogVelocity.x;
      
      if (keys.arrowleft || keys.a) {
        xVelocity -= state.rageMode ? 1.5 : 0.8;
      }
      if (keys.arrowright || keys.d) {
        xVelocity += state.rageMode ? 1.5 : 0.8;
      }
      
      // Apply weather effects
      if (state.weather === 'wind') {
        xVelocity += Math.sin(Date.now() / 1000) * 0.3;
      } else if (state.weather === 'storm') {
        xVelocity += Math.sin(Date.now() / 500) * 0.7;
      }
      
      // Apply friction
      xVelocity *= state.weather === 'rain' ? 0.97 : 0.95;
      
      // Update velocity
      let yVelocity = state.frogVelocity.y;
      
      // Apply gravity
      yVelocity += 0.5;
      
      // Calculate new position
      let newX = state.frogPosition.x + xVelocity;
      let newY = state.frogPosition.y + yVelocity;
      
      // Check for platform collisions
      let onPlatform = false;
      let bounced = false;
      let fellThrough = false;
      
      state.platforms.forEach(platform => {
        // Only check visible platforms
        if (!platform.visible) return;
        
        // Collision from above
        if (
          newY + 40 >= platform.y && 
          state.frogPosition.y + 40 <= platform.y &&
          newX + 30 > platform.x && 
          newX < platform.x + platform.width
        ) {
          if (platform.type === 'fake') {
            // Fake platform - will collapse after landing
            fellThrough = true;
            playSound('splash');
            
            // Hide the platform temporarily
            setTimeout(() => {
              dispatch({
                type: 'GENERATE_LEVEL',
                payload: state.currentLevel
              });
            }, 1000);
          } else if (platform.type === 'bouncy') {
            // Bouncy platform - extra jump
            bounced = true;
            yVelocity = -15;
            playSound('jump');
          } else {
            // Normal platform
            onPlatform = true;
            newY = platform.y - 40;
            yVelocity = 0;
            
            // Only play land sound if we were falling
            if (state.falling) {
              playSound('land');
            }
          }
        }
      });
      
      // Update jumping/falling state
      const wasJumping = state.jumping;
      const wasFalling = state.falling;
      
      const jumping = yVelocity < 0;
      const falling = yVelocity > 0 && !onPlatform;
      
      if (jumping !== wasJumping) {
        dispatch({ type: 'SET_JUMPING', payload: jumping });
      }
      
      if (falling !== wasFalling) {
        dispatch({ type: 'SET_FALLING', payload: falling });
      }
      
      // Check if frog fell off the bottom
      if (newY > 600) {
        playSound('splash');
        playAngrySound(state.rageLevel);
        
        // Save ghost replay
        dispatch({
          type: 'ADD_GHOST',
          payload: {
            positions: [...ghostPositionsRef.current],
            timeStamp: Date.now()
          }
        });
        
        // Reset ghost positions
        ghostPositionsRef.current = [];
        
        // Increase rage
        dispatch({ type: 'INCREASE_RAGE' });
        
        // Lose a life or game over
        if (state.livesLeft <= 1) {
          dispatch({ type: 'GAME_OVER' });
          playSound('explosion');
        } else {
          // Reset position
          dispatch({
            type: 'GENERATE_LEVEL',
            payload: state.currentLevel
          });
        }
      } else {
        // Update position and velocity
        dispatch({ 
          type: 'MOVE_FROG', 
          payload: { x: newX, y: newY } 
        });
        
        dispatch({ 
          type: 'SET_VELOCITY', 
          payload: { x: xVelocity, y: yVelocity } 
        });
      }
      
      // Update camera offset based on frog position
      if (containerWidth > 0) {
        const targetOffset = Math.max(0, newX - containerWidth / 3);
        setCameraOffset(targetOffset);
      }
      
      // Check for level completion
      const lastPlatform = state.platforms[state.platforms.length - 1];
      if (
        lastPlatform && 
        newX > lastPlatform.x && 
        newX < lastPlatform.x + lastPlatform.width &&
        newY + 40 >= lastPlatform.y && 
        newY + 40 <= lastPlatform.y + 10
      ) {
        // Completed the level!
        const newLevel = state.currentLevel + 1;
        const newScore = state.score + 1000;
        
        dispatch({ type: 'UPDATE_SCORE', payload: newScore });
        
        // Unlock skins based on progress
        if (newLevel === 3 && !state.unlockedSkins.includes('ninja')) {
          dispatch({ type: 'UNLOCK_SKIN', payload: 'ninja' });
          playSound('unlock');
        } else if (newLevel === 5 && !state.unlockedSkins.includes('wizard')) {
          dispatch({ type: 'UNLOCK_SKIN', payload: 'wizard' });
          playSound('unlock');
        } else if (newLevel === 8 && !state.unlockedSkins.includes('alien')) {
          dispatch({ type: 'UNLOCK_SKIN', payload: 'alien' });
          playSound('unlock');
        }
        
        // Generate new level
        dispatch({ type: 'GENERATE_LEVEL', payload: newLevel });
        
        // Change weather randomly for next level
        const weathers: Array<'clear' | 'rain' | 'wind' | 'storm'> = ['clear', 'rain', 'wind', 'storm'];
        const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
        dispatch({ type: 'SET_WEATHER', payload: randomWeather });
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [
    state.frogPosition, 
    state.frogVelocity, 
    state.platforms, 
    state.jumping, 
    state.falling,
    state.rageLevel,
    state.rageMode,
    state.weather,
    state.gameOver,
    state.currentLevel,
    state.score,
    state.livesLeft,
    state.unlockedSkins,
    keys,
    dispatch,
    playSound,
    playAngrySound,
    containerWidth
  ]);

  return (
    <div className="relative w-full h-screen overflow-hidden" ref={containerRef}>
      <WeatherEffects weather={state.weather} />
      
      <div 
        className="relative w-[5000px] h-full transition-transform duration-200"
        style={{ transform: `translateX(-${cameraOffset}px)` }}
      >
        {/* Background layers with parallax effect */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-[url('https://images.pexels.com/photos/572688/pexels-photo-572688.jpeg')] bg-repeat-x bg-contain opacity-20"
            style={{ transform: `translateX(${cameraOffset * 0.1}px)` }}
          ></div>
          <div 
            className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1421903/pexels-photo-1421903.jpeg')] bg-repeat-x bg-contain opacity-30"
            style={{ transform: `translateX(${cameraOffset * 0.3}px)` }}
          ></div>
        </div>
        
        {/* Platforms */}
        {state.platforms.map(platform => (
          <Platform
            key={platform.id}
            x={platform.x}
            y={platform.y}
            width={platform.width}
            height={platform.height}
            type={platform.type}
            visible={platform.visible}
          />
        ))}
        
        {/* Ghost replays */}
        {state.ghosts.map((ghost, index) => (
          <GhostReplay key={index} ghost={ghost} />
        ))}
        
        {/* Frog */}
        <Frog
          x={state.frogPosition.x}
          y={state.frogPosition.y}
          skin={state.currentSkin}
          jumping={state.jumping}
          falling={state.falling}
          rageMode={state.rageMode}
        />
      </div>
      
      {/* HUD elements that don't move with camera */}
      <GameHUD />
      
      {/* Game over screen */}
      {state.gameOver && <GameOver score={state.score} highScore={state.highScore} />}
    </div>
  );
};

export default GameContainer;