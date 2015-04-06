#ifdef GL_ES
precision lowp float;
#endif

varying vec4 v_color;
void main(){
	gl_FragColor = v_color;
}