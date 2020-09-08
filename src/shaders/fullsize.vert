attribute vec2 a_position;
attribute vec2 a_uv;
attribute vec2 a_texture_coord;

varying vec2 v_uv;
varying vec2 v_texture_coord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);

  v_uv = a_uv;
  v_texture_coord = a_texture_coord;
}
