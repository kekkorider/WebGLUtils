import { mat4 } from 'gl-matrix'

export default class Camera {
  constructor(gl, fov, aspect, near, far, radius, controls = false) {
    this.gl = gl
    this.fov = fov
    this.aspect = aspect
    this.near = near
    this.far = far
    this.radius = radius
    this.controls = controls

    this.rotation = { x: 0, y: 0, z: 0 }
    this.position = { x: 0, y: 0, z: this.radius }

    this.state = {
      mousedown: false,
      drag: false
    }

    this.#addListeners()
  }

  /**
   * Set the camera to look at a specific coordinate.
   *
   * @param {Object} targetPos An Object containing the target x, y and z coordinates of the camera.
   * @returns {mat4} The viewProjectionMatrix
   */
  lookAt(targetPos) {
    this.#updateProjectionMatrix()
    this.#updateCameraMatrix()
    this.#updateViewMatrix()

    mat4.lookAt(this.viewMatrix, Object.values(this.position), Object.values(targetPos), [0, 1, 0])
    mat4.rotate(this.viewMatrix, this.viewMatrix, Math.PI, [1, 0, 0])

    this.#updateViewProjectionMatrix()

    return this.viewProjectionMatrix
  }

  /**
   *
   * @param {Object} position An Object containing the new X, Y and Z coordinates of the camera.
   */
  setPosition(position) {
    this.position = { ...this.position, ...position }
  }

  /**
   * @returns {Object} The position object
   */
  getPosition() {
    return this.position
  }

  /**
   * DEPRECATED. Moves the camera to a specific coordinate.
   *
   * @param {Object} cameraPos An Object containing the new camera X, Y and Z coordinates.
   */
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

  #addListeners() {
    if (!this.controls) return

    this.gl.canvas.addEventListener('mousedown', () => {
      this.state.mousedown = true
    })

    this.gl.canvas.addEventListener('mousemove', e => {
      this.state.drag = this.state.mousedown

      if (this.state.drag) {
        this.rotation.x += e.movementY
        this.rotation.y -= e.movementX
        this.rotation.z += e.movementX

        this.setPosition({
          x: Math.sin(this.#degToRad(this.rotation.y * 0.0005)) * this.radius,
          y: Math.sin(this.#degToRad(this.rotation.x * 0.0005)) * this.radius,
          z: Math.cos(this.#degToRad(this.rotation.z * 0.0005)) * this.radius
        })
      }
    })

    this.gl.canvas.addEventListener('mouseup', () => {
      this.state.mousedown = false
      this.state.drag = false
    })
  }

  /**
   *
   * @param {Number} angle The angle in degrees
   * @returns {Number} The angle in radians
   */
  #degToRad(angle) {
    return angle * 180 / Math.PI
  }
}
