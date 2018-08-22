import { Renderer, Scene } from './modules';

class App {
  constructor() {
    this.scene = new Scene();
    this.renderer = new Renderer(this.scene.getScene(), this.scene.getCamera());
    this.now = (new Date()).getTime();
  }

  loop() {
    requestAnimationFrame(() => { this.loop(); });
    const now = (new Date()).getTime();
    const delta = (now - this.now) / 1000.0;
    this.now = now;
    this.scene.update(delta);
    this.renderer.render(delta);
  }
}

window.onload = () => { const app = new App(); };