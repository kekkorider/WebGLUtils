attribute vec2 a_position;

uniform vec2 u_resolution;
uniform mat3 u_matrix;

void main() {
  vec2 position = (u_matrix * vec3(a_position, 1.0)).xy;

  // Convert rectangle points from pixels to -1.0->1.0
  vec2 clipSpace = position / u_resolution * 2.0 - 1.0;

  gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
}
