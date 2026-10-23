import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../../services/soundEngine';
import { getAssetUrl } from '../../utils/assets';

export const MidnightSeoulVideoWorld: React.FC = () => {
  const introVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasFinishedIntro, setHasFinishedIntro] = useState<boolean>(false);

  useEffect(() => {
    soundEngine.playAmbient('city');
    setHasFinishedIntro(false);

    if (introVideoRef.current) {
      introVideoRef.current.currentTime = 0;
      introVideoRef.current.play().catch(() => {});
    }
  }, []);

  const handleIntroEnded = () => {
    setHasFinishedIntro(true);
  };

  const handleIntroTimeUpdate = () => {
    if (!introVideoRef.current) return;
    const dur = introVideoRef.current.duration;
    const curr = introVideoRef.current.currentTime;

    if (dur > 0 && curr >= dur - 0.4) {
      setHasFinishedIntro(true);
      introVideoRef.current.pause();
    }
  };

  // Live Neon Rain Streaks & Puddle Bokeh Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const drops: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];

    for (let i = 0; i < 50; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 26 + 14,
        speed: Math.random() * 3.2 + 2.0,
        opacity: Math.random() * 0.4 + 0.15,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1.3;

      drops.forEach((d) => {
        ctx.beginPath();
        // Cyan-pink neon rain reflection tint
        ctx.strokeStyle = `rgba(244, 114, 182, ${d.opacity * 0.7})`;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        d.x -= 0.2;
        if (d.y > canvas.height) {
          d.y = -20;
          d.x = Math.random() * canvas.width;
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full h-[88vh] select-none overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-black flex items-center justify-center">
      
      <motion.div 
        animate={{
          scale: [1.0, 1.018, 1.0],
          y: [0, -3.5, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none"
      >
        {/* Full Intro Story Video */}
        <video
          ref={introVideoRef}
          src={getAssetUrl('/assets/videos/scene_4_seoul_hd.mp4')}
          autoPlay
          playsInline
          muted
          onEnded={handleIntroEnded}
          onTimeUpdate={handleIntroTimeUpdate}
          className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
            !hasFinishedIntro ? 'opacity-100' : 'opacity-0 absolute'
          }`}
          style={{
            filter: 'contrast(103%) brightness(102%) saturate(104%)',
          }}
        />

        {/* Base Ultra-HD Final Scene Frame */}
        {hasFinishedIntro && (
          <img
            src={getAssetUrl('/assets/videos/scene_4_final_frame.jpg')}
            alt="Midnight Neon Seoul Living Scene"
            className="w-full h-full object-cover object-center opacity-100"
            style={{
              filter: 'contrast(103%) brightness(102%) saturate(104%)',
            }}
          />
        )}

        {/* Live Neon Rain Canvas */}
        <canvas
          ref={canvasRef}
          width={1200}
          height={700}
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
        />

        {/* Neon Pink/Cyan Ambient Pulse */}
        <motion.div
          animate={{
            opacity: [0.12, 0.22, 0.14, 0.25, 0.12],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-gradient-to-tr from-pink-500/15 via-transparent to-cyan-500/15 pointer-events-none"
        />

        {/* Soft Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
      </motion.div>

      {/* Top Left Living Sanctuary Badge */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-xs shadow-xl">
        <span className="text-xl">🍜</span>
        <div>
          <h3 className="font-serif font-bold text-white text-sm">
            Midnight Neon Seoul
          </h3>
          <p className="text-[10px] text-pink-300 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-emerald-300">
              {hasFinishedIntro ? 'LIVE SANCTUARY' : 'PLAYING STORY'}
            </span>
            <span>• Rainy Lo-Fi Street</span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default MidnightSeoulVideoWorld;
