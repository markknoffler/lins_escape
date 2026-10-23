import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface ComicScene {
  id: string;
  sceneNumber: number;
  totalScenes: number;
  title: string;
  image: string;
  sfx: string;
  speaker: string;
  speech: string;
  caption: string;
}

interface ComicStory {
  id: string;
  title: string;
  tag: string;
  scenes: ComicScene[];
}

export const SinglePanelComicViewer: React.FC = () => {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  const stories: ComicStory[] = [
    {
      id: 'cafe_prestory',
      title: '☕ Why We Flew to CLOY & Goblin Café',
      tag: 'PRE-STORY 1',
      scenes: [
        {
          id: 'cafe_1',
          sceneNumber: 1,
          totalScenes: 4,
          title: 'Scene 1: The 2:30 AM Medico Freeze',
          image: '/assets/landing_frame_3.jpg',
          sfx: '🥶 SFX: SHIVER... 2:30 AM',
          speaker: 'Lin',
          speech: '“It’s 2:30 AM... 8:00 AM clinical postings start soon, and this hostel tea is nowhere near enough. 😭”',
          caption: 'DMCH Hostel Room • Exhausted after marathon hospital postings'
        },
        {
          id: 'cafe_2',
          sceneNumber: 2,
          totalScenes: 4,
          title: 'Scene 2: The K-Drama Realization',
          image: '/assets/cozy_cafe.jpg',
          sfx: '💡 SFX: BING! CLOY MODE',
          speaker: 'Lin',
          speech: '“You know what we need right now? Captain Ri’s heated coffee shop and Goblin’s warm OST playing.”',
          caption: 'Watching K-Drama clips and replaying Stay With Me to survive the night'
        },
        {
          id: 'cafe_3',
          sceneNumber: 3,
          totalScenes: 4,
          title: 'Scene 3: The Comfort Food Promise',
          image: '/assets/comic_smoked_potatoes.jpg',
          sfx: '🥘 SFX: SIZZLE & LAUGHTER',
          speaker: 'Lin',
          speech: '“If we go, post-hospital chole bhature and 50-rupee momos are on me! 🥟🥘”',
          caption: 'Samreedh on chat: “Done! 12 big momos guaranteed with extra chutney! 😂”'
        },
        {
          id: 'cafe_4',
          sceneNumber: 4,
          totalScenes: 4,
          title: 'Scene 4: Boarding for the Rainy Café',
          image: '/assets/landing_frame_2.jpg',
          sfx: '✈️ SFX: ALL ABOARD! ☕',
          speaker: 'Pilot',
          speech: '“Next stop: CLOY Café. Bottomless cat latte art, warm hearth, and hospital ward rounds permanently repealed. Hop on, Lin!”',
          caption: 'The skyplane descends through twilight clouds to pick her up'
        }
      ]
    },
    {
      id: 'beach_prestory',
      title: '🌊 Why We Flew to Sunset Ocean Shore',
      tag: 'PRE-STORY 2',
      scenes: [
        {
          id: 'beach_1',
          sceneNumber: 1,
          totalScenes: 4,
          title: 'Scene 1: The Clinical Postings Exhaustion',
          image: '/assets/comic_curfew_heist.jpg',
          sfx: '📑 SFX: HOSPITAL SHIFT DONE',
          speaker: 'Lin',
          speech: '“I have survived back-to-back hospital shifts and pharmacology vivas. My brain has officially evaporated.”',
          caption: 'Tired after a long day of patient care and lecture marathons'
        },
        {
          id: 'beach_2',
          sceneNumber: 2,
          totalScenes: 4,
          title: 'Scene 2: Longing for Ocean Waves',
          image: '/assets/sunset_beach.jpg',
          sfx: '🌊 SFX: OCEAN CALM...',
          speaker: 'Lin',
          speech: '“I need wide open waters... Diphu is peaceful, but my soul needs the sound of gentle tides and salty air.”',
          caption: 'Remembering golden pastel sunsets and endless coastal shores'
        },
        {
          id: 'beach_3',
          sceneNumber: 3,
          totalScenes: 4,
          title: 'Scene 3: The Origami Worry Boat',
          image: '/assets/landing_frame_1.jpg',
          sfx: '⛵ SFX: SAIL AWAY! 🙃',
          speaker: 'Lin',
          speech: '“Writing every heavy thought onto an origami boat and letting it drift into the golden sunset.”',
          caption: 'Releasing all medical stress and insomnia into the quiet tide'
        },
        {
          id: 'beach_4',
          sceneNumber: 4,
          totalScenes: 4,
          title: 'Scene 4: Flight to the Golden Shore',
          image: '/assets/sunset_beach.jpg',
          sfx: '⛵ SFX: GOLDEN WAVES!',
          speaker: 'Pilot',
          speech: '“Your emergency flight to the Golden Shore is cleared for landing! Zero clinical rounds detected for 5,000 miles!”',
          caption: 'Skyplane swooping low over sunlit turquoise waves'
        }
      ]
    },
    {
      id: 'mountain_prestory',
      title: '🌲 Why We Flew to Umrangso & Karbi Peak',
      tag: 'PRE-STORY 3',
      scenes: [
        {
          id: 'mountain_1',
          sceneNumber: 1,
          totalScenes: 4,
          title: 'Scene 1: Homesick for the Pine Mist',
          image: '/assets/landing_frame_3.jpg',
          sfx: '🏔️ SFX: MOUNTAIN BREEZE...',
          speaker: 'Lin',
          speech: '“I really miss the cool mountain mist, rolling hills, and the turquoise waters near Umrangso.”',
          caption: 'Looking out the hostel window towards the distant hills'
        },
        {
          id: 'mountain_2',
          sceneNumber: 2,
          totalScenes: 4,
          title: 'Scene 2: Karbi Youth Festival Echoes',
          image: '/assets/starry_mountain.jpg',
          sfx: '🌿 SFX: FOLK SONGS & POEMS',
          speaker: 'Lin',
          speech: '“From the Zonal Karbi Youth Festival to starlit campfires, ancient traditions always bring my peace back.”',
          caption: 'Remembering folk melodies and ancestral roots'
        },
        {
          id: 'mountain_3',
          sceneNumber: 3,
          totalScenes: 4,
          title: 'Scene 3: The Umrangso Road Trip Bet',
          image: '/assets/starry_mountain.jpg',
          sfx: '🚗 SFX: ROAD TRIP BET! ⛰️',
          speaker: 'Lin',
          speech: '“Samreedh bet: ‘If he likes you, you pay for food on our Umrangso trip. If he doesn’t, I pay!’ Deal is on! 🚙💨”',
          caption: 'Planning the November road trip across wide turquoise waters'
        },
        {
          id: 'mountain_4',
          sceneNumber: 4,
          totalScenes: 4,
          title: 'Scene 4: Flight to the Starlit Campfire',
          image: '/assets/starry_mountain.jpg',
          sfx: '🌲 SFX: PINE EMBERS GLOW!',
          speaker: 'Pilot',
          speech: '“Taking you back to the mountains, Lin. Fresh pine air, crackling fire, and the turquoise lake of Umrangso await!”',
          caption: 'Ascending under the glowing starry night sky'
        }
      ]
    },
    {
      id: 'city_prestory',
      title: '🌃 Why We Flew to Neon Seoul',
      tag: 'PRE-STORY 4',
      scenes: [
        {
          id: 'city_1',
          sceneNumber: 1,
          totalScenes: 4,
          title: 'Scene 1: The Hostel Mess Disaster',
          image: '/assets/comic_snack_heist.jpg',
          sfx: '🚫 SFX: MESS FOOD REJECTED',
          speaker: 'Lin',
          speech: '“I don’t know what this mess food is, but I think it just looked back at me. I need real momos and ramyeon!”',
          caption: 'Stomach grumbling after a long day of hospital postings'
        },
        {
          id: 'city_2',
          sceneNumber: 2,
          totalScenes: 4,
          title: 'Scene 2: The 11:00 PM Gate Lockdown',
          image: '/assets/comic_curfew_heist.jpg',
          sfx: '🔒 SFX: CLANG! LOCKDOWN',
          speaker: 'Warden',
          speech: '“11:00 PM! Hostel gates locked! Nobody leaves for street food!”',
          caption: 'Lin with dramatic comic shadows: “We are taking the skyway.”'
        },
        {
          id: 'city_3',
          sceneNumber: 3,
          totalScenes: 4,
          title: 'Scene 3: Late-Night Spotify Jam',
          image: '/assets/night_city.jpg',
          sfx: '🎧 SFX: SPOTIFY JAM SYNC',
          speaker: 'Lin',
          speech: '“Tonmoy Krypton’s Unmona and soft acoustic covers... This playlist is statistically engineered to cure midnight insomnia.”',
          caption: 'Listening to soft covers together on Spotify Jam at 12:30 AM'
        },
        {
          id: 'city_4',
          sceneNumber: 4,
          totalScenes: 4,
          title: 'Scene 4: Flight into the Rainy Neon City',
          image: '/assets/night_city.jpg',
          sfx: '🍜 SFX: NEON RAIN & MOMOS!',
          speaker: 'Pilot',
          speech: '“Welcome to Midnight Seoul, Lin. No curfews, shiny rain puddles, and piping hot momos waiting for you!”',
          caption: 'Gliding between glowing neon towers in the gentle midnight rain'
        }
      ]
    },
    {
      id: 'blossom_prestory',
      title: '🌸 Why We Flew to Blossom Melody Meadow',
      tag: 'PRE-STORY 5',
      scenes: [
        {
          id: 'blossom_1',
          sceneNumber: 1,
          totalScenes: 4,
          title: 'Scene 1: Singing Just for Yourself',
          image: '/assets/landing_frame_1.jpg',
          sfx: '🎶 SFX: GENTLE VOCALS...',
          speaker: 'Lin',
          speech: '“I stopped posting on YouTube and Instagram... but when I sing just for myself, my heart finally feels at peace.”',
          caption: 'Strumming an acoustic guitar in the quiet corner of the room'
        },
        {
          id: 'blossom_2',
          sceneNumber: 2,
          totalScenes: 4,
          title: 'Scene 2: The Spider-Man Crochet Project',
          image: '/assets/peaceful_blossom.jpg',
          sfx: '🧶 SFX: YARN & HOOKS',
          speaker: 'Lin',
          speech: '“I can make you a crochet bear... or a Spider-Man keychain doll! Crafting with hands is pure therapy.”',
          caption: 'Colorful yarn balls and crochet hooks laid out on the wooden desk'
        },
        {
          id: 'blossom_3',
          sceneNumber: 3,
          totalScenes: 4,
          title: 'Scene 3: The 11/10 Vocal Certification',
          image: '/assets/peaceful_blossom.jpg',
          sfx: '🎤 SFX: 11/10 RATING!',
          speaker: 'Lin',
          speech: '“Samreedh: ‘Why are you a doctor, be a singer! Your voice is 11/10!’ 🤭🎶”',
          caption: 'Singing the chorus of Spring Snow on a quiet afternoon'
        },
        {
          id: 'blossom_4',
          sceneNumber: 4,
          totalScenes: 4,
          title: 'Scene 4: Flight to the Blossom Hills',
          image: '/assets/peaceful_blossom.jpg',
          sfx: '🌿 SFX: SUMMER BREEZE!',
          speaker: 'Pilot',
          speech: '“Landing in the Blossom Melody Meadow. Grab your guitar and yarn, Lin. Today we create with zero pressure!”',
          caption: 'Soaring over green hills toward the giant blooming cherry tree'
        }
      ]
    },
    {
      id: 'void_prestory',
      title: '🚀 Why We Flew to Cosmic Void',
      tag: 'PRE-STORY 6',
      scenes: [
        {
          id: 'void_1',
          sceneNumber: 1,
          totalScenes: 4,
          title: 'Scene 1: The Dead Battery Meltdown',
          image: '/assets/stress_shredder.jpg',
          sfx: '💥 SFX: PHONE DEAD & NO POWER!',
          speaker: 'Lin',
          speech: '“WHY DID MY PHONE BATTERY DIE RIGHT DURING CALLOUTS?! And now they want to put their tournament winner on substitute?!”',
          caption: 'Staring at dead screen as teammate drama unfolds'
        },
        {
          id: 'void_2',
          sceneNumber: 2,
          totalScenes: 4,
          title: 'Scene 2: Option 1 Activated',
          image: '/assets/stress_shredder.jpg',
          sfx: '⚡ SFX: OPTION 1 LOCKED!',
          speaker: 'Lin',
          speech: '“Samreedh said: ‘Option 1: Don’t give a shit, let them realize what they lost, and shine on your own.’ Option 1 it is!”',
          caption: 'Unshakable MVP Support confidence restored'
        },
        {
          id: 'void_3',
          sceneNumber: 3,
          totalScenes: 4,
          title: 'Scene 3: Weaponizing the Clinical Stress',
          image: '/assets/stress_shredder.jpg',
          sfx: '🚀 SFX: LOCK & LOAD!',
          speaker: 'Lin',
          speech: '“Loading all hospital exhaustion, viva anxiety, and substitute drama into the cosmic artillery. Target: Black Hole!”',
          caption: 'Stacking medical textbooks and attendance sheets into ammo crates'
        },
        {
          id: 'void_4',
          sceneNumber: 4,
          totalScenes: 4,
          title: 'Scene 4: Flight to the Black Hole Cannon',
          image: '/assets/stress_shredder.jpg',
          sfx: '🌌 SFX: WARP SPEED! 💥',
          speaker: 'Pilot',
          speech: '“Approaching the Zero-G Stress Annihilator, Lin. Target locked on all hospital exhaustion. Ready to fire on your command!”',
          caption: 'Bursting past Earth into deep space to vaporize all stress'
        }
      ]
    }
  ];

  const currentStory = stories[selectedStoryIndex];
  const currentScene = currentStory.scenes[currentSceneIndex];

  const handleNextScene = () => {
    soundEngine.playPop();
    if (currentSceneIndex < currentStory.scenes.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
    } else {
      setSelectedStoryIndex(prev => (prev + 1) % stories.length);
      setCurrentSceneIndex(0);
    }
  };

  const handlePrevScene = () => {
    soundEngine.playPop();
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Story Selector Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-3 mb-4 scrollbar-thin">
        {stories.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              soundEngine.playPop();
              setSelectedStoryIndex(idx);
              setCurrentSceneIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              selectedStoryIndex === idx
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-black/40 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {/* Single-Panel Scene Box */}
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-white/20 p-4 sm:p-5 shadow-2xl flex flex-col items-center bg-black/60">
        
        {/* Top Panel Header */}
        <div className="w-full flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 bg-purple-950/80 text-purple-200 rounded-full border border-purple-500/30">
              {currentStory.tag}
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              {currentScene.title}
            </h4>
          </div>

          <span className="text-xs font-mono text-amber-300 font-bold">
            Scene {currentScene.sceneNumber} / {currentScene.totalScenes}
          </span>
        </div>

        {/* Square 1:1 Illustrated Comic Art Box */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/80 mb-3">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentScene.id}
              src={currentScene.image}
              alt={currentScene.title}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full h-full object-cover object-center"
            />
          </AnimatePresence>

          {/* Sound Effect Badge Overlay */}
          <div className="absolute top-3 left-3 px-3 py-1 bg-amber-500/90 text-black font-black text-xs rounded-xl shadow-lg border border-amber-300/60 uppercase tracking-wide animate-pulse">
            {currentScene.sfx}
          </div>

          {/* Stylized Speech Bubble Overlay */}
          <motion.div
            key={`speech_${currentScene.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="absolute bottom-3 left-3 right-3 p-3.5 rounded-2xl bg-white/95 text-slate-900 shadow-2xl border border-white flex flex-col backdrop-blur-md"
          >
            <span className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider mb-0.5">
              💬 {currentScene.speaker}:
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
              {currentScene.speech}
            </p>
          </motion.div>
        </div>

        {/* Caption */}
        <p className="text-xs text-slate-300 italic text-center mb-4 px-2">
          {currentScene.caption}
        </p>

        {/* Bottom Scene Controls */}
        <div className="w-full flex items-center justify-between pt-3 border-t border-white/10">
          <button
            onClick={handlePrevScene}
            disabled={currentSceneIndex === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              currentSceneIndex === 0 ? 'opacity-30 cursor-not-allowed text-slate-500' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Scene
          </button>

          {/* Scene Dots */}
          <div className="flex items-center gap-1.5">
            {currentStory.scenes.map((_, sIdx) => (
              <div
                key={sIdx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  sIdx === currentSceneIndex ? 'w-5 bg-purple-400' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNextScene}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition active:scale-95"
          >
            <span>{currentSceneIndex === currentStory.scenes.length - 1 ? 'Next Pre-Story' : 'Next Scene'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
