#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float normScale;
uniform float timeFactor;

varying vec4 vVertexPosition;

void main() {
	gl_Position = vVertexPosition = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
	gl_Position.x += normScale * sin(timeFactor); // offset the vertex in the X-axis
}
