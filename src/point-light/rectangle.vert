attribute vec4 a_position;
attribute vec4 a_color;
attribute vec3 a_normal;

uniform mat4 u_worldMatrix;
uniform mat4 u_worldViewProjectionMatrix;
uniform mat4 u_worldInverseTransposeMatrix;
uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;

varying vec4 v_color;
varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

mat2 rotate2D(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec4 position = a_position;

  vec3 surfaceWorldPosition = (u_worldMatrix * a_position).xyz;

  position.xyz += vec3(-50.0, -75.0, -15.0);

  gl_Position = u_worldViewProjectionMatrix * position;

  v_color = a_color;
  v_normal = mat3(u_worldInverseTransposeMatrix) * a_normal;
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}
