import '../../lib/loaders';

class LoadOBJ {
  constructor(path) {
    // load OBJ files
    this.path = path;
    this.materials = {};
    this.images = {};
    this.materialLoader = new THREE.MTLLoader();
    this.objectLoader =  new THREE.OBJLoader();
    this.textureLoader = new THREE.TextureLoader();

    // conf
    this.bumpScale = 0.05;
    this.lightMapIntensity = 1;
    this.envMapIntensity = 0.25;
    this.envTextureCube = new THREE.CubeTextureLoader().load([
      this.path + 'envmap/posx.jpg',
      this.path + 'envmap/negx.jpg',
      this.path + 'envmap/posy.jpg',
      this.path + 'envmap/negy.jpg',
      this.path + 'envmap/posz.jpg',
      this.path + 'envmap/negz.jpg',
    ]);

    // set root
    this.materialLoader.setPath(this.path);
    this.objectLoader.setPath(this.path);
    this.textureLoader.setPath(this.path);
  }

  load(file) {
    // load OBJ from file
    return new Promise(
      (resolve, reject) => {
        try {
          this.materialLoader.load(file + '.mtl', (mtl) => {
            // load mats async
            this.preload(file, mtl.materialsInfo);
            this.objectLoader.load(file + '.obj', (obj) => {
              obj.children.forEach((child) => { this.setMaterial(child, this.materials[file]); });
              resolve(obj);
            });
          });
        } catch(error) {
          reject(error);
        }
      }
    );
  }

  preload(key, meta) {
    // load materials from meta mat file
    this.materials[key] = {};

    for (let prop in meta) {
      if (meta.hasOwnProperty(prop)) {
        this.newMaterial(key, prop, meta[prop]);
      }
    }
  }

  newMaterial(key, target, prop) {
    // make new material from props
    this.materials[key][target] = new THREE.MeshPhysicalMaterial({});
    const mat = this.materials[key][target];

    // diffuse map (texture)
    if (prop.map_kd) {
      const tex_kd = this.textureLoader.load(prop.map_kd);
      mat.color = new THREE.Color(1, 1, 1);
      mat.map = tex_kd;

      if (prop.map_kd.indexOf('.png') != -1) {
        mat.transparent = true;
        mat.side = THREE.DoubleSide;
      }
    } else {
      // no diffuse map, set emissive to colour
      mat.emissive = new THREE.Color(prop.ka[0], prop.ka[1], prop.ka[2])
    }

    // bump mapping
    if (prop.bump) {
      try {
        const opts = prop.bump.split(' ');
        const tex_bump = this.textureLoader.load(opts[0]);
        mat.bumpScale = parseFloat(opts[2]) * this.bumpScale;
        mat.bumpMap = tex_bump;
      } catch(err) {
        console.log('Bump map', err);
      }
    }

    // ambient map
    if (prop.map_ka) {
      mat.requireSecondUVSet = true;
      const tex_ka = this.textureLoader.load(prop.map_ka);
      mat.lightMap = tex_ka;
      mat.lightMapIntensity = this.lightMapIntensity;
    }

    // add global env map
    mat.envMap = this.envTextureCube;
    mat.envMapIntensity = this.envMapIntensity; // mat.metalness ?
  }

  setMaterial(obj, materials) {
    // set material from materials
    if (materials[obj.material.name]) {
      obj.material = materials[obj.material.name];

      // copy uvs for lightmap
      if (obj.material.requireSecondUVSet) {
        obj.geometry.addAttribute('uv2', new THREE.BufferAttribute(obj.geometry.attributes.uv.array, 2));
      }
    }
  }
}

export { LoadOBJ };
