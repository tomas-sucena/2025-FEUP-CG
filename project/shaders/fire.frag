#ifdef GL_ES
precision highp float;
#endif

// Varying passed from vertex shader
varying vec3 vVertexPosition;

uniform float height;

// Random function
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    // normalize height (from 0 to 1)
    float h = vVertexPosition.y / height;

    // add a bit of randomness
    h *= 3.5 * rand(vVertexPosition.xz);

    // compute the color by mixing yellow with orange based on the height
    vec3 color = mix(
        vec3(1.0, 1.0, 0.2), // yellow
        vec3(1.0, 0.2, 0.0), // orange
        h
    );

    gl_FragColor = vec4(color, 1);
}