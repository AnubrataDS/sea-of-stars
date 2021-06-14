import * as THREE from "three";
import imageExample from "./img/sus.png";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader";
import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";
import mask from "./img/particle_mask.jpg";
export default class Sketch {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("container").appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      99999
    );
    this.camera.position.z = 50;
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.raycaster = new THREE.Raycaster();
    this.time = 0;
    this.pressed = 0;
    this.mouse = new THREE.Vector2();
    this.point = new THREE.Vector2();
    this.addMesh();
    this.mouseEffects();
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.7,
      0.5,
      0.1
    );
    this.composer.addPass(bloomPass);
    var rgbShift = new ShaderPass(RGBShiftShader);
    var rgbAmount = 0.001;
    var angle = 3.5;

    rgbShift.uniforms.amount.value = rgbAmount;
    rgbShift.uniforms.angle.value = angle;
    rgbShift.enabled = true;

    this.composer.addPass(rgbShift);
    this.render();

    window.addEventListener(
      "resize",
      () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
        console.log("resize");
      },
      false
    );
  }
  mouseEffects() {
    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);

      var intersects = this.raycaster.intersectObjects([this.test]);
      if (intersects[0]) {
        this.point.x = intersects[0].point.x;
        this.point.y = intersects[0].point.y;
      }
    });
    window.addEventListener("mousedown", (event) => {
      this.pressed = 1;
    });
    window.addEventListener("mouseup", (event) => {
      this.pressed = 0;
    });
  }
  addMesh() {
    this.geometry = new THREE.PlaneBufferGeometry(300, 128, 300, 128);
    this.texture = new THREE.TextureLoader().load(imageExample);
    this.mask = new THREE.TextureLoader().load(mask);
    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      blending: THREE.AdditiveBlending,
      uniforms: {
        time: { type: "f", value: 0 },
        pressed: { type: "f", value: 0 },
        mask: { type: "t", value: this.mask },
        mouse: { type: "v2", value: null },
      },
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.mesh.rotateX(-Math.PI * 0.35);
    this.scene.add(this.mesh);
    this.test = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2000, 2000),
      new THREE.MeshBasicMaterial()
    );
    // const axesHelper = new THREE.AxesHelper(5);
    // this.scene.add(axesHelper);
  }
  render() {
    this.time += 0.05;
    // this.mesh.rotation.x += 0.001;
    // this.mesh.rotation.y += 0.002;
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.mouse.value = this.point;
    this.material.uniforms.pressed.value = this.pressed;
    //this.renderer.render(this.scene, this.camera);
    this.composer.render();
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch();
