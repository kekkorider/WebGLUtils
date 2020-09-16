attribute vec4 a_position;
attribute vec4 a_color;
attribute vec3 a_normal;

uniform mat4 u_worldMatrix;
uniform mat4 u_worldViewProjectionMatrix;
uniform mat4 u_worldInverseTransposeMatrix;
uniform float u_rotationY;
uniform vec3 u_lightWorldPosition;

varying vec4 v_color;
varying vec3 v_normal;
varying vec3 v_surfaceToLight;

mat2 rotate2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec4 position = a_position;

  // position.xyz += vec3(-50.0, -75.0, -15.0); // Move pivot point to the center
  position.xz *= rotate2D(u_rotationY);

  vec3 surfaceWorldPosition = (u_worldMatrix * a_position).xyz;

  gl_Position = u_worldViewProjectionMatrix * position;

  v_color = a_color;
  v_normal = mat3(u_worldInverseTransposeMatrix) * a_normal;
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
}
