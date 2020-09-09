import WebGLUtils from '../WebGLUtils'

const vertexShader = require('../shaders/fullsize.vert')
const fragmentShader = require('../shaders/image-multiple-effects.frag')

/*
 * REF: https://webglfundamentals.org/webgl/lessons/webgl-image-processing-continued.html
 */
class MultipleImageEffects {
  constructor() {
    this.canvas = document.querySelector('#app')

    this.#init()
  }

  #init() {
    this.#loadImage('./flower.jpg')
      .then(image => {
        this.#setup(image)
        requestAnimationFrame(() => this.#render(this.gl))
      })
  }

  #render(gl) {
    this.#updateUniforms()
    this.#renderTextureWithEffects()

    requestAnimationFrame(() => this.#render(gl))
  }

  #renderTextureWithEffects() {
    const gl = this.gl

    // Start with the original image
    gl.bindTexture(gl.TEXTURE_2D, this.originalTexture.texture)

    // Loop through each effect we want to apply
    for(let i = 0; i < this.effectsToApply.length; i++) {
      // Setup to draw into one of the framebuffers
      this.#setFramebuffer(this.frameBuffers[i%2], this.originalTexture.width, this.originalTexture.height)

      this.#drawWithKernel(this.effectsToApply[i])

      // For the next draw, use the texture we just rendered to
      gl.bindTexture(gl.TEXTURE_2D, this.textures[i%2])
    }

    // Draw the final result to the canvas
    this.#setFramebuffer(null, this.canvas.width, this.canvas.height)
    this.#drawWithKernel('normal')
  }

  #setup(image) {
    this.gl = WebGLUtils.createContext(this.canvas)
    this.#createProgram()
    this.#createUniforms()
    WebGLUtils.createFullsizeAttribs(this.gl, this.program)
    this.originalTexture = {
      texture: WebGLUtils.createFullsizeTexture(this.gl, this.program, image),
      width: image.width,
      height: image.height
    }
    this.#createEffects()
    this.#createFramebuffers(image)
  }

  #loadImage(url) {
    return new Promise(resolve => {
      const image = new Image()
      image.src = url
      image.decode()
        .then(() => resolve(image))
    })
  }

  #createProgram() {
    const vs = WebGLUtils.createShader(this.gl, 'vertex', vertexShader)
    const fs = WebGLUtils.createShader(this.gl, 'fragment', fragmentShader)

    this.program = WebGLUtils.createProgram(this.gl, vs, fs)
    this.gl.useProgram(this.program)
  }

  #createUniforms() {
    const gl = this.gl
    const program = this.program

    this.uniforms = {
      u_resolution: {
        location: gl.getUniformLocation(program, 'u_resolution'),
        value: [this.canvas.clientWidth, this.canvas.clientHeight]
      },
      u_kernel: {
        location: gl.getUniformLocation(program, 'u_kernel'),
        value: new Float32Array(9)
      }
    }
  }

  #updateUniforms() {}

  #createEffects() {
    this.kernels = {
      normal: [
        0, 0, 0,
        0, 1, 0,
        0, 0, 0
      ],
      gaussianBlur: [
        0.045, 0.122, 0.045,
        0.122, 0.332, 0.122,
        0.045, 0.122, 0.045
      ],
      unsharpen: [
        -1, -1, -1,
        -1,  9, -1,
        -1, -1, -1
      ],
      emboss: [
         -2, -1,  0,
         -1,  1,  1,
          0,  1,  2
      ]
    }

    // List of effects to apply.
    this.effectsToApply = [
      'gaussianBlur',
      'emboss',
      'unsharpen'
    ]
  }

  #createFramebuffers(image) {
    const gl = this.gl

    this.textures = []
    this.frameBuffers = []

    for (let i = 0; i < 2; i++) {
      const texture = WebGLUtils.createFullsizeTexture(gl, this.program, image)
      this.textures.push(texture)

      const fbo = gl.createFramebuffer()
      this.frameBuffers.push(fbo)
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    }
  }

  #setFramebuffer(fbo, width, height) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo)
    this.gl.uniform2f(this.uniforms.u_resolution.location, width, height)
    this.gl.viewport(0, 0, width, height)
  }

  #drawWithKernel(name) {
    this.gl.uniform1fv(this.uniforms.u_kernel.location, this.kernels[name])
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
}

const app = new MultipleImageEffects()
console.log(app)
