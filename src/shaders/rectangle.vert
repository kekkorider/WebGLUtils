attribute vec2 a_position;

uniform mat3 u_matrix;

void main() {
  gl_Position = vec4((u_matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);
}
