/**
 * Create and handle the scene: player, camera, map, collisions.
 **/

import { Camera, Lighting, Player, Map } from './scenery';

class Scene {
  constructor() {
    const el = document.querySelector('.wrapper');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scene = new THREE.Scene();
    this.colliderSystem = new Collider.System();
    this.player = new Player(this);
    this.camera = new Camera(this);
    this.lighting = new Lighting(this.scene);
    this.map = new Map(this);

    // events
    window.addEventListener('resize', () => { this.resize(); });
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.resize();
    this.map.resize();
  }

  update(delta) {
    this.player.update(delta);
    this.camera.update(delta);
    this.map.update(delta);
  }
}

export { Scene };
