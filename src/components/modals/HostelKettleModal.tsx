import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Play, RotateCcw, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../services/soundEngine';

interface HostelKettleModalProps {
  onClose: () => void;
}

export const HostelKettleModal: React.FC<HostelKettleModalProps> = ({ onClose }) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(15 * 60); // seconds
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [selectedBrew, setSelectedBrew] = useState<'chamomile' | 'darjeeling' | 'water'>('chamomile');

  const timerRef = useRef<any>(null);

  const brewOptions = [
    { id: 'chamomile', name: 'Chamomile & Lavender', desc: 'Calms 3 AM racing thoughts', icon: '🪻', mins: 10 },
    { id: 'darjeeling', name: 'Darjeeling Green Tea', desc: 'Gentle focus & antioxidant reset', icon: '🍃', mins: 15 },
    { id: 'water', name: 'Warm Filtered Water', desc: 'Hostel hydration & health first', icon: '💧', mins: 20 },
  ];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsDone(true);
      soundEngine.playChime();
      confetti({ particleCount: 50, spread: 60 });
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleSelectBrew = (brewId: 'chamomile' | 'darjeeling' | 'water', mins: number) => {
    soundEngine.playPop();
    setSelectedBrew(brewId);
    setSelectedDuration(mins * 60);
    setTimeLeft(mins * 60);
    setIsRunning(false);
    setIsDone(false);
  };

  const toggleTimer = () => {
    soundEngine.playPour();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    soundEngine.playPop();
    setIsRunning(false);
    setIsDone(false);
    setTimeLeft(selectedDuration);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold mb-2">
            <span>🫖 HOSTEL BREAK PROTOCOL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
            The 2 AM Tea Kettle
          </h2>
          <p className="text-xs text-slate-300 font-light max-w-md mx-auto mt-1">
            Put the laptop down. Rest your eyes while the virtual water boils.
          </p>
        </div>

        {/* Brew Selection Pills */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mb-6">
          {brewOptions.map(b => (
            <button
              key={b.id}
              onClick={() => handleSelectBrew(b.id as any, b.mins)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                selectedBrew === b.id
                  ? 'bg-amber-500/20 border-amber-400/50 text-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg">{b.icon}</span>
                <span className="text-[10px] font-mono text-amber-300 font-bold">{b.mins} min</span>
              </div>
              <div>
                <h4 className="text-xs font-bold font-serif">{b.name}</h4>
                <p className="text-[10px] text-slate-400 font-light mt-0.5 line-clamp-1">{b.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Animated Steaming Kettle & Timer Ring */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-6">
          
          {/* Ambient Glow */}
          <motion.div
            animate={{
              scale: isRunning ? [1, 1.15, 1] : 1,
              opacity: isRunning ? [0.4, 0.7, 0.4] : 0.3,
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 via-rose-500/20 to-cyan-500/30 blur-2xl"
          />

          {/* Steaming Kettle Icon */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            
            {/* Animated Rising Steam */}
            {isRunning && (
              <div className="absolute -top-10 flex gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -25, -45],
                      opacity: [0, 0.6, 0],
                      scale: [0.6, 1.2, 1.6],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: 'easeOut',
                    }}
                    className="w-4 h-4 rounded-full bg-white/40 blur-sm"
                  />
                ))}
              </div>
            )}

            <div className="p-5 rounded-full bg-black/60 border border-white/20 shadow-2xl backdrop-blur-md flex flex-col items-center">
              <span className="text-4xl sm:text-5xl mb-1">{isDone ? '☕' : '🫖'}</span>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-widest">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[10px] text-amber-300 font-mono mt-0.5">
                {isRunning ? '✨ Brewing Peace...' : isDone ? '🌿 Brew Ready!' : 'Paused'}
              </span>
            </div>
          </div>
        </div>

        {/* Completion Message */}
        {isDone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-xs text-amber-200 text-center font-medium mb-4"
          >
            ☕ Your warm brew is ready. Take a slow sip, stretch your shoulders, and rest your eyes.
          </motion.div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <button
            onClick={toggleTimer}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-serif font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition border border-white/30 cursor-pointer active:scale-95"
          >
            {isRunning ? (
              <>
                <Moon className="w-4 h-4" />
                <span>Pause Rest</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{isDone ? 'Brew Again' : 'Start Rest Break'}</span>
              </>
            )}
          </button>

          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer border border-white/10"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
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

export default HostelKettleModal;
