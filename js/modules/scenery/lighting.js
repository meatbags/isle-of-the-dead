/**
 * Creating lighting, fog, sky.
 **/

import '../../lib/glsl/SkyShader.js';

class Lighting {
  constructor(scene) {
    // create scene lighting
    this.scene = scene;
    this.lights = {
      point: {
        a: new THREE.PointLight(0xffffff, 1, 100, 2)
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

    // fog
    //this.scene.fog = new THREE.FogExp2(0x333333, 0.0275);

    // skybox
    this.sky = new THREE.Sky();
    this.sky.scale.setScalar(450000);
    const d = 400000;
    const azimuth = 0.25;
    const inclination = 0.4875;
    const theta = Math.PI * (inclination - 0.5);
    const phi = Math.PI * 2 * (azimuth - 0.5);
    const sunPos = new THREE.Vector3(d * Math.cos(phi), d * Math.sin(phi) * Math.sin(theta), d * Math.sin(phi) * Math.cos(theta));
    this.sky.material.uniforms.sunPosition.value.copy(sunPos);
    this.scene.add(this.sky);
  }

  setLightPositions() {
    this.lights.point.a.position.set(40, 1, 40);
  }
}

export { Lighting };
