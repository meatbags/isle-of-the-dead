/**
 * Loads all 3d models and populates collision map.
 **/

import { LoadOBJ, Materials } from '../loader';
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
    this.loader = new LoadOBJ('./assets/');
    this.loadScene();
  }

  loadScene() {
    this.floor = new THREE.Mesh(new THREE.BoxBufferGeometry(10000, 1, 10000), Materials.porcelain.clone());
    this.floor.position.y = -1;
    this.root.scene.add(this.floor);
    this.root.colliderSystem.add(this.floor);

    // blocks
    var s = 50 / 3;
    for (var x=-50 - s/2; x<50; x+=s) {
      for (var z=-50 - s/2; z<50; z+=s) {
        const box = new THREE.Mesh(new THREE.SphereBufferGeometry(2, 12, 12), Materials.porcelain.clone());
        box.position.set(x, 2.5, z);
        this.root.colliderSystem.add(box);
        this.root.scene.add(box);
        this.interactive.push(box);
      }
    }

    /*
    this.loader.load('object-file-name').then((map) => {
      this.scene.add(map);
    }, (err) => {});
    */
  }

  update(delta) {
    // brighten cubes
    /*
    for (var i=0, len=this.interactive.length; i<len; ++i) {
      const box = this.interactive[i];
      if (box.active) {
        const c = Blend(box.material.emissive.r, 1, 0.25);
        box.material.emissive.r = c;
        box.material.emissive.g = c;
        box.material.emissive.b = c;
      } else {
        const c = Blend(box.material.emissive.r, 0, 0.25);
        box.material.emissive.r = c;
        box.material.emissive.g = c;
        box.material.emissive.b = c;
      }
    }
    */

    //this.camera.getWorldDirection(this.cameraWorldDirection);
    //for (var i=0, len=this.textNodes.length; i<len; ++i) {
      //this.textNodes[i].update(delta, this.camera, this.cameraWorldDirection, this.centreX, this.centreY)
    //}
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
