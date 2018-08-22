/**
 * Perspective camera which tracks player movement and rotation.
 **/

class Camera {
  constructor(root, position, rotation) {
    this.root = root;
    this.position = this.root.player.position;
    this.rotation = this.root.player.rotation;
    this.fov = 90;
    this.aspectRatio = this.root.width / this.root.height;
    this.offset = 0.1;
    this.height = 2;
    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspectRatio, 0.1, 1000);
    this.camera.up = new THREE.Vector3(0, 1, 0);
  }

  resize(w, h) {
    this.aspectRatio = this.root.width / this.root.height;
    this.camera.aspect = this.aspectRatio;
    this.camera.updateProjectionMatrix();
  }

  update(delta) {
    const offsetXZ = this.offset - this.offset * Math.abs(Math.sin(this.rotation.pitch));
    const offsetY = this.offset;
    const y = this.position.y + this.height;
    this.camera.up.z = -Math.sin(this.rotation.yaw) * this.rotation.roll;
    this.camera.up.x = Math.cos(this.rotation.yaw) * this.rotation.roll;
    this.camera.position.set(
      this.position.x - Math.sin(this.rotation.yaw) * offsetXZ / 4,
      y - Math.sin(this.rotation.pitch) * offsetY / 4,
      this.position.z - Math.cos(this.rotation.yaw) * offsetXZ / 4
    );
    this.camera.lookAt(
      new THREE.Vector3(this.position.x + Math.sin(this.rotation.yaw) * offsetXZ,
      y + Math.sin(this.rotation.pitch) * offsetY,
      this.position.z + Math.cos(this.rotation.yaw) * offsetXZ)
    );
  }

  teleport() {
    this.camera.updateProjectionMatrix();
  }
}

export { Camera };
