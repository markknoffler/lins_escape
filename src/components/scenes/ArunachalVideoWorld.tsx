import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../../services/soundEngine';
import { getAssetUrl } from '../../utils/assets';

export const ArunachalVideoWorld: React.FC = () => {
  const introVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasFinishedIntro, setHasFinishedIntro] = useState<boolean>(false);

  useEffect(() => {
    soundEngine.playAmbient('fire');
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

  // Live Campfire Sparks & Dancing Aurora Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    
    // Campfire embers rising
    const sparks: { x: number; y: number; size: number; speedY: number; speedX: number; opacity: number }[] = [];
    for (let i = 0; i < 35; i++) {
      sparks.push({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 120,
        y: canvas.height * 0.75 + Math.random() * 80,
        size: Math.random() * 2.5 + 1,
        speedY: Math.random() * 1.8 + 0.8,
        speedX: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.8 + 0.2,
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      // 1. Soft Emerald Aurora Wave
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5 + Math.sin(time * 0.5) * 100,
        canvas.height * 0.2,
        20,
        canvas.width * 0.5,
        canvas.height * 0.2,
        canvas.width * 0.6
      );
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
      gradient.addColorStop(0.5, 'rgba(5, 150, 105, 0.08)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.5);

      // 2. Rising Campfire Sparks
      sparks.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${s.opacity})`;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.fill();

        s.y -= s.speedY;
        s.x += s.speedX + Math.sin(time + s.y * 0.05) * 0.3;
        s.opacity -= 0.005;

        if (s.y < canvas.height * 0.25 || s.opacity <= 0) {
          s.y = canvas.height * 0.75 + Math.random() * 40;
          s.x = canvas.width * 0.5 + (Math.random() - 0.5) * 100;
          s.opacity = Math.random() * 0.8 + 0.2;
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
          src={getAssetUrl('/assets/videos/scene_3_arunachal_hd.mp4')}
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
            src={getAssetUrl('/assets/videos/scene_3_final_frame.jpg')}
            alt="Umrangso & Karbi Starlit Peak Living Scene"
            className="w-full h-full object-cover object-center opacity-100"
            style={{
              filter: 'contrast(103%) brightness(102%) saturate(104%)',
            }}
          />
        )}

        {/* Live Aurora & Campfire Sparks Canvas */}
        <canvas
          ref={canvasRef}
          width={1200}
          height={700}
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
        />

        {/* Warm Fireplace Hearth Flicker Glow */}
        <motion.div
          animate={{
            opacity: [0.15, 0.3, 0.18, 0.32, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-gradient-to-t from-amber-600/20 via-emerald-950/10 to-transparent pointer-events-none"
        />

        {/* Soft Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
      </motion.div>

      {/* Top Left Living Sanctuary Badge */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-xs shadow-xl">
        <span className="text-xl">🏔️</span>
        <div>
          <h3 className="font-serif font-bold text-white text-sm">
            Umrangso & Karbi Starlit Peak
          </h3>
          <p className="text-[10px] text-emerald-300 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-emerald-300">
              {hasFinishedIntro ? 'LIVE SANCTUARY' : 'PLAYING STORY'}
            </span>
            <span>• Campfire & Pine Mist Lake View</span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default ArunachalVideoWorld;
