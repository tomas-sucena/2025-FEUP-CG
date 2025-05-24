#ifdef GL_ES
precision highp float;
#endif

// input
varying vec2 vTextureCoord;

uniform sampler2D uMaskSampler;
uniform sampler2D uGrassSampler;
uniform sampler2D uLakeSampler;

void main() {
    vec4 mask = texture2D(uMaskSampler, vTextureCoord);

    gl_FragColor = (mask.r == 1.0)
        ? texture2D(uGrassSampler, vTextureCoord)
        : texture2D(uLakeSampler, vTextureCoord);
}
