#ifdef GL_ES
precision highp float;
#endif

varying vec4 vVertexPosition;

void main() {
	gl_FragColor = (vVertexPosition.y > 0.5)
		? vec4(0.9, 0.9, 0, 1.0)
		: vec4(0.54,0.54,0.9, 1.0);
}
