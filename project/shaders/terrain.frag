#ifdef GL_ES
precision highp float;
#endif

// input
varying vec2 vTextureCoord;

uniform sampler2D uMaskSampler;
uniform sampler2D uGrassSampler;
uniform sampler2D uLakeSampler;
uniform float size;

void main() {
    vec4 mask = texture2D(uMaskSampler, vTextureCoord);
    
    gl_FragColor = (mask.r == 1.0)
        ? texture2D(uGrassSampler, vTextureCoord * 2.0)
        : texture2D(uLakeSampler, vTextureCoord * size / 16.0);
}
