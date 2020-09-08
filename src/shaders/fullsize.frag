precision highp float;

uniform sampler2D u_image;

varying vec2 v_uv;
varying vec2 v_texture_coord;

void main() {
  vec4 color = texture2D(u_image, v_texture_coord);
  gl_FragColor = color;
}
