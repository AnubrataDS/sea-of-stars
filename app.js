import * as THREE from "three";
import imageExample from "./img/sus.png";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Sketch {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("container").appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      10
    );
    this.camera.position.z = 1;

    this.scene = new THREE.Scene();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.addMesh();
    this.render();
  }
  addMesh() {
    this.geometry = new THREE.PlaneBufferGeometry(1, 1);
    this.texture = new THREE.TextureLoader().load(imageExample);
    this.material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: this.texture,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }
  render() {
    this.time++;
    this.mesh.rotation.x += 0.001;
    this.mesh.rotation.y += 0.002;

    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch();
