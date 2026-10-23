import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Flame, Orbit } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../services/soundEngine';

interface StressShredderModalProps {
  onClose: () => void;
}

export const StressShredderModal: React.FC<StressShredderModalProps> = ({ onClose }) => {
  const [stressInput, setStressInput] = useState('');
  const [isShredding, setIsShredding] = useState(false);
  const [shredType, setShredType] = useState<'blackhole' | 'cat' | null>(null);
  const [shreddedCount, setShreddedCount] = useState(() => {
    return parseInt(localStorage.getItem('lin_shredded_count') || '14', 10);
  });
  const [lastShreddedText, setLastShreddedText] = useState<string | null>(null);

  const quickStressSuggestions = [
    '8:00 AM DMCH Clinical Postings & Vivas',
    'Clueless Teammates Offering "Substitute"',
    'Hospital Ward Exhaustion & Uncle Care',
    'Hostel Gate Curfew & Attendance Checks',
    'Dead Phone Battery on Power Cut Days',
    '2 AM Hyperactive Brain Overthinking'
  ];

  const handleShred = (type: 'blackhole' | 'cat') => {
    if (!stressInput.trim()) return;
    setIsShredding(true);
    setShredType(type);
    setLastShreddedText(stressInput);

    if (type === 'blackhole') {
      soundEngine.playLaserShred();
      confetti({
        particleCount: 45,
        spread: 70,
        colors: ['#a855f7', '#3b82f6', '#06b6d4'],
      });
    } else {
      soundEngine.playPurr();
      confetti({
        particleCount: 40,
        spread: 60,
        colors: ['#f472b6', '#fbbf24', '#fb7185'],
      });
    }

    const newCount = shreddedCount + 1;
    setShreddedCount(newCount);
    localStorage.setItem('lin_shredded_count', newCount.toString());

    setTimeout(() => {
      setIsShredding(false);
      setStressInput('');
      setShredType(null);
    }, 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-md select-none"
    >
      <div className="relative w-full max-w-2xl bg-black/75 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col items-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold mb-2">
            <span>🗑️ CATHARTIC DECOMPRESSION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            The 3 AM Assignment Yeeter
          </h2>
          <p className="text-xs text-slate-300 font-light max-w-md mx-auto mt-1">
            Type whatever college nuisance is stressing you out, and obliterate it into cosmic stardust.
          </p>
        </div>

        {/* Paper Note Canvas / Input Area */}
        <div className="relative w-full max-w-lg mb-4">
          <AnimatePresence mode="wait">
            {!isShredding ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.2, rotate: 180, filter: 'blur(8px)' }}
                transition={{ duration: 0.4 }}
                className="w-full bg-amber-50/10 backdrop-blur-xl p-5 rounded-2xl border-2 border-dashed border-amber-300/40 shadow-inner flex flex-col gap-3"
              >
                <div className="flex items-center justify-between text-xs text-amber-200/80 font-mono">
                  <span>📄 ACADEMIC CHAOS DRAFT</span>
                  <span>CONFIDENTIAL</span>
                </div>

                <textarea
                  value={stressInput}
                  onChange={e => setStressInput(e.target.value)}
                  placeholder="Type an assignment, evaluation, curfew, or annoying deadline..."
                  rows={3}
                  className="w-full bg-transparent text-slate-100 placeholder:text-slate-400 text-sm font-sans resize-none focus:outline-none leading-relaxed"
                />

                {/* Quick Suggestion Chips */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                  {quickStressSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        soundEngine.playPop();
                        setStressInput(s);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] text-slate-300 hover:text-white transition cursor-pointer border border-white/5"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="shredding"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-44 rounded-2xl bg-black/80 border border-purple-500/40 flex flex-col items-center justify-center text-center p-4 shadow-2xl relative overflow-hidden"
              >
                {/* Shredding Cosmic Animation */}
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.3, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-5xl mb-2"
                >
                  {shredType === 'blackhole' ? '🌌' : '🐱💨'}
                </motion.div>

                <h3 className="font-serif font-bold text-white text-base">
                  {shredType === 'blackhole' ? 'YEETING INTO BLACK HOLE...' : 'THE CAT ATE YOUR ASSIGNMENT!'}
                </h3>
                <p className="text-xs text-purple-300 font-mono mt-1 italic line-clamp-1">
                  “{lastShreddedText}” has been completely erased from spacetime.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-lg mb-5">
          <button
            disabled={!stressInput.trim() || isShredding}
            onClick={() => handleShred('blackhole')}
            className={`py-3 px-4 rounded-2xl font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition border border-white/20 cursor-pointer shadow-xl ${
              !stressInput.trim() || isShredding
                ? 'bg-purple-950/40 text-slate-500 border-white/5 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white active:scale-95'
            }`}
          >
            <Orbit className="w-4 h-4" />
            <span>Yeet to Black Hole 🌌</span>
          </button>

          <button
            disabled={!stressInput.trim() || isShredding}
            onClick={() => handleShred('cat')}
            className={`py-3 px-4 rounded-2xl font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition border border-white/20 cursor-pointer shadow-xl ${
              !stressInput.trim() || isShredding
                ? 'bg-rose-950/40 text-slate-500 border-white/5 cursor-not-allowed'
                : 'bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white active:scale-95'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Feed to Cat 🐱</span>
          </button>
        </div>

        {/* Global Shredded Counter */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Total College Stress Obliterated: <strong>{shreddedCount} items</strong></span>
        </div>

        {/* Handwritten Footer */}
        <div className="mt-5 text-center">
          <span className="font-handwritten text-base text-rose-300/90 font-medium tracking-wide">
            written with care for lin ☁️
          </span>
        </div>

      </div>
    </motion.div>
  );
};

export default StressShredderModal;
