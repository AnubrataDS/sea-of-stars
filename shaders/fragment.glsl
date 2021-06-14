uniform float time;
varying vec3 pos;
uniform sampler2D mask;
float rand(float n) {
    return fract(sin(n) * 43758.5453123);
}
float rand(float a, float b, float t) {
    return a + (b - a) * rand(t);
}
void main() {
    //gl_FragColor = vec4((abs(pos.x) / 256.) * sin(time * 0.01), abs(pos.y) / 256., abs(pos.z) / 256., 1.);
    vec4 maskTexture = texture2D(mask, gl_PointCoord);
    //gl_FragColor = vec4(1., 1., 1., 1.);
    gl_FragColor = maskTexture;
}