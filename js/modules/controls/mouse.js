class Mouse {
  constructor(domElement, onDown, onMove, onUp) {
    // mouse handler
    this.x = 0;
    this.y = 0;
    this.origin = new THREE.Vector2(0, 0);
    this.delta = new THREE.Vector2(0, 0);
    this.rotation = {pitch: 0, yaw: 0, roll: 0};
    this.active = false;
    this.timestamp = 0;
    this.domElement = domElement;
    this.domElement.addEventListener('mousedown', onDown, false);
    this.domElement.addEventListener('mousemove', onMove, false);
    this.domElement.addEventListener('mouseup', onUp, false);
    this.domElement.addEventListener('mouseleave', onUp, false);
  }

  start(e, pitch, yaw) {
    // set mouse position [-1, 1]
    this.active = true;
    const bound = this.domElement.getBoundingClientRect();
    this.origin.x = ((e.clientX - bound.x) / bound.width) * 2 - 1;
    this.origin.y = ((e.clientY - bound.y) / bound.height) * 2 - 1;
    this.rotation.pitch = pitch || 0;
    this.rotation.yaw = yaw || 0;
    this.timestamp = (new Date()).getTime();
  }

  stop() {
    // flag off
    this.active = false;
  }

  move(e) {
    // move mouse
    const bound = this.domElement.getBoundingClientRect();
    this.x = ((e.clientX - bound.x) / bound.width) * 2 - 1;
    this.y = ((e.clientY - bound.y) / bound.height) * 2 - 1;
    this.delta.x = this.x - this.origin.x;
    this.delta.y = this.y - this.origin.y;
  }

  getPitch(min, max) {
    // get clamped pitch
    const pitch = Math.max(min, Math.min(max, this.rotation.pitch + this.delta.y));
    if (pitch == min || pitch == max) {
      this.origin.y = this.y;
      this.rotation.pitch = pitch;
    }
    return pitch;
  }

  getYaw() {
    return this.rotation.yaw + this.delta.x;
  }

  getTimestamp() {
    return this.timestamp;
  }

  isActive() {
    return this.active;
  }
}

export { Mouse };
