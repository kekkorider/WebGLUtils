import { mat4 } from 'gl-matrix'

export default class Camera {
  constructor(gl, fov = Math.PI * 0.25, near = 0.1, far = 10000) {
    this.gl = gl
    this.fov = fov
    this.aspect = gl.canvas.width / gl.canvas.height
    this.near = near
    this.far = far
  }

  lookAt(cameraPos, targetPos) {
    this.#updateProjectionMatrix()
    this.#updateCameraMatrix()
    this.#updateViewMatrix()

    mat4.lookAt(this.viewMatrix, cameraPos, targetPos, [0, 1, 0])
    mat4.rotate(this.viewMatrix, this.viewMatrix, Math.PI, [1, 0, 0])

    this.#updateViewProjectionMatrix()

    return this.viewProjectionMatrix
  }

  translate(cameraPos) {
    this.#updateProjectionMatrix()
    this.#updateCameraMatrix()
    this.#updateViewMatrix()

    mat4.rotate(this.viewMatrix, this.viewMatrix, Math.PI, [1, 0, 0])
    mat4.translate(this.viewMatrix, this.viewMatrix, cameraPos)

    this.#updateViewProjectionMatrix()

    return this.viewProjectionMatrix
  }

  #updateProjectionMatrix() {
    this.projectionMatrix = mat4.create()
    mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far)
  }

  #updateCameraMatrix() {
    this.cameraMatrix = mat4.create()
  }

  #updateViewMatrix() {
    this.viewMatrix = mat4.create()
    mat4.invert(this.viewMatrix, this.cameraMatrix)
  }

  #updateViewProjectionMatrix() {
    this.viewProjectionMatrix = mat4.create()
    mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix)
  }
}
