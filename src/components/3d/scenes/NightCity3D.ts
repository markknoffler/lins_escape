import * as THREE from 'three';

export interface NightCity3DWorld {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update: (delta: number, time: number) => void;
  destroy: () => void;
  interactiveObjects: THREE.Object3D[];
}

export function createNightCity3D(container: HTMLElement): NightCity3DWorld {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a18, 0.015);

  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 800);
  camera.position.set(0, 4, 30);

  const ambientLight = new THREE.AmbientLight(0x221144, 1.2);
  scene.add(ambientLight);

  const roadLength = 400;
  const roadGeo = new THREE.PlaneGeometry(24, roadLength);
  roadGeo.rotateX(-Math.PI / 2);
  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x0f1118,
    roughness: 0.15,
    metalness: 0.8,
  });
  const road = new THREE.Mesh(roadGeo, roadMat);
  scene.add(road);

  const walkGeo = new THREE.BoxGeometry(6, 0.4, roadLength);
  const walkMat = new THREE.MeshStandardMaterial({ color: 0x1f2430, roughness: 0.7 });
  const walkL = new THREE.Mesh(walkGeo, walkMat);
  walkL.position.set(-15, 0.2, 0);
  scene.add(walkL);

  const walkR = new THREE.Mesh(walkGeo, walkMat);
  walkR.position.set(15, 0.2, 0);
  scene.add(walkR);

  const buildings: THREE.Mesh[] = [];
  const neonSigns: THREE.Mesh[] = [];

  const neonTexts = [
    { title: 'CLOY 24/7', sub: 'Crash Landing On You', color: '#f43f5e', glow: 0xf43f5e },
    { title: 'Spotify lo-fi Blend', sub: 'Statistically Suspicious 🎧', color: '#10b981', glow: 0x10b981 },
    { title: '심야 라멘 (Midnight Ramen)', sub: '"Tastes better than it looks"', color: '#f59e0b', glow: 0xf59e0b },
    { title: 'No Curfew Zone', sub: '11:00 PM Permanent Exemption', color: '#06b6d4', glow: 0x06b6d4 },
    { title: 'Hostel Escape Bar', sub: 'Clean Water & Boba 🧋', color: '#a855f7', glow: 0xa855f7 },
  ];

  for (let i = 0; i < 24; i++) {
    const isLeft = i % 2 === 0;
    const zPos = (Math.floor(i / 2) * -32) + 20;
    const height = 35 + Math.random() * 45;
    const width = 16 + Math.random() * 10;
    const depth = 22;

    const bGeo = new THREE.BoxGeometry(width, height, depth);
    const bMat = new THREE.MeshStandardMaterial({
      color: 0x0d111d,
      roughness: 0.6,
      metalness: 0.2,
    });
    const building = new THREE.Mesh(bGeo, bMat);
    building.position.set(isLeft ? -26 - width / 2 : 26 + width / 2, height / 2, zPos);
    scene.add(building);
    buildings.push(building);

    if (i < 10) {
      const info = neonTexts[i % neonTexts.length];
      const signCanvas = document.createElement('canvas');
      signCanvas.width = 512;
      signCanvas.height = 256;
      const sCtx = signCanvas.getContext('2d')!;
      sCtx.fillStyle = '#050711';
      sCtx.fillRect(0, 0, 512, 256);
      sCtx.strokeStyle = info.color;
      sCtx.lineWidth = 10;
      sCtx.strokeRect(6, 6, 500, 244);

      sCtx.fillStyle = info.color;
      sCtx.font = 'bold 36px sans-serif';
      sCtx.textAlign = 'center';
      sCtx.fillText(info.title, 256, 90);

      sCtx.fillStyle = '#ffffff';
      sCtx.font = 'bold 22px sans-serif';
      sCtx.fillText(info.sub, 256, 170);

      const signTex = new THREE.CanvasTexture(signCanvas);
      const signGeo = new THREE.PlaneGeometry(10, 5);
      const signMat = new THREE.MeshBasicMaterial({ map: signTex });
      const sign = new THREE.Mesh(signGeo, signMat);
      
      sign.position.set(
        isLeft ? -13 : 13,
        10 + Math.random() * 6,
        zPos + (Math.random() - 0.5) * 8
      );
      sign.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
      scene.add(sign);
      neonSigns.push(sign);

      const neonLight = new THREE.PointLight(info.glow, 2.5, 25, 1.2);
      neonLight.position.set(isLeft ? -11 : 11, 8, zPos);
      scene.add(neonLight);
    }
  }

  const rainCount = 1800;
  const rainGeo = new THREE.BufferGeometry();
  const rainPos = new Float32Array(rainCount * 3);
  for (let i = 0; i < rainCount; i++) {
    rainPos[i * 3] = (Math.random() - 0.5) * 80;
    rainPos[i * 3 + 1] = Math.random() * 50;
    rainPos[i * 3 + 2] = (Math.random() - 0.5) * 350;
  }
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
  const rainMat = new THREE.PointsMaterial({
    color: 0x93c5fd,
    size: 0.15,
    transparent: true,
    opacity: 0.6,
  });
  const rain = new THREE.Points(rainGeo, rainMat);
  scene.add(rain);

  const cartGroup = new THREE.Group();
  const cartBodyGeo = new THREE.BoxGeometry(6, 3, 4);
  const cartBodyMat = new THREE.MeshStandardMaterial({ color: 0x5c3317 });
  const cartBody = new THREE.Mesh(cartBodyGeo, cartBodyMat);
  cartBody.position.y = 1.5;
  cartGroup.add(cartBody);

  const canopyGeo = new THREE.ConeGeometry(5, 1.5, 4);
  canopyGeo.rotateY(Math.PI / 4);
  const canopyMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  canopy.position.y = 4;
  cartGroup.add(canopy);

  for (let i = 0; i < 2; i++) {
    const lanternGeo = new THREE.SphereGeometry(0.5, 12, 12);
    const lanternMat = new THREE.MeshBasicMaterial({ color: 0xff3333 });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(-2 + i * 4, 3.2, 2.2);
    cartGroup.add(lantern);

    const light = new THREE.PointLight(0xff4422, 2.0, 10);
    light.position.copy(lantern.position);
    cartGroup.add(light);
  }

  cartGroup.position.set(-14, 0.4, 5);
  cartGroup.name = 'ramen_cart';
  scene.add(cartGroup);

  const update = (_delta: number, _time: number) => {
    const pos = rainGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < rainCount; i++) {
      let y = pos.getY(i) - 1.2;
      let z = pos.getZ(i);
      if (y < 0) {
        y = 50;
      }
      pos.setXYZ(i, pos.getX(i), y, z);
    }
    pos.needsUpdate = true;

    camera.position.z -= 0.18;
    if (camera.position.z < -200) {
      camera.position.z = 25;
    }
  };

  const destroy = () => {
    roadGeo.dispose();
    roadMat.dispose();
    rainGeo.dispose();
    rainMat.dispose();
    scene.clear();
  };

  return {
    scene,
    camera,
    update,
    destroy,
    interactiveObjects: [cartGroup, ...neonSigns],
  };
}
