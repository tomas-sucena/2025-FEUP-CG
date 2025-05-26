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
    // Calculate a pseudo-random offset based on the vertex's original position
    // This ensures each vertex has a slightly different oscillation phase/magnitude
    float randomness = rand(aVertexPosition.xz); // Use XZ for horizontal randomness
    
    vec3 positionOffset = aVertexNormal;
    positionOffset.x = randomness * 0.01;
    positionOffset.z = randomness * 0.02;

    // Transform the new position
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + positionOffset, 1.0);
}