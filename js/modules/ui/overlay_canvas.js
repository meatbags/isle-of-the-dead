/**
 * Render HUD/ 2d overlay.
 **/

class OverlayCanvas {
  constructor(root, domElement) {
    this.root = root;
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.cvs.width = window.innerWidth;
    this.cvs.height = window.innerHeight;
    this.domElement = domElement;
    this.domElement.append(this.cvs);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
    this.ctx.font = '14px Karla';
    this.ctx.strokeStyle = '#fff';
    this.ctx.fillStyle = '#fff';
    this.ctx.lineWidth = 1.5;
    this.ctx.lineCap = 'round';
  }

  resize() {
    const rect = this.domElement.getBoundingClientRect();
    this.cvs.width = rect.width;
    this.cvs.height = rect.height;
  }

  draw(objects) {
    this.clear();
    for (var i=0, len=objects.length; i<len; ++i) {
      objects[i].draw(this.ctx);
    }

    this.ctx.globalAlpha = 1;
    const x = Math.round(this.root.player.position.x * 10) / 10;
    const y = Math.round(this.root.player.position.y * 10) / 10;
    const z = Math.round(this.root.player.position.z * 10) / 10;
    this.ctx.fillText(`${x}, ${y}, ${z}`, 20, 30);
  }
}

export { OverlayCanvas };
