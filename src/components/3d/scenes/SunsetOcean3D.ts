import * as THREE from 'three';

export interface Ocean3DWorld {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update: (delta: number, time: number) => void;
  destroy: () => void;
  launchBoat: (worryText: string) => void;
  interactiveObjects: THREE.Object3D[];
}

export function createSunsetOcean3D(container: HTMLElement): Ocean3DWorld {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xe08d6c, 0.007);

  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 2000);
  camera.position.set(0, 8, 35);

  const ambientLight = new THREE.AmbientLight(0xffccaa, 0.8);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xff7733, 2.5);
  sunLight.position.set(0, 40, -150);
  scene.add(sunLight);

  const skyGeo = new THREE.SphereGeometry(800, 32, 15);
  const skyMat = new THREE.MeshBasicMaterial({
    color: 0xfa9372,
    side: THREE.BackSide,
  });
  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  scene.add(skyDome);

  const sunGeo = new THREE.SphereGeometry(35, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffeedd });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.position.set(0, 30, -200);
  scene.add(sunMesh);

  const oceanWidth = 500;
  const oceanSegments = 120;
  const oceanGeo = new THREE.PlaneGeometry(oceanWidth, oceanWidth, oceanSegments, oceanSegments);
  oceanGeo.rotateX(-Math.PI / 2);

  const oceanMat = new THREE.MeshStandardMaterial({
    color: 0x1d4e68,
    roughness: 0.1,
    metalness: 0.85,
    flatShading: true,
  });
  const oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
  scene.add(oceanMesh);

  const posAttr = oceanGeo.attributes.position as THREE.BufferAttribute;
  const originalPositions = posAttr.array.slice();

  const cliffGeo = new THREE.ConeGeometry(40, 50, 6);
  const cliffMat = new THREE.MeshStandardMaterial({ color: 0x4a3b32, roughness: 0.9, flatShading: true });
  const cliff = new THREE.Mesh(cliffGeo, cliffMat);
  cliff.position.set(-90, 15, -120);
  scene.add(cliff);

  const cliff2 = new THREE.Mesh(cliffGeo, cliffMat);
  cliff2.position.set(110, 10, -140);
  cliff2.scale.set(0.8, 0.7, 0.8);
  scene.add(cliff2);

  const lighthouseGroup = new THREE.Group();
  const towerGeo = new THREE.CylinderGeometry(2.5, 4, 25, 8);
  const towerMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.5 });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.y = 12.5;
  lighthouseGroup.add(tower);

  const stripeGeo = new THREE.CylinderGeometry(3.1, 3.5, 5, 8);
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xd9383a });
  const stripe = new THREE.Mesh(stripeGeo, stripeMat);
  stripe.position.y = 12.5;
  lighthouseGroup.add(stripe);

  const lanternGeo = new THREE.SphereGeometry(3, 16, 16);
  const lanternMat = new THREE.MeshBasicMaterial({ color: 0xfff0aa });
  const lantern = new THREE.Mesh(lanternGeo, lanternMat);
  lantern.position.y = 26;
  lighthouseGroup.add(lantern);

  const beamGeo = new THREE.ConeGeometry(12, 160, 16, 1, true);
  beamGeo.rotateX(Math.PI / 2);
  beamGeo.translate(0, 0, 80);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xfff5cc,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const beamMesh = new THREE.Mesh(beamGeo, beamMat);
  beamMesh.position.y = 26;
  lighthouseGroup.add(beamMesh);

  lighthouseGroup.position.set(-90, 40, -120);
  scene.add(lighthouseGroup);

  const islandGroup = new THREE.Group();
  const islandSandGeo = new THREE.CylinderGeometry(20, 25, 4, 12);
  const islandSandMat = new THREE.MeshStandardMaterial({ color: 0xf4d5a6, roughness: 0.9 });
  const islandSand = new THREE.Mesh(islandSandGeo, islandSandMat);
  islandGroup.add(islandSand);

  for (let i = 0; i < 3; i++) {
    const trunkGeo = new THREE.CylinderGeometry(0.5, 0.8, 10, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6e4e37 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set((i - 1) * 6, 5, (i % 2) * 4);
    trunk.rotation.z = (Math.random() - 0.5) * 0.3;
    islandGroup.add(trunk);

    const leavesGeo = new THREE.ConeGeometry(5, 4, 6);
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2e8b57, flatShading: true });
    const leaves = new THREE.Mesh(leavesGeo, leavesMat);
    leaves.position.set(trunk.position.x, 10, trunk.position.z);
    islandGroup.add(leaves);
  }

  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512;
  signCanvas.height = 256;
  const ctx = signCanvas.getContext('2d')!;
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 248);
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🏝️ White Beach (Philippines)', 256, 70);
  ctx.font = 'italic 26px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Tropical Escape • Philippines', 256, 130);
  ctx.font = '22px sans-serif';
  ctx.fillStyle = '#fdba74';
  ctx.fillText('Zero Assignments • Endless Sun', 256, 190);

  const signTex = new THREE.CanvasTexture(signCanvas);
  const signGeo = new THREE.PlaneGeometry(16, 8);
  const signMat = new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide });
  const signMesh = new THREE.Mesh(signGeo, signMat);
  signMesh.position.set(0, 8, 0);
  signMesh.name = 'white_beach_sign';
  islandGroup.add(signMesh);

  islandGroup.position.set(65, 0, -60);
  scene.add(islandGroup);

  const boats: { mesh: THREE.Group; speed: number; xOffset: number; baseZ: number }[] = [];

  const createPaperBoat = (_text: string, xPos: number, zPos: number) => {
    const boat = new THREE.Group();
    const hullGeo = new THREE.ConeGeometry(2, 4, 4);
    hullGeo.rotateX(Math.PI / 2);
    hullGeo.scale(1, 0.4, 1.8);
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, flatShading: true });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    boat.add(hull);

    const sailGeo = new THREE.ConeGeometry(1.5, 3, 3);
    sailGeo.rotateZ(Math.PI / 6);
    const sailMat = new THREE.MeshStandardMaterial({ color: 0xffeedd, roughness: 0.2 });
    const sail = new THREE.Mesh(sailGeo, sailMat);
    sail.position.set(0, 1.5, 0);
    boat.add(sail);

    boat.position.set(xPos, 1, zPos);
    boat.scale.set(0.8, 0.8, 0.8);
    scene.add(boat);

    boats.push({ mesh: boat, speed: 0.15 + Math.random() * 0.1, xOffset: xPos, baseZ: zPos });
  };

  createPaperBoat("No Assignments", -15, 10);
  createPaperBoat("Sleep > 2 AM", 12, 5);
  createPaperBoat("Vacation Vibes", 0, -20);

  const gulls: { mesh: THREE.Group; speed: number; radius: number; angle: number; y: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const gull = new THREE.Group();
    const wingMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    
    const leftWingGeo = new THREE.PlaneGeometry(1.5, 0.5);
    leftWingGeo.rotateY(Math.PI / 4);
    const leftWing = new THREE.Mesh(leftWingGeo, wingMat);
    leftWing.position.x = -0.7;
    gull.add(leftWing);

    const rightWingGeo = new THREE.PlaneGeometry(1.5, 0.5);
    rightWingGeo.rotateY(-Math.PI / 4);
    const rightWing = new THREE.Mesh(rightWingGeo, wingMat);
    rightWing.position.x = 0.7;
    gull.add(rightWing);

    scene.add(gull);
    gulls.push({
      speed: 0.01 + Math.random() * 0.015,
      radius: 40 + Math.random() * 60,
      angle: Math.random() * Math.PI * 2,
      y: 20 + Math.random() * 15,
      mesh: gull,
    });
  }

  const update = (_delta: number, time: number) => {
    const pos = oceanGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const origX = originalPositions[i * 3];
      const origZ = originalPositions[i * 3 + 2];
      const wave1 = Math.sin(origX * 0.05 + time * 1.8) * 1.8;
      const wave2 = Math.cos(origZ * 0.06 + time * 1.2) * 1.4;
      const wave3 = Math.sin((origX + origZ) * 0.03 + time * 2.2) * 0.8;
      pos.setY(i, wave1 + wave2 + wave3);
    }
    pos.needsUpdate = true;
    oceanGeo.computeVertexNormals();

    beamMesh.rotation.y = time * 0.8;

    boats.forEach(b => {
      b.baseZ -= b.speed;
      if (b.baseZ < -150) b.baseZ = 40;
      b.mesh.position.z = b.baseZ;
      b.mesh.position.y = 1 + Math.sin(time * 2 + b.xOffset) * 0.5;
      b.mesh.rotation.z = Math.sin(time * 1.5 + b.xOffset) * 0.15;
      b.mesh.rotation.x = Math.cos(time * 1.8) * 0.1;
    });

    gulls.forEach(g => {
      g.angle += g.speed;
      g.mesh.position.x = Math.cos(g.angle) * g.radius;
      g.mesh.position.z = Math.sin(g.angle) * g.radius - 40;
      g.mesh.position.y = g.y + Math.sin(time * 3 + g.angle) * 2;
      g.mesh.rotation.y = -g.angle + Math.PI / 2;
      g.mesh.children[0].rotation.z = Math.sin(time * 12) * 0.4;
      g.mesh.children[1].rotation.z = -Math.sin(time * 12) * 0.4;
    });

    signMesh.rotation.y = Math.sin(time * 0.5) * 0.1;
  };

  const launchBoat = (worryText: string) => {
    createPaperBoat(worryText, (Math.random() - 0.5) * 30, 25);
  };

  const destroy = () => {
    oceanGeo.dispose();
    oceanMat.dispose();
    skyGeo.dispose();
    skyMat.dispose();
    scene.clear();
  };

  return {
    scene,
    camera,
    update,
    destroy,
    launchBoat,
    interactiveObjects: [signMesh, lighthouseGroup, islandGroup],
  };
}
