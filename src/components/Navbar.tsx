import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Gamepad2, 
  Heart, 
  Maximize2, 
  Compass, 
  Mail, 
  Sliders,
  BookOpen
} from 'lucide-react';
import type { SceneId } from '../types';
import { SCENES } from '../data/scenes';
import { soundEngine } from '../services/soundEngine';

interface NavbarProps {
  currentScene: SceneId;
  onOpenDestinations: () => void;
  onOpenGame: () => void;
  onOpenCareKit: () => void;
  onOpenLetter: () => void;
  onOpenStory?: () => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScene,
  onOpenDestinations,
  onOpenGame,
  onOpenCareKit,
  onOpenLetter,
  onOpenStory,
  isZenMode,
  onToggleZenMode
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [showSoundMixer, setShowSoundMixer] = useState(false);
  const [volume, setVolume] = useState(60);

  const activeSceneConfig = SCENES.find(s => s.id === currentScene) || SCENES[0];

  const handleMuteToggle = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    soundEngine.setMasterVolume(val / 100);
  };

  if (isZenMode) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={onToggleZenMode}
          className="bg-black/60 px-4 py-2 rounded-full text-xs text-white/80 hover:text-white border border-white/20 shadow-lg flex items-center gap-2 transition backdrop-blur-md cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          Exit Zen Mode
        </button>
      </div>
    );
  }

  return (
    <header className="relative z-40 w-full px-4 pt-4 pb-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        
        {/* Brand & Active Sanctuary Info */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2.5 bg-black/40 px-3.5 py-2 rounded-2xl border border-white/15 shadow-xl backdrop-blur-md">
            <span className="text-xl animate-float-slow">☁️</span>
            <div>
              <h1 className="text-xs sm:text-sm font-serif font-bold text-white tracking-wide">
                {activeSceneConfig.name}
              </h1>
              <p className="text-[10px] text-purple-300 font-mono leading-none">
                Lin's Sanctuary
              </p>
            </div>
          </div>

          <button
            onClick={onOpenLetter}
            className="bg-black/40 hover:bg-black/60 px-3 py-2 rounded-2xl border border-pink-400/30 hover:border-pink-400/60 text-pink-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-lg backdrop-blur-md cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">A Note for You</span>
          </button>

          {onOpenStory && (
            <button
              onClick={() => {
                soundEngine.playPop();
                onOpenStory();
              }}
              className="bg-black/40 hover:bg-black/60 px-3 py-2 rounded-2xl border border-amber-400/30 hover:border-amber-400/60 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-lg backdrop-blur-md cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Backstory Comic</span>
            </button>
          )}
        </div>

        {/* Center: Explore Another Sanctuary */}
        <div className="flex items-center">
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenDestinations();
            }}
            className="px-4 sm:px-5 py-2 rounded-2xl bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-amber-600/80 hover:from-purple-500 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-2 transition shadow-xl border border-white/30 backdrop-blur-md cursor-pointer hover:shadow-[0_0_25px_rgba(216,180,254,0.6)]"
          >
            <Compass className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>Explore Another Sanctuary 🧭</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Relaxation Arcade */}
          <button
            onClick={onOpenGame}
            title="Relaxation Arcade"
            className="bg-black/40 hover:bg-black/60 px-3 py-2 rounded-2xl border border-cyan-400/30 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-lg backdrop-blur-md cursor-pointer"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">Relaxation Arcade</span>
          </button>

          {/* Care Kit */}
          <button
            onClick={onOpenCareKit}
            title="Emergency Care Kit"
            className="bg-black/40 hover:bg-black/60 px-3 py-2 rounded-2xl border border-pink-400/30 text-pink-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-lg backdrop-blur-md cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400" />
            <span className="hidden sm:inline">Care Kit</span>
          </button>

          {/* Sound Controls */}
          <div className="relative flex items-center gap-1">
            <button
              onClick={handleMuteToggle}
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
              className={`p-2 rounded-2xl border transition shadow-lg backdrop-blur-md cursor-pointer ${
                isMuted
                  ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                  : 'bg-black/40 border-cyan-400/30 text-cyan-300'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setShowSoundMixer(prev => !prev)}
              title="Sound Mixer"
              className="bg-black/40 p-2 rounded-2xl border border-cyan-400/20 text-cyan-300 hover:text-white transition shadow-lg backdrop-blur-md cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
            </button>

            {showSoundMixer && (
              <div className="absolute top-full right-0 mt-2 p-3.5 w-48 bg-black/80 backdrop-blur-2xl rounded-2xl border border-cyan-400/30 shadow-2xl z-50 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-cyan-200">Volume</span>
                  <span className="font-mono text-cyan-300">{volume}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Zen Mode */}
          <button
            onClick={onToggleZenMode}
            title="Zen Mode (Hide UI)"
            className="bg-black/40 p-2 rounded-2xl border border-white/15 text-slate-300 hover:text-white transition shadow-lg backdrop-blur-md cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
