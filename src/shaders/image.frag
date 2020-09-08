precision mediump float;

uniform sampler2D u_image;
uniform float u_time;
uniform vec2 u_resolution;

varying vec2 v_uv;
varying vec2 v_texture_coord;

void main() {
  // Simple visualization altering the RB channels
  // vec3 color = texture2D(u_image, v_texture_coord).rgb;
  // color.r = abs(sin(u_time * 0.0085));
  // color.b = abs(sin(u_time * 0.0055));

  // Pixels average
  vec2 pixel = (10.0 / u_resolution) * sin(u_time * 0.01);
  vec3 color = (
    texture2D(u_image, v_texture_coord) +
    texture2D(u_image, v_texture_coord + vec2(pixel.x, pixel.y)) +
    texture2D(u_image, v_texture_coord + vec2(-pixel.x, pixel.y))
  ).rgb / 3.0;

  gl_FragColor = vec4(color, 1.0);
}
