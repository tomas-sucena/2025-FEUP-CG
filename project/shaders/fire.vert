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

// varying
varying vec3 vVertexPosition;

// Pseudo-random number generator function
// Based on a common GLSL hash function
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// Curved flame displacement
void main() {
    vVertexPosition = aVertexPosition;

    // Use the vertex position to generate a triangle-based pseudo-random seed
    float triangleId = floor(vVertexPosition.y * 10.0 + vVertexPosition.x * 10.0); // crude grouping
    float r = rand(vec2(triangleId, triangleId));

    // Create wave motion based on time + random phase offset
    float wave = sin(uTime + r * 6.2831); // full 2π offset

    // Apply sideways undulation (e.g., x-axis) modulated by height
    vVertexPosition.x += 0.1 * wave * smoothstep(0.0, 1.0, vVertexPosition.y); // taller = more motion

    // simulate the flame rising
    vVertexPosition.y += 0.1 * sin(uTime / 1.5);

    // Optionally also slightly oscillate in Z for depth flicker
    vVertexPosition.z += 0.05 * wave * (r - 0.5);

    gl_Position = uPMatrix * uMVMatrix * vec4(vVertexPosition, 1.0);
}