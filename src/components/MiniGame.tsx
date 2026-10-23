import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Play, RotateCcw, Trophy, Zap, Shield, Sparkles, Coffee, Waves, Gamepad2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../services/soundEngine';
import { getAssetUrl } from '../utils/assets';
import { ZenLatteArtGame } from './games/ZenLatteArtGame';
import { OrigamiSailGame } from './games/OrigamiSailGame';

interface MiniGameProps {
  onClose: () => void;
}

export const MiniGame: React.FC<MiniGameProps> = ({ onClose }) => {
  const [activeGameTab, setActiveGameTab] = useState<'dash' | 'latte' | 'sail'>('dash');

  // =========================================================================
  // GAME 1: CAMPUS CURFEW DASH (TUNED LEISURELY SCENERY TRANSITIONS)
  // =========================================================================
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('lin_campus_dash_hs') || '0', 10);
  });
  const [combo, setCombo] = useState(1);
  const [shieldActive, setShieldActive] = useState(false);
  const [speedBoostActive, setSpeedBoostActive] = useState(false);

  const stageSceneries = [
    getAssetUrl('/assets/scenes/scenary_2.png'),
    getAssetUrl('/assets/scenes/scenary_3.png'),
    getAssetUrl('/assets/scenes/scenary_4.png'),
    getAssetUrl('/assets/scenes/scenary_5.png'),
    getAssetUrl('/assets/scenes/scenary_6.png')
  ];

  const loadedImagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    stageSceneries.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      loadedImagesRef.current[idx] = img;
    });
  }, []);

  const stateRef = useRef({
    playerY: 340,
    playerVy: 0,
    isJumping: false,
    jumpCount: 0,
    gravity: 0.82,
    jumpPower: -15.2,
    groundY: 340,
    speed: 6.8,
    distance: 0,
    screenShake: 0,
    comboCount: 0,
    comboMultiplier: 1,
    obstacles: [] as { x: number; y: number; width: number; height: number; label: string; icon: string; color: string }[],
    powerups: [] as { x: number; y: number; type: 'coffee' | 'boba' | 'samosa' | 'pass'; icon: string; label: string }[],
    floatingTexts: [] as { x: number; y: number; text: string; color: string; life: number }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }[],
    bgOffset: 0,
    lastObstacleTime: 0,
    lastPowerupTime: 0,
    shield: false,
    speedBoostTimer: 0,
    score: 0,
    stageIndex: 0,
  });

  const jump = () => {
    const s = stateRef.current;
    if (s.jumpCount < 2) {
      soundEngine.playPop();
      s.playerVy = s.jumpPower;
      s.isJumping = true;
      s.jumpCount++;

      for (let i = 0; i < 14; i++) {
        s.particles.push({
          x: 130,
          y: s.playerY + 44,
          vx: (Math.random() - 0.5) * 7,
          vy: Math.random() * 4 + 1,
          life: 1.0,
          size: Math.random() * 4 + 2,
          color: s.jumpCount === 2 ? '#fbbf24' : '#c084fc',
        });
      }
    }
  };

  const startDashGame = () => {
    soundEngine.playChime();
    const s = stateRef.current;
    s.playerY = 340;
    s.playerVy = 0;
    s.isJumping = false;
    s.jumpCount = 0;
    s.speed = 6.8;
    s.distance = 0;
    s.screenShake = 0;
    s.comboCount = 0;
    s.comboMultiplier = 1;
    s.obstacles = [];
    s.powerups = [];
    s.floatingTexts = [];
    s.particles = [];
    s.shield = false;
    s.speedBoostTimer = 0;
    s.score = 0;
    s.stageIndex = 0;
    s.lastObstacleTime = performance.now();
    s.lastPowerupTime = performance.now();

    setScore(0);
    setCombo(1);
    setShieldActive(false);
    setSpeedBoostActive(false);
    setGameState('playing');
  };

  const gameDashOver = () => {
    soundEngine.playPop();
    const s = stateRef.current;
    s.screenShake = 18;
    setGameState('gameover');
    if (s.score > highScore) {
      setHighScore(s.score);
      localStorage.setItem('lin_campus_dash_hs', s.score.toString());
      confetti({ particleCount: 90, spread: 80 });
    }
  };

  useEffect(() => {
    if (activeGameTab !== 'dash') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const s = stateRef.current;

      ctx.save();
      if (s.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * s.screenShake;
        const shakeY = (Math.random() - 0.5) * s.screenShake;
        ctx.translate(shakeX, shakeY);
        s.screenShake *= 0.88;
        if (s.screenShake < 0.5) s.screenShake = 0;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentBgImg = loadedImagesRef.current[s.stageIndex % loadedImagesRef.current.length];
      if (currentBgImg && currentBgImg.complete) {
        ctx.globalAlpha = 0.55;
        const bgW = canvas.width;
        const bgH = canvas.height;
        const offset = s.bgOffset % bgW;
        ctx.drawImage(currentBgImg, -offset, 0, bgW, bgH);
        ctx.drawImage(currentBgImg, bgW - offset, 0, bgW, bgH);
        ctx.globalAlpha = 1.0;
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, '#0f0c29');
        grad.addColorStop(0.5, '#302b63');
        grad.addColorStop(1, '#24243e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.fillStyle = 'rgba(8, 8, 17, 0.38)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const groundY = 390;
      ctx.fillStyle = 'rgba(15, 12, 35, 0.92)';
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.75)';
      ctx.lineWidth = 3;
      for (let x = -(s.bgOffset * 2.4) % 55; x < canvas.width; x += 55) {
        ctx.beginPath();
        ctx.moveTo(x, groundY + 16);
        ctx.lineTo(x + 28, groundY + 16);
        ctx.stroke();
      }

      if (gameState === 'playing') {
        const currentSpeed = s.speedBoostTimer > 0 ? s.speed * 1.45 : s.speed;
        s.bgOffset += currentSpeed * dt * 55;
        s.distance += currentSpeed * dt * 10 * s.comboMultiplier;
        s.score = Math.floor(s.distance);
        setScore(s.score);

        // Fixed Leisurely Scenery Shifts every 500m (instead of fast rushing!)
        const newStage = Math.floor(s.score / 500) % stageSceneries.length;
        if (newStage !== s.stageIndex) {
          s.stageIndex = newStage;
          s.floatingTexts.push({
            x: canvas.width / 2,
            y: 90,
            text: '✨ NEW SANCTUARY DISCOVERED! ✨',
            color: '#fbbf24',
            life: 1.8
          });
        }

        if (s.speedBoostTimer > 0) {
          s.speedBoostTimer -= dt;
          if (s.speedBoostTimer <= 0) setSpeedBoostActive(false);
        }

        s.playerVy += s.gravity;
        s.playerY += s.playerVy;
        if (s.playerY >= 340) {
          s.playerY = 340;
          s.playerVy = 0;
          s.isJumping = false;
          s.jumpCount = 0;
        }

        if (time - s.lastObstacleTime > Math.max(1400, 2500 - s.score * 1.5)) {
          s.lastObstacleTime = time;
          const obstacleTypes = [
            { label: '11 PM GATE', icon: '🔒', width: 38, height: 50, color: '#f43f5e' },
            { label: 'JURY SHEET', icon: '📑', width: 34, height: 44, color: '#fb7185' },
            { label: 'WARDEN ALARM', icon: '🚨', width: 36, height: 48, color: '#f59e0b' }
          ];
          const choice = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
          s.obstacles.push({
            x: canvas.width + 60,
            y: groundY - choice.height,
            width: choice.width,
            height: choice.height,
            label: choice.label,
            icon: choice.icon,
            color: choice.color
          });
        }

        if (time - s.lastPowerupTime > 3800) {
          s.lastPowerupTime = time;
          const powerupTypes: ('coffee' | 'boba' | 'samosa' | 'pass')[] = ['coffee', 'boba', 'samosa', 'pass'];
          const pType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
          const icons = { coffee: '☕', boba: '🧋', samosa: '🥟', pass: '📜' };
          const labels = { coffee: '+Speed', boba: 'Shield', samosa: '+25 Pts', pass: 'Exemption!' };
          s.powerups.push({
            x: canvas.width + 60,
            y: groundY - 55 - Math.random() * 65,
            type: pType,
            icon: icons[pType],
            label: labels[pType]
          });
        }

        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const ob = s.obstacles[i];
          ob.x -= currentSpeed * dt * 65;

          const playerBox = { x: 120, y: s.playerY, w: 38, h: 48 };
          if (
            playerBox.x < ob.x + ob.width &&
            playerBox.x + playerBox.w > ob.x &&
            playerBox.y < ob.y + ob.height &&
            playerBox.y + playerBox.h > ob.y
          ) {
            if (s.shield) {
              s.shield = false;
              setShieldActive(false);
              s.obstacles.splice(i, 1);
              soundEngine.playPop();
              s.screenShake = 10;
              s.floatingTexts.push({ x: ob.x, y: ob.y, text: 'SHIELD BROKEN!', color: '#38bdf8', life: 1.0 });
              continue;
            } else {
              gameDashOver();
              break;
            }
          }

          if (ob.x < -70) {
            s.obstacles.splice(i, 1);
            s.comboCount++;
            if (s.comboCount % 3 === 0 && s.comboMultiplier < 4) {
              s.comboMultiplier++;
              setCombo(s.comboMultiplier);
              soundEngine.playChime();
              s.floatingTexts.push({ x: 140, y: s.playerY - 20, text: `${s.comboMultiplier}x COMBO! 🔥`, color: '#f43f5e', life: 1.0 });
            }
          }
        }

        for (let i = s.powerups.length - 1; i >= 0; i--) {
          const p = s.powerups[i];
          p.x -= currentSpeed * dt * 65;

          const playerBox = { x: 120, y: s.playerY, w: 38, h: 48 };
          if (
            playerBox.x < p.x + 30 &&
            playerBox.x + playerBox.w > p.x &&
            playerBox.y < p.y + 30 &&
            playerBox.y + playerBox.h > p.y
          ) {
            soundEngine.playChime();
            if (p.type === 'coffee') {
              s.speedBoostTimer = 4.5;
              setSpeedBoostActive(true);
              s.floatingTexts.push({ x: p.x, y: p.y, text: '☕ CHAI SPEED BOOST!', color: '#fbbf24', life: 1.0 });
            } else if (p.type === 'boba') {
              s.shield = true;
              setShieldActive(true);
              s.floatingTexts.push({ x: p.x, y: p.y, text: '🧋 BOBA SHIELD ACTIVE!', color: '#38bdf8', life: 1.0 });
            } else if (p.type === 'samosa') {
              s.distance += 25;
              s.floatingTexts.push({ x: p.x, y: p.y, text: '+25 SAMOSA PTS!', color: '#f472b6', life: 1.0 });
            } else if (p.type === 'pass') {
              s.distance += 100;
              s.floatingTexts.push({ x: p.x, y: p.y, text: '📜 100M EXEMPTION PASS!', color: '#a78bfa', life: 1.5 });
              confetti({ particleCount: 35, spread: 60 });
            }
            s.powerups.splice(i, 1);
            continue;
          }

          if (p.x < -60) s.powerups.splice(i, 1);
        }
      }

      s.obstacles.forEach(ob => {
        ctx.fillStyle = ob.color;
        ctx.shadowColor = ob.color;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.roundRect(ob.x, ob.y, ob.width, ob.height, 10);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = '22px serif';
        ctx.textAlign = 'center';
        ctx.fillText(ob.icon, ob.x + ob.width / 2, ob.y + ob.height / 2 + 7);
      });

      s.powerups.forEach(p => {
        const bob = Math.sin(time * 0.006 + p.x) * 5;
        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.icon, p.x + 15, p.y + 20 + bob);
      });

      const px = 120;
      const py = s.playerY;

      if (s.shield) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(px + 18, py + 24, 32, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      if (s.speedBoostTimer > 0) {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.35)';
        ctx.beginPath();
        ctx.arc(px - 20, py + 24, 22, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.arc(px + 18, py + 14, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(px + 17, py + 12, 12, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px + 6, py + 9, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.roundRect(px + 11, py + 24, 16, 18, 5);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(px + 3, py + 25, 9, 16, 4);
      ctx.fill();

      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 3.5;
      const legCycle = Math.sin(time * 0.022) * 10;
      ctx.beginPath();
      ctx.moveTo(px + 15, py + 42);
      ctx.lineTo(px + 11 - legCycle, py + 52);
      ctx.moveTo(px + 22, py + 42);
      ctx.lineTo(px + 26 + legCycle, py + 52);
      ctx.stroke();

      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const ft = s.floatingTexts[i];
        ft.y -= 40 * dt;
        ft.life -= dt;
        ctx.font = 'bold 15px Outfit, sans-serif';
        ctx.fillStyle = ft.color;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        if (ft.life <= 0) s.floatingTexts.splice(i, 1);
      }

      for (let i = s.particles.length - 1; i >= 0; i--) {
        const pt = s.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= dt * 1.5;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        if (pt.life <= 0) s.particles.splice(i, 1);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (gameState === 'playing') jump();
        else if (gameState === 'idle' || gameState === 'gameover') startDashGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, highScore, activeGameTab]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 select-none overflow-hidden"
    >
      {/* Semi-Transparent Glassmorphic Backdrop revealing fixed background */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/45 backdrop-blur-md cursor-pointer"
      />

      {/* Spacious, Immersive Game Container (Mobile Scroll Enabled) */}
      <div className="relative z-10 w-full max-w-5xl bg-black/80 backdrop-blur-2xl p-3.5 sm:p-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center max-h-[94vh] overflow-y-auto">
        
        {/* Top Header & 3-Game Selector Tabs */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
          
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-float-slow">🎮</span>
            <div>
              <h2 className="text-sm sm:text-base font-serif font-bold text-white tracking-wide">
                Lin's Relaxation Arcade
              </h2>
              <p className="text-[10px] text-purple-300 font-mono">
                Pure Fun • Zero Evaluations Attached
              </p>
            </div>
          </div>

          {/* Clean 3-Game Tab Buttons (Mobile Horizontally Scrollable) */}
          <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-2xl border border-white/15 text-xs overflow-x-auto max-w-full flex-nowrap">
            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveGameTab('dash');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeGameTab === 'dash'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Curfew Dash 🏃‍♀️</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveGameTab('latte');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeGameTab === 'latte'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Zen Latte Art ☕</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                setActiveGameTab('sail');
              }}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeGameTab === 'sail'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              <span>Origami Sail ⛵</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Content 1: Campus Dash */}
        {activeGameTab === 'dash' && (
          <div className="w-full flex flex-col items-center">
            
            {/* HUD Status */}
            <div className="w-full flex items-center justify-between mb-3 px-2">
              <span className="text-xs text-purple-200 font-medium">
                🏃‍♀️ Sprint past curfews and juries across peaceful 500m scenic stages!
              </span>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-xl border border-white/10 text-xs">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-slate-300 font-mono">Best: {highScore}m</span>
                </div>

                <div className="px-3.5 py-1 bg-purple-900/60 rounded-xl border border-purple-500/30 text-xs font-mono font-bold text-amber-300">
                  {score}m {combo > 1 && <span className="text-rose-400">({combo}x)</span>}
                </div>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="relative w-full aspect-[16/9] max-h-[460px] rounded-2xl overflow-hidden border border-white/20 shadow-inner bg-black">
              <canvas
                ref={canvasRef}
                width={1000}
                height={520}
                onClick={() => {
                  if (gameState === 'playing') jump();
                  else if (gameState === 'idle' || gameState === 'gameover') startDashGame();
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  if (gameState === 'playing') jump();
                  else if (gameState === 'idle' || gameState === 'gameover') startDashGame();
                }}
                className="w-full h-full object-cover cursor-pointer touch-none"
              />

              {/* Active Buffs HUD */}
              <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                {shieldActive && (
                  <div className="px-3 py-1 bg-sky-500/80 backdrop-blur-md rounded-xl text-xs font-bold text-white flex items-center gap-1.5 border border-sky-300/40 animate-pulse">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Boba Shield</span>
                  </div>
                )}
                {speedBoostActive && (
                  <div className="px-3 py-1 bg-amber-500/80 backdrop-blur-md rounded-xl text-xs font-bold text-black flex items-center gap-1.5 border border-amber-300/40 animate-bounce">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Chai Speed Boost</span>
                  </div>
                )}
              </div>

              {/* Idle Start Overlay */}
              {gameState === 'idle' && (
                <div 
                  onClick={startDashGame}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    startDashGame();
                  }}
                  className="absolute inset-0 bg-black/65 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 cursor-pointer touch-none"
                >
                  <h3 className="text-2xl sm:text-3xl font-serif font-black text-white mb-2">
                    Curfew in 2 Minutes, Lin! 🏃‍♀️💨
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-6 leading-relaxed pointer-events-none">
                    Press <span className="text-amber-300 font-bold">Spacebar</span> or tap the screen to jump & double-jump over curfews and evaluations!
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startDashGame();
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      startDashGame();
                    }}
                    className="px-9 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-bold text-base shadow-2xl flex items-center gap-2.5 transition active:scale-95 cursor-pointer border border-white/30"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Campus Run</span>
                  </button>
                </div>
              )}

              {/* Game Over Overlay */}
              {gameState === 'gameover' && (
                <div 
                  onClick={startDashGame}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    startDashGame();
                  }}
                  className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 cursor-pointer touch-none"
                >
                  <span className="text-4xl mb-1">😵</span>
                  <h3 className="text-2xl font-serif font-black text-rose-400 mb-1">
                    Caught at the Hostel Gate!
                  </h3>
                  <p className="text-sm text-slate-300 mb-5 pointer-events-none">
                    You dashed <span className="text-amber-300 font-bold">{score} meters</span> of campus chaos!
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startDashGame();
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      startDashGame();
                    }}
                    className="px-9 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-bold text-sm shadow-2xl flex items-center gap-2 transition active:scale-95 cursor-pointer border border-white/30"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Try Again (Spacebar)</span>
                  </button>
                </div>
              )}
            </div>

            <div className="w-full flex items-center justify-between mt-3 text-xs text-slate-300 font-medium px-2">
              <span>⌨️ Controls: Space / W / Up Arrow / Tap to Jump (Double Jump supported)</span>
              <span className="flex items-center gap-1.5 text-purple-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Powerups: ☕ Chai Speed • 🧋 Boba Shield • 🥟 +25 Pts • 📜 Exemption</span>
              </span>
            </div>
          </div>
        )}

        {/* Tab Content 2: Zen Latte Art */}
        {activeGameTab === 'latte' && <ZenLatteArtGame />}

        {/* Tab Content 3: Origami Starlight Sail */}
        {activeGameTab === 'sail' && <OrigamiSailGame />}

      </div>
    </motion.div>
  );
};

export default MiniGame;
