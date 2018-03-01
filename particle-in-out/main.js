const WIDTH = document.documentElement.clientWidth
const HEIGHT = document.documentElement.clientHeight

function Particle({ wrap, imgsUrl, radius}) {
  this.wrap = wrap
  this.ctx = wrap.getContext('2d')
  this.imgsUrl = imgsUrl
  this.imgsObj = []
  this.radius = radius
  this.index = 0
  this.initz = 300
  this.dots = []
  this.init()
}

Particle.prototype = {
  constructor: Particle,

  init: function () {
    this.wrap.style.marginLeft = 'calc(50vw - 500px)'
    this.wrap.style.marginTop = 'calc(50vh - 300px)'

    if (this.wrap.width > 500 || this.wrap.height > 300) {
      this.radius >= 4 ? this.radius = this.radius : this.radius = 4
    } else {
      this.radius >= 2 ? this.radius = this.radius : this.radius = 2
    }

    let promise_arr = this.imgsUrl.map(imgUrl => {
      return new Promise((resolve, reject) => {
        const imgObj = new Image()
        imgObj.onload = () => {
          this.imgsObj.push(imgObj)
          resolve()
        }
        imgObj.src = imgUrl
      })
    })

    Promise.all(promise_arr).then(() => {
      this.picLoop()
    })
  },

  picLoop: function () {
    this.dots = []
    this.drawPic()
    this.toParticle()
    this.combineAnimate()
    this.index === this.imgsUrl.length - 1 ? this.index = 0 : this.index += 1
  },

  drawPic: function () {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT)
    let imgObj = this.imgsObj[this.index]

    if (imgObj.width > imgObj.height) {
      ImgScale = imgObj.height / imgObj.width
      imgObj.width = this.wrap.wdith * .5
      imgObj.height = imgObj.wdith * ImgScale
    } else {
      ImgScale = imgObj.height / imgObj.width
      imgObj.width = this.wrap.width * .7
      imgObj.width = imgObj.height * ImgScale
    }

    this.ctx.drawImage(imgObj, this.wrap.width / 2 - imgObj.width / 2, this.wrap.height / 2 - imgObj.height / 2, imgObj.width, imgObj.height)
  },

  toParticle: function () {
    const imgData = this.ctx.getImageData(0, 0, WIDTH, HEIGHT)
    const data = imgData.data

    for (let x = 0; x < imgData.width; x += this.radius * 2) {
      for (let y = 0; y < imgData.height; y += this.radius * 2) {
        let i = (x + y * WIDTH) * 4
        if (data[i + 3] !== 0 && data[i] !== 255 && data[i + 1] !== 255 && data[i + 2] !== 255) {
          const dot = {
            x,
            y,
            z: 0,
            r: data[i],
            g: data[i + 1],
            b: data[i + 2],
            a: 1,
            ix: Math.random() * WIDTH,
            iy: Math.random() * HEIGHT,
            iz: Math.random() * this.initz * 2 - this.initz,
            ir: 255,
            ig: 255,
            ib: 255,
            ia: 0,
            tx: Math.random() * WIDTH,
            ty: Math.random() * HEIGHT,
            tz: Math.random() * this.initz * 2 - this.initz,
            tr: 255,
            tg: 255,
            tb: 255,
            ta: 0,
          }
          this.dots.push(dot)
        }
      }
    }
  },

  combineAnimate: function () {
    let combined = false
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT)
    this.dots.map(dot => {
      if (Math.abs(dot.ix - dot.x) < .1 && Math.abs(dot.iy - dot.y) < .1 && Math.abs(dot.iz - dot.z) < .1) {
        dot.ix = dot.x
        dot.iy = dot.y
        dot.iz = dot.z
        dot.ir = dot.r
        dot.ig = dot.g
        dot.ib = dot.b
        dot.ia = dot.a
        combined = true
      } else {
        dot.ix += (dot.x - dot.ix) * 0.07
        dot.iy += (dot.y - dot.iy) * 0.07
        dot.iz += (dot.z - dot.iz) * 0.07
        dot.ir += (dot.r - dot.ir) * 0.3
        dot.ig += (dot.g - dot.ig) * 0.3
        dot.ib += (dot.b - dot.ib) * 0.3
        dot.ia += (dot.a - dot.ia) * 0.1
        combined = false
      }

      return this.drawDot(dot)
    })

    if (!combined) {
      window.requestAnimationFrame(() => {
        return this.combineAnimate()
      })
    } else {
      setTimeout(() => {
        return this.separateAnimate()
      }, 2000)
    }
  },

  separateAnimate: function () {
    let separate = false
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT)
    this.dots.map(dot => {
      if (Math.abs(dot.ix - dot.tx < .1 && Math.abs(dot.iy - dot.ty) < .1 && Math.abs(dot.iz - dot.tz) < .1)) {
        dot.ix = dot.tx
        dot.iy = dot.ty
        dot.iz = dot.tz
        dot.ir = dot.tr
        dot.ig = dot.tg
        dot.ib = dot.tb
        dot.ia = dot.ta
        separated = true
      } else {
        dot.ix += (dot.tx - dot.ix) * 0.07
        dot.iy += (dot.ty - dot.iy) * 0.07
        dot.iz += (dot.tz - dot.iz) * 0.07
        dot.ir += (dot.tr - dot.ir) * 0.02
        dot.ig += (dot.tg - dot.ig) * 0.02
        dot.ib += (dot.tb - dot.ib) * 0.02
        dot.ia += (dot.ta - dot.ia) * 0.03
        separated = false
      }
      return this.drawDot(dot)
    })

    if (!separated) {
      window.requestAnimationFrame(() => {
        return this.separateAnimate()
      })
    } else {
      setTimeout(() => {
        return this.picLoop()
      }, 100)
    }
  },

  drawDot: function (dot) {
    const scale = this.initz / (this.initz + dot.iz)
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.fillStyle = `rgba(${Math.floor(dot.ir)}, ${Math.floor(dot.ig)}, ${Math.floor(dot.ib)}, ${dot.ia})`
    this.ctx.arc(this.wrap.width / 2 + (dot.ix - this.wrap.width / 2) * scale, this.wrap.height / 2 + (dot.iy - this.wrap.height / 2) * scale, this.radius * scale, 0, Math.PI * 2, false)
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.restore()
  }
}

const myWrap = document.getElementById('canvas-particle')

const particle = new Particle({
  wrap: myWrap,
  imgsUrl: ['imgs/1.jpg', 'imgs/1.jpeg'],
  radius: 1,
})