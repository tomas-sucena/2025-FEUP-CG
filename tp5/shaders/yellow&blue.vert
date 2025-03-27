#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float scaleFactor;
uniform float timeFactor;

varying vec4 vVertexPosition;

void main() {
	vVertexPosition = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vVertexPosition.x += scaleFactor * sin(timeFactor); // offset the vertex in the X-axis
    
	gl_Position = vVertexPosition;
}
