import React, { createContext, useContext, useRef, useEffect, useState } from 'react';

// Sound effects URLs (using reliable, CORS-friendly sources)
const SOUND_URLS = {
  jump: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  land: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
  splash: 'https://assets.mixkit.co/active_storage/sfx/1143/1143-preview.mp3',
  explosion: 'https://assets.mixkit.co/active_storage/sfx/235/235-preview.mp3',
  rageModeEnter: 'https://assets.mixkit.co/active_storage/sfx/2682/2682-preview.mp3',
  angryFrog1: 'https://assets.mixkit.co/active_storage/sfx/2377/2377-preview.mp3',
  angryFrog2: 'https://assets.mixkit.co/active_storage/sfx/2378/2378-preview.mp3',
  angryFrog3: 'https://assets.mixkit.co/active_storage/sfx/2379/2379-preview.mp3',
  unlock: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  bgMusic: 'https://assets.mixkit.co/active_storage/sfx/123/123-preview.mp3',
  wind: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3',
  rain: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
};

type SoundEffectType = keyof typeof SOUND_URLS;

interface SoundContextType {
  playSound: (sound: SoundEffectType) => void;
  playAngrySound: (rageLevel: number) => void;
  toggleMusic: () => void;
  isMusicOn: boolean;
  isSoundOn: boolean;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRefs = useRef<Record<SoundEffectType, HTMLAudioElement | null>>({} as any);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements
  useEffect(() => {
    Object.entries(SOUND_URLS).forEach(([sound, url]) => {
      const audio = new Audio(url);
      if (sound === 'bgMusic') {
        audio.loop = true;
        audio.volume = 0.3;
        bgMusicRef.current = audio;
      } else {
        audio.volume = 0.7;
      }
      audioRefs.current[sound as SoundEffectType] = audio;
    });

    return () => {
      // Cleanup
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  const playSound = (sound: SoundEffectType) => {
    if (!isSoundOn && sound !== 'bgMusic') return;
    
    const audio = audioRefs.current[sound];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.error("Error playing sound:", e));
    }
  };

  const playAngrySound = (rageLevel: number) => {
    if (!isSoundOn) return;
    
    let sound: SoundEffectType = 'angryFrog1';
    
    if (rageLevel > 6) {
      sound = 'angryFrog3';
    } else if (rageLevel > 3) {
      sound = 'angryFrog2';
    }
    
    playSound(sound);
  };

  const toggleMusic = () => {
    setIsMusicOn(prev => {
      const newState = !prev;
      if (newState && bgMusicRef.current) {
        bgMusicRef.current.play().catch(e => console.error("Error playing music:", e));
      } else if (!newState && bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
      return newState;
    });
  };

  const toggleSound = () => {
    setIsSoundOn(prev => !prev);
  };

  return (
    <SoundContext.Provider value={{ 
      playSound, 
      playAngrySound, 
      toggleMusic, 
      isMusicOn, 
      isSoundOn, 
      toggleSound 
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};