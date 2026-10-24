import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Compass 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { SceneId } from '../types';
import { soundEngine } from '../services/soundEngine';
import { getAssetUrl } from '../utils/assets';

interface ScrollStoryModalProps {
  sceneId: SceneId;
  onClose: () => void;
  onEnterWorld: (sceneId: SceneId) => void;
}

export const ScrollStoryModal: React.FC<ScrollStoryModalProps> = ({
  sceneId,
  onClose,
  onEnterWorld,
}) => {
  const [activeActIndex, setActiveActIndex] = useState(0);
  const isScrollLocked = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // 5 Complete Backstory Comics (4 Acts each)
  const storyData: Record<SceneId, {
    title: string;
    tag: string;
    acts: { actNumber: number; title: string; image: string }[];
  }> = {
    cafe: {
      title: 'Cozy CLOY & Goblin Café',
      tag: 'ORIGIN STORY',
      acts: [
        { actNumber: 1, title: 'Act I: The 2:30 AM Medico Freeze', image: '/assets/comics/scene_1_comic/scene_1.1.png' },
        { actNumber: 2, title: 'Act II: The K-Drama Warmth Sanctuary', image: '/assets/comics/scene_1_comic/scene_1.2.png' },
        { actNumber: 3, title: 'Act III: The 50₹ Momos & Warm Brew Promise', image: '/assets/comics/scene_1_comic/scene_1.3.png' },
        { actNumber: 4, title: 'Act IV: Boarding for the Rainy CLOY Café', image: '/assets/comics/scene_1_comic/scene_1.4.png' }
      ]
    },
    beach: {
      title: 'Sunset Ocean Shore',
      tag: 'SECRET VACATION',
      acts: [
        { actNumber: 1, title: 'Act I: Hospital Ward Duty Exhaustion', image: '/assets/comics/scene_2_comic/scene_2.1.png' },
        { actNumber: 2, title: 'Act II: Longing for Coastal Waves & Calm', image: '/assets/comics/scene_2_comic/scene_2.2.png' },
        { actNumber: 3, title: 'Act III: Folding Worries into Origami Boats', image: '/assets/comics/scene_2_comic/scene_2.3.png' },
        { actNumber: 4, title: 'Act IV: Golden Waves & Salty Ocean Air', image: '/assets/comics/scene_2_comic/scene_2.4.png' }
      ]
    },
    mountains: {
      title: 'Umrangso & Karbi Starlit Peak',
      tag: 'HOME CONNECTION',
      acts: [
        { actNumber: 1, title: 'Act I: Missing the Karbi Pine Breeze', image: '/assets/comics/scene_3_comics/scene_3.1.png' },
        { actNumber: 2, title: 'Act II: The Umrangso Road Trip Bet', image: '/assets/comics/scene_3_comics/scene_3.2.png' },
        { actNumber: 3, title: 'Act III: Starlit Campfire by Umrangso Lake', image: '/assets/comics/scene_3_comics/scene_3.3.png' },
        { actNumber: 4, title: 'Act IV: Mountain Serenity Found', image: '/assets/comics/scene_3_comics/scene_3.4.png' }
      ]
    },
    night_city: {
      title: 'Midnight Neon Seoul',
      tag: 'LO-FI ESCAPE',
      acts: [
        { actNumber: 1, title: 'Act I: The Hostel Mess Food Tragedy', image: '/assets/comics/scene_4_comic/scene_4.1.png' },
        { actNumber: 2, title: 'Act II: The 11 PM Gate Lockdown', image: '/assets/comics/scene_4_comic/scene_4.2.png' },
        { actNumber: 3, title: 'Act III: Late-Night Lo-Fi & Spotify Sync', image: '/assets/comics/scene_4_comic/scene_4.3.png' },
        { actNumber: 4, title: 'Act IV: Midnight Momos & Steaming Broth', image: '/assets/comics/scene_4_comic/scene_4.4.png' }
      ]
    },
    blossom_meadow: {
      title: 'Blossom & Melody Meadow',
      tag: 'CREATIVE RESET',
      acts: [
        { actNumber: 1, title: 'Act I: The Silenced Melody & Heartbreak', image: '/assets/comics/scene_5_comic/scene_5.1.png' },
        { actNumber: 2, title: 'Act II: Crafting with Heart & Red Yarn', image: '/assets/comics/scene_5_comic/scene_5.2.png' },
        { actNumber: 3, title: 'Act III: Samreedh’s 11/10 Encouragement', image: '/assets/comics/scene_5_comic/scene_5.3.png' },
        { actNumber: 4, title: 'Act IV: Singing in the Cherry Blossom Meadow', image: '/assets/comics/scene_5_comic/scene_5.4.png' }
      ]
    }
  };

  const currentStory = storyData[sceneId] || storyData.cafe;
  const currentAct = currentStory.acts[activeActIndex];
  const isFinalAct = activeActIndex === currentStory.acts.length - 1;

  const goToNextAct = () => {
    if (isScrollLocked.current) return;
    if (activeActIndex < currentStory.acts.length - 1) {
      isScrollLocked.current = true;
      soundEngine.playPop();
      setActiveActIndex(prev => prev + 1);
      setTimeout(() => {
        isScrollLocked.current = false;
      }, 500);
    }
  };

  const goToPrevAct = () => {
    if (isScrollLocked.current) return;
    if (activeActIndex > 0) {
      isScrollLocked.current = true;
      soundEngine.playPop();
      setActiveActIndex(prev => prev - 1);
      setTimeout(() => {
        isScrollLocked.current = false;
      }, 500);
    }
  };

  // Mouse Wheel: 1 Scroll = Strictly 1 Page Transition
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isScrollLocked.current) return;

    if (e.deltaY > 15) {
      goToNextAct();
    } else if (e.deltaY < -15) {
      goToPrevAct();
    }
  };

  // Mobile Touch / Swipe Gesture Handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;

    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    const threshold = 35; // px

    // Detect horizontal swipe or vertical swipe
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      // Vertical swipe: swipe UP -> next act, swipe DOWN -> prev act
      if (deltaY < -threshold) {
        goToNextAct();
      } else if (deltaY > threshold) {
        goToPrevAct();
      }
    } else {
      // Horizontal swipe: swipe LEFT -> next act, swipe RIGHT -> prev act
      if (deltaX < -threshold) {
        goToNextAct();
      } else if (deltaX > threshold) {
        goToPrevAct();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrollLocked.current) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        goToNextAct();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrevAct();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeActIndex, currentStory.acts.length, onClose]);

  const handleFinish = () => {
    soundEngine.playChime();
    confetti({ particleCount: 60, spread: 70 });
    onEnterWorld(sceneId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden touch-none"
    >
      {/* 1. Fixed Cozy Café Background (Crystal-Clear Visibility) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={getAssetUrl('/assets/scenes/scenary_2.png')}
          alt="Cozy Café Scenery Background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
      </div>

      {/* Close Button Top Right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-slate-300 hover:text-white transition backdrop-blur-md shadow-2xl cursor-pointer"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Top Floating Story Pill */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-3 bg-black/70 backdrop-blur-xl px-4 sm:px-6 py-1.5 sm:py-2 rounded-full border border-white/20 shadow-2xl text-xs sm:text-sm max-w-[90vw] truncate">
        <span className="font-mono text-amber-300 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
          {currentStory.tag}
        </span>
        <span className="text-white/40">•</span>
        <span className="font-serif font-bold text-white tracking-wide truncate">
          {currentStory.title}
        </span>
        <span className="text-white/40">•</span>
        <span className="text-purple-300 font-mono font-bold whitespace-nowrap">
          Act {currentAct.actNumber}/{currentStory.acts.length}
        </span>
      </div>

      {/* Center Focus Comic Frame Container */}
      <div className="relative z-20 flex flex-col items-center justify-center p-2 sm:p-4 max-w-4xl w-full max-h-[92vh]">
        
        {/* Comic Frame Wrapper with Side Touch Buttons */}
        <div className="relative w-full max-w-[620px] flex items-center justify-center">
          
          {/* Left Arrow Button (Visible & Clickable on Touch & Desktop) */}
          <button
            onClick={goToPrevAct}
            disabled={activeActIndex === 0}
            className={`absolute -left-2 sm:-left-12 z-30 p-2.5 sm:p-3 rounded-full bg-black/75 hover:bg-black border border-white/20 text-white shadow-2xl backdrop-blur-md transition cursor-pointer disabled:opacity-0 disabled:pointer-events-none ${
              activeActIndex > 0 ? 'opacity-90 hover:scale-110' : 'opacity-0'
            }`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Expanded High-Resolution Comic Frame */}
          <div className="relative w-full aspect-square max-h-[66vh] rounded-3xl overflow-hidden border-2 border-white/30 shadow-[0_0_60px_rgba(0,0,0,0.9)] bg-black flex items-center justify-center">
            
            <AnimatePresence mode="wait">
              <motion.img
                key={currentAct.actNumber}
                src={getAssetUrl(currentAct.image)}
                alt={currentAct.title}
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.04, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full h-full object-contain object-center"
              />
            </AnimatePresence>

            {/* Act Title Pill Overlay (Bottom of Image) */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-semibold shadow-lg text-center max-w-[88%] truncate">
              {currentAct.title}
            </div>
          </div>

          {/* Right Arrow Button (Visible & Clickable on Touch & Desktop) */}
          <button
            onClick={goToNextAct}
            disabled={activeActIndex === currentStory.acts.length - 1}
            className={`absolute -right-2 sm:-right-12 z-30 p-2.5 sm:p-3 rounded-full bg-black/75 hover:bg-black border border-white/20 text-white shadow-2xl backdrop-blur-md transition cursor-pointer disabled:opacity-0 disabled:pointer-events-none ${
              activeActIndex < currentStory.acts.length - 1 ? 'opacity-90 hover:scale-110' : 'opacity-0'
            }`}
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

        </div>

        {/* Bottom Floating Control / Step Inside Button */}
        <div className="mt-3.5 flex flex-col items-center gap-2 w-full max-w-sm">
          
          {/* Act Step Indicator Pills */}
          <div className="flex items-center gap-2">
            {currentStory.acts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundEngine.playPop();
                  setActiveActIndex(idx);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeActIndex ? 'w-8 bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]' : 'w-2.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Final Act Launch Button or Mobile Swipe Cue */}
          {!isFinalAct ? (
            <div className="flex items-center justify-between w-full px-2 text-xs text-slate-300 font-light mt-1">
              <span className="text-[11px] text-purple-200/80 font-mono">
                Swipe / Scroll to turn page
              </span>
              <button
                onClick={goToNextAct}
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer"
              >
                Next Act ➔
              </button>
            </div>
          ) : (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFinish}
              className="w-full mt-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-serif font-bold text-xs sm:text-sm shadow-2xl flex items-center justify-center gap-2 transition border border-white/40 hover:shadow-[0_0_35px_rgba(245,158,11,0.7)] cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Step Inside {currentStory.title} ✨</span>
            </motion.button>
          )}

        </div>

      </div>

    </motion.div>
  );
};

export default ScrollStoryModal;
