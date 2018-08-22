class TextNode {
  constructor(text, x, y, z) {
    this.text = text;
    this.position = new THREE.Vector3(x, y, z);
    this.position2d = new THREE.Vector2();
    this.target = new THREE.Vector3();
    this.mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(0.1, 12, 12), new THREE.MeshPhysicalMaterial({emissive: 0xffffff}));
    this.mesh.position.set(x, y, z);
  }

  update(delta, camera, worldDirection, centreX, centreY) {
    // project perspective camera to screen
    this.target.copy(camera.position);
    this.target.sub(this.position);
    this.target.normalize();

    if (this.target.dot(worldDirection) <= 0) {
      this.behindCamera = false;
      this.target.copy(this.position);
      this.target.project(camera);
      this.position2d.x = (this.target.x + 1) * centreX;
      this.position2d.y = (-this.target.y + 1) * centreY;
    } else {
      this.behindCamera = true;
    }
  }

  teleport(p) {
    this.position.x += p.x;
    this.position.z += p.z;
    this.mesh.position.x += p.x;
    this.mesh.position.z += p.z;
  }

  draw(ctx) {
    // project text onto screen
    if (!this.behindCamera) {
      ctx.fillText(this.text, this.position2d.x, this.position2d.y);
    }
  }
}

export { TextNode };
