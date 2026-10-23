import * as THREE from 'three';

export interface Mountain3DWorld {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update: (delta: number, time: number) => void;
  destroy: () => void;
  interactiveObjects: THREE.Object3D[];
  triggerShootingStar: () => void;
}

export function createStarryMountain3D(container: HTMLElement): Mountain3DWorld {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a1020, 0.009);

  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1500);
  camera.position.set(0, 7, 28);

  const ambientLight = new THREE.AmbientLight(0x223355, 0.9);
  scene.add(ambientLight);

  const moonLight = new THREE.DirectionalLight(0xaaccff, 1.2);
  moonLight.position.set(-60, 100, -80);
  scene.add(moonLight);

  const starCount = 2500;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const radius = 600 + Math.random() * 200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 0.9);
    starPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = radius * Math.cos(phi);
    starPos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.8,
    transparent: true,
    opacity: 0.9,
  });
  const starDome = new THREE.Points(starGeo, starMat);
  scene.add(starDome);

  const auroraGeo = new THREE.CylinderGeometry(300, 320, 80, 48, 8, true);
  const auroraMat = new THREE.MeshBasicMaterial({
    color: 0x34d399,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const aurora = new THREE.Mesh(auroraGeo, auroraMat);
  aurora.position.set(0, 120, -250);
  scene.add(aurora);

  const mountainMat = new THREE.MeshStandardMaterial({
    color: 0x182030,
    roughness: 0.9,
    flatShading: true,
  });
  for (let i = 0; i < 7; i++) {
    const mGeo = new THREE.ConeGeometry(50 + Math.random() * 40, 120 + Math.random() * 60, 6);
    const m = new THREE.Mesh(mGeo, mountainMat);
    m.position.set(-200 + i * 70 + (Math.random() - 0.5) * 30, 40, -180 + (Math.random() - 0.5) * 60);
    scene.add(m);
  }

  const terrainGeo = new THREE.PlaneGeometry(300, 300, 32, 32);
  terrainGeo.rotateX(-Math.PI / 2);
  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0x142018,
    roughness: 0.95,
    flatShading: true,
  });
  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  scene.add(terrain);

  const treeMat = new THREE.MeshStandardMaterial({ color: 0x0f291e, roughness: 0.8, flatShading: true });
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d271d });

  for (let i = 0; i < 45; i++) {
    const tree = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.4, 0.6, 4, 6);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 2;
    tree.add(trunk);

    for (let c = 0; c < 3; c++) {
      const coneGeo = new THREE.ConeGeometry(3.5 - c * 0.8, 4.5, 6);
      const cone = new THREE.Mesh(coneGeo, treeMat);
      cone.position.y = 4.5 + c * 2.5;
      tree.add(cone);
    }

    const tX = (Math.random() - 0.5) * 160;
    const tZ = (Math.random() - 0.5) * 140 - 30;
    if (Math.hypot(tX, tZ) > 18) {
      tree.position.set(tX, 0, tZ);
      scene.add(tree);
    }
  }

  const fireGroup = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const stoneGeo = new THREE.DodecahedronGeometry(0.6);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
    const stone = new THREE.Mesh(stoneGeo, stoneMat);
    const angle = (i * Math.PI * 2) / 8;
    stone.position.set(Math.cos(angle) * 1.6, 0.4, Math.sin(angle) * 1.6);
    fireGroup.add(stone);
  }

  const logGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.5, 6);
  const logMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
  for (let i = 0; i < 3; i++) {
    const log = new THREE.Mesh(logGeo, logMat);
    log.position.y = 0.5;
    log.rotation.z = Math.PI / 4;
    log.rotation.y = (i * Math.PI) / 3;
    fireGroup.add(log);
  }

  const flameGeo = new THREE.ConeGeometry(0.8, 2.2, 8);
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xff7700, blending: THREE.AdditiveBlending });
  const flame = new THREE.Mesh(flameGeo, flameMat);
  flame.position.y = 1.2;
  fireGroup.add(flame);

  const fireLight = new THREE.PointLight(0xff7722, 3.5, 22, 1.4);
  fireLight.position.set(0, 1.8, 0);
  fireGroup.add(fireLight);

  fireGroup.position.set(0, 0, 0);
  scene.add(fireGroup);

  const emberCount = 60;
  const emberGeo = new THREE.BufferGeometry();
  const emberPos = new Float32Array(emberCount * 3);
  for (let i = 0; i < emberCount; i++) {
    emberPos[i * 3] = (Math.random() - 0.5) * 1.2;
    emberPos[i * 3 + 1] = Math.random() * 4;
    emberPos[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
  }
  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
  const emberMat = new THREE.PointsMaterial({
    color: 0xfbbf24,
    size: 0.15,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });
  const embers = new THREE.Points(emberGeo, emberMat);
  scene.add(embers);

  const mithunGroup = new THREE.Group();
  const mithunMat = new THREE.MeshStandardMaterial({ color: 0x382216, roughness: 0.8 });
  const whiteSockMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.8 });

  const bodyGeo = new THREE.BoxGeometry(4, 2.5, 2);
  const body = new THREE.Mesh(bodyGeo, mithunMat);
  body.position.y = 2.2;
  mithunGroup.add(body);

  const headGeo = new THREE.BoxGeometry(1.6, 1.8, 1.4);
  const head = new THREE.Mesh(headGeo, mithunMat);
  head.position.set(2.4, 3, 0);
  mithunGroup.add(head);

  const hornGeo = new THREE.ConeGeometry(0.2, 1.8, 6);
  const hornMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 });
  const hornL = new THREE.Mesh(hornGeo, hornMat);
  hornL.position.set(2.2, 4, 0.9);
  hornL.rotation.x = Math.PI / 4;
  hornL.rotation.z = -Math.PI / 6;
  mithunGroup.add(hornL);

  const hornR = new THREE.Mesh(hornGeo, hornMat);
  hornR.position.set(2.2, 4, -0.9);
  hornR.rotation.x = -Math.PI / 4;
  hornR.rotation.z = -Math.PI / 6;
  mithunGroup.add(hornR);

  for (let x = -1.2; x <= 1.2; x += 2.4) {
    for (let z = -0.7; z <= 0.7; z += 1.4) {
      const legGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 6);
      const leg = new THREE.Mesh(legGeo, mithunMat);
      leg.position.set(x, 1, z);
      mithunGroup.add(leg);

      const footGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.6, 6);
      const foot = new THREE.Mesh(footGeo, whiteSockMat);
      foot.position.set(x, 0.3, z);
      mithunGroup.add(foot);
    }
  }

  mithunGroup.position.set(-10, 0, -6);
  mithunGroup.rotation.y = Math.PI / 4;
  mithunGroup.name = 'sacred_mithun';
  scene.add(mithunGroup);

  let shootingStarMesh: THREE.Line | null = null;
  const triggerShootingStar = () => {
    if (shootingStarMesh) scene.remove(shootingStarMesh);
    const p1 = new THREE.Vector3((Math.random() - 0.5) * 200, 150 + Math.random() * 50, -200);
    const p2 = p1.clone().add(new THREE.Vector3(60, -40, 20));
    const sGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const sMat = new THREE.LineBasicMaterial({ color: 0xffeedd, linewidth: 3 });
    shootingStarMesh = new THREE.Line(sGeo, sMat);
    scene.add(shootingStarMesh);
    setTimeout(() => {
      if (shootingStarMesh) {
        scene.remove(shootingStarMesh);
        shootingStarMesh = null;
      }
    }, 900);
  };

  const update = (_delta: number, time: number) => {
    fireLight.intensity = 3.2 + Math.sin(time * 14) * 0.5 + Math.cos(time * 22) * 0.3;
    flame.scale.y = 1 + Math.sin(time * 12) * 0.2;
    flame.scale.x = 1 + Math.cos(time * 10) * 0.15;

    const pos = emberGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < emberCount; i++) {
      let y = pos.getY(i) + 0.04;
      let x = pos.getX(i) + Math.sin(time * 3 + i) * 0.01;
      let z = pos.getZ(i) + Math.cos(time * 3 + i) * 0.01;
      if (y > 5) {
        y = 0.5;
        x = (Math.random() - 0.5) * 1.2;
        z = (Math.random() - 0.5) * 1.2;
      }
      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;

    aurora.rotation.y = time * 0.04;
    starDome.rotation.y = time * 0.005;
    head.rotation.y = Math.sin(time * 1.2) * 0.08;
  };

  const destroy = () => {
    terrainGeo.dispose();
    terrainMat.dispose();
    starGeo.dispose();
    starMat.dispose();
    scene.clear();
  };

  return {
    scene,
    camera,
    update,
    destroy,
    interactiveObjects: [mithunGroup, fireGroup],
    triggerShootingStar,
  };
}
