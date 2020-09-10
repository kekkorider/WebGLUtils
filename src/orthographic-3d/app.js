import WebGLUtils from '../WebGLUtils'
import { mat3, mat4 } from 'gl-matrix'

const vertexShader = require('./rectangle.vert')
const fragmentShader = require('./rectangle.frag')

class Matrices {
  constructor() {
    this.canvas = document.querySelector('canvas')
    this.tick = 0

    this.#init()
  }

  #init() {
    this.gl = WebGLUtils.createContext(this.canvas)
    this.#createProgram()
    this.#createAttributes()
    this.#createUniforms()
    this.#createBuffers()
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
    }
  }

  #createUniforms() {
    const gl = this.gl

    this.uniforms = {
      u_matrix: {
        location: gl.getUniformLocation(this.program, 'u_matrix'),
        value: mat3.create()
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
    gl.enableVertexAttribArray(this.attributes.a_color.position)
    gl.vertexAttribPointer(this.attributes.a_color.location, 3, gl.UNSIGNED_BYTE, true, 0, 0)
  }

  #updateUniforms() {
    const gl = this.gl

    // u_matrix
    const scale = 0.8 + Math.abs(Math.sin(Date.now() * 0.001) * 0.4)

    const translation = [
      this.canvas.width / 2,
      this.canvas.height / 2,
      -200
    ]

    const matrix = mat4.create()
    mat4.ortho(matrix, 0, this.canvas.width, this.canvas.height, 0, 0.1 , 1000)
    mat4.translate(matrix, matrix, translation)
    mat4.rotate(matrix, matrix, Math.PI * -0.1, [1, 0, 0])
    mat4.rotate(matrix, matrix, Math.PI * 0.1, [0, 1, 0])
    mat4.scale(matrix, matrix, [scale, scale, scale])
    mat4.translate(matrix, matrix, [-50, -75, 0]) // Move the origin from top left to the center

    gl.uniformMatrix4fv(this.uniforms.u_matrix.location, false, matrix)

    // u_time
    gl.uniform1f(this.uniforms.u_time.location, this.tick)
  }

  #drawGeometry() {
    const gl = this.gl

    const positions = new Float32Array([
      0, 0, 0, // Left column - back
      30, 0, 0,
      0, 150, 0,
      30, 0, 0,
      30, 150, 0,
      0, 150, 0,

      0, 0, 30, // Left column - front
      0, 150, 30,
      30, 0, 30,
      0, 150, 30,
      30, 150, 30,
      30, 0, 30,

      0, 0, 0, // Left column - top
      0, 0, 30,
      30, 0, 0,
      0, 0, 30,
      30, 0, 30,
      30, 0, 0,


      0, 0, 0, // Left column - left side
      0, 150, 0,
      0, 0, 30,
      0, 0, 30,
      0, 150, 0,
      0, 150, 30,

      30, 30, 0, // Left column - right side
      30, 30, 30,
      30, 150, 0,
      30, 30, 30,
      30, 150, 30,
      30, 150, 0,

      0, 150, 0, // Left column - bottom side
      30, 150, 0,
      0, 150, 30,
      0, 150, 30,
      30, 150, 0,
      30, 150, 30,

      30, 0, 0, // Top rung - back
      100, 0, 0,
      30, 30, 0,
      30, 30, 0,
      100, 0, 0,
      100, 30, 0,

      30, 0, 30, // Top rung - front
      30, 30, 30,
      100, 0, 30,
      30, 30, 30,
      100, 30, 30,
      100, 0, 30,

      30, 30, 0, // Top rung - bottom side
      100, 30, 0,
      30, 30, 30,
      100, 30, 0,
      100, 30, 30,
      30, 30, 30,

      100, 0, 0, // Top rung - right side
      100, 30, 30,
      100, 30, 0,
      100, 30, 30,
      100, 0, 0,
      100, 0, 30,

      30, 0, 0, // Top rung - top
      30, 0, 30,
      100, 0, 0,
      30, 0, 30,
      100, 0, 30,
      100, 0, 0,

      30, 60, 0, // Middle rung - back
      67, 60, 0,
      30, 90, 0,
      30, 90, 0,
      67, 60, 0,
      67, 90, 0,

      30, 60, 30, // Middle rung - front
      30, 90, 30,
      67, 60, 30,
      30, 90, 30,
      67, 90, 30,
      67, 60, 30,

      67, 60, 0, // Middle rung - right side
      67, 90, 30,
      67, 90, 0,
      67, 90, 30,
      67, 60, 0,
      67, 60, 30,

      30, 60, 0, // Middle rung - top side
      30, 60, 30,
      67, 60, 0,
      30, 60, 30,
      67, 60, 30,
      67, 60, 0,

      30, 90, 0, // Middle rung - bottom side
      67, 90, 0,
      30, 90, 30,
      30, 90, 30,
      67, 90, 0,
      67, 90, 30,
    ])

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)


    const colors = new Uint8Array([
      200, 50, 60, // Left column - back
      200, 50, 60,
      200, 50, 60,
      200, 50, 60,
      200, 50, 60,
      200, 50, 60,

      10, 170, 130, // Left column - front
      10, 170, 130,
      10, 170, 130,
      10, 170, 130,
      10, 170, 130,
      10, 170, 130,

      200, 100, 80, // Left column - top
      200, 100, 80,
      200, 100, 80,
      200, 100, 80,
      200, 100, 80,
      200, 100, 80,

      100, 150, 60, // Left column - left side
      100, 150, 60,
      100, 150, 60,
      100, 150, 60,
      100, 150, 60,
      100, 150, 60,

      230, 190, 0, // Left column - right side
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,
      230, 190, 0,

      90, 250, 110, // Left column - bottom side
      90, 250, 110,
      90, 250, 110,
      90, 250, 110,
      90, 250, 110,
      90, 250, 110,

      30, 120, 90, // Top rung - front
      30, 120, 90,
      30, 120, 90,
      30, 120, 90,
      30, 120, 90,
      30, 120, 90,

      0, 200, 180, // Top rung - back
      0, 200, 180,
      0, 200, 180,
      0, 200, 180,
      0, 200, 180,
      0, 200, 180,

      220, 80, 200, // Top rung - bottom side
      220, 80, 200,
      220, 80, 200,
      220, 80, 200,
      220, 80, 200,
      220, 80, 200,

      200, 200, 0, // Top rung - right side
      200, 200, 0,
      200, 200, 0,
      200, 200, 0,
      200, 200, 0,
      200, 200, 0,

      0, 0, 240, // Top rung - top
      0, 0, 240,
      0, 0, 240,
      0, 0, 240,
      0, 0, 240,
      0, 0, 240,

      230, 10, 10, // Middle rung - front
      230, 10, 10,
      230, 10, 10,
      230, 10, 10,
      230, 10, 10,
      230, 10, 10,

      10, 60, 130, // Middle rung - back
      10, 60, 130,
      10, 60, 130,
      10, 60, 130,
      10, 60, 130,
      10, 60, 130,

      160, 160, 40, // Middle rung - right side
      160, 160, 40,
      160, 160, 40,
      160, 160, 40,
      160, 160, 40,
      160, 160, 40,

      0, 80, 70, // Middle rung - top side
      0, 80, 70,
      0, 80, 70,
      0, 80, 70,
      0, 80, 70,
      0, 80, 70,

      240, 210, 140, // Middle rung - bottom side
      240, 210, 140,
      240, 210, 140,
      240, 210, 140,
      240, 210, 140,
      240, 210, 140
    ])

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color)
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
  }
}

const app = new Matrices()
console.log(app)
