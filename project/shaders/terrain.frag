#ifdef GL_ES
precision highp float;
#endif

// varying
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

// uniforms
uniform sampler2D uMaskSampler;
uniform sampler2D uGrassSampler;
uniform sampler2D uLakeSampler;

void main() {
    vec4 mask = texture2D(uMaskSampler, vTextureCoord);
    
    gl_FragColor = (mask.r == 1.0)
        ? texture2D(uGrassSampler, vTextureCoord * 2.0)  // grass
        : texture2D(uLakeSampler, vTextureCoord * 16.0) + 0.004 * length(vVertexPosition); // lake
}
