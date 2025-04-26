import React, { createContext, useContext, useReducer, useEffect } from 'react';

type FrogSkin = 'default' | 'ninja' | 'wizard' | 'alien';

type WeatherType = 'clear' | 'rain' | 'wind' | 'storm';

interface Position {
  x: number;
  y: number;
}

interface Platform {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'normal' | 'fake' | 'bouncy';
  visible: boolean;
}

interface Ghost {
  positions: Position[];
  timeStamp: number;
}

interface GameState {
  frogPosition: Position;
  frogVelocity: Position;
  platforms: Platform[];
  currentLevel: number;
  rageLevel: number;
  rageMode: boolean;
  score: number;
  highScore: number;
  livesLeft: number;
  currentSkin: FrogSkin;
  unlockedSkins: FrogSkin[];
  weather: WeatherType;
  ghosts: Ghost[];
  jumping: boolean;
  falling: boolean;
  gameOver: boolean;
}

type GameAction =
  | { type: 'MOVE_FROG'; payload: { x: number; y: number } }
  | { type: 'SET_VELOCITY'; payload: { x: number; y: number } }
  | { type: 'JUMP' }
  | { type: 'INCREASE_RAGE' }
  | { type: 'RESET_RAGE' }
  | { type: 'TOGGLE_RAGE_MODE' }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'SET_WEATHER'; payload: WeatherType }
  | { type: 'UNLOCK_SKIN'; payload: FrogSkin }
  | { type: 'SELECT_SKIN'; payload: FrogSkin }
  | { type: 'ADD_GHOST'; payload: Ghost }
  | { type: 'SET_JUMPING'; payload: boolean }
  | { type: 'SET_FALLING'; payload: boolean }
  | { type: 'GAME_OVER' }
  | { type: 'RESTART_GAME' }
  | { type: 'GENERATE_LEVEL'; payload: number };

const initialState: GameState = {
  frogPosition: { x: 100, y: 400 },
  frogVelocity: { x: 0, y: 0 },
  platforms: [],
  currentLevel: 1,
  rageLevel: 0,
  rageMode: false,
  score: 0,
  highScore: 0,
  livesLeft: 3,
  currentSkin: 'default',
  unlockedSkins: ['default'],
  weather: 'clear',
  ghosts: [],
  jumping: false,
  falling: false,
  gameOver: false,
};

function generatePlatforms(level: number): Platform[] {
  const platforms: Platform[] = [];
  const numPlatforms = 5 + level;
  
  // Start platform
  platforms.push({
    id: 'start',
    x: 50,
    y: 450,
    width: 150,
    height: 20,
    type: 'normal',
    visible: true,
  });
  
  // Other platforms with increasing difficulty
  for (let i = 1; i < numPlatforms; i++) {
    const platformType = Math.random() < 0.7 ? 'normal' : 
                         Math.random() < 0.5 ? 'fake' : 'bouncy';
    
    // Make platforms get progressively further apart
    const minDistance = 100 + (level * 10);
    const maxDistance = 200 + (level * 15);
    const distance = Math.random() * (maxDistance - minDistance) + minDistance;
    
    const lastPlatform = platforms[i - 1];
    const x = lastPlatform.x + distance;
    const y = Math.max(100, Math.min(450, lastPlatform.y + (Math.random() * 200 - 100)));
    
    platforms.push({
      id: `platform-${i}`,
      x,
      y,
      width: 100 - (level * 2),
      height: 20,
      type: platformType,
      visible: true,
    });
  }
  
  // End platform (goal)
  const lastPlatform = platforms[platforms.length - 1];
  platforms.push({
    id: 'goal',
    x: lastPlatform.x + 200,
    y: 450,
    width: 150,
    height: 20,
    type: 'normal',
    visible: true,
  });
  
  return platforms;
}

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'MOVE_FROG':
      return {
        ...state,
        frogPosition: {
          x: action.payload.x,
          y: action.payload.y
        }
      };
    
    case 'SET_VELOCITY':
      return {
        ...state,
        frogVelocity: {
          x: action.payload.x,
          y: action.payload.y
        }
      };
    
    case 'JUMP':
      const jumpStrength = state.rageMode ? -15 : -12;
      const randomFactor = state.rageMode ? 
        (Math.random() * 10 - 5) : (Math.random() * 4 - 2);
      
      return {
        ...state,
        jumping: true,
        frogVelocity: {
          x: state.frogVelocity.x + randomFactor,
          y: jumpStrength
        }
      };
    
    case 'INCREASE_RAGE':
      const newRageLevel = Math.min(state.rageLevel + 1, 10);
      return {
        ...state,
        rageLevel: newRageLevel,
        rageMode: newRageLevel >= 8
      };
    
    case 'RESET_RAGE':
      return {
        ...state,
        rageLevel: 0,
        rageMode: false
      };
    
    case 'TOGGLE_RAGE_MODE':
      return {
        ...state,
        rageMode: !state.rageMode
      };
    
    case 'UPDATE_SCORE':
      const newScore = action.payload;
      return {
        ...state,
        score: newScore,
        highScore: Math.max(state.highScore, newScore)
      };
    
    case 'SET_WEATHER':
      return {
        ...state,
        weather: action.payload
      };
    
    case 'UNLOCK_SKIN':
      if (state.unlockedSkins.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        unlockedSkins: [...state.unlockedSkins, action.payload]
      };
    
    case 'SELECT_SKIN':
      if (!state.unlockedSkins.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        currentSkin: action.payload
      };
    
    case 'ADD_GHOST':
      // Keep only the last 3 ghosts
      const updatedGhosts = [...state.ghosts, action.payload].slice(-3);
      return {
        ...state,
        ghosts: updatedGhosts
      };
    
    case 'SET_JUMPING':
      return {
        ...state,
        jumping: action.payload
      };
    
    case 'SET_FALLING':
      return {
        ...state,
        falling: action.payload
      };
    
    case 'GAME_OVER':
      return {
        ...state,
        gameOver: true
      };
    
    case 'RESTART_GAME':
      return {
        ...initialState,
        highScore: state.highScore,
        unlockedSkins: state.unlockedSkins,
        currentSkin: state.currentSkin,
        platforms: generatePlatforms(1),
        currentLevel: 1
      };
    
    case 'GENERATE_LEVEL':
      return {
        ...state,
        platforms: generatePlatforms(action.payload),
        currentLevel: action.payload,
        frogPosition: { x: 100, y: 400 },
        frogVelocity: { x: 0, y: 0 },
        jumping: false,
        falling: false
      };
    
    default:
      return state;
  }
};

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialState,
    platforms: generatePlatforms(1)
  });

  // Initialize or load saved data
  useEffect(() => {
    const savedHighScore = localStorage.getItem('frogRageHighScore');
    const savedUnlockedSkins = localStorage.getItem('frogRageUnlockedSkins');
    
    if (savedHighScore) {
      dispatch({ 
        type: 'UPDATE_SCORE', 
        payload: parseInt(savedHighScore, 10) 
      });
    }
    
    if (savedUnlockedSkins) {
      const skins = JSON.parse(savedUnlockedSkins) as FrogSkin[];
      skins.forEach(skin => {
        if (skin !== 'default') {
          dispatch({ type: 'UNLOCK_SKIN', payload: skin });
        }
      });
    }
  }, []);

  // Save high score and unlocked skins when they change
  useEffect(() => {
    localStorage.setItem('frogRageHighScore', state.highScore.toString());
    localStorage.setItem('frogRageUnlockedSkins', JSON.stringify(state.unlockedSkins));
  }, [state.highScore, state.unlockedSkins]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};