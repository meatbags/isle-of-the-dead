/**
 * Creating lighting, fog, sky.
 **/

import '../../lib/glsl/SkyShader.js';

class Lighting {
  constructor(scene) {
    // create scene lighting
    this.scene = scene;
    this.lights = {point: {}, ambient: {}, hemisphere: {}, directional: {}};
    this.lights.point.a = new THREE.PointLight(0xffffff, 0.5, 12, 2);
    this.lights.ambient.a = new THREE.AmbientLight(0xffffff, 0.0625);
    this.lights.hemisphere.a = new THREE.HemisphereLight(0x0, 0x0000ff, 0.25);
    this.lights.directional.a = new THREE.DirectionalLight(0xffffff, 0.25);

    // configure lights
    this.lights.point.a.position.set(0, 7.4, 2.5);
    this.lights.directional.a.position.set(0, 0, 0);
    this.lights.directional.a.target.position.set(1, 0.25, -0.25);
    console.log(this.lights.directional.a)

    // add
    Object.keys(this.lights).forEach(type => {
      Object.keys(this.lights[type]).forEach(key => {
        this.scene.add(this.lights[type][key]);
        if (type === 'directional') {
          this.scene.add(this.lights[type][key].target);
        }
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
