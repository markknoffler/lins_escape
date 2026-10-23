import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { soundEngine } from '../../services/soundEngine';
import { getAssetUrl } from '../../utils/assets';

export const SunsetBeachVideoWorld: React.FC = () => {
  const introVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasFinishedIntro, setHasFinishedIntro] = useState<boolean>(false);

  useEffect(() => {
    soundEngine.playAmbient('waves');
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

  // Live Golden Ocean Wave Foam Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.025;

      // Draw undulating gentle wave foam lines on the lower water area
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const yOffset = canvas.height * 0.72 + i * 40 + Math.sin(time + i) * 15;
        ctx.moveTo(0, yOffset);

        for (let x = 0; x <= canvas.width; x += 30) {
          const waveY = yOffset + Math.sin(x * 0.008 + time + i * 1.5) * 8;
          ctx.lineTo(x, waveY);
        }

        ctx.strokeStyle = `rgba(254, 243, 199, ${0.25 - i * 0.06})`;
        ctx.lineWidth = 2.5 - i * 0.5;
        ctx.shadowColor = '#fde68a';
        ctx.shadowBlur = 10;
        ctx.stroke();
      }

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
          src={getAssetUrl('/assets/videos/scene_2_beach_hd.mp4')}
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
            src={getAssetUrl('/assets/videos/scene_2_final_frame.jpg')}
            alt="Sunset Ocean Shore Living Scene"
            className="w-full h-full object-cover object-center opacity-100"
            style={{
              filter: 'contrast(103%) brightness(102%) saturate(104%)',
            }}
          />
        )}

        {/* Live Golden Wave Foam Canvas */}
        <canvas
          ref={canvasRef}
          width={1200}
          height={700}
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
        />

        {/* Golden Hour Sun Shimmer Glow */}
        <motion.div
          animate={{
            opacity: [0.12, 0.25, 0.15, 0.28, 0.12],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-gradient-to-tr from-amber-500/18 via-orange-500/10 to-transparent pointer-events-none"
        />

        {/* Soft Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
      </motion.div>

      {/* Top Left Living Sanctuary Badge */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-xs shadow-xl">
        <span className="text-xl">🌊</span>
        <div>
          <h3 className="font-serif font-bold text-white text-sm">
            Sunset Ocean Shore
          </h3>
          <p className="text-[10px] text-orange-300 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-emerald-300">
              {hasFinishedIntro ? 'LIVE SANCTUARY' : 'PLAYING STORY'}
            </span>
            <span>• Ocean Shoreline & Origami Tides</span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default SunsetBeachVideoWorld;
