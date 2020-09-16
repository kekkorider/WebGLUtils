precision highp float;

uniform vec4 u_color;
// uniform vec3 u_lightDir;

varying vec4 v_color;
varying vec3 v_normal;
varying vec3 v_surfaceToLight;

void main() {
  vec3 normal = normalize(v_normal);
  vec3 surfaceToLightdirection = normalize(v_surfaceToLight);
  float light = dot(normal, surfaceToLightdirection);

  gl_FragColor = v_color;
  gl_FragColor.rgb *= light;
}
