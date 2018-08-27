const Materials = {
  default: new THREE.MeshPhysicalMaterial({emissive: 0, roughness: 1, envMapIntensity: 0.25}),
  porcelain: new THREE.MeshPhysicalMaterial({color: 0xffffff, emissive: 0x444444, roughness: 0.55, metalness: 0.125, envMapIntensity: 0.5}),
  metal: new THREE.MeshPhysicalMaterial({color: 0xa88e79, emissive: 0x0, roughness: 0.25, metalness: 1.0, envMapIntensity: 0.5}),
  envMap: new THREE.CubeTextureLoader().load(['./assets/envmap/posx.jpg', './assets/envmap/negx.jpg', './assets/envmap/posy.jpg', './assets/envmap/negy.jpg', './assets/envmap/posz.jpg', './assets/envmap/negz.jpg']),
  normalMap: new THREE.TextureLoader().load('./assets/textures/noise.jpg'),
  loaded: {}
};

Materials.normalMap.wrapS = Materials.normalMap.wrapT = THREE.RepeatWrapping;
Materials.normalMap.repeat.set(32, 32);

// set env map for all
Object.keys(Materials).forEach(key => {
  if (Materials[key].type && Materials[key].type === 'MeshPhysicalMaterial') {
    Materials[key].envMap = Materials.envMap;
  }
})

export { Materials };
