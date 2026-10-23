import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../../services/soundEngine';
import { getAssetUrl } from '../../utils/assets';

export const GhibliBlossomVideoWorld: React.FC = () => {
  const introVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasFinishedIntro, setHasFinishedIntro] = useState<boolean>(false);

  useEffect(() => {
    soundEngine.playAmbient('wind');
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

  // Live Swirling Pink Cherry Blossom Petals Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const petals: { x: number; y: number; size: number; speedX: number; speedY: number; rotation: number; rotSpeed: number; opacity: number }[] = [];

    for (let i = 0; i < 40; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 5,
        speedX: Math.random() * 1.6 + 0.8,
        speedY: Math.random() * 1.2 + 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        opacity: Math.random() * 0.6 + 0.3,
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      petals.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.beginPath();
        // Delicate pink petal shape
        ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 114, 182, ${p.opacity})`;
        ctx.shadowColor = '#f472b6';
        ctx.shadowBlur = 4;
        ctx.fill();

        ctx.restore();

        p.x += p.speedX + Math.sin(time + p.y * 0.02) * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (p.x > canvas.width + 20) {
          p.x = -20;
          p.y = Math.random() * canvas.height;
        }
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
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
          src={getAssetUrl('/assets/videos/scene_5_ghibli_hd.mp4')}
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
            src={getAssetUrl('/assets/videos/scene_5_final_frame.jpg')}
            alt="Ghibli Blossom Meadow Living Scene"
            className="w-full h-full object-cover object-center opacity-100"
            style={{
              filter: 'contrast(103%) brightness(102%) saturate(104%)',
            }}
          />
        )}

        {/* Live Swirling Petals Canvas */}
        <canvas
          ref={canvasRef}
          width={1200}
          height={700}
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
        />

        {/* Soft Golden Sunbeam Glow */}
        <motion.div
          animate={{
            opacity: [0.1, 0.22, 0.12, 0.24, 0.1],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-gradient-to-tr from-amber-400/15 via-transparent to-purple-500/10 pointer-events-none"
        />

        {/* Soft Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
      </motion.div>

      {/* Top Left Living Sanctuary Badge */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-xs shadow-xl">
        <span className="text-xl">🌸</span>
        <div>
          <h3 className="font-serif font-bold text-white text-sm">
            Ghibli Blossom Meadow
          </h3>
          <p className="text-[10px] text-purple-300 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-emerald-300">
              {hasFinishedIntro ? 'LIVE SANCTUARY' : 'PLAYING STORY'}
            </span>
            <span>• Math-Art Flower Garden</span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default GhibliBlossomVideoWorld;
