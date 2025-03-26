attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vVertexPosition;

void main() {
	gl_Position = vVertexPosition = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
