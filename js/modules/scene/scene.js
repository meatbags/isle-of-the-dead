import { Camera } from './camera';
import { Lighting } from './lighting';
import { Player } from './player';
import { Map } from './map';
import { Raycaster } from './raycaster';
import { Mouse } from '../input';

class Scene {
  constructor(domElement, width, height) {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x222222, 0.0275);
    this.collider = new Collider.System();
    this.player = new Player(domElement, this.scene, this.collider);
    this.camera = new Camera(width, height, this.player.position, this.player.rotation);
    this.lighting = new Lighting(this.scene);
    this.map = new Map(this.scene, this.collider, this.camera.getCamera(), width, height);
    this.raycaster = new Raycaster(domElement, this.camera.getCamera());
    this.mouse = new Mouse(domElement, (e) => { this.mouse.start(e); }, (e) => { this.onMouseMove(e); }, (e) => { this.onMouseUp(e); });
  }

  getObjects2d() {
    return this.map.getObjects2d();
  }

  onMouseMove(e) {
    if (!this.mouse.isActive()) {
      this.map.activateObjects(
        this.raycaster.cast(e, this.map.getInteractive())
      );
    }
  }

  onMouseUp(e) {
    const t = (new Date()).getTime();
    this.mouse.stop();
    if (t - this.mouse.getTimestamp() < 100) {
      // do something
    }
  }

  resize(width, height) {
    this.camera.resize(width, height);
    this.map.resize(width, height);
    this.raycaster.resize();
  }

  update(delta) {
    if (this.teleportFlag) {
      this.teleportFlag = false;
      this.player.teleport(this.teleport);
      this.map.teleport(this.teleport);
    }

    // set camera & scene
    this.player.update(delta);
    this.camera.update(delta);
    this.map.update(delta);

    // wrap player, objects
    const tele = this.map.getTeleport(this.player.getTargetPosition());
    if (tele.x || tele.z) {
      this.teleportFlag = true;
      this.teleport = tele;
    }
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera.getCamera();
  }
}

export { Scene };
