import * as THREE from 'three';

export interface Cafe3DWorld {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update: (delta: number, time: number) => void;
  destroy: () => void;
  interactiveObjects: THREE.Object3D[];
  changeLatteArt: (name: string) => void;
}

export function createCozyCafe3D(container: HTMLElement): Cafe3DWorld {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x1a120b, 0.025);

  const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 3.5, 7);

  // 1. Warm Interior Lighting
  const ambientLight = new THREE.AmbientLight(0xffecd6, 0.9);
  scene.add(ambientLight);

  const lampLight1 = new THREE.PointLight(0xffaa44, 2.5, 12, 1.2);
  lampLight1.position.set(0, 5, 2);
  scene.add(lampLight1);

  const lampLight2 = new THREE.PointLight(0xff7722, 2.0, 10, 1.5);
  lampLight2.position.set(-3, 4, -1);
  scene.add(lampLight2);

  // 2. Room Architecture
  const roomGeo = new THREE.BoxGeometry(16, 8, 16);
  const roomMat = new THREE.MeshStandardMaterial({
    color: 0x3d271d,
    roughness: 0.8,
    side: THREE.BackSide,
  });
  const room = new THREE.Mesh(roomGeo, roomMat);
  room.position.y = 4;
  scene.add(room);

  const floorGeo = new THREE.PlaneGeometry(16, 16);
  floorGeo.rotateX(-Math.PI / 2);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x2b1810,
    roughness: 0.3,
    metalness: 0.1,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  scene.add(floor);

  // 3. Huge Rainy Window Looking Out
  const windowFrameGeo = new THREE.BoxGeometry(8, 5, 0.2);
  const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x1f140e });
  const windowFrame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
  windowFrame.position.set(0, 4, -7.9);
  scene.add(windowFrame);

  const glassGeo = new THREE.PlaneGeometry(7.6, 4.6);
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x88bbdd,
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
  });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(0, 4, -7.8);
  scene.add(glass);

  // Outside Rainy Bokeh Backdrop
  const backdropCanvas = document.createElement('canvas');
  backdropCanvas.width = 512;
  backdropCanvas.height = 256;
  const bCtx = backdropCanvas.getContext('2d')!;
  bCtx.fillStyle = '#0a0d1a';
  bCtx.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 40; i++) {
    bCtx.beginPath();
    const bx = Math.random() * 512;
    const by = Math.random() * 256;
    const br = 4 + Math.random() * 16;
    bCtx.arc(bx, by, br, 0, Math.PI * 2);
    const colors = ['rgba(255, 180, 80, 0.4)', 'rgba(56, 189, 248, 0.35)', 'rgba(236, 72, 153, 0.35)'];
    bCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    bCtx.fill();
  }
  const backdropTex = new THREE.CanvasTexture(backdropCanvas);
  const backdropGeo = new THREE.PlaneGeometry(12, 7);
  const backdropMat = new THREE.MeshBasicMaterial({ map: backdropTex });
  const backdrop = new THREE.Mesh(backdropGeo, backdropMat);
  backdrop.position.set(0, 4, -8.5);
  scene.add(backdrop);

  // 4. Center Wooden Coffee Table
  const tableGroup = new THREE.Group();
  const tableTopGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.15, 24);
  const tableTopMat = new THREE.MeshStandardMaterial({ color: 0x543829, roughness: 0.4 });
  const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
  tableTop.position.y = 2;
  tableGroup.add(tableTop);

  const tableLegGeo = new THREE.CylinderGeometry(0.12, 0.12, 2, 8);
  const tableLegMat = new THREE.MeshStandardMaterial({ color: 0x1a120b });
  for (let i = 0; i < 3; i++) {
    const leg = new THREE.Mesh(tableLegGeo, tableLegMat);
    const angle = (i * Math.PI * 2) / 3;
    leg.position.set(Math.cos(angle) * 1.4, 1, Math.sin(angle) * 1.4);
    leg.rotation.z = Math.sin(angle) * 0.1;
    tableGroup.add(leg);
  }
  tableGroup.position.set(0, 0, 3);
  scene.add(tableGroup);

  // 5. 3D Ceramic Coffee Mug & Steaming Particle System
  const mugGroup = new THREE.Group();
  const mugBodyGeo = new THREE.CylinderGeometry(0.35, 0.3, 0.6, 16);
  const mugBodyMat = new THREE.MeshStandardMaterial({ color: 0xfaf5ee, roughness: 0.2 });
  const mugBody = new THREE.Mesh(mugBodyGeo, mugBodyMat);
  mugGroup.add(mugBody);

  const latteCanvas = document.createElement('canvas');
  latteCanvas.width = 256;
  latteCanvas.height = 256;
  const lCtx = latteCanvas.getContext('2d')!;
  
  const drawLatteArt = (text: string) => {
    lCtx.fillStyle = '#533422';
    lCtx.fillRect(0, 0, 256, 256);
    lCtx.fillStyle = '#fce7d2';
    lCtx.beginPath();
    lCtx.arc(128, 128, 90, 0, Math.PI * 2);
    lCtx.fill();
    lCtx.fillStyle = '#4a2c17';
    lCtx.font = 'bold 32px sans-serif';
    lCtx.textAlign = 'center';
    lCtx.fillText(text, 128, 140);
  };
  drawLatteArt('🐱 Kitty');

  const latteTex = new THREE.CanvasTexture(latteCanvas);
  const latteGeo = new THREE.CircleGeometry(0.32, 16);
  latteGeo.rotateX(-Math.PI / 2);
  const latteMat = new THREE.MeshBasicMaterial({ map: latteTex });
  const latteMesh = new THREE.Mesh(latteGeo, latteMat);
  latteMesh.position.y = 0.29;
  mugGroup.add(latteMesh);

  mugGroup.position.set(0, 2.38, 3.2);
  mugGroup.name = 'coffee_mug';
  scene.add(mugGroup);

  const steamCount = 35;
  const steamGeo = new THREE.BufferGeometry();
  const steamPos = new Float32Array(steamCount * 3);
  const steamVelocities: { x: number; y: number; z: number }[] = [];

  for (let i = 0; i < steamCount; i++) {
    steamPos[i * 3] = mugGroup.position.x + (Math.random() - 0.5) * 0.15;
    steamPos[i * 3 + 1] = mugGroup.position.y + 0.3 + Math.random() * 0.8;
    steamPos[i * 3 + 2] = mugGroup.position.z + (Math.random() - 0.5) * 0.15;
    steamVelocities.push({
      x: (Math.random() - 0.5) * 0.02,
      y: 0.015 + Math.random() * 0.02,
      z: (Math.random() - 0.5) * 0.02,
    });
  }
  steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
  const steamMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.12,
    transparent: true,
    opacity: 0.35,
  });
  const steamPoints = new THREE.Points(steamGeo, steamMat);
  scene.add(steamPoints);

  // 6. 3D Chalkboard Menu on Wall
  const menuCanvas = document.createElement('canvas');
  menuCanvas.width = 512;
  menuCanvas.height = 512;
  const mCtx = menuCanvas.getContext('2d')!;
  mCtx.fillStyle = '#18201a';
  mCtx.fillRect(0, 0, 512, 512);
  mCtx.strokeStyle = '#b45309';
  mCtx.lineWidth = 12;
  mCtx.strokeRect(6, 6, 500, 500);

  mCtx.fillStyle = '#fbbf24';
  mCtx.font = 'bold 36px sans-serif';
  mCtx.textAlign = 'center';
  mCtx.fillText('☕ CLOY Café Special', 256, 60);

  mCtx.fillStyle = '#ffffff';
  mCtx.font = 'bold 24px sans-serif';
  mCtx.fillText('— CHEF’S REPUTATION MENU —', 256, 105);

  mCtx.fillStyle = '#fde68a';
  mCtx.font = '22px sans-serif';
  mCtx.fillText('🥘 Lin’s Post-Hospital Chole Bhature', 256, 160);
  mCtx.fillStyle = '#cbd5e1';
  mCtx.font = 'italic 18px sans-serif';
  mCtx.fillText('"100% Celebratory Comfort Food 😌"', 256, 190);

  mCtx.fillStyle = '#fde68a';
  mCtx.font = '22px sans-serif';
  mCtx.fillText('🥟 Samreedh’s 50-Rupee Street Momos', 256, 250);
  mCtx.fillStyle = '#cbd5e1';
  mCtx.font = 'italic 18px sans-serif';
  mCtx.fillText('"12 Pieces • Extra Fiery Chutney"', 256, 280);

  mCtx.fillStyle = '#67e8f9';
  mCtx.font = 'bold 20px sans-serif';
  mCtx.fillText('⛔ 11:00 PM Curfew: REPEALED', 256, 360);
  mCtx.fillText('🚫 Ward Postings: BANNED', 256, 400);
  mCtx.fillText('😴 Bedtime: Whenever you want', 256, 440);

  const menuTex = new THREE.CanvasTexture(menuCanvas);
  const menuGeo = new THREE.PlaneGeometry(3.5, 3.5);
  const menuMat = new THREE.MeshBasicMaterial({ map: menuTex });
  const menuBoard = new THREE.Mesh(menuGeo, menuMat);
  menuBoard.position.set(-6.5, 4, 0);
  menuBoard.rotation.y = Math.PI / 2;
  menuBoard.name = 'chalkboard_menu';
  scene.add(menuBoard);

  // 7. 3D Sleeping Cat on Windowsill
  const catGroup = new THREE.Group();
  const catBodyGeo = new THREE.SphereGeometry(0.35, 12, 12);
  catBodyGeo.scale(1.4, 0.8, 1);
  const catMat = new THREE.MeshStandardMaterial({ color: 0xec9a5b, roughness: 0.9 });
  const catBody = new THREE.Mesh(catBodyGeo, catMat);
  catGroup.add(catBody);

  const catHeadGeo = new THREE.SphereGeometry(0.22, 12, 12);
  const catHead = new THREE.Mesh(catHeadGeo, catMat);
  catHead.position.set(0.4, 0.15, 0);
  catGroup.add(catHead);

  const earGeo = new THREE.ConeGeometry(0.08, 0.15, 4);
  const earL = new THREE.Mesh(earGeo, catMat);
  earL.position.set(0.45, 0.35, 0.1);
  catGroup.add(earL);
  const earR = new THREE.Mesh(earGeo, catMat);
  earR.position.set(0.45, 0.35, -0.1);
  catGroup.add(earR);

  catGroup.position.set(2.6, 1.8, -7.5);
  catGroup.name = 'sleeping_cat';
  scene.add(catGroup);

  const update = (_delta: number, time: number) => {
    lampLight1.intensity = 2.4 + Math.sin(time * 8) * 0.15;
    lampLight2.intensity = 1.9 + Math.cos(time * 6) * 0.12;

    const pos = steamGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < steamCount; i++) {
      let y = pos.getY(i) + steamVelocities[i].y;
      let x = pos.getX(i) + steamVelocities[i].x + Math.sin(time * 2 + i) * 0.002;
      let z = pos.getZ(i) + steamVelocities[i].z;

      if (y > mugGroup.position.y + 1.2) {
        y = mugGroup.position.y + 0.3;
        x = mugGroup.position.x + (Math.random() - 0.5) * 0.15;
        z = mugGroup.position.z + (Math.random() - 0.5) * 0.15;
      }
      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;

    catBody.scale.y = 0.8 + Math.sin(time * 2) * 0.04;
  };

  const changeLatteArt = (name: string) => {
    drawLatteArt(name);
    latteTex.needsUpdate = true;
  };

  const destroy = () => {
    roomGeo.dispose();
    roomMat.dispose();
    floorGeo.dispose();
    floorMat.dispose();
    scene.clear();
  };

  return {
    scene,
    camera,
    update,
    destroy,
    interactiveObjects: [mugGroup, menuBoard, catGroup],
    changeLatteArt,
  };
}
