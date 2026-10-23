import * as THREE from 'three';

export interface SpaceVoid3DWorld {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update: (delta: number, time: number) => void;
  destroy: () => void;
  interactiveObjects: THREE.Object3D[];
  launchAssignmentMissile: (text: string) => void;
}

export function createSpaceVoid3D(container: HTMLElement): SpaceVoid3DWorld {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060814, 0.005);

  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 2000);
  camera.position.set(0, 8, 30);

  const ambientLight = new THREE.AmbientLight(0x334466, 1.2);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
  sunLight.position.set(50, 50, 50);
  scene.add(sunLight);

  const starCount = 3000;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 800;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 800;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 800;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0x93c5fd,
    size: 2.0,
    transparent: true,
    opacity: 0.8,
  });
  const starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  const holeGroup = new THREE.Group();
  
  const coreGeo = new THREE.SphereGeometry(14, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const core = new THREE.Mesh(coreGeo, coreMat);
  holeGroup.add(core);

  for (let r = 0; r < 4; r++) {
    const ringGeo = new THREE.RingGeometry(16 + r * 6, 20 + r * 6, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: r % 2 === 0 ? 0x06b6d4 : 0xf43f5e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45 - r * 0.08,
      blending: THREE.AdditiveBlending,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    holeGroup.add(ring);
  }

  holeGroup.position.set(0, 15, -160);
  scene.add(holeGroup);

  const platformGroup = new THREE.Group();
  const baseGeo = new THREE.CylinderGeometry(14, 16, 2, 8);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.8,
    roughness: 0.3,
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  platformGroup.add(base);

  const holoGeo = new THREE.RingGeometry(11, 12.5, 32);
  holoGeo.rotateX(-Math.PI / 2);
  const holoMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
  const holoRing = new THREE.Mesh(holoGeo, holoMat);
  holoRing.position.y = 1.05;
  platformGroup.add(holoRing);

  platformGroup.position.set(0, 0, 10);
  scene.add(platformGroup);

  const cannonGroup = new THREE.Group();
  const barrelGeo = new THREE.CylinderGeometry(1.4, 2.0, 8, 12);
  barrelGeo.rotateX(Math.PI / 3);
  const barrelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.1 });
  const barrel = new THREE.Mesh(barrelGeo, barrelMat);
  barrel.position.set(0, 4, 0);
  cannonGroup.add(barrel);

  const cRingGeo = new THREE.TorusGeometry(2.2, 0.25, 8, 24);
  cRingGeo.rotateX(Math.PI / 3);
  const cRingMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
  const cRing = new THREE.Mesh(cRingGeo, cRingMat);
  cRing.position.set(0, 5.5, -2);
  cannonGroup.add(cRing);

  cannonGroup.position.set(0, 1, 12);
  cannonGroup.name = 'space_cannon';
  scene.add(cannonGroup);

  interface Missile {
    mesh: THREE.Group;
    target: THREE.Vector3;
    progress: number;
  }
  const activeMissiles: Missile[] = [];

  const launchAssignmentMissile = (_text: string) => {
    const missile = new THREE.Group();

    const bookGeo = new THREE.BoxGeometry(2.5, 3.2, 0.8);
    const bookMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, metalness: 0.4, roughness: 0.4 });
    const book = new THREE.Mesh(bookGeo, bookMat);
    missile.add(book);

    const trailGeo = new THREE.SphereGeometry(1.2, 8, 8);
    const trailMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, blending: THREE.AdditiveBlending });
    const trail = new THREE.Mesh(trailGeo, trailMat);
    trail.position.set(0, -1.8, 0);
    missile.add(trail);

    missile.position.copy(cannonGroup.position).add(new THREE.Vector3(0, 5, -3));
    scene.add(missile);

    activeMissiles.push({
      mesh: missile,
      target: holeGroup.position.clone().add(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, 0)),
      progress: 0,
    });
  };

  const update = (_delta: number, time: number) => {
    holeGroup.rotation.z = time * 0.8;
    holeGroup.rotation.y = Math.sin(time * 0.3) * 0.2;
    starField.rotation.y = time * 0.02;
    cannonGroup.rotation.y = Math.sin(time * 0.8) * 0.15;

    for (let i = activeMissiles.length - 1; i >= 0; i--) {
      const m = activeMissiles[i];
      m.progress += 0.025;

      m.mesh.position.lerp(m.target, 0.035);
      m.mesh.rotation.x += 0.2;
      m.mesh.rotation.y += 0.25;

      const scale = Math.max(0.01, 1 - m.progress * 0.8);
      m.mesh.scale.set(scale, scale, scale);

      if (m.progress >= 1 || m.mesh.position.distanceTo(m.target) < 15) {
        scene.remove(m.mesh);
        activeMissiles.splice(i, 1);
      }
    }
  };

  const destroy = () => {
    starGeo.dispose();
    starMat.dispose();
    scene.clear();
  };

  return {
    scene,
    camera,
    update,
    destroy,
    interactiveObjects: [cannonGroup, platformGroup],
    launchAssignmentMissile,
  };
}
