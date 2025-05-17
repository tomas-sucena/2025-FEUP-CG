#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float timeFactor;
uniform float slider;

varying vec4 vVertexPosition;

void main() {
	vVertexPosition = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vVertexPosition.x += slider * sin(timeFactor); // offset the vertex in the X-axis
    
	gl_Position = vVertexPosition;
}
