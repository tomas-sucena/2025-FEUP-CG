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
    // Pass through position
    vec3 pos = aVertexPosition;

    // Use the vertex position to generate a triangle-based pseudo-random seed
    float triangleId = floor(pos.y * 10.0 + pos.x * 10.0); // crude grouping
    float r = rand(vec2(triangleId, triangleId));

    // Create wave motion based on time + random phase offset
    float wave = sin(uTime + r * 6.2831); // full 2π offset

    // Apply sideways undulation (e.g., x-axis) modulated by height
    pos.x += 0.1 * wave * smoothstep(0.0, 1.0, pos.y); // taller = more motion

    // Optionally also slightly oscillate in Z for depth flicker
    pos.z += 0.05 * wave * (r - 0.5);

    // Slight upward scale to simulate rising
    pos.y += pos.y * 0.1 * wave;

    // Output
    vVertexPosition = pos;
    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);
}