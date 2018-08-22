import { Renderer, Renderer2d } from './render';
import { Scene } from './scene';
import { Timer } from './time';

class Master {
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.domElement = document.getElementsByClassName('content')[0];
    this.scene = new Scene(this.domElement, this.width, this.height);
    this.renderer = new Renderer(this.domElement, this.width, this.height, this.scene.getScene(), this.scene.getCamera());
    this.renderer2d = new Renderer2d(this.domElement, this.width, this.height, this.scene.getCamera());
    this.timer = new Timer();
    this.loop();
  }

  resize() {
    // resize from window
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scene.resize(this.width, this.height);
    this.renderer.resize(this.width, this.height);
    this.renderer
  }

  loop() {
    // main game loop
    if (!this.paused) {
      if (!this.loopGuard) {
        // restrict async looping
        this.loopGuard = true;
        requestAnimationFrame(() => {
          this.loopGuard = false;
          this.loop();
        });
      }
      var delta = this.timer.getDelta();
      this.scene.update(delta);
      this.renderer.render(delta);
      this.renderer2d.render(delta, this.scene.getObjects2d());
    }
  }
}

export { Master };
