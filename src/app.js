import WebGLUtils from './WebGLUtils'

class WebGLImage {
  constructor(container) {
    this.container = container
    this.canvas = this.container.querySelector('canvas')

    this.ui = {
      btn: document.querySelector('.js-button')
    }

    this.uniforms = {}

    this.count = 0

    this.init()
  }

  init() {
    this._setupListener()
  }

  render() {
    this.count++
    this.uniforms.u_time.value = this.count
    this.gl.uniform1f(this.uniforms.u_time.location, this.uniforms.u_time.value)
    WebGLUtils.render(this.gl)
  }

  _loadImage(url) {
    return new Promise(resolve => {
      const image = new Image()
      image.src = url
      image.decode()
        .then(() => resolve(image))
    })
  }

  _setupListener() {
    this.ui.btn.addEventListener('click', () => {
      this._loadImage(this.container.dataset.webglImage)
        .then(image => {
          this.gl = WebGLUtils.createContext(this.canvas)
          this._createProgram()
          WebGLUtils.createFullsizeAttribs(this.gl, this.program)
          WebGLUtils.createFullsizeTexture(this.gl, this.program, image)
          this._createUniforms()

          window.WEBGL_IMAGES.push(this)
          this.container.classList.add('is-visible')
        })
    }, { once: true })
  }

  _createProgram() {
    const vsSource = WebGLUtils.getFullsizeVertexShaderSource()
    const fsSource = this._getFragmentShader()

    const vs = WebGLUtils.createShader(this.gl, 'vertex', vsSource)
    const fs = WebGLUtils.createShader(this.gl, 'fragment', fsSource)

    this.program = WebGLUtils.createProgram(this.gl, vs, fs)
    this.gl.useProgram(this.program)
  }

  _getFragmentShader() {
    return `
      precision mediump float;

      uniform sampler2D u_image;

      uniform float u_time;

      varying vec2 v_uv;
      varying vec2 v_texture_coord;

      void main() {
        vec4 color = texture2D(u_image, v_texture_coord);
        color.r = abs(sin(u_time * 0.0085));
        color.b = abs(sin(u_time * 0.0055));

        gl_FragColor = color;
      }
    `
  }

  _createUniforms() {
    this.uniforms.u_time = {
      location: this.gl.getUniformLocation(this.program, 'u_time'),
      value: 0
    }
  }
}

window.WEBGL_IMAGES = []

document.querySelectorAll('[data-webgl-image]').forEach(image => {
  new WebGLImage(image)
})

const rAFCallback = () => {
  window.WEBGL_IMAGES.forEach(image => image.render())
  requestAnimationFrame(rAFCallback)
}
requestAnimationFrame(rAFCallback)
