#ifdef GL_ES
precision highp float;
#endif

// attributes
attribute vec3 aVertexPosition;

// uniforms
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float uTime;

// varying
varying vec3 vVertexPosition;

// common GLSL pseudo-random number generator
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vVertexPosition = aVertexPosition;

    // simulate wave motion based on time and randomness
    float r = rand(10.0 * vVertexPosition.yz);
    float wave = sin(uTime + r * 6.2831);

    // apply sideways undulation
    vVertexPosition.x += 0.3 * wave * smoothstep(0.0, 1.0, vVertexPosition.y);
    vVertexPosition.z += 0.4 * wave * (r - 0.5);

    // simulate the flame rising
    vVertexPosition.y += (0.1 + 0.4 * vVertexPosition.y) * wave;

    gl_Position = uPMatrix * uMVMatrix * vec4(vVertexPosition, 1.0);
}