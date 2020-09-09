precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform float u_kernel[9];

varying vec2 v_uv;
varying vec2 v_texture_coord;

void main() {
  vec2 pixel = 1.0 / u_resolution;

  vec4 colorSum =
    texture2D(u_image, v_texture_coord + pixel * vec2(-1, -1)) * u_kernel[0] +
    texture2D(u_image, v_texture_coord + pixel * vec2( 0, -1)) * u_kernel[1] +
    texture2D(u_image, v_texture_coord + pixel * vec2( 1, -1)) * u_kernel[2] +
    texture2D(u_image, v_texture_coord + pixel * vec2(-1,  0)) * u_kernel[3] +
    texture2D(u_image, v_texture_coord + pixel * vec2( 0,  0)) * u_kernel[4] +
    texture2D(u_image, v_texture_coord + pixel * vec2( 1,  0)) * u_kernel[5] +
    texture2D(u_image, v_texture_coord + pixel * vec2(-1,  1)) * u_kernel[6] +
    texture2D(u_image, v_texture_coord + pixel * vec2( 0,  1)) * u_kernel[7] +
    texture2D(u_image, v_texture_coord + pixel * vec2( 1,  1)) * u_kernel[8];

  gl_FragColor = vec4((colorSum/1.0).rgb, 1.0);
}
