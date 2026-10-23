import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, RefreshCw, Bomb, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../services/soundEngine';

export const StressShredderScene: React.FC = () => {
  const [stressText, setStressText] = useState('');
  const [annihilationMode, setAnnihilationMode] = useState<'rocket' | 'capybara' | 'blackhole' | 'shredder'>('rocket');
  const [isAnnihilating, setIsAnnihilating] = useState(false);
  const [annihilatedCount, setAnnihilatedCount] = useState(0);
  const [lastVictoryMsg, setLastVictoryMsg] = useState<string | null>(null);

  const presets = [
    "3:00 AM Evaluation Panic",
    "Hostel Mystery Mess Curry",
    "11:00 PM Hostel Curfew Alarm",
    "2-Week Course Syllabus Overload",
    "Hostel Tap Water Drama",
    "Group Project Ghosters"
  ];

  const handleAnnihilate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stressText.trim() || isAnnihilating) return;

    setIsAnnihilating(true);

    if (annihilationMode === 'rocket') {
      soundEngine.playRocket();
    } else if (annihilationMode === 'capybara') {
      soundEngine.playPurr();
    } else {
      soundEngine.playLaserShred();
    }

    setTimeout(() => {
      soundEngine.playChime();
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.5, x: 0.5 }
      });

      setAnnihilatedCount(prev => prev + 1);
      setIsAnnihilating(false);

      const msg = `"${stressText}" was successfully blasted into harmless cosmic sparkles. Stress level permanently lowered! 🚀✨`;
      setLastVictoryMsg(msg);
      setStressText('');

      setTimeout(() => {
        setLastVictoryMsg(null);
      }, 5000);
    }, 1200);
  };

  return (
    <div className="relative w-full min-h-[85vh] flex flex-col justify-between p-4 md:p-8 select-none text-white">
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="self-center glass-panel px-6 py-3 rounded-full flex items-center gap-3 text-cyan-200 border border-cyan-500/30 text-sm md:text-base shadow-lg z-20"
      >
        <Rocket className="w-5 h-5 text-cyan-400 animate-bounce" />
        <span className="font-medium">Cosmic Assignment Annihilator — Where college stress gets deleted forever.</span>
      </motion.div>

      {/* Center Annihilator Machine */}
      <div className="max-w-2xl mx-auto w-full my-auto z-20">
        <motion.div 
          animate={isAnnihilating ? { x: [-4, 4, -4, 4, 0], scale: [1, 1.02, 0.98, 1] } : {}}
          transition={{ duration: 0.3, repeat: isAnnihilating ? 4 : 0 }}
          className="glass-panel rounded-3xl p-6 md:p-8 border-2 border-cyan-400/40 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-2xl border border-cyan-400/40">
                🚀
              </div>
              <div>
                <h2 className="text-xl font-bold text-cyan-100">Assignment Annihilator 9000</h2>
                <p className="text-xs text-cyan-300/80">Operated by Chill Capybara & Starry Cat</p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold bg-cyan-950/80 text-cyan-300 px-3 py-1.5 rounded-full border border-cyan-500/40 shadow-inner">
              {annihilatedCount} Annihilated 💥
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="mb-4">
            <label className="text-xs font-medium text-slate-300 mb-1.5 block">Quick Select Stress Target:</label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    soundEngine.playPop();
                    setStressText(p);
                  }}
                  className="text-[11px] bg-black/40 hover:bg-cyan-900/40 border border-cyan-500/20 hover:border-cyan-400/50 text-cyan-200 px-2.5 py-1 rounded-lg transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAnnihilate} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1.5 block">Target Stress / Deadline / Problem:</label>
              <input 
                type="text"
                value={stressText}
                onChange={(e) => setStressText(e.target.value)}
                placeholder="Type whatever is draining your energy..."
                className="w-full bg-black/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-sm text-white placeholder-cyan-300/40 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            {/* Annihilation Mode Selector */}
            <div>
              <label className="text-xs font-medium text-slate-300 mb-1.5 block">Destruction Mode:</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { id: 'rocket', label: '🚀 Rocket to Sun' },
                  { id: 'capybara', label: '🦆 Capybara Munch' },
                  { id: 'blackhole', label: '🕳️ Black Hole' },
                  { id: 'shredder', label: '📄 Laser Shredder' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playPop();
                      setAnnihilationMode(mode.id as any);
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border transition ${
                      annihilationMode === mode.id
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg'
                        : 'bg-black/40 text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!stressText.trim() || isAnnihilating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm shadow-xl transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnnihilating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  YEETING INTO THE MULTIVERSE...
                </>
              ) : (
                <>
                  <Bomb className="w-5 h-5" />
                  ANNIHILATE THIS STRESS NOW 💥
                </>
              )}
            </button>
          </form>

          {/* Victory Toast */}
          <AnimatePresence>
            {lastVictoryMsg && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-400/50 text-emerald-200 text-xs font-medium flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{lastVictoryMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
