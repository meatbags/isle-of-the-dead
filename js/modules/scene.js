/**
 * Create and handle the scene: player, camera, map, collisions.
 **/

import { Camera, Lighting, Player, Map, Raycaster } from './scenery';
import { Mouse } from './controls';

class Scene {
  constructor() {
    const el = document.querySelector('.wrapper');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x333333, 0.0275);
    this.colliderSystem = new Collider.System();
    this.player = new Player(this);
    this.camera = new Camera(this);
    this.lighting = new Lighting(this.scene);
    this.map = new Map(this);
    this.raycaster = new Raycaster(el, this.camera.camera);

    // events
    window.addEventListener('resize', () => { this.resize(); });
    this.onMouseDown = (e) => { this.mouse.start(e); };
    this.onMouseMove = (e) => {
      /*
      if (!this.mouse.isActive()) {
        this.map.activateObjects(
          this.raycaster.cast(e, this.map.getInteractive())
        );
      }
      */
    };
    this.onMouseUp = (e) => {
      const t = (new Date()).getTime();
      this.mouse.stop();
      if (t - this.mouse.getTimestamp() < 100) {
        // do something
      }
    };
    this.mouse = new Mouse(el, this.onMouseDown, this.onMouseMove, this.onMouseUp);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.resize();
    this.map.resize();
    this.raycaster.resize();
  }

  update(delta) {
    this.player.update(delta);
    this.camera.update(delta);
    this.map.update(delta);
  }
}

export { Scene };
