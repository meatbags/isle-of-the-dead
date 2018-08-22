class Lighting {
  constructor(scene) {
    // create scene lighting

    this.scene = scene;
    this.lights = {
      point: {
        //a: new THREE.PointLight(0xffffff, 1, 100, 2)
      },
      ambient: {
        a: new THREE.AmbientLight(0xffffff, 0.05)
      }
    }
    this.setLightPositions();

    for (var p in this.lights.point) {
      if (this.lights.point.hasOwnProperty(p)) {
        this.scene.add(this.lights.point[p]);
      }
    }
    for (var a in this.lights.ambient) {
      if (this.lights.ambient.hasOwnProperty(a)) {
        this.scene.add(this.lights.ambient[a]);
      }
    }
  }

  setLightPositions() {
    //this.lights.point.a.position.set(10, 10, 10);
  }
}

export { Lighting };
