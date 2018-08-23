/**
 * Signify view location exists.
 **/

import { NodeBase } from './node_base';

class NodeView extends NodeBase {
  constructor(position, rotation, clipping) {
    super(position, clipping || null);
    this.rotation = rotation;
    this.active = true;
    this.hover = false;
    this.radius = {min: 5, max: 30, fadeThreshold: 5};
    this.boundingBox = {width: 32, height: 32};
    this.drawRadius = {current: 10, min: 5, max: 10};
    this.distance = -1;
    this.opacity = 1;
  }

  mouseOver(x, y) {
    if (this.active && this.onscreen) {
      this.hover = (
        x >= this.coords.x - this.boundingBox.width &&
        x <= this.coords.x + this.boundingBox.width &&
        y >= this.coords.y - this.boundingBox.height &&
        y <= this.coords.y + this.boundingBox.height
      );
    } else {
      this.hover = false;
    }
    return this.hover;
  }

  update(delta, player, camera, worldVec, centre) {
    this.calculateNodePosition(camera, worldVec, centre);

    // fade out and deactivate
    this.distance = player.position.distanceTo(this.position);
    if (this.distance < this.radius.min || this.distance > this.radius.max) {
      this.active = false;
    } else {
      this.active = true;
      if (this.distance < this.radius.min + this.radius.fadeThreshold) {
        this.opacity = (this.distance - this.radius.min) / this.radius.fadeThreshold;
      } else if (this.distance > this.radius.max - this.radius.fadeThreshold) {
        this.opacity = (this.radius.max - this.distance) / this.radius.fadeThreshold;
      } else {
        this.opacity = 1;
      }
    }
  }

  draw(ctx) {
    if (this.onscreen && this.active) {
      this.drawRadius.current += ((this.hover ? this.drawRadius.min : this.drawRadius.max) - this.drawRadius.current) * 0.25;
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.coords.x, this.coords.y, this.drawRadius.current, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

export { NodeView };
