
import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../services/audioService';
import { JourneyNode } from '../types';

/* ===== PIXEL BUTTON ===== */
export const PixelButton: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'danger' | 'success' | 'option' | 'country';
  disabled?: boolean;
}> = ({ onClick, children, className = '', variant = 'primary', disabled = false }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 border-blue-800 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    danger: 'bg-red-600 hover:bg-red-500 border-red-800 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    success: 'bg-green-600 hover:bg-green-500 border-green-800 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]',
    option: 'bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-gray-500',
    country: 'bg-gray-900 hover:bg-gray-800 border-gray-700 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]',
  };

  const handleClick = () => {
    audioService.playClick();
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        border-b-4 active:border-b-0 active:translate-y-1
        px-4 py-2 text-xs md:text-sm uppercase tracking-widest
        transition-all duration-100 text-white disabled:opacity-40 disabled:cursor-not-allowed
        cursor-pointer select-none
        ${className}
      `}
      style={{ boxShadow: disabled ? 'none' : 'inset -4px -4px 0px 0px rgba(0,0,0,0.3)' }}
    >
      {children}
    </button>
  );
};

/* ===== STATUS BAR ===== */
export const StatusBar: React.FC<{
  label: string;
  value: number;
  max: number;
  color: string;
}> = ({ label, value, max, color }) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  const isLow = percentage < 25;
  
  return (
    <div className="mb-2">
      <div className="flex justify-between text-[10px] mb-1 uppercase">
        <span className={isLow ? 'text-red-400 animate-pulse' : 'text-gray-400'}>{label}</span>
        <span className={isLow ? 'text-red-400 font-bold' : 'text-gray-500'}>{value}/{max}</span>
      </div>
      <div className="stat-bar-container h-4 w-full">
        <div 
          className={`h-full ${color} transition-all duration-500 ${isLow ? 'animate-pulse' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/* ===== TYPEWRITER TEXT ===== */
export const TypewriterText: React.FC<{
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  playSound?: boolean;
}> = ({ text, speed = 35, className = '', onComplete, playSound = true }) => {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplayed('');
    setIsComplete(false);
    indexRef.current = 0;

    if (!text) {
      setIsComplete(true);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        if (playSound && indexRef.current % 3 === 0) {
          audioService.playNarrator();
        }
        indexRef.current++;
      } else {
        setIsComplete(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        onComplete?.();
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed]);

  const skipToEnd = () => {
    if (!isComplete) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayed(text);
      setIsComplete(true);
      onComplete?.();
    }
  };

  return (
    <span className={className} onClick={skipToEnd} style={{ cursor: isComplete ? 'default' : 'pointer' }}>
      {displayed}
      {!isComplete && <span className="animate-blink text-blue-400">▌</span>}
    </span>
  );
};

/* ===== DIALOGUE BOX ===== */
export const DialogueBox: React.FC<{
  localText: string;
  englishText: string;
  npcName?: string;
}> = ({ localText, englishText, npcName }) => {
  return (
    <div className="pixel-border bg-black p-4 mb-4 flex-1 flex flex-col justify-center relative">
      {npcName && (
        <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[8px] px-3 py-1 border-2 border-blue-800 uppercase tracking-wider">
          {npcName}
        </div>
      )}
      <div className="mt-1">
        <TypewriterText 
          text={localText} 
          className="text-white text-[10px] md:text-xs leading-relaxed uppercase tracking-tighter block mb-2"
          speed={30}
        />
      </div>
      <p className="text-gray-500 text-[8px] italic mt-1">
        "{englishText}"
      </p>
    </div>
  );
};

/* ===== SPRITE DISPLAY ===== */
export const SpriteDisplay: React.FC<{
  src: string;
  name: string;
  role: string;
  className?: string;
}> = ({ src, name, role, className = '' }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  return (
    <div className={`text-center animate-spriteEntrance ${className}`}>
      <div className="bg-white/90 text-black text-[8px] px-3 py-1 mb-2 font-bold uppercase inline-block border-2 border-black tracking-wider">
        {name} <span className="text-gray-600">|</span> {role}
      </div>
      <div className="animate-idleBob">
        <img 
          src={error ? '/assets/images/npcs/spain_barkeep.png' : src} 
          alt={`${name} - ${role}`}
          className={`h-56 md:h-72 pixel-art mx-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      </div>
    </div>
  );
};

/* ===== JOURNEY PROGRESS MAP ===== */
export const JourneyProgress: React.FC<{
  stages: JourneyNode[];
  currentStage: number;
  countryColor?: string;
}> = ({ stages, currentStage, countryColor = '#3b82f6' }) => {
  return (
    <div className="w-full py-3 px-2">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2 journey-line" />
        {/* Progress line */}
        <div 
          className="absolute top-1/2 left-0 h-[3px] -translate-y-1/2 transition-all duration-700 ease-out"
          style={{ 
            width: `${(currentStage / Math.max(stages.length - 1, 1)) * 100}%`,
            background: `repeating-linear-gradient(to right, ${countryColor} 0px, ${countryColor} 8px, transparent 8px, transparent 16px)`
          }}
        />
        
        {stages.map((stage, idx) => {
          const isCompleted = idx < currentStage;
          const isCurrent = idx === currentStage;
          const isFuture = idx > currentStage;
          
          return (
            <div key={idx} className="relative z-10 flex flex-col items-center" style={{ flex: 1 }}>
              <div 
                className={`
                  w-8 h-8 md:w-10 md:h-10 rounded-sm flex items-center justify-center text-sm md:text-base
                  border-2 transition-all duration-300
                  ${isCompleted ? 'border-green-500 bg-green-900/80 scale-90' : ''}
                  ${isCurrent ? 'border-blue-400 bg-blue-900/80 scale-110 animate-nodePulse' : ''}
                  ${isFuture ? 'border-gray-700 bg-gray-900/80 opacity-50 scale-90' : ''}
                `}
                title={stage.description}
              >
                {isCompleted ? '✓' : stage.icon}
              </div>
              <span className={`text-[6px] md:text-[7px] mt-1 uppercase tracking-wide text-center leading-tight
                ${isCurrent ? 'text-blue-400 font-bold' : isCompleted ? 'text-green-500' : 'text-gray-600'}
              `}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ===== FEEDBACK FLASH ===== */
export const FeedbackFlash: React.FC<{
  type: 'positive' | 'neutral' | 'offensive' | null;
  message?: string;
}> = ({ type, message }) => {
  if (!type) return null;
  
  const styles = {
    positive: 'border-green-500 text-green-400 bg-green-950/50',
    neutral: 'border-yellow-500 text-yellow-400 bg-yellow-950/50',
    offensive: 'border-red-500 text-red-400 bg-red-950/50',
  };
  
  const icons = {
    positive: '✦',
    neutral: '◆',
    offensive: '✖',
  };
  
  return (
    <div className={`animate-fadeIn border-2 ${styles[type]} px-4 py-2 text-[9px] uppercase tracking-wider text-center mb-2`}>
      <span className="mr-2">{icons[type]}</span>
      {message || (type === 'positive' ? '+5 XP' : type === 'offensive' ? '-2 HP  +1 INSANITY' : '+2 XP')}
    </div>
  );
};

/* ===== SCREEN TRANSITION ===== */
export const ScreenTransition: React.FC<{
  active: boolean;
}> = ({ active }) => {
  if (!active) return null;
  
  return (
    <div className="fixed inset-0 z-[9997] pointer-events-none">
      <div className="absolute inset-0 bg-black animate-screenWipe" />
    </div>
  );
};
