import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, RotateCcw, Check, Coffee, Palette } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../services/soundEngine';

export const ZenLatteArtGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'etch' | 'cinnamon' | 'foam'>('etch');
  const [customerReview, setCustomerReview] = useState<string | null>(null);
  const isDrawing = useRef(false);

  // Initialize Latte Foam Cup
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ceramic Mug Rim
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = 160;

    // Dark espresso base with creamy crema gradient
    const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, r);
    grad.addColorStop(0, '#fef3c7'); // Creamy milk center
    grad.addColorStop(0.5, '#d97706'); // Warm caramel crema
    grad.addColorStop(0.85, '#78350f'); // Rich espresso
    grad.addColorStop(1, '#451a03'); // Dark rim

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Ceramic Cup Outer Shadow
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
    ctx.stroke();

    setCustomerReview(null);
  };

  useEffect(() => {
    initCanvas();
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const { x, y } = getCanvasCoords(e);
    draw(x, y);
  };

  const moveDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const { x, y } = getCanvasCoords(e);
    draw(x, y);
  };

  const stopDraw = () => {
    isDrawing.current = false;
  };

  const draw = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check inside circle
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const dist = Math.hypot(x - cx, y - cy);
    if (dist > 155) return;

    if (tool === 'etch') {
      // White velvety milk foam etching
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (tool === 'cinnamon') {
      // Warm dark cocoa/cinnamon dust
      ctx.fillStyle = '#5c2c16';
      for (let i = 0; i < 4; i++) {
        const ox = (Math.random() - 0.5) * 16;
        const oy = (Math.random() - 0.5) * 16;
        ctx.beginPath();
        ctx.arc(x + ox, y + oy, Math.random() * 2 + 1, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (tool === 'foam') {
      // Soft blending brush
      ctx.fillStyle = 'rgba(254, 243, 199, 0.4)';
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handleServeLatte = () => {
    soundEngine.playChime();
    confetti({ particleCount: 50, spread: 60 });
    const reviews = [
      "⭐⭐⭐⭐⭐ “Chef Lin’s 3-Star Michelin Latte! The cat foam is legendary.” — CLOY Regular",
      "⭐⭐⭐⭐⭐ “Pure comfort after a 3 AM jury! Best brew in the quadrant.” — Capt. Ri",
      "⭐⭐⭐⭐⭐ “100% Love, 0% Italian Approval. Absolutely delicious.” — Design Jury"
    ];
    setCustomerReview(reviews[Math.floor(Math.random() * reviews.length)]);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl py-2 select-none">
      
      {/* Interactive Tool Palette */}
      <div className="flex items-center gap-3 mb-4 bg-black/60 backdrop-blur-md px-5 py-2 rounded-2xl border border-white/15 text-xs">
        <button
          onClick={() => {
            soundEngine.playPop();
            setTool('etch');
          }}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
            tool === 'etch' ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Milk Etching Pen 🥛</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playPop();
            setTool('cinnamon');
          }}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
            tool === 'cinnamon' ? 'bg-amber-700 text-white shadow-lg' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>Cinnamon Dust 🤎</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playPop();
            setTool('foam');
          }}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
            tool === 'foam' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Soft Foam Blender ☁️</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playPop();
            initCanvas();
          }}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer ml-2"
          title="Clear Cup"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Latte Canvas Area */}
      <div className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black/40 flex items-center justify-center p-3">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          onMouseDown={startDraw}
          onMouseMove={moveDraw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={moveDraw}
          onTouchEnd={stopDraw}
          className="w-full h-full object-contain cursor-crosshair rounded-full shadow-inner"
        />

        {/* Customer Review Bubble */}
        {customerReview && (
          <div className="absolute inset-x-4 bottom-4 p-3.5 bg-black/85 backdrop-blur-xl rounded-2xl border border-amber-400/40 text-xs text-amber-200 text-center font-medium shadow-2xl animate-fade-in">
            {customerReview}
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleServeLatte}
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-serif font-bold text-sm shadow-xl flex items-center gap-2 transition border border-white/30 cursor-pointer"
        >
          <Check className="w-4 h-4 text-amber-300" />
          <span>Serve to Café Guest ✨</span>
        </button>
      </div>

      <p className="text-[11px] text-slate-400 mt-2 font-light">
        Click and drag to etch cute cat faces, hearts, or swirls into the warm espresso crema.
      </p>

    </div>
  );
};

export default ZenLatteArtGame;
