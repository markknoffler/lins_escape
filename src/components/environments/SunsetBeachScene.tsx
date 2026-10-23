import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Compass, Eye, Waves } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../services/soundEngine';

interface Boat {
  id: number;
  worry: string;
  x: number;
  progress: number;
}

export const SunsetBeachScene: React.FC = () => {
  const [worryInput, setWorryInput] = useState('');
  const [boats, setBoats] = useState<Boat[]>([]);
  const [showTelescope, setShowTelescope] = useState(false);
  const [footprints, setFootprints] = useState<{ id: number; x: number; y: number }[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<'golden' | 'twilight' | 'midnight'>('golden');

  const launchBoat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!worryInput.trim()) return;

    soundEngine.playSplash();
    const newBoat: Boat = {
      id: Date.now(),
      worry: worryInput.trim(),
      x: 20 + Math.random() * 60,
      progress: 0
    };

    setBoats(prev => [...prev, newBoat]);
    setWorryInput('');

    const interval = setInterval(() => {
      setBoats(prev => 
        prev.map(b => {
          if (b.id === newBoat.id) {
            const nextProg = b.progress + 2;
            if (nextProg >= 100) {
              clearInterval(interval);
              soundEngine.playChime();
              confetti({
                particleCount: 25,
                spread: 40,
                origin: { y: 0.45, x: b.x / 100 }
              });
              return { ...b, progress: 100 };
            }
            return { ...b, progress: nextProg };
          }
          return b;
        }).filter(b => b.progress < 100)
      );
    }, 100);
  };

  const handleBeachClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    if (yPercent > 55) {
      soundEngine.playPop();
      const newPrint = {
        id: Date.now(),
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: yPercent
      };
      setFootprints(prev => [...prev.slice(-12), newPrint]);
    }
  };

  return (
    <div 
      onClick={handleBeachClick}
      className={`relative w-full min-h-[85vh] flex flex-col justify-between p-4 md:p-8 select-none text-white transition-colors duration-1000 ${
        timeOfDay === 'twilight' 
          ? 'bg-purple-950/20' 
          : timeOfDay === 'midnight' 
          ? 'bg-indigo-950/40' 
          : ''
      }`}
    >
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="self-center glass-panel px-6 py-3 rounded-full flex items-center gap-3 text-orange-200 border border-orange-500/30 text-sm md:text-base shadow-lg z-20"
      >
        <Waves className="w-5 h-5 text-orange-400 animate-pulse" />
        <span className="font-medium">Sunset Beach Sanctuary — Where assignments dissolve in the ocean.</span>
      </motion.div>

      {/* Interactive Footprints on Sand */}
      {footprints.map(fp => (
        <motion.div
          key={fp.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0 }}
          style={{ left: `${fp.x}%`, top: `${fp.y}%` }}
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 text-amber-200/50 text-xl"
        >
          🐾
        </motion.div>
      ))}

      {/* Sailing Origami Worry Boats */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {boats.map(boat => (
          <motion.div
            key={boat.id}
            style={{
              left: `${boat.x}%`,
              top: `${72 - (boat.progress * 0.35)}%`,
              transform: `scale(${Math.max(0.3, 1 - (boat.progress * 0.007))})`
            }}
            className="absolute flex flex-col items-center -translate-x-1/2 transition-all duration-100"
          >
            <span className="text-3xl animate-bounce">⛵</span>
            <div className="bg-orange-950/80 backdrop-blur-sm text-orange-100 text-[10px] px-2 py-0.5 rounded-full border border-orange-400/40 shadow-lg whitespace-nowrap max-w-[150px] truncate">
              {boat.worry}
            </div>
            <span className="text-[9px] text-orange-300 font-mono">Sailing away...</span>
          </motion.div>
        ))}
      </div>

      {/* Center Interactive Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full my-auto z-20">
        
        {/* Card 1: Paper Boat Worry Launcher */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="glass-panel rounded-2xl p-5 border border-orange-400/30 backdrop-blur-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-500/20 rounded-lg text-orange-300">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-orange-100">Paper Boat Worry Release</h3>
            </div>
            <span className="text-xs bg-orange-900/60 text-orange-300 px-2 py-1 rounded-full border border-orange-500/30">
              Wave Therapy 🌊
            </span>
          </div>

          <p className="text-xs text-orange-200/80 mb-3 leading-relaxed">
            Write down any college burden, 3 AM deadline, or hostel annoyance. We'll fold it into a paper boat and sail it out past the horizon.
          </p>

          <form onSubmit={launchBoat} className="space-y-3">
            <div className="relative">
              <input 
                type="text"
                value={worryInput}
                onChange={(e) => setWorryInput(e.target.value)}
                placeholder="e.g. Tomorrow's evaluation, hostel curry..."
                className="w-full bg-black/40 border border-orange-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-orange-300/40 focus:outline-none focus:border-orange-400 transition"
              />
            </div>
            <button 
              type="submit"
              disabled={!worryInput.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Fold & Sail Into Sunset ⛵
            </button>
          </form>
        </motion.div>

        {/* Card 2: Secret Lighthouse Telescope & Atmosphere */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="glass-panel rounded-2xl p-5 border border-amber-400/30 backdrop-blur-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/20 rounded-lg text-amber-300">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-amber-100">Shore Exploration</h3>
            </div>
            <span className="text-xs bg-amber-900/60 text-amber-300 px-2 py-1 rounded-full border border-amber-500/30">
              Easter Egg 🔍
            </span>
          </div>

          <p className="text-xs text-amber-200/80 mb-3">
            Click the lighthouse telescope to inspect distant secret islands across the sea.
          </p>

          <div className="space-y-3">
            <button 
              onClick={() => {
                soundEngine.playChime();
                setShowTelescope(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/40 text-amber-100 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <Eye className="w-4 h-4 text-amber-300" />
              Look Through Lighthouse Telescope 🔭
            </button>

            {/* Time of Day Switcher */}
            <div className="flex items-center justify-between bg-black/30 p-2 rounded-xl border border-white/10 text-xs">
              <span className="text-slate-300 font-medium text-[11px]">Time of Day:</span>
              <div className="flex gap-1">
                {(['golden', 'twilight', 'midnight'] as const).map(time => (
                  <button
                    key={time}
                    onClick={() => {
                      soundEngine.playPop();
                      setTimeOfDay(time);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition ${
                      timeOfDay === time 
                        ? 'bg-orange-500 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Secret Telescope Modal: White Beach Philippines Easter Egg */}
      <AnimatePresence>
        {showTelescope && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowTelescope(false)}
          >
            <motion.div 
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full glass-panel rounded-3xl p-6 border-2 border-orange-400/60 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="w-36 h-36 mx-auto mb-4 rounded-full border-4 border-dashed border-orange-300/60 flex items-center justify-center bg-gradient-to-br from-cyan-900/40 to-blue-900/60 relative shadow-inner">
                <span className="text-5xl animate-bounce">🏝️</span>
                <div className="absolute inset-0 border border-white/20 rounded-full" />
                <div className="absolute w-full h-[1px] bg-orange-400/40 top-1/2" />
                <div className="absolute h-full w-[1px] bg-orange-400/40 left-1/2" />
              </div>

              <span className="text-[11px] font-mono font-bold bg-orange-500/30 text-orange-200 px-3 py-1 rounded-full border border-orange-400/40">
                COORDINATES LOCKED 🇵🇭
              </span>

              <h2 className="text-2xl font-serif font-bold text-orange-100 mt-3">
                White Beach (Philippines)
              </h2>

              <div className="bg-black/40 p-3.5 rounded-2xl border border-orange-500/20 my-4 text-left font-handwritten text-lg text-amber-200">
                <p className="italic">"Secret Tropical Getaway: White Beach (Philippines) 🏝️"</p>
                <p className="text-xs font-sans text-slate-300 not-italic mt-2">
                  → System footnote: <span className="text-orange-300 font-semibold">Apparently we were supposed to come here.</span> No evaluations or curfews allowed on this island!
                </p>
              </div>

              <button 
                onClick={() => setShowTelescope(false)}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-lg transition"
              >
                Lower Telescope
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
