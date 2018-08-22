class Renderer2d {
  constructor(domElement, width, height, camera) {
    // 2d canvas overlay
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.cvs.width = width;
    this.cvs.height = height;
    this.ctx.font = '20px Playfair Display';
    this.camera = camera;

    // add to doc
    domElement.append(this.cvs);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
  }

  resize(width, height) {
    this.cvs.width = width;
    this.cvs.height = height;
  }

  render(delta, objects) {
    this.clear();
    for (var i=0, len=objects.length; i<len; ++i) {
      objects[i].draw(this.ctx);
    }
    this.ctx.fillRect(0, 0, 20, 20);
  }
}

export { Renderer2d }
