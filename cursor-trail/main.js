const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const WIDTH = document.documentElement.clientWidth
const HEIGHT = document.documentElement.clientHeight

canvas.width = WIDTH
canvas.height = HEIGHT

const params = {
  num: 100,
  color: false,
  r: .9,
  o: .05,
  a: 1,
}

let color, color2, round_arr = []

window.onmousemove = e => {
  mouseX = e.clientX
  mouseY = e.clientY

  round_arr.push({
    mouseX,
    mouseY,
    r: params.r,
    o: 1,
  })
}

if (params.color) {
  color2 = params.color
} else {
  color = Math.random() * 360
}

function animate() {
  if (!params.color) {
    color += .5
    color2 = `hsl(${color}, 100%, 80%)`
  }

  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  for (let i = 0; i < round_arr.length; i += 1) {
    ctx.fillStyle = color2
    ctx.beginPath()
    ctx.arc(round_arr[i].mouseX, round_arr[i].mouseY, round_arr[i].r, 0, Math.PI * 2, false)
    ctx.closePath()
    ctx.fill()
    round_arr[i].r += params.r
    round_arr[i].o -= params.o

    if (round_arr[i].o <= 0) {
      round_arr.splice(i, 1)
      i -= 1
    }
  }
  window.requestAnimationFrame(animate)
}

animate()
