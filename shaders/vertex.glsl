varying vec2 vUv;
void main() {
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
    gl_PointSize = 50. * (1. / -mvPosition.z);      //perspective based particle size
    //gl_PointSize = size * 10.;
    gl_Position = projectionMatrix * mvPosition;
}