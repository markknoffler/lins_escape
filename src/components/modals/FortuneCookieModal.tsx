import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../services/soundEngine';

interface FortuneCookieModalProps {
  onClose: () => void;
}

export const FortuneCookieModal: React.FC<FortuneCookieModalProps> = ({ onClose }) => {
  const [isCracked, setIsCracked] = useState(false);
  const [fortuneIndex, setFortuneIndex] = useState(0);

  const fortunes = [
    {
      text: "“The DMCH warden is currently distracted with tea. Now is the optimal window for a stealth momos run.”",
      tag: "STEALTH CLEARANCE 🥟",
      luckyNumber: "10:59 PM"
    },
    {
      text: "“Your patient notes are written. Your sleep schedule is not. Go to bed, Lin.”",
      tag: "HEALTH DIRECTIVE 🌙",
      luckyNumber: "8 Hours Sleep"
    },
    {
      text: "“An 11/10 singing voice was detected. The world may be noisy, but your melody brings quiet peace.”",
      tag: "11/10 VOCALS 🎶",
      luckyNumber: "11/10 Score"
    },
    {
      text: "“The Umrangso road trip bet stands: delicious roadside food is guaranteed in your future.”",
      tag: "ROAD TRIP VIBES 🚙",
      luckyNumber: "Dima Hasao"
    },
    {
      text: "“By decree of the Khelon committee: You are the forever MVP Support of this squad.”",
      tag: "CHAMPION MVP 👑",
      luckyNumber: "+500 Squad Pride"
    },
    {
      text: "“Sliding under the hostel gate at 10:59:59 PM is mathematically considered an on-time arrival.”",
      tag: "GATE PHYSICS ⏰",
      luckyNumber: "10:59:59 PM"
    },
    {
      text: "“A plate of 12 steaming momos for 50₹ is medically proven to heal all clinical exhaustion.”",
      tag: "COMFORT FOOD 🥟",
      luckyNumber: "12 Pieces"
    },
    {
      text: "“Gwenchana, gwenchana! You survived today, and tomorrow will be much gentler.”",
      tag: "K-DRAMA TRUTH ✨",
      luckyNumber: "1 Day at a Time"
    }
  ];

  const handleCrackCookie = () => {
    if (isCracked) return;
    soundEngine.playPop();
    setIsCracked(true);
    confetti({
      particleCount: 45,
      spread: 65,
      colors: ['#fbbf24', '#f472b6', '#c084fc'],
    });
  };

  const handleNextCookie = () => {
    soundEngine.playPop();
    setIsCracked(false);
    setFortuneIndex(prev => (prev + 1) % fortunes.length);
  };

  const currentFortune = fortunes[fortuneIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-md select-none"
    >
      <div className="relative w-full max-w-xl bg-black/75 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col items-center text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold mb-2">
            <span>🥠 LATE-NIGHT ORACLE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            Hostel Fortune Cookie
          </h2>
          <p className="text-xs text-slate-300 font-light max-w-sm mx-auto mt-1">
            Tap the golden cookie to crack it open and reveal tonight's wisdom.
          </p>
        </div>

        {/* Fortune Cookie Visual / Crack Animation */}
        <div className="relative w-56 h-48 flex items-center justify-center mb-4">
          <AnimatePresence mode="wait">
            {!isCracked ? (
              <motion.button
                key="whole"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleCrackCookie}
                className="relative group cursor-pointer flex flex-col items-center"
              >
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl group-hover:bg-amber-400/40 transition" />
                <span className="text-7xl sm:text-8xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] animate-bounce">
                  🥠
                </span>
                <span className="text-xs text-amber-300 font-mono font-bold mt-2 px-3 py-1 bg-black/60 rounded-full border border-amber-400/30">
                  Tap to Crack Open ✨
                </span>
              </motion.button>
            ) : (
              <motion.div
                key="cracked"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center w-full"
              >
                {/* Cracked Cookie Pieces */}
                <div className="flex items-center justify-center gap-6 text-4xl mb-3">
                  <motion.span animate={{ x: -10, rotate: -15 }}>🥠</motion.span>
                  <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                  <motion.span animate={{ x: 10, rotate: 15 }}>🥠</motion.span>
                </div>

                {/* Paper Fortune Slip */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-full bg-amber-50/90 text-slate-900 p-5 rounded-2xl border border-amber-200 shadow-2xl relative"
                >
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-800 px-2.5 py-0.5 bg-amber-200/60 rounded-md">
                    {currentFortune.tag}
                  </span>

                  <p className="font-handwritten text-lg sm:text-xl text-slate-900 font-bold leading-relaxed my-3">
                    {currentFortune.text}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-amber-900/70 border-t border-amber-300/60 pt-2">
                    <span>Lucky Parameter:</span>
                    <strong className="text-amber-950 font-bold">{currentFortune.luckyNumber}</strong>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        {isCracked && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleNextCookie}
            className="mt-4 px-6 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-serif text-xs font-bold flex items-center gap-2 transition cursor-pointer border border-white/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Open Another Cookie</span>
          </motion.button>
        )}

        {/* Handwritten Footer */}
        <div className="mt-6 text-center">
          <span className="font-handwritten text-base text-rose-300/90 font-medium tracking-wide">
            written with care for lin ☁️
          </span>
        </div>

      </div>
    </motion.div>
  );
};

export default FortuneCookieModal;
