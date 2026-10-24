import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Coffee, 
  Waves, 
  Mountain, 
  Moon, 
  Flower2, 
  Gamepad2, 
  Heart,
  BookOpen,
  RotateCcw,
  Mail
} from 'lucide-react';
import type { MoodType, SceneId } from '../types';
import { soundEngine } from '../services/soundEngine';
import { getAssetUrl } from '../utils/assets';

interface LandingHeroProps {
  onSelectMood: (mood: MoodType) => void;
  onEnterScene?: (sceneId: SceneId) => void;
  onOpenGame?: () => void;
  onOpenCareKit?: () => void;
  onOpenLetter?: () => void;
  onOpenStoryForScene: (sceneId: SceneId) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ 
  onSelectMood: _,
  onEnterScene,
  onOpenGame,
  onOpenCareKit,
  onOpenLetter,
  onOpenStoryForScene
}) => {
  // Step in the Journey: 1 = Welcome & Breath, 2 = Mood Check, 3 = Choose Destination
  const [journeyStep, setJourneyStep] = useState<1 | 2 | 3>(1);
  const [selectedMoodId, setSelectedMoodId] = useState<MoodType | null>(null);

  const moods = [
    {
      id: 'exhausted' as MoodType,
      emoji: '☕',
      label: 'Exhausted from Hospital & 8 AM Postings',
      desc: 'Ward rounds and clinical lectures took everything. Need warm chai, quiet rain & cozy hearth.',
      recommendedScene: 'cafe' as SceneId,
      glowColor: 'hover:shadow-[0_0_35px_rgba(245,158,11,0.55)] border-amber-500/40 hover:border-amber-400',
      gradient: 'from-amber-950/40 via-stone-900/40 to-black/60',
      accent: 'text-amber-300'
    },
    {
      id: 'sad' as MoodType,
      emoji: '🌊',
      label: 'Hostel Loneliness & Overthinking',
      desc: 'Room is quiet, evening nap wore off. Need gentle ocean waves, origami worry boats & fresh sea breeze.',
      recommendedScene: 'beach' as SceneId,
      glowColor: 'hover:shadow-[0_0_35px_rgba(249,115,22,0.55)] border-orange-500/40 hover:border-orange-400',
      gradient: 'from-orange-950/40 via-stone-900/40 to-black/60',
      accent: 'text-orange-300'
    },
    {
      id: 'overthinking' as MoodType,
      emoji: '🌲',
      label: 'Homesick for Karbi Hills & Umrangso',
      desc: 'Missing the pine hills, turquoise lake waters, and crackling starlit campfires.',
      recommendedScene: 'mountains' as SceneId,
      glowColor: 'hover:shadow-[0_0_35px_rgba(16,185,129,0.55)] border-emerald-500/40 hover:border-emerald-400',
      gradient: 'from-emerald-950/40 via-stone-900/40 to-black/60',
      accent: 'text-emerald-300'
    },
    {
      id: 'meh' as MoodType,
      emoji: '🥟',
      label: 'Post-Hospital Hunger & Hyperactive Brain',
      desc: 'Tired of mess food & curfews. Craving hot chole bhature, 50₹ momos, lo-fi beats & soft covers.',
      recommendedScene: 'night_city' as SceneId,
      glowColor: 'hover:shadow-[0_0_35px_rgba(236,72,153,0.55)] border-pink-500/40 hover:border-pink-400',
      gradient: 'from-pink-950/40 via-stone-900/40 to-black/60',
      accent: 'text-pink-300'
    },
    {
      id: 'peace' as MoodType,
      emoji: '🌸',
      label: 'Pure Creative Soul (Singing & Crocheting)',
      desc: 'Want to sing an 11/10 acoustic cover just for yourself, weave Spider-Man yarn, or doodle with zero pressure.',
      recommendedScene: 'blossom_meadow' as SceneId,
      glowColor: 'hover:shadow-[0_0_35px_rgba(168,85,247,0.55)] border-purple-500/40 hover:border-purple-400',
      gradient: 'from-purple-950/40 via-stone-900/40 to-black/60',
      accent: 'text-purple-300'
    }
  ];

  // Exactly 5 Destination Worlds
  const destinationWorlds = [
    {
      id: 'cafe' as SceneId,
      name: 'Cozy CLOY & Goblin Café',
      tagline: 'Warm hearth, cat latte art & rainy window',
      image: getAssetUrl('/assets/scenes/scenary_2.png'),
      icon: <Coffee className="w-5 h-5 text-amber-300" />,
      tag: 'K-DRAMA SANCTUARY',
      glow: 'hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] border-amber-500/40 hover:border-amber-300'
    },
    {
      id: 'beach' as SceneId,
      name: 'Sunset Ocean Shore',
      tagline: 'Origami boat worries & golden ocean tide',
      image: getAssetUrl('/assets/scenes/scenary_3.png'),
      icon: <Waves className="w-5 h-5 text-orange-300" />,
      tag: 'SERENE GETAWAY',
      glow: 'hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] border-orange-500/40 hover:border-orange-300'
    },
    {
      id: 'mountains' as SceneId,
      name: 'Umrangso & Karbi Starlit Peak',
      tagline: 'Campfire embers, pine breeze & turquoise lake view',
      image: getAssetUrl('/assets/scenes/scenary_4.png'),
      icon: <Mountain className="w-5 h-5 text-emerald-300" />,
      tag: 'HOME ROOTS',
      glow: 'hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] border-emerald-500/40 hover:border-emerald-300'
    },
    {
      id: 'night_city' as SceneId,
      name: 'Midnight Neon Seoul',
      tagline: 'Rain-slicked streets, lo-fi beats & steaming momos',
      image: getAssetUrl('/assets/scenes/scenary_5.png'),
      icon: <Moon className="w-5 h-5 text-pink-300" />,
      tag: 'LO-FI NOOK',
      glow: 'hover:shadow-[0_0_40px_rgba(236,72,153,0.6)] border-pink-500/40 hover:border-pink-300'
    },
    {
      id: 'blossom_meadow' as SceneId,
      name: 'Blossom Melody & Crochet Meadow',
      tagline: 'Swirling petals, acoustic guitar & colorful crochet yarn',
      image: getAssetUrl('/assets/scenes/scenary_6.png'),
      icon: <Flower2 className="w-5 h-5 text-purple-300" />,
      tag: 'CREATIVE SANCTUARY',
      glow: 'hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] border-purple-500/40 hover:border-purple-300'
    }
  ];

  const handleMoodSelect = (mood: typeof moods[0]) => {
    soundEngine.playChime();
    setSelectedMoodId(mood.id);
    setJourneyStep(3);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between p-4 sm:p-8 select-none text-white overflow-x-hidden font-sans">
      
      {/* 1. Fixed Cozy Café Background (Crystal-Clear Visibility) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={getAssetUrl('/assets/scenes/scenary_2.png')}
          alt="Cozy Café Scenery Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Very subtle tint allowing the warm café colors to shine through brightly */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />
      </div>

      {/* Elegant Header Navigation */}
      <header className="relative z-20 max-w-6xl mx-auto w-full flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-md">
          <span className="text-2xl animate-float-slow">☁️</span>
          <div>
            <h2 className="text-sm sm:text-base font-serif font-bold text-white tracking-wide">
              Lin's Sanctuary
            </h2>
            <p className="text-[10px] text-purple-200 font-mono">
              A Quiet Place for Talinbon
            </p>
          </div>
        </div>


        {/* Quick Action Floating Pills */}
        <div className="flex items-center gap-2.5">
          {onOpenLetter && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenLetter}
              className="bg-black/45 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-amber-400/40 hover:border-amber-300 text-amber-200 text-xs font-bold flex items-center gap-1.5 transition shadow-lg hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] cursor-pointer"
            >
              <Mail className="w-4 h-4 text-amber-300" />
              <span>A Note for You</span>
            </motion.button>
          )}

          {onOpenGame && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenGame}
              className="bg-black/45 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-purple-400/40 hover:border-purple-300 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition shadow-lg hover:shadow-[0_0_25px_rgba(192,132,252,0.6)] cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-purple-300" />
              <span className="hidden sm:inline">Relaxation Arcade</span>
            </motion.button>
          )}

          {onOpenCareKit && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenCareKit}
              className="bg-black/45 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-pink-400/40 hover:border-pink-300 text-pink-200 text-xs font-bold flex items-center gap-1.5 transition shadow-lg hover:shadow-[0_0_25px_rgba(244,114,182,0.6)] cursor-pointer"
            >
              <Heart className="w-4 h-4 text-pink-300 fill-pink-300" />
              <span>Care Kit</span>
            </motion.button>
          )}
        </div>
      </header>

      {/* Main Journey Step Container */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto py-8">
        
        <AnimatePresence mode="wait">
          
          {/* ========================================================================= */}
          {/* JOURNEY STEP 1: WELCOME & THE DEEP BREATH */}
          {/* ========================================================================= */}
          {journeyStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.55 }}
              className="flex flex-col items-center text-center max-w-3xl mx-auto"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-black/40 border border-white/20 text-amber-200 text-xs md:text-sm font-medium mb-6 backdrop-blur-md shadow-2xl"
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Permanent Exemption • No Hospital Ward Calls • Zero Alarms</span>
              </motion.div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-rose-100 to-purple-200 tracking-tight leading-snug sm:leading-tight pb-2 sm:pb-3 px-2 drop-shadow-lg overflow-visible">
                You have survived another long, exhausting day.
              </h1>

              <p className="text-sm sm:text-lg md:text-xl text-slate-200/95 font-light leading-relaxed mb-4 max-w-xl sm:max-w-2xl px-3 drop-shadow-md">
                Take a slow, deep breath. Put down the medical notes. For the next few minutes, leave DMCH postings, blood transfusion duties, and hostel curfews behind.
              </p>

              <p className="font-handwritten text-xl sm:text-2xl text-purple-300 mb-8 sm:mb-10 px-3 py-1 leading-normal overflow-visible">
                “Remember October 13? I promised I'd make something special for you using my skills. Here it is.” ✨
              </p>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  soundEngine.playChime();
                  setJourneyStep(2);
                }}
                className="px-10 py-4 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-serif font-bold text-base md:text-lg shadow-2xl flex items-center gap-3 transition border border-white/30 hover:shadow-[0_0_40px_rgba(216,180,254,0.7)] cursor-pointer"
              >
                <span>Begin Your Escape</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* JOURNEY STEP 2: THE HEART & MOOD CHECK-IN */}
          {/* ========================================================================= */}
          {journeyStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.55 }}
              className="flex flex-col items-center text-center w-full"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold mb-2 px-3 py-1 bg-black/50 rounded-full border border-white/15">
                — Step 2: The Heart Check-In —
              </span>

              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-3">
                How is your heart feeling tonight?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mb-8 font-light">
                Hover and choose the mood that fits you right now. We'll open the perfect sanctuary for you.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
                {moods.map((m) => (
                  <motion.button
                    key={m.id}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleMoodSelect(m)}
                    className={`p-5 rounded-3xl bg-gradient-to-br ${m.gradient} border ${m.glowColor} backdrop-blur-md text-left flex flex-col justify-between transition-all duration-300 shadow-xl cursor-pointer group min-h-[140px]`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl group-hover:scale-125 transition-transform duration-300">
                        {m.emoji}
                      </span>
                      <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition-all group-hover:translate-x-1" />
                    </div>

                    <div>
                      <h3 className={`text-sm sm:text-base font-bold ${m.accent} group-hover:text-white transition`}>
                        {m.label}
                      </h3>
                      <p className="text-xs text-slate-300/90 mt-1 font-light leading-relaxed line-clamp-2">
                        {m.desc}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={() => {
                  soundEngine.playPop();
                  setJourneyStep(1);
                }}
                className="mt-8 text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Back to Welcome</span>
              </button>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* JOURNEY STEP 3: SANCTUARY DESTINATIONS (5 WORLDS) */}
          {/* ========================================================================= */}
          {journeyStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
              transition={{ duration: 0.55 }}
              className="flex flex-col items-center text-center w-full"
            >
              <div className="flex items-center justify-between w-full max-w-5xl mb-6 px-2">
                <div className="text-left">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold px-3 py-1 bg-black/50 rounded-full border border-white/15">
                    — Step 3: Choose Your Escape —
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                    Where would you like to wander, Lin?
                  </h2>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playPop();
                    setJourneyStep(2);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-semibold flex items-center gap-1 transition border border-white/10 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Change Mood</span>
                </button>
              </div>

              {/* 5 Destination World Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-5xl">
                {destinationWorlds.map((world) => {
                  const isRecommended = selectedMoodId && moods.find(m => m.id === selectedMoodId)?.recommendedScene === world.id;

                  return (
                    <motion.div
                      key={world.id}
                      whileHover={{ scale: 1.04, y: -6 }}
                      className={`relative rounded-3xl overflow-hidden bg-black/40 backdrop-blur-md border ${world.glow} shadow-2xl transition-all duration-300 text-left flex flex-col justify-between group h-[300px]`}
                    >
                      {/* High-Res Scenery Background */}
                      <div className="absolute inset-0 -z-10 overflow-hidden">
                        <img
                          src={world.image}
                          alt={world.name}
                          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30" />
                      </div>

                      {/* Card Top Pill */}
                      <div className="p-4 flex items-center justify-between relative z-10">
                        <div className="p-2 bg-black/60 rounded-xl border border-white/20 shadow-lg">
                          {world.icon}
                        </div>

                        {isRecommended ? (
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 bg-amber-500 text-black rounded-full shadow-lg animate-pulse">
                            ✨ MATCHES YOUR MOOD
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 bg-black/60 text-purple-200 rounded-full border border-white/10">
                            {world.tag}
                          </span>
                        )}
                      </div>

                      {/* Card Bottom Content & Story-First Action Button */}
                      <div className="p-5 relative z-10">
                        <h3 className="text-base sm:text-lg font-serif font-bold text-white group-hover:text-amber-200 transition">
                          {world.name}
                        </h3>
                        <p className="text-xs text-slate-200/90 mt-1 mb-4 font-light line-clamp-2">
                          {world.tagline}
                        </p>

                        <button
                          onClick={() => {
                            soundEngine.playPop();
                            onOpenStoryForScene(world.id);
                          }}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xl border border-white/30 cursor-pointer hover:shadow-[0_0_25px_rgba(216,180,254,0.6)]"
                        >
                          <BookOpen className="w-4 h-4 text-amber-300" />
                          <span>Read Pre-Story & Enter ✨</span>
                        </button>

                        <button
                          onClick={() => {
                            soundEngine.playChime();
                            if (onEnterScene) onEnterScene(world.id);
                          }}
                          className="w-full mt-2 py-1 text-[11px] text-white/50 hover:text-white/90 text-center transition cursor-pointer"
                        >
                          or step inside directly ➔
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Simple, Non-Intrusive Footer */}
      <footer className="relative z-20 text-center text-xs text-slate-400 font-light select-none pt-4">
        <span>A quiet sanctuary made for </span>
        <span className="font-semibold text-purple-300">Lin</span>
        <span> • Take all the time you need ☁️</span>
      </footer>

    </div>
  );
};

export default LandingHero;
