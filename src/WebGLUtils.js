export default class WebGLUtils {
  /**
   * Create a WebGL context.
   *
   * @param {HTMLCanvasElement} canvas - The canvas element
   *
   * @return {WebGLRenderingContext} The WebGL context
   */
  static createContext(canvas) {
    const gl = canvas.getContext('webgl')

    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    return gl
  }

  /**
   * Create a shader.
   *
   * @param {WebGLRenderingContext} gl - The WebGL context
   * @param {string} type - The type of shader (vertex/fragment)
   * @param {string} source - The GLSL code of the shader
   *
   * @return {WebGLShader}
   */
  static createShader(gl, type, source) {
    const shaderType = gl[`${type.toUpperCase()}_SHADER`]
    const shader = gl.createShader(shaderType)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

    if (success) return shader

    console.warn(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
  }

  /**
   * Create a program.
   *
   * @param {WebGLRenderingContext} gl - The WebGL context
   * @param {WebGLShader} vs - The vertex shader
   * @param {WebGLShader} fs - The fragment shader
   *
   * @return {WebGLProgram}
   */
  static createProgram(gl, vs, fs) {
    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    const success = gl.getProgramParameter(program, gl.LINK_STATUS)

    if (success) return program

    console.warn(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
  }

  /**
   * Set the a_position and a_uv attributes needed in
   * the big triangle technique.
   *
   * Use this if you need to create a shader that covers the full canvas.
   *
   * @param {WebGLRenderingContext} gl - The WebGLContext
   * @param {WebGLProgram} program - The WebGL program
   */
  static createFullsizeAttribs(gl, program) {
    // a_position
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

    const positions = [
      -1, -1,
      3, -1,
      -1, 3
    ]

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    const positionAttribLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionAttribLocation)

    const size = 2
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.vertexAttribPointer(positionAttribLocation, size, type, normalize, stride, offset)

    // a_uv
    const uvBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer)

    const uvs = [
      0, 0,
      2, 0,
      0, 2
    ]

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW)

    const uvAttributeLocation = gl.getAttribLocation(program, 'a_uv')
    gl.enableVertexAttribArray(uvAttributeLocation)

    gl.vertexAttribPointer(uvAttributeLocation, size, type, normalize, stride, offset)
  }

  /**
   * Create a WebGLTexture to use with the big triangle technique.
   *
   * Use this only if the image must cover the entire viewport of the canvas.
   *
   * @param {WebGLRenderingContext} gl - The WebGL context
   * @param {WebGLProgram} program - The WebGL program
   * @param {HTMLImageElement|HTMLCanvasElement} image - The image to pass as a texture
   */
  static createFullsizeTexture(gl, program, image) {
    const textureCoordLocation = gl.getAttribLocation(program, 'a_texture_coord')
    gl.enableVertexAttribArray(textureCoordLocation)

    const textureCoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer)

    const coords = [
      0, 0,
      2, 0,
      0, 2
    ]

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW)

    gl.vertexAttribPointer(textureCoordLocation, 2, gl.FLOAT, false, 0, 0)

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  }

  /**
   * Get the minimal vertex shader needed for the big triangle technique.
   *
   * @return {string} A string containiing the shader code
   */
  static getFullsizeVertexShaderSource() {
    return `
      attribute vec2 a_position;
      attribute vec2 a_uv;
      attribute vec2 a_texture_coord;

      varying vec2 v_uv;
      varying vec2 v_texture_coord;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);

        v_uv = a_uv;
        v_texture_coord = a_texture_coord;
      }
    `
  }

  /**
   * Get the minimal fragment shader needed for the big triangle technique.
   *
   * @return {string} A string containiing the shader code
   */
  static getFullsizeFragmentShaderSource() {
    return `
      precision mediump float;

      uniform sampler2D u_image;

      varying vec2 v_uv;
      varying vec2 v_texture_coord;

      void main() {
        vec4 color = texture2D(u_image, v_texture_coord);
        gl_FragColor = color;
      }
    `
  }

  /**
   * Render to the canvas.
   *
   * @param {WebGLRenderingContext} gl - The WebGLContext
   */
  static render(gl) {
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  /**
   * Destroy a WebGL context.
   *
   * @param {WebGLRenderingContext} gl - The WebGL context to destroy
   */
  static destroy(gl) {
    gl.getExtension('WEBGL_lose_context').loseContext()
  }
}
