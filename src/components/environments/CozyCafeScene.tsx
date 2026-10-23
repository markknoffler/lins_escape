import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, UtensilsCrossed, Sparkles, RefreshCw, Heart } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { CAFE_FIVE_MINUTES_RESPONSES, SECRET_MENU_ITEMS } from '../../data/easterEggs';

export const CozyCafeScene: React.FC = () => {
  const [fiveMinCount, setFiveMinCount] = useState(0);
  const [currentLatteArt, setCurrentLatteArt] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [catPurrMsg, setCatPurrMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const latteArts = [
    { name: "Sweet Kitty Face 🐱", desc: "Whiskers & foam paws" },
    { name: "Fluffy Teddy Bear 🐻", desc: "Cozy cinnamon dusting" },
    { name: "Sparkling Heart 💖", desc: "Warm comfort brew" },
    { name: "Sleep > 2:00 AM 😴", desc: "Prescription for rest" },
    { name: "Surviving DMCH 🩺", desc: "Heroic daily achievement" },
    { name: "No Ward Duties ☕", desc: "Officially banned here" }
  ];

  const catThoughts = [
    "Meow... (Translation: Put the medical notes away, Lin, it's nap time.)",
    "*Purrrrrr...* (Translation: The cat approves of your break.)",
    "Meow! (Translation: Tell your professor that a cat is currently sitting on your keyboard.)",
    "*Gentle head boop* (Translation: You did good today, mon cher.)"
  ];

  // Initialize Fog Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 300;
    canvas.height = canvas.parentElement?.clientHeight || 200;

    // Draw misty condensation fog
    ctx.fillStyle = 'rgba(230, 240, 255, 0.45)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw faint raindrops
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 30; i++) {
      const rx = Math.random() * canvas.width;
      const ry = Math.random() * canvas.height;
      ctx.beginPath();
      ctx.ellipse(rx, ry, 2, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const handleCanvasDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();

    soundEngine.playPop();
  };

  const handleFiveMinutes = () => {
    soundEngine.playPop();
    setFiveMinCount(prev => prev + 1);
  };

  const cycleLatteArt = () => {
    soundEngine.playPour();
    setCurrentLatteArt(prev => (prev + 1) % latteArts.length);
  };

  const petTheCat = () => {
    soundEngine.playPurr();
    const randomThought = catThoughts[Math.floor(Math.random() * catThoughts.length)];
    setCatPurrMsg(randomThought);
    setTimeout(() => setCatPurrMsg(null), 4500);
  };

  const resetFog = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(230, 240, 255, 0.45)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    soundEngine.playSplash();
  };

  return (
    <div className="relative w-full min-h-[85vh] flex flex-col justify-between p-4 md:p-8 select-none text-white">
      {/* Top Banner with Cozy Quote */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="self-center glass-panel px-6 py-3 rounded-full flex items-center gap-3 text-amber-200 border border-amber-500/30 text-sm md:text-base shadow-lg"
      >
        <Coffee className="w-5 h-5 text-amber-400 animate-bounce" />
        <span className="font-medium">Welcome to CLOY Café — Assignments & Curfews strictly prohibited.</span>
      </motion.div>

      {/* Main Interactive Floating Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto max-w-6xl mx-auto w-full z-20">
        
        {/* Card 1: Interactive Steaming Mug & Latte Art */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-panel rounded-2xl p-5 border border-amber-400/20 backdrop-blur-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/20 rounded-lg text-amber-300">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-amber-100">Hot Latte Bar</h3>
            </div>
            <span className="text-xs bg-amber-900/60 text-amber-300 px-2 py-1 rounded-full border border-amber-500/30">
              Steaming ☕
            </span>
          </div>

          <div className="my-4 flex flex-col items-center">
            {/* Steaming Animation Container */}
            <div className="relative group cursor-pointer" onClick={cycleLatteArt}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-80 pointer-events-none">
                <span className="w-1.5 h-6 bg-white/40 rounded-full animate-steam" style={{ animationDelay: '0s' }} />
                <span className="w-1.5 h-8 bg-white/50 rounded-full animate-steam" style={{ animationDelay: '0.4s' }} />
                <span className="w-1.5 h-6 bg-white/40 rounded-full animate-steam" style={{ animationDelay: '0.8s' }} />
              </div>

              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-900 to-amber-700 p-2 shadow-inner border-4 border-amber-200/40 flex items-center justify-center transform transition group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-[#5a3825] flex flex-col items-center justify-center text-center p-1 border border-amber-300/30 shadow-lg">
                  <span className="text-2xl">{latteArts[currentLatteArt].name.split(' ')[2] || '☕'}</span>
                  <span className="text-[10px] font-bold text-amber-200 leading-tight mt-0.5">
                    {latteArts[currentLatteArt].name.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-amber-200/80 mt-3 font-medium text-center">
              Current Art: <span className="text-amber-300 font-bold">{latteArts[currentLatteArt].name}</span>
            </p>
            <p className="text-[11px] text-slate-300 text-center italic mt-0.5">
              {latteArts[currentLatteArt].desc}
            </p>
          </div>

          <button 
            onClick={cycleLatteArt}
            className="w-full py-2 px-4 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/40 text-amber-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Pour New Latte Art
          </button>
        </motion.div>

        {/* Card 2: 5 More Minutes & The Cozy Corner */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-panel rounded-2xl p-5 border border-purple-400/20 backdrop-blur-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-purple-100">Escape Extension</h3>
            </div>
            <span className="text-xs bg-purple-900/60 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">
              +{fiveMinCount * 5} min rested
            </span>
          </div>

          <div className="my-2 p-3.5 bg-black/30 rounded-xl border border-white/5 min-h-[90px] flex flex-col justify-center text-center">
            <p className="text-xs font-serif text-purple-200 italic leading-relaxed">
              "{fiveMinCount === 0 
                ? "You've been working too hard. Hit the button to pause time." 
                : CAFE_FIVE_MINUTES_RESPONSES[(fiveMinCount - 1) % CAFE_FIVE_MINUTES_RESPONSES.length]}"
            </p>
          </div>

          <div className="space-y-2 mt-2">
            <button 
              onClick={handleFiveMinutes}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600/40 to-pink-600/40 hover:from-purple-600/60 hover:to-pink-600/60 border border-purple-400/50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              Just 5 More Minutes ☕
            </button>

            <button 
              onClick={() => {
                soundEngine.playChime();
                setShowMenu(true);
              }}
              className="w-full py-1.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              <UtensilsCrossed className="w-3 h-3 text-amber-400" />
              View Secret Café Menu (Easter Eggs)
            </button>
          </div>
        </motion.div>

        {/* Card 3: Rainy Window Doodle & Sleepy Cat */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-panel rounded-2xl p-5 border border-cyan-400/20 backdrop-blur-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-cyan-100">Foggy Window Scratchpad</h3>
            </div>
            <button 
              onClick={resetFog}
              className="text-[10px] text-cyan-300 hover:text-cyan-100 underline"
            >
              Re-fog glass
            </button>
          </div>

          <div className="relative w-full h-32 rounded-xl overflow-hidden border border-cyan-500/30 my-2 cursor-crosshair bg-slate-900/60">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400/60 text-[11px] font-handwritten text-center px-4">
              Draw or wipe with your finger / mouse on the misty window 🌧️
            </div>
            <canvas 
              ref={canvasRef}
              onMouseMove={(e) => {
                if (e.buttons === 1) handleCanvasDraw(e);
              }}
              onTouchMove={handleCanvasDraw}
              onClick={handleCanvasDraw}
              className="interactive-fog-canvas"
            />
          </div>

          {/* Sleepy Cat Interactable */}
          <div className="relative mt-1">
            <button 
              onClick={petTheCat}
              className="w-full py-2 px-3 rounded-xl bg-amber-950/40 hover:bg-amber-950/60 border border-amber-400/30 text-amber-200 text-xs font-semibold flex items-center justify-between transition group"
            >
              <span className="flex items-center gap-1.5">
                🐱 <span className="group-hover:text-amber-100">Pet the windowsill cat</span>
              </span>
              <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full text-amber-300 font-mono">
                *purr*
              </span>
            </button>

            <AnimatePresence>
              {catPurrMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute bottom-full left-0 right-0 mb-2 p-2.5 bg-amber-900/90 text-amber-100 text-xs rounded-xl border border-amber-400/40 shadow-2xl backdrop-blur-md text-center font-handwritten text-sm"
                >
                  {catPurrMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>

      {/* Secret Café Menu Modal */}
      <AnimatePresence>
        {showMenu && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowMenu(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-lg w-full glass-panel-light text-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-amber-300/50"
            >
              <div className="flex items-center justify-between border-b border-amber-900/20 pb-4 mb-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-amber-950 flex items-center gap-2">
                    ☕ CLOY Café Secret Menu
                  </h2>
                  <p className="text-xs text-amber-800 italic">Chef's private tasting notes for Lin</p>
                </div>
                <button 
                  onClick={() => setShowMenu(false)}
                  className="p-1.5 rounded-full hover:bg-black/10 text-slate-700 transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {SECRET_MENU_ITEMS.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-amber-950 text-sm md:text-base">{item.name}</h4>
                      <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-xs text-amber-900/80 mt-1 font-medium">{item.tagline}</p>
                    <p className="text-[11px] text-amber-800 font-handwritten text-sm mt-1 bg-amber-100/60 p-1.5 rounded-lg border border-amber-300/40">
                      {item.note}
                    </p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-amber-900/20 flex justify-end">
                <button 
                  onClick={() => setShowMenu(false)}
                  className="px-5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-bold shadow-md transition"
                >
                  Close Menu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
