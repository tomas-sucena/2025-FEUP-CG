attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform sampler2D uSampler2;
uniform float timeFactor;
uniform float slider;

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord + 0.002 * vec2(1, 1) * timeFactor * slider;

    // sample the height map
    vec4 texSample = texture2D(uSampler2, vTextureCoord);

    // offset the vertex coordinates based on the height map
    vec3 positionOffset = 0.06 * aVertexNormal * texSample.b;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + positionOffset, 1.0);
}
