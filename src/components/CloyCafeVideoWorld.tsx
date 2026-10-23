import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { getAssetUrl } from '../utils/assets';

export const CloyCafeVideoWorld: React.FC = () => {
  const introVideoRef = useRef<HTMLVideoElement | null>(null);
  const petVideoRef = useRef<HTMLVideoElement | null>(null);
  const rainCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasFinishedIntro, setHasFinishedIntro] = useState<boolean>(false);
  const [isPlayingPet, setIsPlayingPet] = useState<boolean>(false);
  const [hudNotice, setHudNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setHudNotice(msg);
    setTimeout(() => setHudNotice(null), 3500);
  };

  // On entering the environment, play ambient sound and start video from beginning
  useEffect(() => {
    soundEngine.playAmbient('cafe');
    setHasFinishedIntro(false);

    if (introVideoRef.current) {
      introVideoRef.current.currentTime = 0;
      introVideoRef.current.play().catch(() => {});
    }
  }, []);

  // When intro video completes, hold on the final live scene
  const handleIntroEnded = () => {
    setHasFinishedIntro(true);
  };

  const handleIntroTimeUpdate = () => {
    if (!introVideoRef.current) return;
    const dur = introVideoRef.current.duration;
    const curr = introVideoRef.current.currentTime;

    // Transition smoothly to final scene when approaching end (last 0.4s)
    if (dur > 0 && curr >= dur - 0.4) {
      setHasFinishedIntro(true);
      introVideoRef.current.pause();
    }
  };

  // Live Continuous Raindrop Streams Canvas on the Window Glass
  useEffect(() => {
    const canvas = rainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rainAnimId: number;
    const drops: { x: number; y: number; length: number; speed: number; opacity: number }[] = [];

    for (let i = 0; i < 45; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 24 + 12,
        speed: Math.random() * 2.6 + 1.8,
        opacity: Math.random() * 0.35 + 0.15,
      });
    }

    const renderRain = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1.2;

      drops.forEach((d) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(220, 235, 255, ${d.opacity})`;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        d.x -= 0.15;
        if (d.y > canvas.height) {
          d.y = -20;
          d.x = Math.random() * canvas.width;
        }
      });

      rainAnimId = requestAnimationFrame(renderRain);
    };

    rainAnimId = requestAnimationFrame(renderRain);
    return () => cancelAnimationFrame(rainAnimId);
  }, []);

  // 2s Backplay + 2s Forward Play Petting Action (Zero Stutter, 4K Quality)
  const handlePetCat = () => {
    if (isPlayingPet) return;
    setIsPlayingPet(true);
    soundEngine.playPurr();
    showNotification("🐱 The cat gently leaned into Lin's hand with a soft purr.");

    if (petVideoRef.current) {
      petVideoRef.current.currentTime = 0;
      petVideoRef.current.play().catch(() => {});
    }

    // Petting video is 4.0s (2s backward + 2s forward)
    setTimeout(() => {
      setIsPlayingPet(false);
      if (petVideoRef.current) {
        petVideoRef.current.pause();
      }
    }, 4050);
  };

  return (
    <div className="relative w-full h-[88vh] select-none overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-black flex items-center justify-center">
      
      {/* Visual Scene Container */}
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
        
        {/* 1. Full Intro Video (Restarts from 0s every time environment is entered) */}
        <video
          ref={introVideoRef}
          src={getAssetUrl('/assets/videos/cloy_cafe_hd.mp4')}
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

        {/* 2. Base Ultra-HD 4K Final Scene Frame (Shown after intro finishes) */}
        {hasFinishedIntro && (
          <img
            src={getAssetUrl('/assets/videos/cloy_final_scene_max.jpg')}
            alt="Cozy CLOY Cafe Living Final Scene"
            className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
              isPlayingPet ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              filter: 'contrast(103%) brightness(102%) saturate(104%)',
            }}
          />
        )}

        {/* 3. 4K 2s Reverse + 2s Forward Petting Video (Active during petting) */}
        <video
          ref={petVideoRef}
          src={getAssetUrl('/assets/videos/pet_reverse_forward_hd.mp4')}
          playsInline
          muted
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-200 ${
            isPlayingPet ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            filter: 'contrast(103%) brightness(102%) saturate(104%)',
          }}
        />

        {/* Live Rain Streams Canvas Layer on the Window Glass */}
        <canvas
          ref={rainCanvasRef}
          width={1200}
          height={700}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-60 mix-blend-screen"
        />

        {/* Living Warm Hearth & Lantern Flicker Glow */}
        <motion.div
          animate={{
            opacity: [0.12, 0.24, 0.15, 0.26, 0.12],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 bg-gradient-to-tr from-amber-500/18 via-transparent to-transparent pointer-events-none"
        />

        {/* Floating Coffee Steam Effect */}
        <div className="absolute bottom-[28%] left-[45%] pointer-events-none">
          <motion.div
            animate={{
              y: [0, -30, -65],
              opacity: [0, 0.4, 0],
              scale: [0.6, 1.2, 1.7],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="w-7 h-7 rounded-full bg-white/20 blur-md"
          />
        </div>

        {/* Soft Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
      </motion.div>

      {/* HUD Notification Banner */}
      <AnimatePresence>
        {hudNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-6 py-2.5 rounded-full bg-black/80 border border-amber-400/50 text-amber-200 text-xs md:text-sm font-medium shadow-2xl backdrop-blur-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{hudNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Left Living Sanctuary Badge */}
      <div className="absolute top-4 left-6 z-20 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-xs shadow-xl">
        <span className="text-xl">☕</span>
        <div>
          <h3 className="font-serif font-bold text-white text-sm">
            Cozy CLOY Café
          </h3>
          <p className="text-[10px] text-amber-300 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-emerald-300">
              {hasFinishedIntro ? 'LIVE SANCTUARY' : 'PLAYING STORY'}
            </span>
            <span>• Rainy Window Sanctuary</span>
          </p>
        </div>
      </div>

      {/* Bottom Floating Minimalist Companion Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg px-4">
        <div className="bg-black/75 p-3.5 sm:p-4 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3">
          
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-serif font-bold text-amber-200 flex items-center gap-1.5">
              <span>Windowsill Companion</span>
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 animate-pulse" />
            </span>
            <span className="text-[11px] text-slate-300 font-light">
              Resting quietly with you by the rainy glass
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
            onClick={handlePetCat}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-serif font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 transition border border-white/30 cursor-pointer hover:shadow-[0_0_30px_rgba(245,158,11,0.7)]"
          >
            <span>Pet Sleeping Cat 🐱</span>
          </motion.button>

        </div>
      </div>

    </div>
  );
};

export default CloyCafeVideoWorld;
