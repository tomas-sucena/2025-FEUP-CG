#ifdef GL_ES
precision highp float;
#endif

// attributes
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

// uniforms
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float uTime;

// Pseudo-random number generator function
// Based on a common GLSL hash function
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec3 positionOffset = aVertexNormal * 0.1 * sin(uTime);

    // Transform the new position
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + positionOffset, 1.0);
}