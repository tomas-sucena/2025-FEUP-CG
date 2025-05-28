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
    vec2 scaledTextureCoord = vTextureCoord * size;
    
    gl_FragColor = (mask.r == 1.0)
        ? texture2D(uGrassSampler, scaledTextureCoord)
        : texture2D(uLakeSampler, scaledTextureCoord);
}
