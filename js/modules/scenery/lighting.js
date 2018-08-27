/**
 * Creating lighting, fog, sky.
 **/

import '../../lib/glsl/SkyShader.js';

class Lighting {
  constructor(scene) {
    // create scene lighting
    this.scene = scene;
    this.lights = {point: {}, ambient: {}};
    this.lights.point.a = new THREE.PointLight(0xffffff, 1, 75, 2);
    this.lights.point.b = new THREE.PointLight(0xffffff, 0.25, 15, 1);
    this.lights.point.c = new THREE.PointLight(0xffffff, 0.5, 6, 1);
    this.lights.ambient.a = new THREE.AmbientLight(0x8888ff, 0.125);

    // light positions
    this.lights.point.a.position.set(25, 25, 25);
    this.lights.point.b.position.set(0, 7, 12.5);
    this.lights.point.c.position.set(-0.5, 6.5, 2.5);

    // add
    Object.keys(this.lights).forEach(type => {
      Object.keys(this.lights[type]).forEach(key => {
        this.scene.add(this.lights[type][key]);
      })
    });

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
}

export { Lighting };
