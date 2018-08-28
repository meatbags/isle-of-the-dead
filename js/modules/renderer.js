/**
 * Render the scene.
 **/

import '../lib/glsl';

class Renderer {
  constructor(scene) {
    // init webgl renderer
    this.scene = scene.scene;
    this.camera = scene.camera.camera;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.size = new THREE.Vector2(this.width, this.height);
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x222222, 1);
    //this.renderer.shadowMap.enabled = true;
    //this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // post processing
    const strength = 0.5;
    const radius = 0.25;
    const threshold = 0.975;
    this.renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.FXAAPass = new THREE.ShaderPass(THREE.FXAAShader);
		this.FXAAPass.uniforms['resolution'].value.set(1 / this.width, 1 / this.height);
    //this.SSAOPass = new THREE.SSAOPass(this.scene, this.camera);
    //this.SSAOPass.radius = 14;
    //this.SSAOPass.aoClamp = 0.9;
    //this.SSAOPass.lumInfluence = 1.0;
    //this.SSAOPass.onlyAO = true;
    this.bloomPass = new THREE.UnrealBloomPass(this.size, strength, radius, threshold);
    //this.posterPass = new THREE.PosterPass(this.size);
    //this.noisePass = new THREE.NoisePass();
    this.bloomPass.renderToScreen = true;
    //this.SSAOPass.renderToScreen = true;
    this.composer = new THREE.EffectComposer(this.renderer);
    this.composer.setSize(this.width, this.height);
    this.composer.addPass(this.renderPass);
    //this.composer.addPass(this.SSAOPass);
    //this.composer.addPass(this.FXAAPass);
    //this.composer.addPass(this.posterPass);
    this.composer.addPass(this.bloomPass);
    //this.composer.addPass(this.noisePass);
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;

    // events
    window.addEventListener('resize', () => { this.resize(); });
    this.resize();

    // add to doc
    document.querySelector('.wrapper').append(this.renderer.domElement);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.size.x = this.width;
    this.size.y = this.height;
    this.FXAAPass.uniforms['resolution'].value.set(1 / this.width, 1 / this.height);
    //this.SSAOPass.setSize(this.width, this.height);
    this.bloomPass.setSize(this.width, this.height);
    this.renderer.setSize(this.width, this.height);
    this.composer.setSize(this.width, this.height);
  }

  render(delta) {
    this.composer.render(delta);
  }
}

export { Renderer };
