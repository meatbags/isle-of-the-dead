/**
 * Loads all 3d models and populates collision map.
 **/

import { LoadFBX, Materials } from '../loader';
import { Blend, Rand } from '../maths';
import '../../lib/glsl/water.js';
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
    this.materials = new Materials();
    this.loadScene();
  }

  loadScene() {
    // floor and water
    this.floor = new THREE.Mesh(new THREE.BoxBufferGeometry(768, 2, 512), new THREE.MeshPhysicalMaterial());
    //const flowMap = new THREE.TextureLoader().load('assets/textures/Water_1_M_Flow_Alt.jpg');
		this.water = new THREE.Water(new THREE.PlaneBufferGeometry(768, 512), {
      color: 0xeeeeff,
      scale: 40,
      flowDirection: new THREE.Vector2(0.25, -0.5),
      textureWidth: 1024,
      textureHeight: 1024,
      //flowMap: flowMap
    });
    this.water.rotation.x = -Math.PI / 2;
    this.water.position.set(0, 0.3, -256 + 25);
    this.floor.position.set(0, -2, this.water.position.z);
    this.root.scene.add(this.floor, this.water);

    // floor collider
    const collision = new THREE.Mesh(new THREE.BoxBufferGeometry(768, 2, 512), new THREE.MeshPhongMaterial());
    collision.position.y = -1;
    this.root.colliderSystem.add(collision);

    const afterMapLoaded = () => {
      if (this.materials.loaded.chess) {
        const tex = new THREE.TextureLoader().load('assets/textures/chess.jpg');
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(32, 32);
        this.floor.material = this.materials.loaded.chess.clone();
        this.floor.material.map = tex;
        this.floor.material.metalnessMap = tex;
        this.floor.material.needsUpdate = true;
      }
    };

    const addChildren = (obj) => {
      // apply specific materials
      if (obj.type === 'Mesh') {
        this.root.colliderSystem.add(obj);
        this.materials.conform(obj.material);
      } else if (obj.children && obj.children.length) {
        obj.children.forEach(child => {
          addChildren(child);
        });
      }
    };

    const lArt = () => {
      this.cones = [];
      for (var i=0, len=500; i<len; ++i) {
        const r = 0.125 + Math.random() * 0.5;
        const h = 0.1 + Math.random() * 0.5;
        const geo = Math.random() < 0.85 ? new THREE.ConeBufferGeometry(r, h, 32) : new THREE.TorusBufferGeometry(r, r/4, 16, 16);
        const mesh = new THREE.Mesh(geo, this.materials.loaded.metal);
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
      afterMapLoaded();
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
