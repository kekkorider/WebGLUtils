import WebGLUtils from '../WebGLUtils'
import { mat3 } from 'gl-matrix'

const vertexShader = require('../shaders/rectangle.vert')
const fragmentShader = require('../shaders/rectangle.frag')

class Matrices {
  constructor() {
    this.canvas = document.querySelector('canvas')

    this.#init()
  }

  #init() {
    this.gl = WebGLUtils.createContext(this.canvas)
    this.#createProgram()
    this.#createAttributes()
    this.#createUniforms()
    this.#createBuffers()
    this.#drawGeometry()
    requestAnimationFrame(() => this.#render(this.gl))
  }

  #render(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT)

    this.#updateUniforms()

    gl.drawArrays(gl.TRIANGLES, 0, 18)

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
        value: [0, 0]
      }
    }
  }

  #createUniforms() {
    const gl = this.gl

    this.uniforms = {
      u_color: {
        location: gl.getUniformLocation(this.program, 'u_color'),
        value: [0.5, 0.1, 0.2, 1.0]
      },
      u_matrix: {
        location: gl.getUniformLocation(this.program, 'u_matrix'),
        value: mat3.create()
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
    gl.vertexAttribPointer(this.attributes.a_position.location, 2, gl.FLOAT, false, 0, 0)
  }

  #updateUniforms() {
    const gl = this.gl

    // u_matrix
    const scale = 0.5 + Math.abs(Math.sin(Date.now() * 0.003) * 0.5)

    const translation = [
      this.canvas.width / 2 + Math.cos(Date.now() * 0.004) * 40,
      this.canvas.height / 2 + Math.sin(Date.now() * 0.0025) * 40
    ]

    const matrix = mat3.create()
    mat3.projection(matrix, this.canvas.width, this.canvas.height)
    mat3.translate(matrix, matrix, translation)
    mat3.rotate(matrix, matrix, Date.now() * 0.0035)
    mat3.scale(matrix, matrix, [scale, scale])
    mat3.translate(matrix, matrix, [-50, -75]) // Move the origin from top left to the center

    gl.uniformMatrix3fv(this.uniforms.u_matrix.location, false, matrix)

    // u_color
    gl.uniform4fv(this.uniforms.u_color.location, this.uniforms.u_color.value)
  }

  #drawGeometry() {
    const gl = this.gl

    const positions = new Float32Array([
      0, 0, // Left column
      30, 0,
      0, 150,
      0, 150,
      30, 0,
      30, 150,

      30, 0, // Top rung
      100, 0,
      30, 30,
      30, 30,
      100, 0,
      100, 30,

      30, 60, // Middle rung
      67, 60,
      30, 90,
      30, 90,
      67, 60,
      67, 90
    ])

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
  }
}

const app = new Matrices()
console.log(app)
