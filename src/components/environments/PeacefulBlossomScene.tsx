import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Wind, Sparkles, Sliders, Flower2 } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

export const PeacefulBlossomScene: React.FC = () => {
  const [activeFormula, setActiveFormula] = useState<'rose' | 'spiral' | 'lissajous' | 'fourier'>('rose');
  const [formulaParam, setFormulaParam] = useState(5);
  const [dandelionSeeds, setDandelionSeeds] = useState<{ id: number; x: number; y: number; vx: number; vy: number }[]>([]);

  const mathCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render Generative Math Art
  useEffect(() => {
    const canvas = mathCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.fillStyle = 'rgba(15, 12, 30, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxRadius = Math.min(cx, cy) * 0.75;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.lineWidth = 1.8;

      if (activeFormula === 'rose') {
        const k = formulaParam;
        ctx.beginPath();
        for (let theta = 0; theta < Math.PI * 4; theta += 0.02) {
          const r = maxRadius * Math.cos(k * theta + time * 0.5);
          const x = r * Math.cos(theta);
          const y = r * Math.sin(theta);
          if (theta === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsl(${(time * 40) % 360}, 85%, 70%)`;
        ctx.shadowColor = `hsl(${(time * 40) % 360}, 90%, 60%)`;
        ctx.shadowBlur = 12;
        ctx.stroke();

      } else if (activeFormula === 'spiral') {
        ctx.beginPath();
        for (let theta = 0; theta < Math.PI * 8; theta += 0.05) {
          const r = (theta / (Math.PI * 8)) * maxRadius;
          const x = r * Math.cos(theta + time);
          const y = r * Math.sin(theta + time);
          if (theta === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsl(${(time * 30 + 120) % 360}, 80%, 75%)`;
        ctx.shadowBlur = 10;
        ctx.stroke();

      } else if (activeFormula === 'lissajous') {
        const a = formulaParam;
        const b = formulaParam + 1;
        ctx.beginPath();
        for (let t = 0; t < Math.PI * 2; t += 0.02) {
          const x = maxRadius * Math.sin(a * t + time);
          const y = maxRadius * Math.sin(b * t);
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsl(${(time * 50 + 200) % 360}, 90%, 70%)`;
        ctx.shadowBlur = 15;
        ctx.stroke();

      } else if (activeFormula === 'fourier') {
        ctx.beginPath();
        for (let t = 0; t < Math.PI * 2; t += 0.02) {
          const r1 = maxRadius * 0.6;
          const r2 = maxRadius * 0.3 * Math.sin(formulaParam * t + time);
          const x = (r1 + r2) * Math.cos(t);
          const y = (r1 + r2) * Math.sin(t);
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsl(${(time * 60 + 280) % 360}, 95%, 75%)`;
        ctx.shadowBlur = 14;
        ctx.stroke();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeFormula, formulaParam]);

  const blowDandelion = () => {
    soundEngine.playPop();
    const newSeeds = Array.from({ length: 20 }).map((_, i) => ({
      id: Date.now() + i,
      x: 20 + Math.random() * 10,
      y: 60 + Math.random() * 10,
      vx: 1.5 + Math.random() * 2,
      vy: -0.5 - Math.random() * 1.5
    }));
    setDandelionSeeds(prev => [...prev, ...newSeeds]);

    setTimeout(() => {
      setDandelionSeeds(prev => prev.filter(s => !newSeeds.some(n => n.id === s.id)));
    }, 4000);
  };

  return (
    <div className="relative w-full min-h-[85vh] flex flex-col justify-between p-4 md:p-8 select-none text-white">
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="self-center glass-panel px-6 py-3 rounded-full flex items-center gap-3 text-purple-200 border border-purple-500/30 text-sm md:text-base shadow-lg z-20"
      >
        <Flower2 className="w-5 h-5 text-purple-400 animate-pulse" />
        <span className="font-medium">Ghibli Blossom Sanctuary — Math-based art studio & gentle wildflower breeze.</span>
      </motion.div>

      {/* Floating Dandelion Seeds Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {dandelionSeeds.map(seed => (
          <motion.div
            key={seed.id}
            initial={{ opacity: 1, x: 0, y: 0 }}
            animate={{ 
              opacity: [1, 1, 0],
              x: seed.vx * 300,
              y: seed.vy * 200,
              rotate: 360
            }}
            transition={{ duration: 4, ease: 'easeOut' }}
            style={{ left: `${seed.x}%`, top: `${seed.y}%` }}
            className="absolute text-xl text-white/90"
          >
            🌾
          </motion.div>
        ))}
      </div>

      {/* Main Interactive Meadow Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full my-auto z-20">
        
        {/* Card 1: Generative Math-Art Studio Easel */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="glass-panel rounded-2xl p-5 border border-purple-400/30 backdrop-blur-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/20 rounded-lg text-purple-300">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-purple-100">Math-Art Easel</h3>
            </div>
            <span className="text-xs bg-purple-900/60 text-purple-300 px-2 py-1 rounded-full border border-purple-500/30">
              Interactive 🎨
            </span>
          </div>

          {/* Math Art Canvas */}
          <div className="relative w-full h-44 rounded-xl overflow-hidden border border-purple-500/30 bg-slate-950 flex items-center justify-center my-2 shadow-inner">
            <canvas 
              ref={mathCanvasRef}
              width={320}
              height={180}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Formula Selectors */}
          <div className="space-y-2 mt-2">
            <div className="grid grid-cols-4 gap-1.5 text-[11px]">
              {(['rose', 'spiral', 'lissajous', 'fourier'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => {
                    soundEngine.playPop();
                    setActiveFormula(f);
                  }}
                  className={`py-1 rounded-lg font-medium capitalize transition ${
                    activeFormula === f 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-black/30 text-purple-200 hover:bg-white/10'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 bg-black/30 p-2 rounded-xl border border-white/10">
              <Sliders className="w-3.5 h-3.5 text-purple-300" />
              <input 
                type="range"
                min="2"
                max="12"
                value={formulaParam}
                onChange={(e) => setFormulaParam(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-purple-950 rounded-lg"
              />
              <span className="text-xs font-mono font-bold text-purple-300 w-6 text-right">
                {formulaParam}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Wildflower Meadow & Dandelion Breeze */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="glass-panel rounded-2xl p-5 border border-purple-400/30 backdrop-blur-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-300">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-emerald-100">Blowing Dandelions</h3>
            </div>
            <span className="text-xs bg-emerald-900/60 text-emerald-300 px-2 py-1 rounded-full border border-emerald-500/30">
              Studio Ghibli 🌸
            </span>
          </div>

          <div className="bg-black/40 p-4 rounded-xl border border-white/10 my-auto text-xs text-purple-200/90 leading-relaxed font-handwritten text-lg space-y-2">
            <p>"We talked about art and sketching before... so I built you a tiny studio where mathematical equations bloom into flowers."</p>
            <p className="text-xs font-sans text-slate-300 not-italic">
              Take a slow, deep breath. The grass is soft, the sun is warm, and there's no rush to be anywhere.
            </p>
          </div>

          <button 
            onClick={blowDandelion}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-purple-600 hover:from-emerald-700 hover:to-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Blow Dandelion Seeds into Breeze 🌾
          </button>
        </motion.div>

      </div>
    </div>
  );
};
