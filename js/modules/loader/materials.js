const Materials = {
  default: new THREE.MeshPhysicalMaterial({emissive: 0, roughness: 1, envMapIntensity: 0.25}),
};

Materials.default.envMap = new THREE.CubeTextureLoader().load([
  './assets/envmap/posx.jpg',
  './assets/envmap/negx.jpg',
  './assets/envmap/posy.jpg',
  './assets/envmap/negy.jpg',
  './assets/envmap/posz.jpg',
  './assets/envmap/negz.jpg',
]);

export { Materials };
