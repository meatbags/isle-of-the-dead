/**
 * Loads all 3d models and populates collision map.
 **/

import { LoadFBX, Materials } from '../loader';
import { Blend, Rand } from '../maths';
//import { TextNode } from './text_node';

class Map {
  constructor(root) {
    // load map to scene
    this.root = root;
    //this.cameraWorldDirection = new THREE.Vector3();
    this.centreX = this.root.width / 2;
    this.centreY = this.root.height / 2;
    this.interactive = [];
    this.loader = new LoadFBX('./assets/');
    this.loadScene();
  }

  loadScene() {
    this.floor = new THREE.Mesh(new THREE.BoxBufferGeometry(10000, 2, 10000), Materials.porcelain);
    this.floor.position.y = -1;
    this.root.scene.add(this.floor);
    this.root.colliderSystem.add(this.floor);

    // apply specific materials
    const addChildren = (obj) => {
      if (obj.type === 'Mesh') {
        const mat = obj.material;
        obj.material.envMap = Materials.envMap;
        obj.material.envMapIntensity = 0.5;
        this.root.colliderSystem.add(obj);
        if (mat.name == 'porcelain') {
          obj.material.normalScale.x = 0.125;
          obj.material.normalScale.y = 0.125;
          obj.material.emissive = Materials.porcelain.emissive;
          obj.material.emissiveIntensity = 1.0;
        } else if (mat.name == 'metal') {
          // ?
        }
        // add to bank
        Materials.loaded[mat.name] = mat;
      } else if (obj.children && obj.children.length) {
        obj.children.forEach(child => {
          addChildren(child);
        });
      }
    }

    const lArt = () => {
      this.cones = [];
      for (var i=0, len=500; i<len; ++i) {
        const r = 0.125 + Math.random() * 0.5;
        const h = 0.1 + Math.random() * 0.5;
        const geo = Math.random() < 0.85 ? new THREE.ConeBufferGeometry(r, h, 32) : new THREE.TorusBufferGeometry(r, r/4, 16, 16);
        const mesh = new THREE.Mesh(geo, Materials.loaded.metal);
        mesh.position.x = Math.random() * 10 - 5;
          mesh.position.y = Math.random() * 10 + 5;
        mesh.position.z = Math.random() * 10 - 5;
        mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, 0);
        this.cones.push(mesh);
        this.root.scene.add(mesh);
      }
    }

    this.loader.load('map').then((map) => {
      this.root.scene.add(map);
      addChildren(map);
      //lArt();
    }, (err) => {});
  }

  update(delta) {
    if (this.cones) {
      this.cones.forEach(cone => {
        cone.rotation.x += delta / 2;
        cone.rotation.y += delta / 4;
      })
    }
  }

  resize() {
    this.centreX = this.root.width / 2;
    this.centreY = this.root.height / 2;
  }

  getInteractive() {
    return this.interactive;
  }

  activateObjects(objects) {
    for (var i=0, len=this.interactive.length; i<len; ++i) {
      this.interactive[i].active = false;
    }
    if (objects.length) {
      objects[0].object.active = true;
    }
  }
}

export { Map };
