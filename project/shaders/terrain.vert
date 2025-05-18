#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
// uniform float timeFactor;
// uniform float slider;

// output
varying vec4 vVertexPosition;
varying vec2 vTextureCoord;

void main() {
	vVertexPosition = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;

	gl_Position = vVertexPosition;
}
