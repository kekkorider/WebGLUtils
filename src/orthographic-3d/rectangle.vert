attribute vec4 a_position;
attribute vec4 a_color;

uniform float u_time;
uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
  vec4 pos = a_position;
  pos.z += sin(a_position.x + u_time * 0.05) * 10.0;

  gl_Position = u_matrix * pos;
  v_color = a_color;
}
