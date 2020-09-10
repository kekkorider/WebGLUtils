attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;

void main() {
  // Apply scale
  vec2 position = a_position * u_scale;

  // Apply rotation
  position = vec2(
    position.x * u_rotation.y + position.y * u_rotation.x,
    position.y * u_rotation.y - position.x * u_rotation.x
  );

  // Apply translation
  position += u_translation;
  // position += vec2(100.0); // DEBUG

  // Convert rectangle points from pixels to -1.0->1.0
  vec2 clipSpace = position / u_resolution * 2.0 - 1.0;

  gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
}
