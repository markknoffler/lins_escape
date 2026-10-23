import * as THREE from 'three';

export interface Blossom3DWorld {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  update: (delta: number, time: number) => void;
  destroy: () => void;
  interactiveObjects: THREE.Object3D[];
  changeMathFormula: (type: string) => void;
}

export function createPeacefulBlossom3D(container: HTMLElement): Blossom3DWorld {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xd6e8ee, 0.008);

  const camera = new THREE.PerspectiveCamera(58, container.clientWidth / container.clientHeight, 0.1, 1200);
  camera.position.set(0, 6, 24);

  const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff0bb, 2.0);
  sunLight.position.set(40, 80, 50);
  scene.add(sunLight);

  const skyGeo = new THREE.SphereGeometry(600, 32, 16);
  const skyMat = new THREE.MeshBasicMaterial({ color: 0x8ecae6, side: THREE.BackSide });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);

  const hillWidth = 350;
  const hillGeo = new THREE.PlaneGeometry(hillWidth, hillWidth, 64, 64);
  hillGeo.rotateX(-Math.PI / 2);

  const posAttr = hillGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    const y = Math.sin(x * 0.03) * 6 + Math.cos(z * 0.035) * 5 + Math.sin((x + z) * 0.02) * 3;
    posAttr.setY(i, y);
  }
  hillGeo.computeVertexNormals();

  const hillMat = new THREE.MeshStandardMaterial({
    color: 0x65a30d,
    roughness: 0.8,
    flatShading: true,
  });
  const hillMesh = new THREE.Mesh(hillGeo, hillMat);
  scene.add(hillMesh);

  const treeGroup = new THREE.Group();
  const trunkGeo = new THREE.CylinderGeometry(0.8, 1.8, 12, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a2c17, roughness: 0.9 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 6;
  treeGroup.add(trunk);

  const blossomMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.6, flatShading: true });
  for (let i = 0; i < 9; i++) {
    const bGeo = new THREE.SphereGeometry(3 + Math.random() * 2, 8, 8);
    const bMesh = new THREE.Mesh(bGeo, blossomMat);
    const angle = (i * Math.PI * 2) / 9;
    bMesh.position.set(Math.cos(angle) * 4, 11 + Math.sin(i) * 2, Math.sin(angle) * 4);
    treeGroup.add(bMesh);
  }
  const topBlossom = new THREE.Mesh(new THREE.SphereGeometry(4.5, 8, 8), blossomMat);
  topBlossom.position.set(0, 13, 0);
  treeGroup.add(topBlossom);

  treeGroup.position.set(-15, 4, -10);
  scene.add(treeGroup);

  const petalCount = 800;
  const petalGeo = new THREE.BufferGeometry();
  const petalPos = new Float32Array(petalCount * 3);
  for (let i = 0; i < petalCount; i++) {
    petalPos[i * 3] = (Math.random() - 0.5) * 80;
    petalPos[i * 3 + 1] = 1 + Math.random() * 25;
    petalPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
  }
  petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPos, 3));
  const petalMat = new THREE.PointsMaterial({
    color: 0xfbcfe8,
    size: 0.35,
    transparent: true,
    opacity: 0.85,
  });
  const petals = new THREE.Points(petalGeo, petalMat);
  scene.add(petals);

  const mathGroup = new THREE.Group();
  
  let mathSculpture: THREE.Mesh = new THREE.Mesh(
    new THREE.TorusKnotGeometry(3.5, 0.9, 128, 32, 2, 3),
    new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      metalness: 0.8,
      roughness: 0.2,
    })
  );
  mathGroup.add(mathSculpture);

  const ringGeo = new THREE.RingGeometry(5.5, 5.8, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xc084fc, side: THREE.DoubleSide });
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  mathGroup.add(ring1);
  const ring2 = new THREE.Mesh(ringGeo, ringMat);
  ring2.rotation.x = Math.PI / 2;
  mathGroup.add(ring2);

  mathGroup.position.set(10, 12, -8);
  mathGroup.name = 'math_art_sculpture';
  scene.add(mathGroup);

  const mathLight = new THREE.PointLight(0xa855f7, 2.5, 20);
  mathLight.position.copy(mathGroup.position);
  scene.add(mathLight);

  const update = (_delta: number, time: number) => {
    const pos = petalGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < petalCount; i++) {
      let x = pos.getX(i) + Math.cos(time * 0.5 + i) * 0.08 + 0.05;
      let y = pos.getY(i) - 0.04;
      let z = pos.getZ(i) + Math.sin(time * 0.5 + i) * 0.08;

      if (y < 1 || x > 40) {
        y = 20 + Math.random() * 5;
        x = -40;
        z = (Math.random() - 0.5) * 80;
      }
      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;

    mathGroup.rotation.x = time * 0.6;
    mathGroup.rotation.y = time * 0.8;
    mathGroup.position.y = 12 + Math.sin(time * 1.5) * 1.2;

    ring1.rotation.z = time * 1.2;
    ring2.rotation.y = -time * 1.2;
  };

  const changeMathFormula = (type: string) => {
    mathGroup.remove(mathSculpture);
    mathSculpture.geometry.dispose();

    let newGeo: THREE.BufferGeometry;
    if (type === 'rose') {
      newGeo = new THREE.TorusKnotGeometry(3.5, 0.8, 120, 30, 3, 7);
    } else if (type === 'spiral') {
      newGeo = new THREE.TorusGeometry(3.8, 1.2, 30, 100);
    } else {
      newGeo = new THREE.IcosahedronGeometry(4, 2);
    }
    
    mathSculpture = new THREE.Mesh(
      newGeo,
      new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        metalness: 0.8,
        roughness: 0.2,
      })
    );
    mathGroup.add(mathSculpture);
  };

  const destroy = () => {
    hillGeo.dispose();
    hillMat.dispose();
    petalGeo.dispose();
    petalMat.dispose();
    scene.clear();
  };

  return {
    scene,
    camera,
    update,
    destroy,
    interactiveObjects: [mathGroup, treeGroup],
    changeMathFormula,
  };
}
