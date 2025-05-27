#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
// uniform float timeFactor;
// uniform float slider;
uniform sampler2D uMaskSampler;

// output
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;

void main() {
	vVertexPosition = aVertexPosition;
    vec4 mask = texture2D(uMaskSampler, aTextureCoord);

    // lake
    if (mask.r < 1.0) {
        vVertexPosition += (sin(vVertexPosition.x / 5.0) - 2.0) * aVertexNormal;
    }

    vTextureCoord = aTextureCoord;
	gl_Position = uPMatrix * uMVMatrix * vec4(vVertexPosition, 1.0);
}
