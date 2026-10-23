import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Compass, Sparkles, Mountain } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../services/soundEngine';

interface ShootingStar {
  id: number;
  x: number;
  y: number;
}

export const StarryMountainScene: React.FC = () => {
  const [smoresCount, setSmoresCount] = useState(0);
  const [showMithunModal, setShowMithunModal] = useState(false);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [currentWish, setCurrentWish] = useState<string | null>(null);

  const wishes = [
    "✨ Wish Granted: Tomorrow's 8:00 AM class is magically peaceful.",
    "✨ Wish Granted: Infinite stamina and zero college headaches.",
    "✨ Wish Granted: 100% protection from bad hostel food.",
    "✨ Wish Granted: You will finish your next 2-week course with flying colors.",
    "✨ Wish Granted: A cozy hot cup of mountain tea whenever you need it.",
    "✨ Wish Granted: 8 full hours of undisturbed dreamland sleep."
  ];

  const handleRoastSmore = () => {
    soundEngine.playPour();
    setSmoresCount(prev => prev + 1);
    confetti({
      particleCount: 15,
      spread: 30,
      origin: { y: 0.7, x: 0.5 }
    });
  };

  const handleSkyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

    if (yPercent < 55) {
      soundEngine.playChime();
      const newStar = {
        id: Date.now(),
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: yPercent
      };
      setShootingStars(prev => [...prev, newStar]);

      const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
      setCurrentWish(randomWish);

      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== newStar.id));
      }, 1500);

      setTimeout(() => {
        setCurrentWish(null);
      }, 4000);
    }
  };

  const handleMithunClick = () => {
    soundEngine.playChime();
    setShowMithunModal(true);
  };

  return (
    <div 
      onClick={handleSkyClick}
      className="relative w-full min-h-[85vh] flex flex-col justify-between p-4 md:p-8 select-none text-white cursor-pointer"
    >
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="self-center glass-panel px-6 py-3 rounded-full flex items-center gap-3 text-emerald-200 border border-emerald-500/30 text-sm md:text-base shadow-lg z-20"
      >
        <Mountain className="w-5 h-5 text-emerald-400 animate-pulse" />
        <span className="font-medium">Arunachal Starlit Peak — Click the night sky to cast a shooting star wish.</span>
      </motion.div>

      {/* Dynamic Shooting Stars */}
      {shootingStars.map(star => (
        <motion.div
          key={star.id}
          initial={{ opacity: 0, x: -60, y: -30, scale: 0.5 }}
          animate={{ opacity: 1, x: 120, y: 60, scale: 1.2 }}
          exit={{ opacity: 0 }}
          style={{ left: `${star.x}%`, top: `${star.y}%` }}
          className="absolute pointer-events-none text-amber-200 text-2xl z-30 drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]"
        >
          💫 ⎯⎯⎯ ✨
        </motion.div>
      ))}

      {/* Wish Display Toast */}
      <AnimatePresence>
        {currentWish && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-40 bg-indigo-950/90 border border-indigo-400/50 text-indigo-100 px-6 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs md:text-sm font-medium flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            {currentWish}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Interactive Mountain Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full my-auto z-20" onClick={(e) => e.stopPropagation()}>
        
        {/* Card 1: Crackling Bonfire & S'mores */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="glass-panel rounded-2xl p-5 border border-emerald-400/30 backdrop-blur-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/20 rounded-lg text-amber-300">
                <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
              </div>
              <h3 className="font-semibold text-emerald-100">Cozy Mountain Campfire</h3>
            </div>
            <span className="text-xs bg-amber-900/60 text-amber-300 px-2 py-1 rounded-full border border-amber-500/30">
              {smoresCount} S'mores Roasted 🍢
            </span>
          </div>

          <p className="text-xs text-emerald-200/80 mb-4 leading-relaxed">
            Misty mountain lake, crisp cedar breeze, and a warm crackling fire. Click below to roast marshmallows over the flames.
          </p>

          <div className="space-y-2">
            <button 
              onClick={handleRoastSmore}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-700 hover:to-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              Roast Golden S'more 🍢
            </button>
            <p className="text-[11px] text-slate-300 text-center italic">
              Warmth level: Maximum cozy • No 11 PM curfews in the mountains
            </p>
          </div>
        </motion.div>

        {/* Card 2: The Legendary Mithun & Northeast Roots */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="glass-panel rounded-2xl p-5 border border-emerald-400/30 backdrop-blur-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-300">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-emerald-100">Mountain Wildlife</h3>
            </div>
            <span className="text-xs bg-emerald-900/60 text-emerald-300 px-2 py-1 rounded-full border border-emerald-500/30">
              Arunachal Legend 🐂
            </span>
          </div>

          <p className="text-xs text-emerald-200/80 mb-4 leading-relaxed">
            Somewhere along the pine slopes, a gentle and majestic mountain creature is resting.
          </p>

          <button 
            onClick={handleMithunClick}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-700/40 hover:bg-emerald-700/60 border border-emerald-400/50 text-emerald-100 text-xs font-bold flex items-center justify-center gap-2 shadow-md transition active:scale-95"
          >
            <span className="text-lg">🐂</span>
            Spot the Sacred Mountain Mithun
          </button>
        </motion.div>

      </div>

      {/* Mithun Easter Egg Modal */}
      <AnimatePresence>
        {showMithunModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowMithunModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full glass-panel rounded-3xl p-6 border-2 border-emerald-400/60 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="text-6xl mb-3 animate-bounce">
                🐂✨
              </div>

              <span className="text-[11px] font-mono font-bold bg-emerald-500/30 text-emerald-200 px-3 py-1 rounded-full border border-emerald-400/40">
                SPECIAL NORTHEAST MEMORY UNLOCKED
              </span>

              <h2 className="text-2xl font-serif font-bold text-emerald-100 mt-3 font-handwritten text-3xl text-amber-200">
                “Aapke yaha bhi mithun milte h? 😭🙏”
              </h2>

              <div className="bg-black/40 p-3.5 rounded-2xl border border-emerald-500/20 my-4 text-left text-xs text-emerald-200/90 leading-relaxed">
                <p className="font-semibold text-white mb-1">
                  Arunachal & Adi Heritage Verified 🏔️
                </p>
                <p>
                  From Itanagar to Guwahati mountain trails, homestay memories, and misty waterfalls. Whenever college in Amaravati gets overwhelming, remember where your peace comes from.
                </p>
              </div>

              <button 
                onClick={() => setShowMithunModal(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition"
              >
                Salute the Mithun & Return
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
