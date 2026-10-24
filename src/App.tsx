import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { SceneId, MoodType } from './types';
import { SCENES } from './data/scenes';
import { soundEngine } from './services/soundEngine';

import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';

import { getAssetUrl } from './utils/assets';

import { CloyCafeVideoWorld } from './components/CloyCafeVideoWorld';
import { SunsetBeachVideoWorld } from './components/scenes/SunsetBeachVideoWorld';
import { ArunachalVideoWorld } from './components/scenes/ArunachalVideoWorld';
import { MidnightSeoulVideoWorld } from './components/scenes/MidnightSeoulVideoWorld';
import { GhibliBlossomVideoWorld } from './components/scenes/GhibliBlossomVideoWorld';

import { MiniGame } from './components/MiniGame';
import { CareKitModal } from './components/modals/CareKitModal';
import { LetterModal } from './components/modals/LetterModal';
import { ScrollStoryModal } from './components/ScrollStoryModal';

export const App: React.FC = () => {
  const [isLanding, setIsLanding] = useState(true);
  const [currentSceneId, setCurrentSceneId] = useState<SceneId>('cafe');
  const [showGame, setShowGame] = useState(false);
  const [showCareKit, setShowCareKit] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [storySceneId, setStorySceneId] = useState<SceneId | null>(null);
  const [isZenMode, setIsZenMode] = useState(false);

  const activeSceneConfig = SCENES.find(s => s.id === currentSceneId) || SCENES[0];

  useEffect(() => {
    if (!isLanding) {
      soundEngine.playAmbient(activeSceneConfig.ambientType);
    }
  }, [currentSceneId, isLanding, activeSceneConfig.ambientType]);

  const handleEnterWorld = (targetScene?: SceneId) => {
    if (targetScene) {
      setCurrentSceneId(targetScene);
    }
    setIsLanding(false);
    soundEngine.playAmbient(targetScene ? (SCENES.find(s => s.id === targetScene)?.ambientType || 'waves') : 'waves');
  };

  const handleSelectMood = (mood: MoodType) => {
    if (mood === 'annoyed') {
      setCurrentSceneId('mountains');
    } else if (mood === 'sad' || mood === 'overthinking') {
      setCurrentSceneId('beach');
    } else if (mood === 'exhausted') {
      setCurrentSceneId('cafe');
    } else if (mood === 'peace') {
      setCurrentSceneId('blossom_meadow');
    } else if (mood === 'meh') {
      setCurrentSceneId('night_city');
    }
  };

  const handleOpenStoryForScene = (sceneId: SceneId) => {
    setStorySceneId(sceneId);
  };

  const handleFinishStory = (dest: SceneId) => {
    setStorySceneId(null);
    handleEnterWorld(dest);
  };

  const renderActiveWorld = () => {
    switch (currentSceneId) {
      case 'cafe':
        return <CloyCafeVideoWorld key="cafe" />;
      case 'beach':
        return <SunsetBeachVideoWorld key="beach" />;
      case 'mountains':
        return <ArunachalVideoWorld key="mountains" />;
      case 'night_city':
        return <MidnightSeoulVideoWorld key="night_city" />;
      case 'blossom_meadow':
        return <GhibliBlossomVideoWorld key="blossom_meadow" />;
      default:
        return <CloyCafeVideoWorld key="default" />;
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white selection:bg-purple-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* Permanent Fixed Cozy Café Background — Always rendered directly at root */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        <img
          src={getAssetUrl('/assets/scenes/scenary_2.png')}
          alt="Cozy Café Scenery Background"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft, light tint letting the warm vibrant café colors shine through */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
      </div>

      {/* Main App Content Stack */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between">
        
        {isLanding ? (
          <LandingHero 
            onSelectMood={handleSelectMood}
            onEnterScene={handleEnterWorld}
            onOpenGame={() => setShowGame(true)}
            onOpenCareKit={() => setShowCareKit(true)}
            onOpenLetter={() => setShowLetter(true)}
            onOpenStoryForScene={handleOpenStoryForScene}
          />
        ) : (
          <div className="relative min-h-screen w-full flex flex-col justify-between">
            <Navbar 
              currentScene={currentSceneId}
              onOpenDestinations={() => setIsLanding(true)}
              onOpenGame={() => setShowGame(true)}
              onOpenCareKit={() => setShowCareKit(true)}
              onOpenLetter={() => setShowLetter(true)}
              onOpenStory={() => setStorySceneId(currentSceneId)}
              isZenMode={isZenMode}
              onToggleZenMode={() => setIsZenMode(prev => !prev)}
            />

            <main className="flex-1 flex items-center justify-center relative z-10 w-full px-2 sm:px-6">
              {renderActiveWorld()}
            </main>

            {!isZenMode && (
              <footer className="relative z-20 py-2 text-center text-xs text-white/60 font-light select-none flex items-center justify-center gap-2">
                <span>A sanctuary built for </span>
                <span className="font-semibold text-purple-300">Lin</span>
                <span> • Take all the time you need ☁️</span>
              </footer>
            )}
          </div>
        )}

      </div>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {showGame && <MiniGame onClose={() => setShowGame(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showCareKit && <CareKitModal onClose={() => setShowCareKit(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {showLetter && <LetterModal onClose={() => setShowLetter(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {storySceneId && (
          <ScrollStoryModal 
            sceneId={storySceneId}
            onClose={() => setStorySceneId(null)}
            onEnterWorld={handleFinishStory}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
