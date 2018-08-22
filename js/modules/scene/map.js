import { LoadOBJ } from '../loader';
import { Materials } from '../conf';
import { Blend, Rand } from '../maths';
import { TextNode } from './text_node';

class Map {
  constructor(scene, collider, camera, width, height) {
    // load map to scene
    this.scene = scene;
    this.collider = collider;
    this.camera = camera;
    this.cameraWorldDirection = new THREE.Vector3();
    this.centreX = width / 2;
    this.centreY = height / 2;
    this.interactive = [];
    this.loader = new LoadOBJ('./assets/');
    this.gridSize = 28;
    this.gridThreshold = this.gridSize / 2;
    this.polyCount = 0;
    this.loadScene();
  }

  loadScene() {
    this.floor = new THREE.Mesh(new THREE.BoxBufferGeometry(250, 2, 250), Materials.default.clone());
    this.floor.position.y = -1;
    this.scene.add(this.floor);
    this.collider.add(this.floor);

    // blocks
    var s = 50 / 3;
    for (var x=-50 - s/2; x<50; x+=s) {
      for (var z=-50 - s/2; z<50; z+=s) {
        const h = 1 + Math.random() * 2;
        const box = new THREE.Mesh(new THREE.BoxBufferGeometry(3, h, 3), Materials.default.clone());
        box.position.set(x, h / 2 - 0.1, z);
        this.collider.add(box);
        this.scene.add(box);
        this.interactive.push(box);
      }
    }

    // infinite column grid
    this.loader.load('arches-culled').then((map) => {
      var mapPolyCount = 0;
      map.children.forEach((child) => { mapPolyCount += child.geometry.attributes.position.array.length / child.geometry.attributes.position.itemSize; });

      const limit = this.gridThreshold + this.gridSize * 3;
      for (var x=-limit; x<=limit; x+=this.gridSize) {
        for (var z=-limit; z<=limit; z+=this.gridSize) {
          const roof = map.clone();
          roof.position.set(x, 0, z);
          this.scene.add(roof);
          this.polyCount += mapPolyCount;
        }
      }

      console.log('~Polygons', this.polyCount);
    }, (err) => { console.warn('Load error:', err); });

    this.loader.load('column-culled').then((map) => {
      var mapPolyCount = 0;
      map.children.forEach((child) => {
        mapPolyCount += child.geometry.attributes.position.array.length / child.geometry.attributes.position.itemSize;
        //this.collider.add(new Collider.Mesh(child));
      });

      const limit = this.gridThreshold + this.gridSize * 3;
      for (var x=-limit; x<=limit; x+=this.gridSize) {
        for (var z=-limit; z<=limit; z+=this.gridSize) {
          const col = map.clone();
          // hide culled faces by rotating
          col.rotation.y = ((z > 0) ? ((x < 0) ? 0 : 1) : ((x > 0) ? 2 : 3)) * Math.PI / 2;
          col.position.set(x, 0, z);
          this.scene.add(col);
          this.polyCount += mapPolyCount;
        }
      }

      console.log('~Polygons', this.polyCount);
    }, (err) => { console.warn('Load error:', err); });

    // test text nodes
    this.textNodes = [];
    for (let i=0; i<10; ++i) {
      const textNode = new TextNode('?', Rand(100), 6 + Rand(10), Rand(100));
      this.textNodes.push(textNode);
      this.scene.add(textNode.mesh);
    }
  }

  update(delta) {
    const t = 0.25;

    this.camera.getWorldDirection(this.cameraWorldDirection);
    for (var i=0, len=this.textNodes.length; i<len; ++i) {
      this.textNodes[i].update(delta, this.camera, this.cameraWorldDirection, this.centreX, this.centreY)
    }

    for (var i=0, len=this.interactive.length; i<len; ++i) {
      const box = this.interactive[i];
      if (box.active) {
        const c = Blend(box.material.emissive.r, 1, t);
        box.material.emissive.r = c;
        box.material.emissive.g = c;
        box.material.emissive.b = c;
      } else {
        const c = Blend(box.material.emissive.r, 0, t);
        box.material.emissive.r = c;
        box.material.emissive.g = c;
        box.material.emissive.b = c;
      }
    }
  }

  resize(width, height) {
    this.centreX = width / 2;
    this.centreY = height / 2;
  }

  getObjects2d() {
    return this.textNodes;
  }

  getInteractive() {
    // get interactive objects
    return this.interactive;
  }

  getTeleport(p) {
    return {
      x: (p.x > this.gridThreshold) ? -this.gridSize : ((p.x < -this.gridThreshold) ? this.gridSize : 0),
      z: (p.z > this.gridThreshold) ? -this.gridSize : ((p.z < -this.gridThreshold) ? this.gridSize : 0)
    };
  }

  teleport(p) {
    for (var i=0, len=this.interactive.length; i<len; ++i) {
      this.interactive[i].position.x += p.x;
      this.interactive[i].position.z += p.z;
    }
    for (var i=0, len=this.textNodes.length; i<len; ++i) {
      this.textNodes[i].teleport(p);
    }
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
