import WebGLUtils from '../WebGLUtils'
import Camera from '../Camera'
import { vec3, mat3, mat4 } from 'gl-matrix'

const vertexShader = require('./rectangle.vert')
const fragmentShader = require('./rectangle.frag')

class App {
  constructor() {
    this.canvas = document.querySelector('canvas')
    this.tick = 0
    this.target = { x: 0, y: 0, z: 0 }
    this.lightDir = { x: 0.5, y: 0.7, z: 1 }

    this.#init()
  }

  #init() {
    this.gl = WebGLUtils.createContext(this.canvas)
    this.#createProgram()
    this.#createAttributes()
    this.#createUniforms()
    this.#createBuffers()
    this.#createCamera()
    this.#drawGeometry()

    this.gl.enable(this.gl.CULL_FACE) // backface culling
    this.gl.cullFace(this.gl.BACK)
    this.gl.enable(this.gl.DEPTH_TEST)

    requestAnimationFrame(() => this.#render(this.gl))
  }

  #render(gl) {
    this.tick++

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    this.#updateUniforms()

    gl.drawArrays(gl.TRIANGLES, 0, 6*16)

    requestAnimationFrame(() => this.#render(gl))
  }

  #createProgram() {
    const vs = WebGLUtils.createShader(this.gl, 'vertex', vertexShader)
    const fs = WebGLUtils.createShader(this.gl, 'fragment', fragmentShader)

    this.program = WebGLUtils.createProgram(this.gl, vs, fs)
    this.gl.useProgram(this.program)
  }

  #createAttributes() {
    const gl = this.gl

    this.attributes = {
      a_position: {
        location: gl.getAttribLocation(this.program, 'a_position'),
        value: mat3.create()
      },
      a_color: {
        location: gl.getAttribLocation(this.program, 'a_color'),
        value: mat4.create()
      },
      a_normal: {
        location: gl.getAttribLocation(this.program, 'a_normal'),
        value: mat3.create()
      }
    }
  }

  #createUniforms() {
    const gl = this.gl

    this.uniforms = {
      u_matrix: {
        location: gl.getUniformLocation(this.program, 'u_matrix'),
        value: mat3.create()
      },
      u_lightDir: {
        location: gl.getUniformLocation(this.program, 'u_lightDir'),
        value: vec3.create()
      },
      u_time: {
        location: gl.getUniformLocation(this.program, 'u_time'),
        value: 0
      }
    }
  }

  #createBuffers() {
    this.buffers = {}

    const gl = this.gl

    /*
     * Position buffer (a_position)
     */
    this.buffers.position = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position)

    // Enable the attribute
    gl.enableVertexAttribArray(this.attributes.a_position.location)

    // Tell the attribute how to get data out of positionBuffer
    gl.vertexAttribPointer(this.attributes.a_position.location, 3, gl.FLOAT, false, 0, 0)

    /*
     * Color buffer (a_color)
     */
    this.buffers.color = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color)
    gl.enableVertexAttribArray(this.attributes.a_color.location)
    gl.vertexAttribPointer(this.attributes.a_color.location, 3, gl.UNSIGNED_BYTE, true, 0, 0)

    /*
     * Normals buffer (a_normal)
     */
    this.buffers.normal = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normal)
    gl.enableVertexAttribArray(this.attributes.a_normal.location)
    gl.vertexAttribPointer(this.attributes.a_normal.location, 3, gl.FLOAT, false, 0, 0)
  }

  #createCamera() {
    const fov = Math.PI * 0.25
    const aspect = this.gl.canvas.width / this.gl.canvas.height
    const near = 0.1
    const far = 10000
    const radius = 500
    const controls = true

    this.camera = new Camera(this.gl, fov, aspect, near, far, radius, controls)
  }

  #updateUniforms() {
    const gl = this.gl

    // u_matrix
    const viewProjectionMatrix = this.camera.lookAt(this.target)
    gl.uniformMatrix4fv(this.uniforms.u_matrix.location, false, viewProjectionMatrix)

    // u_lightDir
    const lightDir = vec3.fromValues(this.lightDir.x, this.lightDir.y, this.lightDir.z)
    vec3.normalize(lightDir, lightDir)
    gl.uniform3fv(this.uniforms.u_lightDir.location, lightDir)

    // u_time
    gl.uniform1f(this.uniforms.u_time.location, this.tick)
  }

  #drawGeometry() {
    const gl = this.gl

    const positions = new Float32Array([
      0, 0, 0, // Left column - front
      0, 150, 0,
      30, 0, 0,
      30, 0, 0,
      0, 150, 0,
      30, 150, 0,

      0, 0, 30, // Left column - back
      30, 0, 30,
      0, 150, 30,
      30, 150, 30,
      0, 150, 30,
      30, 0, 30,

      0, 0, 0, // Left column - top
      30, 0, 0,
      0, 0, 30,
      30, 0, 30,
      0, 0, 30,
      30, 0, 0,


      0, 0, 0, // Left column - left side
      0, 0, 30,
      0, 150, 0,
      0, 0, 30,
      0, 150, 30,
      0, 150, 0,

      30, 30, 0, // Left column - right side
      30, 150, 0,
      30, 30, 30,
      30, 150, 30,
      30, 30, 30,
      30, 150, 0,

      0, 150, 0, // Left column - bottom side
      0, 150, 30,
      30, 150, 0,
      0, 150, 30,
      30, 150, 30,
      30, 150, 0,

      30, 0, 0, // Top rung - front
      30, 30, 0,
      100, 0, 0,
      100, 0, 0,
      30, 30, 0,
      100, 30, 0,

      30, 0, 30, // Top rung - back
      100, 0, 30,
      30, 30, 30,
      100, 30, 30,
      30, 30, 30,
      100, 0, 30,

      30, 30, 0, // Top rung - bottom side
      30, 30, 30,
      100, 30, 0,
      100, 30, 30,
      100, 30, 0,
      30, 30, 30,

      100, 0, 0, // Top rung - right side
      100, 30, 0,
      100, 30, 30,
      100, 0, 0,
      100, 30, 30,
      100, 0, 30,

      30, 0, 0, // Top rung - top
      100, 0, 0,
      30, 0, 30,
      100, 0, 30,
      30, 0, 30,
      100, 0, 0,

      30, 60, 0, // Middle rung - front
      30, 90, 0,
      67, 60, 0,
      67, 60, 0,
      30, 90, 0,
      67, 90, 0,

      30, 60, 30, // Middle rung - back
      67, 60, 30,
      30, 90, 30,
      67, 90, 30,
      30, 90, 30,
      67, 60, 30,

      67, 60, 0, // Middle rung - right side
      67, 90, 0,
      67, 90, 30,
      67, 60, 0,
      67, 90, 30,
      67, 60, 30,

      30, 60, 0, // Middle rung - top side
      67, 60, 0,
      30, 60, 30,
      67, 60, 30,
      30, 60, 30,
      67, 60, 0,

      30, 90, 0, // Middle rung - bottom side
      30, 90, 30,
      67, 90, 0,
      67, 90, 0,
      30, 90, 30,
      67, 90, 30
    ])

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)


    const colors = new Uint8Array([
      200, 50, 60, // Left column - front
      200, 50, 60,
      200, 50, 60,
      200, 50, 60,
      200, 50, 60,
      200, 50, 60,

      10, 170, 130, // Left column - back
      10, 170, 130,
      10, 170, 130,
      10, 170, 130,
      10, 170, 130,
      10, 170, 130,

      230, 190, 0, // Left column - top
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,

      230, 190, 0, // Left column - left side
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,

      230, 190, 0, // Left column - right side
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,

      230, 190, 0, // Left column - bottom side
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,

      200, 50, 60, // Top rung - front
      200, 50, 60,
      200, 50, 60,
      200, 50, 60,
      200, 50, 60,
      200, 50, 60,

      10, 170, 130, // Top rung - back
      10, 170, 130,
      10, 170, 130,
      10, 170, 130,
      10, 170, 130,
      10, 170, 130,

      230, 190, 0, // Top rung - bottom side
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,

      230, 190, 0, // Top rung - right side
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,

      230, 190, 0, // Top rung - top
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,

      200, 50, 60, // Middle rung - front
      200, 50, 60,
      200, 50, 60,
      200, 50, 60,
      200, 50, 60,
      200, 50, 60,

      10, 170, 130, // Middle rung - back
      10, 170, 130,
      10, 170, 130,
      10, 170, 130,
      10, 170, 130,
      10, 170, 130,

      230, 190, 0, // Middle rung - right side
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,

      230, 190, 0, // Middle rung - top side
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,

      230, 190, 0, // Middle rung - bottom side
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0
    ])

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color)
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)


    const normals = new Float32Array([
      0, 0, 1, // Left column - front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      0, 0, -1, // Left column - back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      0, 1, 0, // Left column - top
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      -1, 0, 0, // Left column - left side
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,
      -1, 0, 0,

      1, 0, 0, // Left column - right side
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      0, -1, 0, // Left column - bottom side
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      0, 0, 1, // Top rung - front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      0, 0, -1, // Top rung - back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      0, -1, 0, // Top rung - bottom side
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,

      1, 0, 0, // Top rung - right side
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      0, 1, 0, // Top rung - top
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      0, 0, 1, // Middle rung - front
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      0, 0, -1, // Middle rung - back
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,
      0, 0, -1,

      1, 0, 0, // Middle rung - right side
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,
      1, 0, 0,

      0, 1, 0, // Middle rung - top side
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,

      0, -1, 0, // Middle rung - bottom side
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0,
      0, -1, 0
    ])

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normal)
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW)
  }
}

const app = new App()
console.log(app)
