precision highp float;

uniform vec4 u_color;
uniform vec3 u_lightDir;

varying vec4 v_color;
varying vec3 v_normal;

void main() {
  vec3 normal = normalize(v_normal);
  float light = dot(normal, u_lightDir);

  gl_FragColor = v_color;
  gl_FragColor.rgb *= light;
}
