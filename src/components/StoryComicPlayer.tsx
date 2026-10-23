import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Plane, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { SceneId } from '../types';
import { soundEngine } from '../services/soundEngine';

interface StoryComicPlayerProps {
  onClose: () => void;
  onFinishStory: (destination: SceneId) => void;
}

export const StoryComicPlayer: React.FC<StoryComicPlayerProps> = ({ onClose, onFinishStory }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const storyFrames = [
    {
      id: 0,
      title: "ACT 1: The 2:30 AM Medico Fatigue",
      subtitle: "DMCH Hostel Room • Diphu",
      image: "/assets/landing_frame_3.jpg",
      badge: "THE REALITY",
      dialogue: [
        { speaker: "Narrator", text: "It is 2:30 AM. Back-to-back hospital postings and pharmacology notes have pushed sanity to the brink." },
        { speaker: "Lin", text: "“If I have to memorize one more clinical pathway or attend another 8:00 AM ward posting, I am going to escape to Umrangso forever.” 😭" },
        { speaker: "Hostel Clock", text: "⏰ *Hostel curfew has passed. Evening nap wore off. Brain is hyperactive.*" }
      ],
      action: "Hear the distant ticking clock..."
    },
    {
      id: 1,
      title: "ACT 2: The Whimsical Skyplane Arrives",
      subtitle: "Breaking through the hostel window mist",
      image: "/assets/landing_frame_2.jpg",
      badge: "THE ARRIVAL",
      dialogue: [
        { speaker: "Sound FX", text: "✨ *Gentle propeller hum & chime flutter in the cool night breeze...*" },
        { speaker: "The Skyplane", text: "A retro pastel-yellow propeller aeroplane swoops down from the lavender twilight clouds, landing softly outside the window." },
        { speaker: "Pilot", text: "“You have survived another exhausting day at the hospital. No ward rounds allowed where we’re going. Hop in.”" }
      ],
      action: "Lin steps onto the plane wing..."
    },
    {
      id: 2,
      title: "ACT 3: Takeoff Above the Clouds",
      subtitle: "Leaving evaluations & hospital duties far below",
      image: "/assets/landing_frame_1.jpg",
      badge: "THE ESCAPE",
      dialogue: [
        { speaker: "Lin", text: "“Wait, what about tomorrow's 8:00 AM clinical round?”" },
        { speaker: "Pilot", text: "“Officially canceled by order of the Universe. Put on your headphones and play your acoustic playlist.”" },
        { speaker: "Narrator", text: "The skyplane lifts smoothly into the golden clouds. Below, all textbooks and clinical ward sheets shrink into tiny specks." }
      ],
      action: "Cruising into the sunset..."
    },
    {
      id: 3,
      title: "ACT 4: Where do you want to escape to?",
      subtitle: "Choose your destination in the sky",
      image: "/assets/sunset_beach.jpg",
      badge: "THE CHOICE",
      dialogue: [
        { speaker: "Pilot", text: "“The world is completely open, Lin. Pick anywhere you want to land:”" }
      ],
      isChoice: true
    }
  ];

  const destinations: { id: SceneId; name: string; icon: string; desc: string; color: string }[] = [
    { id: 'cafe', name: '☕ CLOY & Goblin Café', icon: '🐱', desc: 'Rainy window, cat latte art & hot chai', color: 'from-amber-600/40 to-orange-700/40 border-amber-500/40' },
    { id: 'beach', name: '🌊 Sunset Ocean Shore', icon: '⛵', desc: 'Origami boat worries & calm waves', color: 'from-orange-600/40 to-rose-700/40 border-orange-500/40' },
    { id: 'mountains', name: '🌲 Umrangso Peak', icon: '⛰️', desc: 'Pine breeze, starlit lake & campfire', color: 'from-emerald-600/40 to-teal-700/40 border-emerald-500/40' },
    { id: 'night_city', name: '🌃 Neon Seoul', icon: '🥟', desc: 'Rain walk, soft indie covers & 50₹ momos', color: 'from-pink-600/40 to-purple-700/40 border-pink-500/40' },
    { id: 'blossom_meadow', name: '🌸 Blossom Melody', icon: '🧶', desc: 'Swirling petals, acoustic guitar & crochet yarn', color: 'from-purple-600/40 to-indigo-700/40 border-purple-500/40' }
  ];

  const handleNext = () => {
    soundEngine.playPop();
    if (currentStep < storyFrames.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    soundEngine.playPop();
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSelectDestination = (dest: SceneId) => {
    soundEngine.playChime();
    confetti({ particleCount: 70, spread: 80 });
    onFinishStory(dest);
  };

  const frame = storyFrames[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl select-none"
    >
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-white/20 p-5 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Story Header */}
        <div className="flex items-center justify-between mb-4 pr-12">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-amber-500 rounded-xl shadow-md">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold px-2.5 py-0.5 bg-black/40 rounded-full border border-white/10">
                {frame.badge}
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                {frame.title}
              </h3>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5 hidden sm:flex">
            {storyFrames.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep ? 'w-6 bg-purple-500 shadow-md' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Story Illustration Box */}
        <div className="relative w-full h-[220px] sm:h-[300px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl mb-4 bg-black/60">
          <AnimatePresence mode="wait">
            <motion.img
              key={frame.id}
              src={frame.image}
              alt={frame.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full h-full object-cover object-center"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <p className="absolute bottom-3 left-4 text-xs font-mono text-purple-200">
            {frame.subtitle}
          </p>
        </div>

        {/* Story Dialogue Box or Choice Screen */}
        <div className="flex-1 overflow-y-auto mb-4">
          {!frame.isChoice ? (
            <div className="flex flex-col gap-2.5 bg-black/40 p-4 rounded-2xl border border-white/10">
              {frame.dialogue?.map((d, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className="flex items-start gap-2.5 text-xs sm:text-sm"
                >
                  <span className="font-bold text-amber-300 min-w-[70px] text-right font-mono text-[11px] sm:text-xs">
                    {d.speaker}:
                  </span>
                  <span className="text-slate-200 leading-relaxed font-light">
                    {d.text}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {destinations.map((dest) => (
                <motion.button
                  key={dest.id}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelectDestination(dest.id)}
                  className={`p-3.5 rounded-2xl bg-gradient-to-br ${dest.color} border text-left flex flex-col justify-between transition shadow-lg group`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{dest.icon}</span>
                    <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white transition group-hover:translate-x-1" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-200">
                    {dest.name}
                  </h4>
                  <p className="text-[10px] text-slate-200/80 mt-0.5 line-clamp-2 leading-tight">
                    {dest.desc}
                  </p>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Story Controls */}
        {!frame.isChoice && (
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                currentStep === 0 ? 'opacity-30 cursor-not-allowed text-slate-500' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Scene
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 transition active:scale-95"
            >
              <span>Continue Story</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </motion.div>
  );
};
