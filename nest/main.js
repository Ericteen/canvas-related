const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
// cursor generated point
const current_point = {
  x: null,
  y: null,
  max: 25000,
}

const WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
const HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
const random_points = []
let all_points = []

canvas.width = WIDTH
canvas.height = HEIGHT
canvas.style = 'position: fixed; top: 0px; left: 0px'

function draw() {
  // clear screen
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  let i, pi, x_dist, y_dist, dist, w

  random_points.forEach((p, index) => {
    p.x += p.xa
    p.y += p.ya
    p.xa *= p.x > WIDTH || p.x < 0 ? -1 : 1
    p.ya *= p.y > HEIGHT || p.y < 0 ? -1 : 1
    ctx.fillRect(p.x - 0.5, p.y - 0.5, 1, 1)

    for (i = index + 1; i < all_points.length; i += 1) {
      pi = all_points[i]
      if (pi.x !== null && pi.y !== null) {
        x_dist = p.x - pi.x
        y_dist = p.y - pi.y
        dist = x_dist * x_dist + y_dist * y_dist
        // adhere to current point
        dist < pi.max && (pi === current_point && dist >= pi.max / 2 && (p.x -= 0.03 * x_dist, p.y -= 0.03 * y_dist))
        w = (pi.max - dist) / pi.max
        ctx.beginPath()
        ctx.lineWidth = w / 2
        ctx.strokeStyle = `rgba(110, 110, 110, ${w + 0.2})`
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(pi.x, pi.y)
        ctx.stroke()
      }
    }
  })
  window.requestAnimationFrame(draw)
}

window.onmousemove = e => {
  e = e || window.event
  current_point.x = e.clientX
  current_point.y = e.clientY
}

window.onmouseout = () => {
  current_point.x = null
  current_point.y = null
}

for (let i = 0; i < 180; i++) {
  const x = Math.random() * WIDTH
  const y = Math.random() * HEIGHT
  xa = 2 * Math.random() - 1
  ya = 2 * Math.random() - 1
  // adhere distance
  max = 6000
  random_points[i] = { x, y, xa, ya, max }  
}

all_points = [...random_points, current_point]

setTimeout(draw, 100)
