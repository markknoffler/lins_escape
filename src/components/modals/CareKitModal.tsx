import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Heart, 
  RotateCcw, 
  Wind, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  Moon,
  Play,
  Orbit,
  Flame,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../services/soundEngine';
import { getAssetUrl } from '../../utils/assets';

interface CareKitModalProps {
  onClose: () => void;
}

export const CareKitModal: React.FC<CareKitModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'stationery' | 'kettle' | 'yeeter' | 'fortune' | 'comics' | 'bubbles' | 'breath'>('stationery');
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleComicTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    touchStartRef.current = null;
    if (deltaX < -35) {
      soundEngine.playPop();
      setComicIndex(prev => (prev + 1) % comics.length);
    } else if (deltaX > 35) {
      soundEngine.playPop();
      setComicIndex(prev => (prev - 1 + comics.length) % comics.length);
    }
  };

  const handleNoteTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    touchStartRef.current = null;
    if (deltaX < -35) {
      soundEngine.playPop();
      setNoteIndex(prev => (prev + 1) % stationeryNotes.length);
    } else if (deltaX > 35) {
      soundEngine.playPop();
      setNoteIndex(prev => (prev - 1 + stationeryNotes.length) % stationeryNotes.length);
    }
  };
  
  // =========================================================================
  // 1. ILLUSTRATED INSIDE-JOKE COMICS CAROUSEL (UNCLIPPED OBJECT-CONTAIN)
  // =========================================================================
  const [comicIndex, setComicIndex] = useState(0);
  const comics = [
    {
      id: 'curfew_heist',
      title: 'The 11:00 PM Hostel Curfew Heist',
      tag: 'EPISODE 01',
      image: getAssetUrl('/assets/comic_curfew_heist.jpg'),
      quote: '“Curfew at 11:00 PM? Victory sliding under the DMCH gate at 10:59:59 PM like a boss.”'
    },
    {
      id: 'smoked_potatoes',
      title: 'Post-Hospital Chole Bhature & Momos',
      tag: 'EPISODE 02',
      image: getAssetUrl('/assets/comic_smoked_potatoes.jpg'),
      quote: '“Tired morning helping uncle with blood transfusion, but surviving with hot chole bhature and momos like a champion! 🥘🥟”'
    },
    {
      id: 'cat_nap',
      title: 'The "Just 5 More Minutes" Evening Nap',
      tag: 'EPISODE 03',
      image: getAssetUrl('/assets/comic_cat_nap.jpg'),
      quote: '“Accidentally falling asleep at 6 PM in an empty hostel room... Waking up at 9 PM wondering what century it is! 😴☁️”'
    },
    {
      id: 'snack_heist',
      title: 'The Spider-Man Crochet Ops',
      tag: 'EPISODE 04',
      image: getAssetUrl('/assets/comic_snack_heist.jpg'),
      quote: '“Spinning red yarn at 2 AM to craft a custom Spider-Man keychain and crochet bear for Samreedh. 🧶🕷️”'
    }
  ];

  // =========================================================================
  // 2. 12 OBSERVANT, CARING STATIONERY LETTERS (NO "97%" MENTIONS)
  // =========================================================================
  const [noteIndex, setNoteIndex] = useState(0);
  const stationeryNotes = [
    {
      stamp: 'OFFICIAL DECREE',
      date: 'DMCH WARD EXEMPTION',
      salutation: 'Dearest Lin,',
      body: 'You do not have to conquer the entire syllabus tonight. Medical school postings and clinical viva preparations are notoriously brutal. Close your textbooks, drink a glass of warm water, and let yourself rest. The hospital ward rounds can wait — your well-being comes first.',
      postscript: 'P.S. 2 AM is not a healthy bedtime for an 8 AM class. Put the notes down.',
      signature: 'With all my support ☁️',
      accent: 'border-amber-400/40 text-amber-200'
    },
    {
      stamp: 'HEALTH PROTOCOL',
      date: 'HOSPITAL RECOVERY & CARE',
      salutation: 'Health First Reminder,',
      body: 'Helping your uncle with blood transfusions and attending back-to-back 2–4 PM classes is emotionally and physically exhausting. Please make sure you are drinking clean filtered water, eating proper meals, and taking care of your own immune system too.',
      postscript: 'P.S. You spend so much time caring for others. Let someone care for you too.',
      signature: 'Stay hydrated & rested 🍵',
      accent: 'border-emerald-400/40 text-emerald-200'
    },
    {
      stamp: 'VOCAL SANCTUARY',
      date: 'THE 11/10 CERTIFICATE',
      salutation: 'When You Sing Just for Yourself,',
      body: 'Even if you stopped posting on YouTube and Instagram after difficult times, your voice is an absolute gift. That cover of Stay With Me was an undisputed 11/10. You do not need public validation or social media likes; singing because it heals your own heart is pure magic.',
      postscript: 'P.S. Whenever you feel like singing, I will always be your favorite audience.',
      signature: 'Headphone Haven 🎶',
      accent: 'border-cyan-400/40 text-cyan-200'
    },
    {
      stamp: 'TOURNAMENT BADGE',
      date: 'MLBB SUPPORT CHAMPION',
      salutation: 'To Our Interbatch Winner,',
      body: 'Last year during DMCH Khelon week, you proved yourself as the champion MVP support. If certain teammates get weird or suggest putting you on "substitute" just because your phone battery died, remember Option 1: ignore the noise, keep your head high, and let them realize what they lost.',
      postscript: 'P.S. Champions never need to fight for a spot in temporary squads.',
      signature: 'Support Main Royalty 👑',
      accent: 'border-purple-400/40 text-purple-200'
    },
    {
      stamp: 'ROAD TRIP VOUCHER',
      date: 'UMRANGSO GETAWAY',
      salutation: 'The Dima Hasao Road Trip,',
      body: 'Wide turquoise waters, rolling pine hills, and cool mountain breezes right at the border of Dima Hasao and Karbi Anglong. Whenever the hostel walls feel too confining, picture the road to Umrangso.',
      postscript: 'P.S. The food bet is on: whoever loses pays for all the dhaba stops! 🚙💨',
      signature: 'Mountain Highway ⛰️',
      accent: 'border-pink-400/40 text-pink-200'
    },
    {
      stamp: 'LEGENDARY EXCUSE',
      date: 'THE BLIND SHIELD',
      salutation: 'Hall of Fame Defense,',
      body: '“I’m sorry I can’t hear you, I’m blind 🫥.” The single greatest evasion line in conversational history. Whenever hostel drama, boring lectures, or unwanted responsibilities approach, activate this superpower with zero remorse.',
      postscript: 'P.S. Works 100% of the time, every time.',
      signature: 'Defense Minister 🫥',
      accent: 'border-rose-400/40 text-rose-200'
    },
    {
      stamp: 'CULTURAL ROOTS',
      date: 'KARBI YOUTH FESTIVAL',
      salutation: 'Folk Songs & Starlit Echoes,',
      body: 'From the Zonal Karbi Youth Festival to ancient ancestral melodies, your heritage and traditions are deep and beautiful. Remember your roots, the nature prayers under open skies, and the resilience passed down from your ex-mouzadar ancestors.',
      postscript: 'P.S. Next year KYF in Diphu: save me a front-row seat for the folk poetry!',
      signature: 'Karbi Hills 🌿',
      accent: 'border-orange-400/40 text-orange-200'
    },
    {
      stamp: 'CRAFT WORKSHOP',
      date: 'SPIDER-MAN & YARN',
      salutation: 'Creative Breathing Space,',
      body: 'Crocheting cute bears, weaving Spider-Man keychains, sketching, and playing acoustic guitar—your creative hands bring warmth into this world. When textbooks feel too dry, pick up the crochet hook and let your imagination breathe.',
      postscript: 'P.S. Still eagerly waiting for that handmade Spiderman doll! 🧶🕷️',
      signature: 'Crochet Fanclub 🧸',
      accent: 'border-indigo-400/40 text-indigo-200'
    },
    {
      stamp: 'K-DRAMA RX',
      date: 'WAIKIKI & GWENCHANA',
      salutation: 'Prescription: K-Drama Marathon,',
      body: 'Watching dramas since Class 5 means you hold an honorary doctorate in Korean romance. When life gets overwhelming, channel your inner Na Hwa-jin, cue up Waikiki for a good laugh, and repeat after me: “Gwenchana... gwenchana!”',
      postscript: 'P.S. Boys Over Flowers nostalgia hits different on rainy hostel nights.',
      signature: 'Drama Partner 📺',
      accent: 'border-amber-400/40 text-amber-200'
    },
    {
      stamp: 'COMFORT FOOD',
      date: '50-RUPEE MOMOS',
      salutation: 'Emergency Food Voucher,',
      body: 'When hostel mess food looks completely unidentifiable, remember: 12 steaming momos for ₹50 with extra fiery chutney and hot ginger tea can fix almost any bad day.',
      postscript: 'P.S. Post-hospital chole bhature also holds official emergency medical approval.',
      signature: 'Snack Patrol 🥟',
      accent: 'border-emerald-400/40 text-emerald-200'
    },
    {
      stamp: 'SLEEP SCIENCE',
      date: 'THE MON CHER BLESSING',
      salutation: 'To the 2 AM Hyperactive Brain,',
      body: '“U k when i have my good mornings? When i sleep as much as i want 😌.” When your mind is racing at night, you don’t need to force yourself to figure out the future. Unclench your jaw, wrap yourself up warm, and let yourself rest, mon cher.',
      postscript: 'P.S. May you wake up tomorrow without an alarm clock in sight.',
      signature: 'Restful Sleep 🌙',
      accent: 'border-cyan-400/40 text-cyan-200'
    },
    {
      stamp: 'PINKY PROMISE',
      date: 'OCTOBER 13 PACT',
      salutation: 'A Promise Kept,',
      body: '“Give me some days, I will make something nice for you using my skills... Pinky promise!” Good things take time, and here it is. Even if we both get busy with exams, postings, and life, you will always have this quiet space made just for you.',
      postscript: 'P.S. And don’t worry, I won’t delete IG—no tragic 10-year K-drama separations allowed!',
      signature: 'Samreedh ☁️✨',
      accent: 'border-purple-400/40 text-purple-200'
    }
  ];

  // =========================================================================
  // 3. THE 2 AM TEA KETTLE BREAK TIMER
  // =========================================================================
  const [selectedDuration, setSelectedDuration] = useState<number>(15 * 60);
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [isKettleRunning, setIsKettleRunning] = useState<boolean>(false);
  const [isKettleDone, setIsKettleDone] = useState<boolean>(false);
  const [selectedBrew, setSelectedBrew] = useState<'chamomile' | 'darjeeling' | 'water'>('chamomile');
  const kettleTimerRef = useRef<any>(null);

  const brewOptions = [
    { id: 'chamomile', name: 'Chamomile & Lavender', desc: 'Calms 3 AM racing thoughts', icon: '🪻', mins: 10 },
    { id: 'darjeeling', name: 'Darjeeling Green Tea', desc: 'Gentle focus & antioxidant reset', icon: '🍃', mins: 15 },
    { id: 'water', name: 'Warm Filtered Water', desc: 'Hostel hydration & health first', icon: '💧', mins: 20 },
  ];

  useEffect(() => {
    if (isKettleRunning && timeLeft > 0) {
      kettleTimerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isKettleRunning) {
      setIsKettleRunning(false);
      setIsKettleDone(true);
      soundEngine.playChime();
      confetti({ particleCount: 50, spread: 60 });
    }
    return () => {
      if (kettleTimerRef.current) clearInterval(kettleTimerRef.current);
    };
  }, [isKettleRunning, timeLeft]);

  const handleSelectBrew = (brewId: 'chamomile' | 'darjeeling' | 'water', mins: number) => {
    soundEngine.playPop();
    setSelectedBrew(brewId);
    setSelectedDuration(mins * 60);
    setTimeLeft(mins * 60);
    setIsKettleRunning(false);
    setIsKettleDone(false);
  };

  const formatKettleTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // =========================================================================
  // 4. THE 3 AM ASSIGNMENT YEETER
  // =========================================================================
  const [stressInput, setStressInput] = useState('');
  const [isShredding, setIsShredding] = useState(false);
  const [shredType, setShredType] = useState<'blackhole' | 'cat' | null>(null);
  const [shreddedCount, setShreddedCount] = useState(() => {
    return parseInt(localStorage.getItem('lin_shredded_count') || '14', 10);
  });
  const [lastShreddedText, setLastShreddedText] = useState<string | null>(null);

  const quickStressSuggestions = [
    '8:00 AM DMCH Clinical Postings & Vivas',
    'Clueless Teammates Offering "Substitute"',
    'Hospital Ward Exhaustion & Uncle Care',
    'Hostel Gate Curfew & Attendance Checks',
    'Dead Phone Battery on Power Cut Days',
    '2 AM Hyperactive Brain Overthinking',
    'Empty Hostel Room Loneliness',
    'Brutal MBBS Anatomy Vivas'
  ];

  const handleShred = (type: 'blackhole' | 'cat') => {
    if (!stressInput.trim()) return;
    setIsShredding(true);
    setShredType(type);
    setLastShreddedText(stressInput);

    if (type === 'blackhole') {
      soundEngine.playLaserShred();
      confetti({
        particleCount: 45,
        spread: 70,
        colors: ['#a855f7', '#3b82f6', '#06b6d4'],
      });
    } else {
      soundEngine.playPurr();
      confetti({
        particleCount: 40,
        spread: 60,
        colors: ['#f472b6', '#fbbf24', '#fb7185'],
      });
    }

    const newCount = shreddedCount + 1;
    setShreddedCount(newCount);
    localStorage.setItem('lin_shredded_count', newCount.toString());

    setTimeout(() => {
      setIsShredding(false);
      setStressInput('');
      setShredType(null);
    }, 2200);
  };

  // =========================================================================
  // 5. HOSTEL FORTUNE COOKIE
  // =========================================================================
  const [isFortuneCracked, setIsFortuneCracked] = useState(false);
  const [fortuneIndex, setFortuneIndex] = useState(0);
  const fortunes = [
    {
      text: "“The DMCH warden is currently distracted with tea. Now is the optimal window for a stealth momos run.”",
      tag: "STEALTH CLEARANCE 🥟",
      luckyNumber: "10:59 PM"
    },
    {
      text: "“Your patient notes are written. Your sleep schedule is not. Go to bed, Lin.”",
      tag: "HEALTH DIRECTIVE 🌙",
      luckyNumber: "8 Hours Sleep"
    },
    {
      text: "“An 11/10 singing voice was detected. The world may be noisy, but your melody brings quiet peace.”",
      tag: "11/10 VOCALS 🎶",
      luckyNumber: "11/10 Score"
    },
    {
      text: "“The Umrangso road trip bet stands: delicious roadside food is guaranteed in your future.”",
      tag: "ROAD TRIP VIBES 🚙",
      luckyNumber: "Dima Hasao"
    },
    {
      text: "“By decree of the Khelon committee: You are the forever MVP Support of this squad.”",
      tag: "CHAMPION MVP 👑",
      luckyNumber: "+500 Squad Pride"
    },
    {
      text: "“Sliding under the hostel gate at 10:59:59 PM is mathematically considered an on-time arrival.”",
      tag: "GATE PHYSICS ⏰",
      luckyNumber: "10:59:59 PM"
    },
    {
      text: "“A plate of 12 steaming momos for 50₹ is medically proven to heal all clinical exhaustion.”",
      tag: "COMFORT FOOD 🥟",
      luckyNumber: "12 Pieces"
    },
    {
      text: "“Gwenchana, gwenchana! You survived today, and tomorrow will be much gentler.”",
      tag: "K-DRAMA TRUTH ✨",
      luckyNumber: "1 Day at a Time"
    }
  ];

  // =========================================================================
  // 6. BUBBLE WRAP & BREATHING
  // =========================================================================
  const [poppedBubbles, setPoppedBubbles] = useState<{ [k: number]: boolean }>({});
  const totalBubbles = 24;

  const handlePopBubble = (idx: number) => {
    if (!poppedBubbles[idx]) {
      soundEngine.playPop();
      setPoppedBubbles(prev => ({ ...prev, [idx]: true }));
    }
  };

  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  useEffect(() => {
    if (activeTab !== 'breath') return;
    const interval = setInterval(() => {
      setBreathPhase(prev => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        return 'Inhale';
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-md select-none"
    >
      <div className="relative w-full max-w-4xl bg-black/75 backdrop-blur-2xl rounded-3xl border border-white/20 p-5 sm:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 pb-4 border-b border-white/10">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/20 rounded-2xl text-rose-300 border border-rose-400/30">
              <Heart className="w-5 h-5 fill-rose-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                Lin's Emergency Care Kit
              </h2>
              <p className="text-xs text-slate-300 font-light">
                A quiet space for rest, reassurance, and inside jokes
              </p>
            </div>
          </div>

          {/* Minimalist Tabs */}
          <div className="flex items-center gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/15 text-xs overflow-x-auto max-w-full">
            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveTab('stationery');
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap ${
                activeTab === 'stationery'
                  ? 'bg-amber-500/30 text-amber-200 font-bold border border-amber-400/40 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Notes ({stationeryNotes.length}) ✉️
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveTab('kettle');
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap ${
                activeTab === 'kettle'
                  ? 'bg-amber-700/40 text-amber-200 font-bold border border-amber-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              2 AM Kettle 🫖
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveTab('yeeter');
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap ${
                activeTab === 'yeeter'
                  ? 'bg-rose-600/30 text-rose-200 font-bold border border-rose-400/40 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Yeeter 🗑️
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveTab('fortune');
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap ${
                activeTab === 'fortune'
                  ? 'bg-purple-600/30 text-purple-200 font-bold border border-purple-400/40 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Fortune 🥠
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveTab('comics');
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap ${
                activeTab === 'comics'
                  ? 'bg-purple-500/30 text-purple-200 font-bold border border-purple-400/40 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Comics 📖
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveTab('bubbles');
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap ${
                activeTab === 'bubbles'
                  ? 'bg-pink-500/30 text-pink-200 font-bold border border-pink-400/40 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Bubbles 🫧
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveTab('breath');
              }}
              className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap ${
                activeTab === 'breath'
                  ? 'bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-400/40 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Breathe 🌿
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: 12 TACTILE STATIONERY POSTCARDS */}
        {/* ========================================================================= */}
        {activeTab === 'stationery' && (
          <div 
            onTouchStart={handleTouchStart} 
            onTouchEnd={handleNoteTouchEnd} 
            className="flex-1 flex flex-col items-center justify-between py-2 overflow-y-auto touch-pan-y"
          >
            
            <AnimatePresence mode="wait">
              <motion.div
                key={noteIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-2xl bg-black/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl relative flex flex-col justify-between min-h-[320px]"
              >
                {/* Stamp & Date Header */}
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-amber-300 px-3 py-1 bg-amber-950/60 rounded-full border border-amber-500/30">
                    {stationeryNotes[noteIndex].stamp}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {stationeryNotes[noteIndex].date}
                  </span>
                </div>

                {/* Letter Body */}
                <div className="space-y-3.5 my-auto">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                    {stationeryNotes[noteIndex].salutation}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed">
                    {stationeryNotes[noteIndex].body}
                  </p>

                  <p className="font-handwritten text-lg sm:text-xl text-purple-300 font-semibold pt-1">
                    {stationeryNotes[noteIndex].postscript}
                  </p>
                </div>

                {/* Signature & Heartwarming Footer */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-5 pt-3 border-t border-white/10 gap-2">
                  <span className="font-handwritten text-base sm:text-lg text-rose-300/90 font-medium tracking-wide">
                    written with care for lin ☁️
                  </span>
                  <span className="text-xs text-slate-400 font-serif italic">
                    {stationeryNotes[noteIndex].signature}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Note Switcher Pagination */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setNoteIndex(prev => (prev - 1 + stationeryNotes.length) % stationeryNotes.length);
                }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {stationeryNotes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundEngine.playPop();
                      setNoteIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === noteIndex ? 'w-6 bg-amber-400 shadow-md' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  soundEngine.playPop();
                  setNoteIndex(prev => (prev + 1) % stationeryNotes.length);
                }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: THE 2 AM TEA KETTLE */}
        {/* ========================================================================= */}
        {activeTab === 'kettle' && (
          <div className="flex-1 flex flex-col items-center justify-between py-2 overflow-y-auto max-w-xl mx-auto w-full text-center">
            
            <div className="mb-2">
              <h3 className="font-serif text-lg font-bold text-white mb-1">
                The 2 AM Tea Kettle Break
              </h3>
              <p className="text-xs text-slate-300 font-light">
                Put the laptop down. Rest your eyes while virtual water boils.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full my-3">
              {brewOptions.map(b => (
                <button
                  key={b.id}
                  onClick={() => handleSelectBrew(b.id as any, b.mins)}
                  className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                    selectedBrew === b.id
                      ? 'bg-amber-500/20 border-amber-400/50 text-white shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{b.icon}</span>
                    <span className="text-[10px] font-mono text-amber-300 font-bold">{b.mins}m</span>
                  </div>
                  <h4 className="text-xs font-bold font-serif mt-1">{b.name}</h4>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-full bg-black/60 border border-white/20 shadow-2xl backdrop-blur-md flex flex-col items-center my-auto">
              <span className="text-4xl mb-1">{isKettleDone ? '☕' : '🫖'}</span>
              <span className="font-mono text-2xl font-bold text-white tracking-widest">
                {formatKettleTime(timeLeft)}
              </span>
              <span className="text-[10px] text-amber-300 font-mono mt-0.5">
                {isKettleRunning ? '✨ Brewing...' : isKettleDone ? '🌿 Brew Ready!' : 'Paused'}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full max-w-xs mt-4">
              <button
                onClick={() => {
                  soundEngine.playPour();
                  setIsKettleRunning(!isKettleRunning);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-serif font-bold text-xs shadow-xl flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {isKettleRunning ? (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    <span>Pause Rest</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{isKettleDone ? 'Brew Again' : 'Start Rest Break'}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  soundEngine.playPop();
                  setIsKettleRunning(false);
                  setIsKettleDone(false);
                  setTimeLeft(selectedDuration);
                }}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <span className="font-handwritten text-sm text-rose-300/90 font-medium tracking-wide mt-3">
              written with care for lin ☁️
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: THE 3 AM ASSIGNMENT YEETER */}
        {/* ========================================================================= */}
        {activeTab === 'yeeter' && (
          <div className="flex-1 flex flex-col items-center justify-between py-2 overflow-y-auto max-w-3xl mx-auto w-full">
            
            {/* Header with Stats */}
            <div className="text-center mb-3 w-full flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold mb-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>{shreddedCount} Deadlines Destroyed Forever</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                The 3 AM Assignment Yeeter 🗑️
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light max-w-lg">
                Type whatever college deadline, jury critique, or hostel stress is bothering you and obliterate it into stardust.
              </p>
            </div>

            {/* Expansive Input or Destruction Screen */}
            <div className="w-full my-auto py-2">
              <AnimatePresence mode="wait">
                {!isShredding ? (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.3, rotate: 180, filter: 'blur(10px)' }}
                    transition={{ duration: 0.4 }}
                    className="w-full bg-white/[0.04] backdrop-blur-xl p-5 sm:p-6 rounded-3xl border-2 border-dashed border-amber-300/40 shadow-2xl flex flex-col gap-3 relative"
                  >
                    {/* Watermark header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300/90 font-bold flex items-center gap-1.5">
                        <span>📄</span> STRESS MEMORANDUM FOR DESTRUCTION
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Zero Consequences Guaranteed
                      </span>
                    </div>

                    <textarea
                      value={stressInput}
                      onChange={e => setStressInput(e.target.value)}
                      placeholder="Type an assignment, evaluation sprint, curfew stress, or annoying jury deadline..."
                      rows={3}
                      className="w-full bg-transparent text-slate-100 placeholder:text-slate-400 text-sm sm:text-base font-serif resize-none focus:outline-none leading-relaxed min-h-[85px]"
                    />

                    {/* Relatable Quick Stress Chips */}
                    <div className="pt-2 border-t border-white/10 flex flex-col gap-1.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        Quick Select Relatable Stressors:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {quickStressSuggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              soundEngine.playPop();
                              setStressInput(s);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-slate-300 hover:text-white transition cursor-pointer hover:border-amber-400/40"
                          >
                            + {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="shredding"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`w-full min-h-[220px] rounded-3xl border shadow-2xl flex flex-col items-center justify-center text-center p-6 backdrop-blur-2xl relative overflow-hidden ${
                      shredType === 'blackhole'
                        ? 'bg-gradient-to-br from-purple-950/90 via-black to-indigo-950/90 border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.4)]'
                        : 'bg-gradient-to-br from-rose-950/90 via-black to-amber-950/90 border-amber-500/50 shadow-[0_0_50px_rgba(251,191,36,0.4)]'
                    }`}
                  >
                    <motion.div
                      animate={{ rotate: shredType === 'blackhole' ? 360 : [0, -10, 10, 0] }}
                      transition={{ duration: shredType === 'blackhole' ? 3 : 0.5, repeat: Infinity, ease: 'linear' }}
                      className="text-6xl mb-3 drop-shadow-2xl"
                    >
                      {shredType === 'blackhole' ? '🌌' : '🐱💨'}
                    </motion.div>

                    <h4 className="font-serif font-extrabold text-white text-lg sm:text-xl tracking-wide mb-1">
                      {shredType === 'blackhole' ? 'ANNIHILATING INTO THE BLACK HOLE...' : 'CHOMP! THE CAT DEVOURED YOUR DEADLINE!'}
                    </h4>

                    <p className="text-xs sm:text-sm text-purple-200 font-mono italic px-4 py-1.5 bg-black/50 rounded-full border border-white/10 max-w-md truncate mt-1">
                      “{lastShreddedText}” has vanished forever.
                    </p>

                    <div className="mt-3 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Peace & Tranquility Restored +100%</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tactile Yeet Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full my-2">
              <button
                disabled={!stressInput.trim() || isShredding}
                onClick={() => handleShred('blackhole')}
                className="py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40 shadow-xl border border-white/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
              >
                <Orbit className="w-4 h-4 text-cyan-300" />
                <span>Yeet to Black Hole 🌌</span>
              </button>

              <button
                disabled={!stressInput.trim() || isShredding}
                onClick={() => handleShred('cat')}
                className="py-3.5 px-5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-serif font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-40 shadow-xl border border-white/20 hover:shadow-[0_0_30px_rgba(244,63,94,0.6)]"
              >
                <Flame className="w-4 h-4 text-amber-300" />
                <span>Feed to Dorm Cat 🐱</span>
              </button>
            </div>

            <span className="font-handwritten text-sm sm:text-base text-rose-300/90 font-medium tracking-wide mt-1">
              written with care for lin ☁️
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: HOSTEL FORTUNE COOKIE */}
        {/* ========================================================================= */}
        {activeTab === 'fortune' && (
          <div className="flex-1 flex flex-col items-center justify-between py-2 overflow-y-auto max-w-3xl mx-auto w-full text-center">
            
            <div className="mb-2">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                Hostel Fortune Cookie 🥠
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light">
                Tap the golden cookie to crack open tonight's fortune, wisdom, and curfew blessings.
              </p>
            </div>

            <div className="my-auto w-full flex flex-col items-center justify-center py-4">
              <AnimatePresence mode="wait">
                {!isFortuneCracked ? (
                  <motion.button
                    key="unopened"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.1, opacity: 0 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      soundEngine.playPop();
                      setIsFortuneCracked(true);
                      confetti({ particleCount: 50, spread: 70 });
                    }}
                    className="group cursor-pointer flex flex-col items-center p-8 rounded-3xl bg-white/[0.03] hover:bg-white/[0.07] border-2 border-dashed border-amber-400/40 transition-all duration-300 shadow-2xl relative max-w-md w-full"
                  >
                    {/* Floating Glow Behind Cookie */}
                    <div className="absolute inset-0 bg-amber-500/10 rounded-3xl blur-xl group-hover:bg-amber-500/20 transition" />

                    <motion.span 
                      animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-7xl sm:text-8xl mb-4 drop-shadow-[0_10px_20px_rgba(251,191,36,0.5)]"
                    >
                      🥠
                    </motion.span>

                    <span className="text-xs sm:text-sm text-amber-200 font-serif font-bold px-6 py-2 bg-black/60 rounded-full border border-amber-400/50 shadow-lg flex items-center gap-2 group-hover:bg-amber-950/80 transition">
                      <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                      <span>Tap to Crack Open Tonight's Fortune ✨</span>
                    </span>

                    <span className="text-[11px] font-mono text-slate-400 mt-3">
                      100% Guaranteed Curfew Immunity Included
                    </span>
                  </motion.button>
                ) : (
                  <motion.div
                    key="cracked"
                    initial={{ opacity: 0, scale: 0.85, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 text-slate-900 p-7 sm:p-9 rounded-3xl border-2 border-amber-300/80 shadow-[0_0_50px_rgba(251,191,36,0.35)] relative flex flex-col justify-between min-h-[260px]"
                  >
                    {/* Vintage Stamp Header */}
                    <div className="flex items-center justify-between border-b border-amber-900/15 pb-3 mb-4">
                      <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-amber-900 px-3 py-1 bg-amber-200/80 rounded-full border border-amber-400/40">
                        {fortunes[fortuneIndex].tag}
                      </span>
                      <span className="text-[11px] sm:text-xs font-mono font-semibold text-amber-900/80 bg-amber-200/50 px-2.5 py-0.5 rounded-lg">
                        Lucky Stat: {fortunes[fortuneIndex].luckyNumber}
                      </span>
                    </div>

                    {/* Fortune Text */}
                    <div className="my-auto py-2">
                      <p className="font-handwritten text-xl sm:text-2xl md:text-3xl text-amber-950 font-bold leading-relaxed">
                        {fortunes[fortuneIndex].text}
                      </p>
                    </div>

                    {/* Action & Footer */}
                    <div className="flex items-center justify-between border-t border-amber-900/15 pt-4 mt-4">
                      <span className="text-xs font-serif italic text-amber-800/80">
                        Fortune Archive • Lin's Care Kit
                      </span>

                      <button
                        onClick={() => {
                          soundEngine.playPop();
                          setIsFortuneCracked(false);
                          setFortuneIndex(prev => (prev + 1) % fortunes.length);
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-950 text-amber-100 hover:bg-amber-900 text-xs sm:text-sm font-serif font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
                      >
                        <span>Crack Another Cookie 🥠✨</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="font-handwritten text-sm sm:text-base text-rose-300/90 font-medium tracking-wide mt-1">
              written with care for lin ☁️
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: 4 FULL UNCLIPPED COMICS */}
        {/* ========================================================================= */}
        {activeTab === 'comics' && (
          <div 
            onTouchStart={handleTouchStart} 
            onTouchEnd={handleComicTouchEnd} 
            className="flex-1 flex flex-col items-center justify-between py-1 overflow-y-auto touch-pan-y"
          >
            
            <AnimatePresence mode="wait">
              <motion.div
                key={comicIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col md:flex-row items-center gap-6 w-full max-w-3xl"
              >
                {/* Full Unclipped Comic Artwork */}
                <div className="w-full md:w-1/2 aspect-square max-w-[380px] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black/90 flex items-center justify-center p-2">
                  <img
                    src={comics[comicIndex].image}
                    alt={comics[comicIndex].title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Comic Context & Quote */}
                <div className="w-full md:w-1/2 text-left flex flex-col justify-center space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-300 px-3 py-1 bg-purple-950/60 rounded-full border border-purple-500/30 w-fit">
                    {comics[comicIndex].tag}
                  </span>

                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    {comics[comicIndex].title}
                  </h3>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="font-handwritten text-lg sm:text-xl text-amber-200 font-semibold leading-relaxed">
                      {comics[comicIndex].quote}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Comic Navigation */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setComicIndex(prev => (prev - 1 + comics.length) % comics.length);
                }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                {comics.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundEngine.playPop();
                      setComicIndex(idx);
                    }}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === comicIndex ? 'w-8 bg-purple-400 shadow-md' : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  soundEngine.playPop();
                  setComicIndex(prev => (prev + 1) % comics.length);
                }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: TACTILE BUBBLE WRAP */}
        {/* ========================================================================= */}
        {activeTab === 'bubbles' && (
          <div className="flex-1 flex flex-col items-center justify-center py-4">
            
            <div className="text-center mb-5">
              <h3 className="font-serif text-lg font-bold text-white mb-1">
                Virtual Bubble Wrap Therapy
              </h3>
              <p className="text-xs text-slate-300 font-light">
                Pop as many as you need to relieve sprint stress
              </p>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 p-5 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/15 shadow-2xl">
              {Array.from({ length: totalBubbles }).map((_, idx) => {
                const isPopped = !!poppedBubbles[idx];
                return (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handlePopBubble(idx)}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      isPopped
                        ? 'bg-white/5 border border-white/10 text-slate-600 shadow-inner'
                        : 'bg-gradient-to-tr from-pink-500/40 via-purple-500/40 to-sky-400/50 border border-white/40 shadow-[0_0_15px_rgba(244,114,182,0.4)] hover:scale-105'
                    }`}
                  >
                    {isPopped ? (
                      <CheckCircle2 className="w-3.5 h-3.5 opacity-30" />
                    ) : (
                      <span className="text-sm">🫧</span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <button
              onClick={() => {
                soundEngine.playChime();
                setPoppedBubbles({});
              }}
              className="mt-6 px-6 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer border border-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Bubble Sheet</span>
            </button>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: MINDFUL BREATHING */}
        {/* ========================================================================= */}
        {activeTab === 'breath' && (
          <div className="flex-1 flex flex-col items-center justify-center py-6">
            
            <div className="text-center mb-6">
              <h3 className="font-serif text-xl font-bold text-white mb-1">
                4-4-4 Box Breathing
              </h3>
              <p className="text-xs text-slate-300 font-light">
                Follow the expanding light to reset your nervous system
              </p>
            </div>

            <div className="relative w-56 h-56 flex items-center justify-center">
              
              <motion.div
                animate={{
                  scale: breathPhase === 'Inhale' ? 1.45 : breathPhase === 'Hold' ? 1.45 : 0.85,
                  opacity: breathPhase === 'Inhale' ? 0.8 : breathPhase === 'Hold' ? 0.9 : 0.4,
                }}
                transition={{
                  duration: 4,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 blur-xl"
              />

              <motion.div
                animate={{
                  scale: breathPhase === 'Inhale' ? 1.3 : breathPhase === 'Hold' ? 1.3 : 0.8,
                }}
                transition={{
                  duration: 4,
                  ease: 'easeInOut',
                }}
                className="w-36 h-36 rounded-full border-2 border-cyan-300/60 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md shadow-2xl z-10"
              >
                <Wind className="w-6 h-6 text-cyan-300 mb-1" />
                <span className="font-serif font-bold text-white text-base">
                  {breathPhase}
                </span>
                <span className="text-[10px] text-cyan-200 font-mono">4 seconds</span>
              </motion.div>

            </div>

            <p className="text-xs text-slate-400 font-light mt-8">
              Inhale deeply • Hold your peace • Exhale all college chaos
            </p>

          </div>
        )}

      </div>
    </motion.div>
  );
};

export default CareKitModal;
