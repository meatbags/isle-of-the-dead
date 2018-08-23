const Materials = {
  default: new THREE.MeshPhysicalMaterial({emissive: 0, roughness: 1, envMapIntensity: 0.25}),
  porcelain: new THREE.MeshPhysicalMaterial({color: 0xffffff, emissive: 0x444444, roughness: 0.55, metalness: 0.125, envMapIntensity:0.5}),
  envMap: new THREE.CubeTextureLoader().load([
    './assets/envmap/posx.jpg',
    './assets/envmap/negx.jpg',
    './assets/envmap/posy.jpg',
    './assets/envmap/negy.jpg',
    './assets/envmap/posz.jpg',
    './assets/envmap/negz.jpg',
  ])
};

Materials.porcelain.envMap = Materials.envMap;

export { Materials };
