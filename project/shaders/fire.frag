#ifdef GL_ES
precision highp float;
#endif

// Varying passed from vertex shader
varying vec3 vVertexPosition;

// Uniforms
uniform float uTime;

// Random function
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

// Fire color gradient function
vec3 fireColor(float height) {
    return mix(
        vec3(1.0, 1.0, 0.2),         // bright yellow
        vec3(1.0, 0.2, 0.0),         // orange
        height
    );
}

void main() {
    // Normalize height from 0 to 1 (assuming flames span y = 0 to y = 1)
    float h = 0.6 * clamp(vVertexPosition.y, 0.0, 1.0);

    // Color gradient
    vec3 color = fireColor(h);

    // Add flickering with randomness
    float flicker = 0.8 + 0.2 * rand(vec2(vVertexPosition.xz + uTime));
    color *= flicker;

    // Optional glow/fade near top
    float alpha = 1.0 - smoothstep(0.8, 1.2, h); // fade top
    alpha *= flicker;

    gl_FragColor = vec4(color, alpha);
}