/* Động cơ pháo hoa trên canvas 2D, không phụ thuộc framework hay thư viện ngoài.
 *
 * Nguyên tắc:
 * - Canvas phải trong suốt phủ lên nền trang, nên mỗi khung hình xoá sạch rồi vẽ lại;
 *   vệt đuôi được tạo bằng cách lưu N vị trí gần nhất của từng hạt.
 * - Vòng lặp requestAnimationFrame chỉ chạy khi còn hạt sống và dừng hẳn khi rảnh,
 *   đồng thời tạm dừng khi tab bị ẩn.
 * - Dùng pool đối tượng và giới hạn cứng số hạt để không tạo rác bộ nhớ khi bấm liên tục.
 * - Nếu getContext trả về null (jsdom, trình duyệt lỗi), mọi hàm đều là no-op an toàn. */

export type FireworksMode = 'light' | 'dark'

export interface FireworksOptions {
  getMode: () => FireworksMode
}

export interface FireworksEngine {
  burst: (x: number, y: number) => void
  resize: () => void
  destroy: () => void
}

/** Bộ chọn các phần tử tương tác: bấm vào chúng thì không bắn pháo hoa. */
export const INTERACTIVE_SELECTOR = [
  'button',
  'a',
  'input',
  'select',
  'textarea',
  'label',
  'summary',
  '[role=button]',
  '[role=link]',
  '[role=menuitem]',
  '[role=tab]',
  '[role=option]',
  '[contenteditable=""]',
  '[contenteditable=true]',
  '[role=dialog]',
  '[data-no-fireworks]',
].join(', ')

/** Trả về true nếu đích của sự kiện nằm trong (hoặc là) một phần tử tương tác.
 *  Nút văn bản được quy về phần tử cha trước khi kiểm tra. */
export function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!target || typeof Element === 'undefined') return false
  const node = target as Node
  const element = node instanceof Element ? node : node.parentElement ?? null
  if (!element) return false
  if (element instanceof HTMLElement && element.isContentEditable) return true
  return element.closest(INTERACTIVE_SELECTOR) !== null
}

/* ---------------------------------------------------------------- Hằng số */

const MAX_PARTICLES = 600
const MAX_ROCKETS = 8
const MAX_DPR = 2
const ROCKET_DURATION = 0.22 // giây: pháo nổ trong khoảng 250ms sau cú bấm
const MAX_TRAIL = 16

type Shape = 'peony' | 'ring' | 'heart' | 'star' | 'willow' | 'crackle' | 'spiral' | 'chrysanthemum'
const SHAPES: Shape[] = ['peony', 'ring', 'heart', 'star', 'willow', 'crackle', 'spiral', 'chrysanthemum']

/** Một sắc màu: hue và saturation; độ sáng được tính theo chế độ sáng/tối. */
interface Hue {
  h: number
  s: number
}

const TEAL: Hue = { h: 173, s: 72 }
const AMBER: Hue = { h: 32, s: 95 }
const ROSE: Hue = { h: 345, s: 85 }
const VIOLET: Hue = { h: 265, s: 80 }
const SKY: Hue = { h: 200, s: 92 }
const LIME: Hue = { h: 88, s: 75 }
const GOLD: Hue = { h: 46, s: 96 }

/** Bảng màu: đơn sắc theo thương hiệu và một số tổ hợp nhiều màu. */
const PALETTES: Hue[][] = [
  [TEAL],
  [TEAL, { h: 168, s: 80 }],
  [AMBER],
  [ROSE],
  [VIOLET],
  [SKY],
  [LIME],
  [GOLD],
  [TEAL, GOLD],
  [ROSE, VIOLET],
  [SKY, LIME],
  [AMBER, ROSE, GOLD],
  [TEAL, SKY, VIOLET],
  [TEAL, AMBER, ROSE, VIOLET, SKY, LIME, GOLD],
]

/* ---------------------------------------------------------------- Hạt */

class Particle {
  x = 0
  y = 0
  vx = 0
  vy = 0
  life = 1
  decay = 1
  size = 2
  gravity = 120
  drag = 2.2
  color = ''
  edge = ''
  flicker = false
  crackle = false
  cracked = false
  flash = false
  trailMax = 6
  trailCount = 0
  trailHead = 0
  trail = new Float32Array(MAX_TRAIL * 2)

  reset(): void {
    this.life = 1
    this.flicker = false
    this.crackle = false
    this.cracked = false
    this.flash = false
    this.trailCount = 0
    this.trailHead = 0
  }

  pushTrail(): void {
    const index = this.trailHead * 2
    this.trail[index] = this.x
    this.trail[index + 1] = this.y
    this.trailHead = (this.trailHead + 1) % this.trailMax
    if (this.trailCount < this.trailMax) this.trailCount++
  }
}

interface Rocket {
  sx: number
  sy: number
  tx: number
  ty: number
  t: number
  shape: Shape
  palette: Hue[]
  color: string
  trail: number[]
}

/* ---------------------------------------------------------------- Tiện ích */

const TAU = Math.PI * 2
const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)]
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/** Tạo chuỗi màu cho lõi hạt và viền tối (chế độ sáng) theo chế độ hiện tại. */
function colorsFor(hue: Hue, mode: FireworksMode): { color: string; edge: string } {
  if (mode === 'light') {
    // Nền gần trắng: màu đậm, bão hoà cao, viền tối hơn để nổi khối.
    const l = hue === TEAL ? 28 : rand(36, 44)
    return {
      color: `hsl(${hue.h} ${Math.min(100, hue.s + 5)}% ${l}%)`,
      edge: `hsl(${hue.h} ${hue.s}% ${Math.max(12, l - 18)}%)`,
    }
  }
  // Nền tối: màu sáng, cộng sáng bằng 'lighter'.
  const l = hue === TEAL ? 55 : rand(60, 70)
  return { color: `hsl(${hue.h} ${Math.min(100, hue.s + 10)}% ${l}%)`, edge: '' }
}

/* ---------------------------------------------------------------- Động cơ */

const NOOP_ENGINE: FireworksEngine = { burst: () => {}, resize: () => {}, destroy: () => {} }

export function createFireworks(canvas: HTMLCanvasElement, options: FireworksOptions): FireworksEngine {
  let ctx: CanvasRenderingContext2D | null = null
  try {
    ctx = canvas.getContext('2d')
  } catch {
    ctx = null
  }
  if (!ctx || typeof window === 'undefined') return NOOP_ENGINE
  const context = ctx

  const live: Particle[] = []
  const pool: Particle[] = []
  const rockets: Rocket[] = []
  let width = 0
  let height = 0
  let rafId = 0
  let running = false
  let lastTime = 0
  let destroyed = false

  function acquire(): Particle | null {
    if (live.length >= MAX_PARTICLES) return null // quá giới hạn: bỏ qua hạt mới
    const particle = pool.pop() ?? new Particle()
    particle.reset()
    live.push(particle)
    return particle
  }

  function release(index: number): void {
    const particle = live[index]
    // Xoá kiểu hoán đổi với phần tử cuối: O(1), thứ tự vẽ không quan trọng.
    live[index] = live[live.length - 1]
    live.pop()
    pool.push(particle)
  }

  function resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  /** Tốc độ nổ cơ sở (px/giây) theo kích thước màn hình, để bán kính vừa mắt. */
  function baseSpeed(): number {
    return Math.max(150, Math.min(330, Math.min(width, height) * 0.36))
  }

  function spawn(
    x: number,
    y: number,
    vx: number,
    vy: number,
    hue: Hue,
    mode: FireworksMode,
    tweak?: Partial<Pick<Particle, 'decay' | 'size' | 'gravity' | 'drag' | 'trailMax' | 'flicker' | 'crackle'>>,
  ): Particle | null {
    const particle = acquire()
    if (!particle) return null
    const { color, edge } = colorsFor(hue, mode)
    particle.x = x
    particle.y = y
    particle.vx = vx
    particle.vy = vy
    particle.color = color
    particle.edge = edge
    particle.decay = tweak?.decay ?? rand(0.75, 1.0)
    particle.size = tweak?.size ?? rand(1.5, 2.4)
    particle.gravity = tweak?.gravity ?? 110
    particle.drag = tweak?.drag ?? 2.2
    particle.trailMax = Math.min(MAX_TRAIL, tweak?.trailMax ?? 6)
    particle.flicker = tweak?.flicker ?? Math.random() < 0.35
    particle.crackle = tweak?.crackle ?? false
    return particle
  }

  /** Chớp sáng ngắn ở tâm vụ nổ. */
  function flash(x: number, y: number, hue: Hue, mode: FireworksMode): void {
    const particle = spawn(x, y, 0, 0, hue, mode, { decay: 5, size: 7, gravity: 0, drag: 0, trailMax: 1, flicker: false })
    if (particle) particle.flash = true
  }

  function explode(x: number, y: number, shape: Shape, palette: Hue[]): void {
    const mode = options.getMode()
    const speed = baseSpeed()
    flash(x, y, palette[0], mode)

    switch (shape) {
      case 'peony': {
        const count = 80
        for (let i = 0; i < count; i++) {
          const angle = rand(0, TAU)
          const v = speed * (0.45 + 0.55 * Math.sqrt(Math.random()))
          spawn(x, y, Math.cos(angle) * v, Math.sin(angle) * v, pick(palette), mode)
        }
        break
      }
      case 'ring': {
        // Vòng tròn nghiêng ngẫu nhiên thành hình elip, như nhìn chéo một quả cầu phẳng.
        const count = 64
        const tilt = rand(0, Math.PI)
        const squash = rand(0.45, 1)
        const hue = pick(palette)
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * TAU
          const ex = Math.cos(angle) * speed * 0.9
          const ey = Math.sin(angle) * speed * 0.9 * squash
          const vx = ex * Math.cos(tilt) - ey * Math.sin(tilt)
          const vy = ex * Math.sin(tilt) + ey * Math.cos(tilt)
          spawn(x, y, vx, vy, palette.length > 1 && i % 2 ? palette[1] : hue, mode, { decay: rand(0.8, 0.95) })
        }
        break
      }
      case 'heart': {
        // Đường cong trái tim tham số: x = 16 sin^3 t, y = 13 cos t - 5 cos 2t - 2 cos 3t - cos 4t.
        const count = 84
        const scale = (speed * 0.95) / 16
        for (let i = 0; i < count; i++) {
          const t = (i / count) * TAU
          const hx = 16 * Math.pow(Math.sin(t), 3)
          const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
          spawn(x, y, hx * scale, hy * scale, palette.length > 1 ? palette[i % palette.length] : ROSE, mode, {
            decay: rand(0.75, 0.85),
            gravity: 60,
          })
        }
        break
      }
      case 'star': {
        // Ngôi sao 5 cánh: nội suy dọc 10 cạnh giữa đỉnh ngoài (r=1) và đỉnh trong (r=0.42).
        const points = 5
        const perEdge = 9
        const rotation = -Math.PI / 2 + rand(-0.3, 0.3)
        const hue = pick(palette)
        for (let edge = 0; edge < points * 2; edge++) {
          const a0 = rotation + (edge / (points * 2)) * TAU
          const a1 = rotation + ((edge + 1) / (points * 2)) * TAU
          const r0 = edge % 2 === 0 ? 1 : 0.42
          const r1 = edge % 2 === 0 ? 0.42 : 1
          for (let k = 0; k < perEdge; k++) {
            const f = k / perEdge
            const px = Math.cos(a0) * r0 * (1 - f) + Math.cos(a1) * r1 * f
            const py = Math.sin(a0) * r0 * (1 - f) + Math.sin(a1) * r1 * f
            spawn(x, y, px * speed, py * speed, hue, mode, { decay: rand(0.8, 0.9), gravity: 70 })
          }
        }
        break
      }
      case 'willow': {
        // Liễu rủ: đuôi dài, trọng lực mạnh, tắt chậm; mặc định tông vàng kim.
        const count = 64
        const hues = palette.length > 2 ? [GOLD, AMBER] : palette.length === 1 && palette[0] === TEAL ? [TEAL] : [GOLD, palette[0]]
        for (let i = 0; i < count; i++) {
          const angle = rand(0, TAU)
          const v = speed * 0.75 * (0.55 + 0.45 * Math.random())
          spawn(x, y, Math.cos(angle) * v, Math.sin(angle) * v, pick(hues), mode, {
            decay: rand(0.38, 0.5),
            gravity: 170,
            drag: 2.8,
            trailMax: 14,
            size: rand(1.3, 1.9),
            flicker: Math.random() < 0.5,
          })
        }
        break
      }
      case 'crackle': {
        // Nổ lách tách: hạt chớp nháy và tự nổ thêm chùm tia nhỏ khi gần tắt.
        const count = 54
        for (let i = 0; i < count; i++) {
          const angle = rand(0, TAU)
          const v = speed * (0.5 + 0.5 * Math.random())
          spawn(x, y, Math.cos(angle) * v, Math.sin(angle) * v, pick(palette), mode, {
            flicker: true,
            crackle: true,
            decay: rand(0.8, 1),
          })
        }
        break
      }
      case 'spiral': {
        // Xoắn ốc: các nhánh có góc lệch tăng dần theo tốc độ.
        const arms = Math.random() < 0.5 ? 3 : 4
        const perArm = 22
        const offset = rand(0, TAU)
        const twist = Math.random() < 0.5 ? 1 : -1
        for (let arm = 0; arm < arms; arm++) {
          const hue = palette[arm % palette.length]
          for (let k = 0; k < perArm; k++) {
            const f = (k + 1) / perArm
            const angle = offset + (arm / arms) * TAU + twist * f * 2.4
            const v = speed * (0.2 + 0.8 * f)
            spawn(x, y, Math.cos(angle) * v, Math.sin(angle) * v, hue, mode, { decay: rand(0.8, 0.95), trailMax: 8 })
          }
        }
        break
      }
      case 'chrysanthemum': {
        // Cúc hai lớp: lớp ngoài nhanh, lớp trong chậm hơn và khác màu, đuôi dài.
        const outer = palette[0]
        const inner = palette.length > 1 ? palette[1] : outer === GOLD ? TEAL : GOLD
        for (let i = 0; i < 72; i++) {
          const angle = (i / 72) * TAU + rand(-0.03, 0.03)
          const v = speed * rand(0.92, 1)
          spawn(x, y, Math.cos(angle) * v, Math.sin(angle) * v, outer, mode, { trailMax: 10, decay: rand(0.7, 0.8) })
        }
        for (let i = 0; i < 40; i++) {
          const angle = (i / 40) * TAU + rand(-0.05, 0.05)
          const v = speed * rand(0.45, 0.52)
          spawn(x, y, Math.cos(angle) * v, Math.sin(angle) * v, inner, mode, { trailMax: 8, decay: rand(0.8, 0.95) })
        }
        break
      }
    }
  }

  /** Chùm tia nhỏ sinh ra từ một hạt nổ lách tách. */
  function crackleBurst(source: Particle, mode: FireworksMode): void {
    const count = 5
    for (let i = 0; i < count; i++) {
      const angle = rand(0, TAU)
      const v = rand(40, 95)
      spawn(source.x, source.y, source.vx * 0.2 + Math.cos(angle) * v, source.vy * 0.2 + Math.sin(angle) * v, GOLD, mode, {
        decay: rand(2.2, 3),
        size: rand(0.9, 1.3),
        trailMax: 3,
        flicker: true,
        gravity: 60,
      })
    }
  }

  function update(dt: number): void {
    const mode = options.getMode()

    for (let i = rockets.length - 1; i >= 0; i--) {
      const rocket = rockets[i]
      rocket.t += dt
      const f = Math.min(1, rocket.t / ROCKET_DURATION)
      const e = easeOutCubic(f)
      rocket.trail.push(rocket.sx + (rocket.tx - rocket.sx) * e, rocket.sy + (rocket.ty - rocket.sy) * e)
      if (rocket.trail.length > 16) rocket.trail.splice(0, 2)
      if (f >= 1) {
        rockets.splice(i, 1)
        explode(rocket.tx, rocket.ty, rocket.shape, rocket.palette)
      }
    }

    for (let i = live.length - 1; i >= 0; i--) {
      const particle = live[i]
      particle.life -= particle.decay * dt
      if (particle.life <= 0) {
        release(i)
        continue
      }
      const damping = Math.exp(-particle.drag * dt)
      particle.vx *= damping
      particle.vy = particle.vy * damping + particle.gravity * dt
      particle.x += particle.vx * dt
      particle.y += particle.vy * dt
      particle.pushTrail()
      if (particle.crackle && !particle.cracked && particle.life < 0.45) {
        particle.cracked = true
        if (Math.random() < 0.6) crackleBurst(particle, mode)
      }
    }
  }

  function draw(): void {
    const mode = options.getMode()
    const dark = mode === 'dark'
    context.clearRect(0, 0, width, height)
    context.globalCompositeOperation = dark ? 'lighter' : 'source-over'
    context.lineCap = 'round'

    // Tên lửa: vệt sáng mảnh từ đáy màn hình lên điểm bấm.
    for (const rocket of rockets) {
      const trail = rocket.trail
      if (trail.length < 4) continue
      context.globalAlpha = dark ? 0.9 : 0.75
      context.strokeStyle = rocket.color
      context.lineWidth = 2
      context.beginPath()
      context.moveTo(trail[0], trail[1])
      for (let k = 2; k < trail.length; k += 2) context.lineTo(trail[k], trail[k + 1])
      context.stroke()
      context.globalAlpha = 1
      context.fillStyle = rocket.color
      context.beginPath()
      context.arc(trail[trail.length - 2], trail[trail.length - 1], 2.4, 0, TAU)
      context.fill()
    }

    for (const particle of live) {
      const alpha = Math.max(0, Math.min(1, particle.life))
      let size = particle.size
      if (particle.flash) {
        size = particle.size * (1.6 - particle.life * 0.6)
      } else if (particle.flicker) {
        size *= 0.7 + Math.random() * 0.6
        // Hạt nổ lách tách có lúc tắt hẳn một khung để tạo cảm giác nhấp nháy.
        if (particle.crackle && Math.random() < 0.2) continue
      }

      // Vệt đuôi: nối các vị trí cũ theo thứ tự thời gian.
      if (particle.trailCount > 1) {
        const start = particle.trailCount < particle.trailMax ? 0 : particle.trailHead
        context.globalAlpha = alpha * (dark ? 0.45 : 0.35)
        context.strokeStyle = particle.color
        context.lineWidth = Math.max(0.8, particle.size * 0.9)
        context.beginPath()
        for (let k = 0; k < particle.trailCount; k++) {
          const index = ((start + k) % particle.trailMax) * 2
          if (k === 0) context.moveTo(particle.trail[index], particle.trail[index + 1])
          else context.lineTo(particle.trail[index], particle.trail[index + 1])
        }
        context.stroke()
      }

      if (dark) {
        // Quầng sáng mờ quanh hạt, cộng dồn nhờ 'lighter'.
        context.globalAlpha = alpha * (particle.flash ? 0.35 : 0.18)
        context.fillStyle = particle.color
        context.beginPath()
        context.arc(particle.x, particle.y, size * 2.6, 0, TAU)
        context.fill()
      } else {
        // Viền tối nhẹ để hạt nổi trên nền gần trắng.
        context.globalAlpha = alpha * 0.45
        context.fillStyle = particle.edge
        context.beginPath()
        context.arc(particle.x, particle.y, size + 0.9, 0, TAU)
        context.fill()
      }

      context.globalAlpha = particle.flash ? alpha * 0.8 : alpha
      context.fillStyle = particle.color
      context.beginPath()
      context.arc(particle.x, particle.y, size, 0, TAU)
      context.fill()
    }

    context.globalAlpha = 1
    context.globalCompositeOperation = 'source-over'
  }

  function frame(time: number): void {
    if (destroyed) return
    const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 1 / 60
    lastTime = time
    update(dt)
    draw()
    if (live.length === 0 && rockets.length === 0) {
      // Hết hạt: xoá canvas và dừng hẳn vòng lặp cho tới lần bấm sau.
      context.clearRect(0, 0, width, height)
      running = false
      rafId = 0
      return
    }
    rafId = window.requestAnimationFrame(frame)
  }

  function start(): void {
    if (running || destroyed || document.hidden) return
    running = true
    lastTime = 0
    rafId = window.requestAnimationFrame(frame)
  }

  function stop(): void {
    if (rafId) window.cancelAnimationFrame(rafId)
    rafId = 0
    running = false
  }

  function onVisibilityChange(): void {
    if (document.hidden) stop()
    else if (live.length > 0 || rockets.length > 0) start()
  }

  function burst(x: number, y: number): void {
    if (destroyed) return
    const shape = pick(SHAPES)
    const palette = pick(PALETTES)
    // Tên lửa chỉ khi điểm bấm đủ cao so với đáy màn hình; nổ vẫn xảy ra trong ~250ms.
    const withRocket = Math.random() < 0.65 && y < height * 0.8 && rockets.length < MAX_ROCKETS
    if (withRocket) {
      const mode = options.getMode()
      rockets.push({
        sx: x + rand(-40, 40),
        sy: height + 4,
        tx: x,
        ty: y,
        t: 0,
        shape,
        palette,
        color: colorsFor(palette[0], mode).color,
        trail: [],
      })
    } else {
      explode(x, y, shape, palette)
    }
    start()
  }

  function destroy(): void {
    destroyed = true
    stop()
    window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    live.length = 0
    pool.length = 0
    rockets.length = 0
    context.clearRect(0, 0, width, height)
  }

  resize()
  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', onVisibilityChange)

  return { burst, resize, destroy }
}
