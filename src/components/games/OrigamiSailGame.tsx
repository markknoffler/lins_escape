import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, RotateCcw, Trophy, Sparkles, Waves, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../services/soundEngine';

export const OrigamiSailGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('lin_origami_sail_hs') || '0', 10);
  });
  const [activeSteer, setActiveSteer] = useState<'left' | 'right' | null>(null);

  const stateRef = useRef({
    boatX: 450,
    boatY: 340,
    boatVx: 0,
    tilt: 0,
    stars: [] as { x: number; y: number; size: number; speed: number; glow: string }[],
    clouds: [] as { x: number; y: number; width: number; height: number; speed: number }[],
    ripples: [] as { x: number; y: number; r: number; opacity: number }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
    score: 0,
    distance: 0,
    touchTargetX: null as number | null,
    touchIndicator: null as { x: number; y: number; r: number; alpha: number } | null,
  });

  const keysRef = useRef<{ [k: string]: boolean }>({});
  const touchSteerRef = useRef<'left' | 'right' | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Space'].includes(e.code)) {
        keysRef.current[e.code] = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startGame = useCallback(() => {
    soundEngine.playSplash();
    const s = stateRef.current;
    s.boatX = 450;
    s.boatY = 340;
    s.boatVx = 0;
    s.tilt = 0;
    s.stars = [];
    s.clouds = [];
    s.ripples = [];
    s.particles = [];
    s.score = 0;
    s.distance = 0;
    s.touchTargetX = null;
    s.touchIndicator = null;
    touchSteerRef.current = null;
    setActiveSteer(null);

    setScore(0);
    setGameState('playing');
  }, []);

  const gameOver = useCallback(() => {
    soundEngine.playPop();
    const s = stateRef.current;
    s.touchTargetX = null;
    touchSteerRef.current = null;
    setActiveSteer(null);
    setGameState('gameover');
    if (s.score > highScore) {
      setHighScore(s.score);
      localStorage.setItem('lin_origami_sail_hs', s.score.toString());
      confetti({ particleCount: 70, spread: 70 });
    }
  }, [highScore]);

  // Touch Steer Buttons Helpers
  const handleSteerStart = (direction: 'left' | 'right') => {
    soundEngine.playPop();
    touchSteerRef.current = direction;
    stateRef.current.touchTargetX = null; // button overrides target touch
    setActiveSteer(direction);
  };

  const handleSteerEnd = (direction: 'left' | 'right') => {
    if (touchSteerRef.current === direction) {
      touchSteerRef.current = null;
      setActiveSteer(null);
    }
  };

  // Convert Client Coordinate to Canvas Coordinate
  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 450, y: 340 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Canvas Direct Touch Handlers for Mobile
  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (gameState === 'idle' || gameState === 'gameover') {
      startGame();
      return;
    }
    if (e.touches.length > 0) {
      const { x, y } = getCanvasCoords(e.touches[0].clientX, e.touches[0].clientY);
      stateRef.current.touchTargetX = Math.max(70, Math.min(830, x));
      stateRef.current.touchIndicator = { x, y, r: 12, alpha: 0.8 };
    }
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (gameState !== 'playing') return;
    if (e.touches.length > 0) {
      const { x, y } = getCanvasCoords(e.touches[0].clientX, e.touches[0].clientY);
      stateRef.current.touchTargetX = Math.max(70, Math.min(830, x));
      stateRef.current.touchIndicator = { x, y, r: 16, alpha: 0.9 };
    }
  };

  const handleCanvasTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    stateRef.current.touchTargetX = null;
    stateRef.current.touchIndicator = null;
  };

  // Canvas Mouse Click/Drag Handlers for Desktop
  const isMouseDownRef = useRef(false);
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState === 'idle' || gameState === 'gameover') {
      startGame();
      return;
    }
    isMouseDownRef.current = true;
    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    stateRef.current.touchTargetX = Math.max(70, Math.min(830, x));
    stateRef.current.touchIndicator = { x, y, r: 12, alpha: 0.8 };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDownRef.current || gameState !== 'playing') return;
    const { x } = getCanvasCoords(e.clientX, e.clientY);
    stateRef.current.touchTargetX = Math.max(70, Math.min(830, x));
  };

  const handleCanvasMouseUp = () => {
    isMouseDownRef.current = false;
    stateRef.current.touchTargetX = null;
    stateRef.current.touchIndicator = null;
  };

  // 60FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.08);
      lastTime = time;

      const s = stateRef.current;

      // 1. Ocean & Sunset Sky Gradient
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#0a0f1d');
      skyGrad.addColorStop(0.35, '#1e1b4b');
      skyGrad.addColorStop(0.65, '#2e1065');
      skyGrad.addColorStop(0.85, '#0c4a6e');
      skyGrad.addColorStop(1, '#082f49');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starry Sky Embers
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 40; i++) {
        const sx = (i * 29 + (time * 0.015)) % canvas.width;
        const sy = (i * 17) % 230;
        const alpha = Math.sin(time * 0.003 + i) * 0.45 + 0.55;
        ctx.globalAlpha = alpha;
        ctx.fillRect(sx, sy, 2, 2);
      }
      ctx.globalAlpha = 1.0;

      // Ocean Waves (Layer 1 - deep background)
      ctx.fillStyle = 'rgba(12, 74, 110, 0.45)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 35) {
        const waveY = 310 + Math.sin(x * 0.015 + time * 0.0018) * 10;
        ctx.lineTo(x, waveY);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();

      // Ocean Waves (Layer 2 - foreground surf)
      ctx.fillStyle = 'rgba(14, 116, 144, 0.55)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 25) {
        const waveY = 325 + Math.sin(x * 0.022 + time * 0.0028) * 12;
        ctx.lineTo(x, waveY);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();

      if (gameState === 'playing') {
        // Controls Physics: Supports Keyboard, On-Screen Touch Buttons, AND Direct Touch Drag!
        const isLeft = 
          keysRef.current['ArrowLeft'] || 
          keysRef.current['KeyA'] || 
          touchSteerRef.current === 'left';

        const isRight = 
          keysRef.current['ArrowRight'] || 
          keysRef.current['KeyD'] || 
          touchSteerRef.current === 'right';

        if (s.touchTargetX !== null) {
          // Direct Touch / Drag Follow
          const dx = s.touchTargetX - s.boatX;
          if (Math.abs(dx) > 5) {
            const steerForce = Math.sign(dx) * Math.min(Math.abs(dx) * 9 * dt, 13);
            s.boatVx = steerForce;
            s.tilt = Math.sign(dx) * Math.min(Math.abs(dx) / 55, 0.22);
          } else {
            s.boatVx *= 0.85;
            s.tilt *= 0.85;
          }
        } else if (isLeft) {
          s.boatVx -= 28 * dt * 35;
          s.boatVx = Math.max(-12, s.boatVx);
          s.tilt = -0.18;
        } else if (isRight) {
          s.boatVx += 28 * dt * 35;
          s.boatVx = Math.min(12, s.boatVx);
          s.tilt = 0.18;
        } else {
          s.boatVx *= 0.90;
          s.tilt *= 0.88;
        }

        s.boatX += s.boatVx;
        s.boatX = Math.max(70, Math.min(canvas.width - 70, s.boatX));

        // Generate wake ripples when boat moves
        if (Math.abs(s.boatVx) > 1.2 && Math.random() < 0.35) {
          s.ripples.push({
            x: s.boatX + (Math.random() - 0.5) * 16,
            y: s.boatY + 14,
            r: 4,
            opacity: 0.6
          });
        }

        s.distance += dt * 15;
        s.score = Math.floor(s.distance);
        setScore(s.score);

        // Spawn Stars
        if (Math.random() < 0.038) {
          s.stars.push({
            x: Math.random() * (canvas.width - 120) + 60,
            y: -20,
            size: Math.random() * 4 + 4,
            speed: Math.random() * 65 + 105,
            glow: Math.random() > 0.3 ? '#fbbf24' : '#f472b6',
          });
        }

        // Spawn Storm Obstacle Clouds
        if (Math.random() < 0.016) {
          s.clouds.push({
            x: Math.random() * (canvas.width - 140) + 70,
            y: -40,
            width: 52,
            height: 36,
            speed: Math.random() * 50 + 125,
          });
        }

        // Update Stars
        for (let i = s.stars.length - 1; i >= 0; i--) {
          const star = s.stars[i];
          star.y += star.speed * dt;

          // Check Catch by Boat
          const dist = Math.hypot(star.x - s.boatX, star.y - s.boatY);
          if (dist < 44) {
            soundEngine.playChime();
            s.distance += 25;
            for (let j = 0; j < 10; j++) {
              s.particles.push({
                x: star.x,
                y: star.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 0.85,
                color: star.glow,
              });
            }
            s.stars.splice(i, 1);
            continue;
          }

          if (star.y > canvas.height + 20) s.stars.splice(i, 1);
        }

        // Update Clouds
        for (let i = s.clouds.length - 1; i >= 0; i--) {
          const c = s.clouds[i];
          c.y += c.speed * dt;

          const dist = Math.hypot(c.x - s.boatX, c.y - s.boatY);
          if (dist < 36) {
            gameOver();
            break;
          }

          if (c.y > canvas.height + 40) s.clouds.splice(i, 1);
        }
      }

      // Draw Wake Ripples
      for (let i = s.ripples.length - 1; i >= 0; i--) {
        const rp = s.ripples[i];
        rp.r += dt * 18;
        rp.opacity -= dt * 0.9;
        if (rp.opacity <= 0) {
          s.ripples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(56, 189, 248, ${rp.opacity * 0.7})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(rp.x, rp.y, rp.r * 1.5, rp.r * 0.6, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Touch / Drag Finger Indicator
      if (s.touchIndicator && gameState === 'playing') {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(s.touchIndicator.x, s.touchIndicator.y, s.touchIndicator.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Starlight Crystals
      s.stars.forEach(st => {
        ctx.fillStyle = st.glow;
        ctx.shadowColor = st.glow;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Storm Clouds
      s.clouds.forEach(c => {
        ctx.fillStyle = '#475569';
        ctx.shadowColor = '#0f172a';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(c.x - c.width / 2, c.y, c.width, c.height, 14);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.font = '16px serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚡', c.x, c.y + 23);
      });

      // Draw Origami Boat
      ctx.save();
      ctx.translate(s.boatX, s.boatY);
      ctx.rotate(s.tilt);

      // Origami Boat Subtle Glow
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 16;

      // Origami Paper Hull
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-30, 6);
      ctx.lineTo(30, 6);
      ctx.lineTo(18, 20);
      ctx.lineTo(-18, 20);
      ctx.closePath();
      ctx.fill();

      // Origami Sail (Right - Warm Pink)
      ctx.fillStyle = '#fbcfe8';
      ctx.beginPath();
      ctx.moveTo(0, 6);
      ctx.lineTo(0, -28);
      ctx.lineTo(20, 6);
      ctx.closePath();
      ctx.fill();

      // Origami Sail (Left - Vibrant Purple)
      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.moveTo(0, 6);
      ctx.lineTo(0, -24);
      ctx.lineTo(-16, 6);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Draw Starlight Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const pt = s.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= dt * 1.5;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
        ctx.fill();
        if (pt.life <= 0) s.particles.splice(i, 1);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [gameState, highScore, gameOver]);

  return (
    <div className="flex flex-col items-center w-full max-w-5xl py-1 select-none">
      
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between mb-2.5 px-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-500/20 rounded-xl text-cyan-300 border border-cyan-400/30">
            <Waves className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs sm:text-base font-serif font-bold text-white leading-tight">
              Origami Starlight Sail
            </h3>
            <p className="text-[10px] text-cyan-300 font-mono">
              Steer the Paper Boat • Catch Falling Stars
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/40 rounded-xl border border-white/10 text-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300 font-mono text-[11px]">Best: {highScore}</span>
          </div>

          <div className="px-3 py-1 bg-cyan-950/80 rounded-xl border border-cyan-500/40 text-xs font-mono font-bold text-cyan-300 shadow-sm">
            {score} pts
          </div>
        </div>
      </div>

      {/* Canvas Viewport (Mobile Touch Enabled) */}
      <div className="relative w-full aspect-[16/9] max-h-[440px] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-black touch-none">
        <canvas
          ref={canvasRef}
          width={900}
          height={500}
          onTouchStart={handleCanvasTouchStart}
          onTouchMove={handleCanvasTouchMove}
          onTouchEnd={handleCanvasTouchEnd}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          className="w-full h-full object-cover cursor-pointer touch-none select-none"
        />

        {/* Start Overlay */}
        {gameState === 'idle' && (
          <div 
            onClick={startGame}
            onTouchStart={(e) => {
              e.preventDefault();
              startGame();
            }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 cursor-pointer touch-none"
          >
            <span className="text-4xl mb-2 animate-bounce">⛵</span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1.5">
              Sail into the Peaceful Sunset
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-sm mb-5 leading-relaxed pointer-events-none">
              <span className="text-cyan-300 font-bold">📱 Phone:</span> Drag finger on water or use the <span className="text-cyan-300 font-bold">◀ ▶ buttons</span> below.<br />
              <span className="text-purple-300 font-bold">💻 Desktop:</span> Arrow Keys or A / D.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                e.preventDefault();
                startGame();
              }}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-serif font-bold text-sm shadow-xl flex items-center gap-2 transition active:scale-95 cursor-pointer border border-white/30"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Begin Sailing ⛵</span>
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div 
            onClick={startGame}
            onTouchStart={(e) => {
              e.preventDefault();
              startGame();
            }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 cursor-pointer touch-none"
          >
            <span className="text-4xl mb-1">🌊</span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-cyan-300 mb-1">
              Ocean Drift Complete!
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 mb-5 pointer-events-none">
              You sailed <span className="text-amber-300 font-bold text-base">{score} starlight points</span> across the sea!
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                e.preventDefault();
                startGame();
              }}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-serif font-bold text-xs sm:text-sm shadow-xl flex items-center gap-2 transition active:scale-95 cursor-pointer border border-white/30"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Sail Again ⛵</span>
            </button>
          </div>
        )}
      </div>

      {/* Tactile On-Screen Steer Buttons (Essential for Phone Gaming!) */}
      <div className="w-full mt-3 flex items-center justify-between gap-3">
        {/* Left Steer Button */}
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            handleSteerStart('left');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleSteerEnd('left');
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            handleSteerEnd('left');
          }}
          onMouseDown={() => handleSteerStart('left')}
          onMouseUp={() => handleSteerEnd('left')}
          onMouseLeave={() => handleSteerEnd('left')}
          className={`flex-1 py-3 px-4 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer touch-none select-none active:scale-95 ${
            activeSteer === 'left'
              ? 'bg-cyan-500/40 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-98'
              : 'bg-black/50 hover:bg-white/10 border-white/20 text-cyan-200 shadow-md'
          }`}
        >
          <ChevronLeft className="w-5 h-5 text-cyan-300" />
          <span className="text-xs sm:text-sm font-bold font-serif tracking-wide">
            Steer Left
          </span>
        </button>

        {/* Right Steer Button */}
        <button
          type="button"
          onTouchStart={(e) => {
            e.preventDefault();
            handleSteerStart('right');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleSteerEnd('right');
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            handleSteerEnd('right');
          }}
          onMouseDown={() => handleSteerStart('right')}
          onMouseUp={() => handleSteerEnd('right')}
          onMouseLeave={() => handleSteerEnd('right')}
          className={`flex-1 py-3 px-4 rounded-2xl border transition-all flex items-center justify-center gap-2 cursor-pointer touch-none select-none active:scale-95 ${
            activeSteer === 'right'
              ? 'bg-cyan-500/40 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-98'
              : 'bg-black/50 hover:bg-white/10 border-white/20 text-cyan-200 shadow-md'
          }`}
        >
          <span className="text-xs sm:text-sm font-bold font-serif tracking-wide">
            Steer Right
          </span>
          <ChevronRight className="w-5 h-5 text-cyan-300" />
        </button>
      </div>

      {/* Controls Legend / Help Footer */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1.5 mt-2.5 text-[11px] text-slate-300 font-medium px-2 text-center">
        <span className="text-cyan-200">
          📱 <strong>Phone:</strong> Drag on water or hold <strong>◀ ▶</strong> buttons to steer
        </span>
        <span className="flex items-center gap-1 text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Catch Starlight ✨ • Dodge Thunderclouds ⚡</span>
        </span>
      </div>

    </div>
  );
};

export default OrigamiSailGame;
