precision mediump float;

uniform sampler2D u_image;
uniform float u_time;

varying vec2 v_uv;
varying vec2 v_texture_coord;

void main() {
  vec4 color = texture2D(u_image, v_texture_coord);
  color.r = abs(sin(u_time * 0.0085));
  color.b = abs(sin(u_time * 0.0055));

  gl_FragColor = color;
}
