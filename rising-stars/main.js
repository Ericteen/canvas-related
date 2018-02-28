const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const WIDTH = document.documentElement.clientWidth
const HEIGHT = document.documentElement.clientHeight
const round = []
const initRoundPopulation = 80
const isUseCache = true

canvas.width = WIDTH
canvas.height = HEIGHT

function animate() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  for(let i in round) {
    round[i].move()
  }

  window.requestAnimationFrame(animate)
}

function Round_item(index, x, y) {
  this.index = index
  this.x = x
  this.y = y
  this.isUseCache = isUseCache
  this.cacheCanvas = document.createElement('canvas')
  this.cacheCtx = this.cacheCanvas.getContext('2d')
  this.r = Math.random() * 2 + 1
  this.cacheCtx.width = 6 * this.r
  this.cacheCtx.height = 6 * this.r
  const alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2
  this.color = `rgba(255, 255, 255, ${alpha})`

  if (isUseCache) {
    this.cache()
  }
}

Round_item.prototype.draw = function() {
  if (!isUseCache) {
    ctx.fillStyle = this.color
    ctx.shaowBlur = this.r * 2
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
    ctx.fill()
  } else {
    ctx.drawImage(this.cacheCanvas, this.x - this.r, this.y - this.r)
  }
}

Round_item.prototype.cache = function() {
  this.cacheCtx.save()
  this.cacheCtx.fillStyle = this.color
  this.cacheCtx.shaowColor = 'white'
  this.cacheCtx.shaowBlur = 2 * this.r
  this.cacheCtx.beginPath()
  this.cacheCtx.arc(3 * this.r, 3 * this.r, this.r, 0, 2 * Math.PI, false)
  this.cacheCtx.closePath()
  this.cacheCtx.fill()
  this.cacheCtx.restore()
}

Round_item.prototype.move = function() {
  this.y -= .15
  if (this.y <= -10) {
    this.y = HEIGHT + 10
  }
  this.draw()
}

function init() {
  for (let i = 0; i < initRoundPopulation; i++) {
    round[i] = new Round_item(i, Math.random() * WIDTH, Math.random() * HEIGHT)    
    round[i].draw()
  }
  animate()
}

init()