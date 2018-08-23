import { Renderer, Scene, ControlSurface } from './modules';

class App {
  constructor() {
    this.scene = new Scene();
    this.renderer = new Renderer(this.scene);
    this.controlSurface = new ControlSurface(this.scene);
    this.now = (new Date()).getTime();
    this.loop();
  }

  loop() {
    requestAnimationFrame(() => { this.loop(); });
    const now = (new Date()).getTime();
    const delta = (now - this.now) / 1000.0;
    this.now = now;
    this.scene.update(delta);
    this.controlSurface.update(delta);
    this.renderer.render(delta);
    this.controlSurface.draw();
  }
}

window.onload = () => { const app = new App(); };
