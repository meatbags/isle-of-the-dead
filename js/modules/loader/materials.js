/**
 * Load and manage materials.
 **/

class Materials {
  constructor() {
    // preload default mats & maps
    this.mat = {
      default: new THREE.MeshPhysicalMaterial({emissive: 0, roughness: 1, envMapIntensity: 0.25}),
      porcelain: new THREE.MeshPhysicalMaterial({color: 0xffffff, emissive: 0x444444, roughness: 0.55, metalness: 0.125, envMapIntensity: 0.5}),
      metal: new THREE.MeshPhysicalMaterial({color: 0xa88e79, emissive: 0x0, roughness: 0.25, metalness: 1.0, envMapIntensity: 0.5}),
    };
    this.envMap = new THREE.CubeTextureLoader().load(['./assets/envmap/posx.jpg', './assets/envmap/negx.jpg', './assets/envmap/posy.jpg', './assets/envmap/negy.jpg', './assets/envmap/posz.jpg', './assets/envmap/negz.jpg']);
    this.normalMap = new THREE.TextureLoader().load('./assets/textures/noise.jpg');
    this.normalMap.wrapS = this.normalMap.wrapT = THREE.RepeatWrapping;
    this.normalMap.repeat.set(32, 32);

    // set env map for all
    Object.keys(this.mat).forEach(key => {
      if (this.mat[key].type && this.mat[key].type === 'MeshPhysicalMaterial') {
        this.mat[key].envMap = this.envMap;
      }
    });

    // reference for loaded materials
    this.loaded = {};
  }

  conform(mat) {
    // format material attribs
    if (mat.name == 'porcelain') {
      mat.normalScale.x = 0.125;
      mat.normalScale.y = 0.125;
      mat.emissive = this.mat.porcelain.emissive;
      mat.emissiveIntensity = 1.0;
    } else if (mat.name == 'metal') {
      mat.normalScale.x = 0.02;
      mat.normalScale.y = 0.02;
    } else if (mat.name == 'chess') {
      mat.normalScale.x = 0.0625;
      mat.normalScale.y = 0.0625;
    }

    // add to store
    this.loaded[mat.name] = mat;
  }
}

export { Materials };
