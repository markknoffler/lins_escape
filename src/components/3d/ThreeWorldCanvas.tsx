import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Camera, Navigation, Send, Flame, Sparkles } from 'lucide-react';
import type { SceneId } from '../../types';
import { soundEngine } from '../../services/soundEngine';

import { createSunsetOcean3D } from './scenes/SunsetOcean3D';
import { createNightCity3D } from './scenes/NightCity3D';
import { createStarryMountain3D } from './scenes/StarryMountain3D';
import { createPeacefulBlossom3D } from './scenes/PeacefulBlossom3D';

interface ThreeWorldCanvasProps {
  sceneId: SceneId;
}

export const ThreeWorldCanvas: React.FC<ThreeWorldCanvasProps> = ({ sceneId }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<any>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const [cameraMode, setCameraMode] = useState<'cinematic' | 'freelook'>('cinematic');
  const [hudMessage, setHudMessage] = useState<string | null>(null);
  const [interactiveActionText, setInteractiveActionText] = useState('');

  const mouseState = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
  });

  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const showHudNotice = (msg: string) => {
    setHudMessage(msg);
    setTimeout(() => setHudMessage(null), 4500);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    let world: any;
    if (sceneId === 'beach') {
      world = createSunsetOcean3D(container);
    } else if (sceneId === 'night_city') {
      world = createNightCity3D(container);
    } else if (sceneId === 'mountains') {
      world = createStarryMountain3D(container);
    } else if (sceneId === 'blossom_meadow') {
      world = createPeacefulBlossom3D(container);
    } else {
      world = createSunsetOcean3D(container);
    }

    worldRef.current = world;
    cameraRef.current = world.camera;

    let animId: number;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      const cam = cameraRef.current;
      if (cam) {
        if (cameraMode === 'cinematic') {
          if (sceneId === 'beach') {
            cam.position.x = Math.sin(time * 0.2) * 15;
            cam.position.y = 7 + Math.sin(time * 0.3) * 2.5;
            cam.position.z = 30 + Math.cos(time * 0.15) * 8;
            cam.lookAt(0, 5, -50);
          } else if (sceneId === 'mountains') {
            cam.position.x = Math.sin(time * 0.15) * 20;
            cam.position.y = 8 + Math.sin(time * 0.2) * 3;
            cam.position.z = 25 + Math.cos(time * 0.15) * 6;
            cam.lookAt(0, 3, 0);
          } else if (sceneId === 'blossom_meadow') {
            cam.position.x = Math.sin(time * 0.2) * 18;
            cam.position.y = 7 + Math.cos(time * 0.25) * 2;
            cam.position.z = 22 + Math.sin(time * 0.15) * 8;
            cam.lookAt(-5, 6, -10);
          } else if (sceneId === 'night_city') {
            cam.position.x = Math.sin(time * 0.1) * 3;
            cam.position.y = 3.5 + Math.sin(time * 0.15) * 0.3;
            cam.position.z = 20 - (time * 2) % 40;
            cam.lookAt(0, 3, cam.position.z - 20);
          }
        } else if (cameraMode === 'freelook') {
          const speed = 12 * delta;
          const dir = new THREE.Vector3();
          cam.getWorldDirection(dir);
          const side = new THREE.Vector3(-dir.z, 0, dir.x).normalize();

          if (keysPressed.current['KeyW'] || keysPressed.current['ArrowUp']) {
            cam.position.addScaledVector(dir, speed);
          }
          if (keysPressed.current['KeyS'] || keysPressed.current['ArrowDown']) {
            cam.position.addScaledVector(dir, -speed);
          }
          if (keysPressed.current['KeyA'] || keysPressed.current['ArrowLeft']) {
            cam.position.addScaledVector(side, -speed);
          }
          if (keysPressed.current['KeyD'] || keysPressed.current['ArrowRight']) {
            cam.position.addScaledVector(side, speed);
          }
        }
      }

      world.update(delta, time);
      renderer.render(world.scene, world.camera);

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    const handleResize = () => {
      if (!container || !renderer || !cameraRef.current) return;
      cameraRef.current.aspect = container.clientWidth / container.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      world.destroy();
      renderer.dispose();
    };
  }, [sceneId, cameraMode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const world = worldRef.current;
    const camera = cameraRef.current;
    if (!container || !world || !camera) return;

    const rect = container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(world.scene.children, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      let root = hit.object;
      while (root.parent && root.parent !== world.scene) {
        root = root.parent;
      }

      if (root.name === 'white_beach_sign') {
        showHudNotice('🏝️ Secret Portal: Sunset Ocean Shore — Zero clinical duties • Endless sun & waves.');
      } else if (root.name === 'mithun') {
        soundEngine.playChime();
        showHudNotice('🐂 “Aapke yaha bhi mithun milte h? 😭🙏” — The Sacred Mithun smiles peacefully.');
      } else if (root.name === 'campfire') {
        soundEngine.playAmbient('fire');
        world.triggerShootingStar?.();
        showHudNotice('🔥 Warm embers crackling. A shooting star blazes across the sky!');
      } else if (root.name === 'chalkboard') {
        showHudNotice('📜 Menu: "Chef Lin\'s Post-Hospital Chole Bhature & Momos — Curfew Repealed"');
      } else if (root.name === 'math_art_mesh') {
        soundEngine.playPop();
        world.changeMathFormula?.('rose');
        showHudNotice('🌸 3D Parametric flower curve morphed!');
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseState.current.isDragging = true;
    mouseState.current.prevX = e.clientX;
    mouseState.current.prevY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseState.current.isDragging || !cameraRef.current) return;
    const dx = e.clientX - mouseState.current.prevX;
    const dy = e.clientY - mouseState.current.prevY;

    if (cameraMode === 'freelook') {
      const euler = new THREE.Euler(0, 0, 0, 'YXZ');
      euler.setFromQuaternion(cameraRef.current.quaternion);
      euler.y -= dx * 0.003;
      euler.x -= dy * 0.003;
      euler.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, euler.x));
      cameraRef.current.quaternion.setFromEuler(euler);
    }

    mouseState.current.prevX = e.clientX;
    mouseState.current.prevY = e.clientY;
  };

  const handleMouseUp = () => {
    mouseState.current.isDragging = false;
  };

  const handlePrimaryAction = () => {
    const world = worldRef.current;
    if (!world) return;

    if (sceneId === 'beach') {
      soundEngine.playSplash();
      world.launchBoat?.(interactiveActionText.trim() || '2 AM Assignments');
      showHudNotice('⛵ Origami boat sailed out over the golden waves into the sunset.');
      setInteractiveActionText('');
    } else if (sceneId === 'mountains') {
      soundEngine.playChime();
      world.triggerShootingStar?.();
      showHudNotice('💫 Shooting star blazing across the Milky Way!');
    } else if (sceneId === 'blossom_meadow') {
      soundEngine.playPop();
      world.changeMathFormula?.('rose');
      showHudNotice('🌸 3D Parametric Rose Knot bloomed in the sky!');
    }
  };

  return (
    <div className="relative w-full h-[88vh] select-none overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
      <div 
        ref={containerRef}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {hudMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-6 py-2.5 rounded-full bg-black/80 border border-amber-400/50 text-amber-200 text-xs md:text-sm font-medium shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{hudMessage}</span>
        </div>
      )}

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 text-xs">
        <span className="text-slate-300 text-[11px] px-2 font-mono hidden sm:inline">Camera:</span>
        <button
          onClick={() => {
            soundEngine.playPop();
            setCameraMode('cinematic');
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
            cameraMode === 'cinematic' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          Cinematic Cruise
        </button>

        <button
          onClick={() => {
            soundEngine.playPop();
            setCameraMode('freelook');
            showHudNotice('🕹️ WASD / Arrows to Move • Click & Drag to Look around!');
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
            cameraMode === 'freelook' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          3D Walk / Fly (WASD)
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4">
        <div className="glass-panel p-3 md:p-4 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl flex items-center gap-3">
          
          {sceneId === 'beach' ? (
            <>
              <input
                type="text"
                value={interactiveActionText}
                onChange={(e) => setInteractiveActionText(e.target.value)}
                placeholder="Fold a worry into a paper boat..."
                className="flex-1 bg-black/50 border border-white/20 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={handlePrimaryAction}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg transition active:scale-95 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Sail 3D Boat ⛵</span>
              </button>
            </>
          ) : sceneId === 'mountains' ? (
            <div className="w-full flex items-center justify-between gap-2">
              <span className="text-xs text-emerald-200 font-medium hidden sm:inline">
                🌲 Walk up to the 3D Sacred Mithun or campfire in the forest!
              </span>
              <button
                onClick={handlePrimaryAction}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4" />
                <span>Cast 3D Shooting Star ✨</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between gap-2">
              <span className="text-xs text-purple-200 font-medium">
                🌸 Click and fly through the 3D landscape! Look around with mouse.
              </span>
              <button
                onClick={handlePrimaryAction}
                className="px-5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg transition active:scale-95 cursor-pointer"
              >
                Morph 3D Art 🎨
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ThreeWorldCanvas;
