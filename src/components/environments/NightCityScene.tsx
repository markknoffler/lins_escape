import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Radio, Umbrella, Sparkles, Moon, Play, Pause } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../services/soundEngine';

export const NightCityScene: React.FC = () => {
  const [isPlayingLofi, setIsPlayingLofi] = useState(soundEngine.getLoFiPlaying());
  const [ramenOrders, setRamenOrders] = useState(0);
  const [showBlendModal, setShowBlendModal] = useState(false);
  const [umbrellaSpins, setUmbrellaSpins] = useState(0);

  const toggleMusic = () => {
    soundEngine.playPop();
    const playing = soundEngine.toggleLoFiMusic();
    setIsPlayingLofi(playing);
  };

  const handleOrderRamen = () => {
    soundEngine.playPour();
    setRamenOrders(prev => prev + 1);
    confetti({
      particleCount: 20,
      spread: 35,
      origin: { y: 0.6, x: 0.3 }
    });
  };

  const spinUmbrella = () => {
    soundEngine.playSplash();
    setUmbrellaSpins(prev => prev + 1);
    confetti({
      particleCount: 30,
      spread: 60,
      colors: ['#38bdf8', '#c084fc', '#f472b6'],
      origin: { y: 0.7, x: 0.7 }
    });
  };

  return (
    <div className="relative w-full min-h-[85vh] flex flex-col justify-between p-4 md:p-8 select-none text-white">
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="self-center glass-panel px-6 py-3 rounded-full flex items-center gap-3 text-pink-200 border border-pink-500/30 text-sm md:text-base shadow-lg z-20"
      >
        <Moon className="w-5 h-5 text-pink-400 animate-pulse" />
        <span className="font-medium">Midnight Neon Seoul — Quiet streets, warm ramyeon, and zero 2 AM evaluations.</span>
      </motion.div>

      {/* Main Interactive City Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full my-auto z-20">
        
        {/* Card 1: Late Night Ramyeon Stall */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-panel rounded-2xl p-5 border border-pink-400/20 backdrop-blur-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-pink-500/20 rounded-lg text-pink-300">
                <span className="text-lg">🍜</span>
              </div>
              <h3 className="font-semibold text-pink-100">Midnight Ramyeon</h3>
            </div>
            <span className="text-xs bg-pink-900/60 text-pink-300 px-2 py-1 rounded-full border border-pink-500/30">
              {ramenOrders} Bowls Enjoyed
            </span>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-pink-500/20 mb-3 text-xs text-pink-200/90 leading-relaxed font-handwritten text-base">
            <p className="text-white font-sans font-bold text-xs mb-1">Chef's Signature Recipe:</p>
            <p>"Disaster Ramen — Trust me, it tastes better than it looks." 😭🙏</p>
          </div>

          <button 
            onClick={handleOrderRamen}
            className="w-full py-2.5 px-4 rounded-xl bg-pink-600/40 hover:bg-pink-600/60 border border-pink-400/50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Order Steaming Midnight Noodles 🍜
          </button>
        </motion.div>

        {/* Card 2: Spotify Blend lo-fi Player Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-panel rounded-2xl p-5 border border-purple-400/30 backdrop-blur-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500/20 rounded-lg text-green-300">
                <Music className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-purple-100">Spotify Blend lo-fi</h3>
            </div>
            <span className="text-xs bg-green-900/60 text-green-300 px-2 py-1 rounded-full border border-green-500/30 font-bold">
              lo-fi Match 🎧
            </span>
          </div>

          <div className="bg-black/40 p-3 rounded-xl border border-white/10 mb-3 text-center">
            <p className="text-xs text-purple-200 font-medium">
              Generative Lo-Fi Rhodes Chords
            </p>
            <p className="text-[11px] text-slate-300 italic mt-0.5">
              {isPlayingLofi ? "Playing soothing ambient harmony 🎵" : "Muted • Click below to play"}
            </p>
          </div>

          <div className="space-y-2">
            <button 
              onClick={toggleMusic}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              {isPlayingLofi ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlayingLofi ? "Pause Chill Chords" : "Play Lo-Fi Ambient Harmonies"}
            </button>

            <button 
              onClick={() => {
                soundEngine.playChime();
                setShowBlendModal(true);
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition"
            >
              <Radio className="w-3.5 h-3.5 text-green-400" />
              View Blend Analysis Card
            </button>
          </div>
        </motion.div>

        {/* Card 3: Transparent Umbrella Rain Spinner */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="glass-panel rounded-2xl p-5 border border-cyan-400/20 backdrop-blur-md flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-300">
                <Umbrella className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-cyan-100">Puddle Walk & Rain</h3>
            </div>
            <span className="text-xs bg-cyan-900/60 text-cyan-300 px-2 py-1 rounded-full border border-cyan-500/30">
              {umbrellaSpins} Rain Splashes
            </span>
          </div>

          <p className="text-xs text-cyan-200/80 mb-4 leading-relaxed">
            Walking through quiet glowing streets with a transparent umbrella under gentle rain.
          </p>

          <button 
            onClick={spinUmbrella}
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-400/40 text-cyan-100 text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            Spin Umbrella & Scatter Rain 🌧️
          </button>
        </motion.div>

      </div>

      {/* Spotify Blend Modal */}
      <AnimatePresence>
        {showBlendModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowBlendModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full glass-panel rounded-3xl p-6 border-2 border-green-400/60 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center text-4xl shadow-lg">
                🎧
              </div>

              <span className="text-[11px] font-mono font-bold bg-green-500/30 text-green-200 px-3 py-1 rounded-full border border-green-400/40">
                SPOTIFY BLEND COMPATIBILITY
              </span>

              <h2 className="text-3xl font-black text-white mt-2">
                lo-fi Match
              </h2>
              <p className="text-xs text-green-300 font-semibold mt-0.5">Lin + Samreedh</p>

              <div className="bg-black/40 p-4 rounded-2xl border border-green-500/20 my-4 text-left font-handwritten text-lg text-emerald-200 space-y-1.5">
                <p>“This is getting statistically suspicious.” 💀</p>
                <p className="text-xs font-sans text-slate-300 not-italic">
                  → Top Shared Genres: K-Drama Soundtracks, Lo-Fi Chill, Late-Night Bedroom Pop & Anti-Assignment Anthems.
                </p>
              </div>

              <button 
                onClick={() => setShowBlendModal(false)}
                className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-lg transition"
              >
                Close Blend Card
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
