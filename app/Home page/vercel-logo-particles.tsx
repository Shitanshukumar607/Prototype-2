"use client"
import { useEffect, useMemo, useRef } from "react"
import event_logo from "../../assets/luminus_logo.png"

interface LuminusParticlesProps {
  /** When true, particles start scattered (no scroll needed). Default false. */
  startDispersed?: boolean
  /** When false, normal cursor is shown and no custom cursor/shockwaves. Default true. */
  hideCursor?: boolean
  /** Pixel step when sampling logo for particles; larger = fewer particles. Default 3. */
  particleGap?: number
}

export default function LuminusParticles({ startDispersed = false, hideCursor = true, particleGap = 3 }: LuminusParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const options = useMemo(
    () => ({ startDispersed, hideCursor, particleGap }),
    [startDispersed, hideCursor, particleGap]
  )

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!

    /** Extra particles that fade in on scroll to fill the background when dispersed */
    type FillParticle = { x: number; y: number; size: number; phase: number; r: number; g: number; b: number }
    let fillParticles: FillParticle[] = []

    function createFillParticles() {
      const w = canvas.width
      const h = canvas.height
      const count = Math.min(2200, Math.floor((w * h) / (36 * 36)))
      fillParticles = []
      for (let i = 0; i < count; i++) {
        fillParticles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.4 + 0.4,
          phase: Math.random() * Math.PI * 2,
          r: 200 + Math.floor(Math.random() * 55),
          g: 180 + Math.floor(Math.random() * 75),
          b: 255,
        })
      }
    }

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      if (fillParticles.length > 0) createFillParticles()
      return dpr
    }
    let dpr = resize()
    const handleResize = () => { dpr = resize() }
    window.addEventListener("resize", handleResize)
    if (hideCursor) {
      document.documentElement.style.cursor = "none"
      document.body.style.cursor = "none"
    }


    type Particle = {
      x: number; y: number
      tx: number; ty: number
      vx: number; vy: number
      size: number; phase: number
      bgx: number; bgy: number
      r: number; g: number; b: number
    }

    type Shockwave = {
      x: number; y: number
      radius: number
      maxRadius: number
      strength: number
      age: number
    }


    const mouse = { x: -9999, y: -9999 }
    const shockwaves: Shockwave[] = []
    let clickGlow = 0
    let starRotation = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleClick = (e: MouseEvent) => {
      clickGlow = 1.0
      shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 300,
        strength: 18,
        age: 0,
      })
    }

    if (hideCursor) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("click", handleClick)
    }

    let particles: Particle[] = []
    let imageData: ImageData | null = null
    let scrollProgress = 0
    let scrollVelocity = 0
    let lastScrollY = 0


    const handleScroll = () => {
      if (startDispersed) return
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      scrollVelocity = Math.abs(window.scrollY - lastScrollY)
      lastScrollY = window.scrollY
      scrollProgress = max > 0 ? Math.min(window.scrollY / max, 1) : 1
    }
    if (!startDispersed) {
      scrollProgress = 0
      window.addEventListener("scroll", handleScroll, { passive: true })
    } else {
      scrollProgress = 1
    }

    function loadLogo(): Promise<void> {
      return new Promise((resolve) => {
        const img = new Image()
        img.src = event_logo.src
        img.onload = () => {
          const off = document.createElement("canvas")
          const offCtx = off.getContext("2d")!
          off.width = canvas.width
          off.height = canvas.height
          const scaleMultiplier = window.innerWidth < 768 ? 0.8 : 1.15
          const scale = Math.min(off.width / img.width, off.height / img.height) * scaleMultiplier
          const w = img.width * scale
          const h = img.height * scale
          const x = (off.width - w) / 2
          const y = (off.height - h) / 2 - off.height * 0.1
          offCtx.drawImage(img, x, y, w, h)
          imageData = offCtx.getImageData(0, 0, off.width, off.height)
          resolve()
        }
      })
    }


    function createParticles() {
      if (!imageData) return
      const data = imageData.data
      particles = []
      const gap = Math.max(2, particleGap)
      for (let y = 0; y < canvas.height; y += gap) {
        for (let x = 0; x < canvas.width; x += gap) {
          const i = (y * canvas.width + x) * 4
          const r = data[i], g = data[i + 1], b = data[i + 2], alpha = data[i + 3]
          if (alpha > 40) {
            const isTextPixel = Math.abs(r - g) < 20 && Math.abs(r - b) < 20 && Math.abs(g - b) < 20 && r > 100
            const wf = isTextPixel ? 0.75 : 0
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              tx: x, ty: y, vx: 0, vy: 0,
              size: Math.random() * 1.6 + 0.5,
              phase: Math.random() * Math.PI * 2,
              bgx: Math.random() * canvas.width,
              bgy: Math.random() * canvas.height,
              r: Math.min(255, r + (255 - r) * wf),
              g: Math.min(255, g + (255 - g) * wf),
              b: Math.min(255, b + (255 - b) * wf),
            })
          }
        }
      }
    }


    function drawStar(cx: number, cy: number, points: number, outer: number, inner: number, angle: number) {
      ctx.beginPath()
      for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outer : inner
        const a = (i * Math.PI) / points + angle
        if (i === 0) ctx.moveTo(cx + r * Math.sin(a), cy - r * Math.cos(a))
        else ctx.lineTo(cx + r * Math.sin(a), cy - r * Math.cos(a))
      }
      ctx.closePath()
    }

    function drawCursor() {
      if (mouse.x < 0) return
      const cx = mouse.x * dpr
      const cy = mouse.y * dpr

      starRotation += 0.012  // gentle idle spin


      if (clickGlow > 0) clickGlow -= 0.03

      const glow = Math.max(clickGlow, 0)
      const baseSize = 7
      const glowSize = baseSize + glow * 22

      ctx.save()


      if (glow > 0) {
        const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize * 3)
        bloom.addColorStop(0, `rgba(255, 220, 255, ${glow * 0.5})`)
        bloom.addColorStop(0.4, `rgba(180, 100, 255, ${glow * 0.25})`)
        bloom.addColorStop(1, `rgba(100, 50, 255, 0)`)
        ctx.fillStyle = bloom
        ctx.beginPath()
        ctx.arc(cx, cy, glowSize * 3, 0, Math.PI * 2)
        ctx.fill()
      }


      const ambient = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseSize * 2.5)
      ambient.addColorStop(0, `rgba(220, 180, 255, ${0.25 + glow * 0.4})`)
      ambient.addColorStop(1, `rgba(150, 80, 255, 0)`)
      ctx.fillStyle = ambient
      ctx.beginPath()
      ctx.arc(cx, cy, baseSize * 2.5, 0, Math.PI * 2)
      ctx.fill()


      const currentSize = baseSize + glow * 5

      // Spike cross (long thin spikes at 0/90/180/270)
      drawStar(cx, cy, 4, currentSize * 1.8, currentSize * 0.15, starRotation)
      ctx.fillStyle = `rgba(255, 255, 255, ${0.85 + glow * 0.15})`
      ctx.fill()

      // Small inner diamond
      drawStar(cx, cy, 4, currentSize * 0.7, currentSize * 0.3, starRotation + Math.PI / 4)
      ctx.fillStyle = `rgba(220, 180, 255, ${0.9 + glow * 0.1})`
      ctx.fill()

      // Bright center dot
      ctx.beginPath()
      ctx.arc(cx, cy, 1.5 + glow * 1.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, 1)`
      ctx.fill()

      ctx.restore()
    }


    function drawShockwaveRings() {
      for (const sw of shockwaves) {
        const progress = sw.radius / sw.maxRadius
        const alpha = (1 - progress) * 0.12
        const sx = sw.x * dpr
        const sy = sw.y * dpr
        ctx.beginPath()
        ctx.arc(sx, sy, sw.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(180, 120, 255, ${alpha * 0.5})`
        ctx.lineWidth = 0.5 * (1 - progress)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(sx, sy, sw.radius * 0.92, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.lineWidth = 0.5 * (1 - progress)
        ctx.stroke()
      }
    }


    let rafId = 0
    let visible = !document.hidden
    const onVisibilityChange = () => {
      visible = !document.hidden
      if (visible) rafId = requestAnimationFrame(animate)
    }
    document.addEventListener("visibilitychange", onVisibilityChange)

    function animate(time: number) {
      if (!visible) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw fill particles when scrolled — fade in with scroll to fill the background
      if (fillParticles.length > 0 && scrollProgress > 0) {
        // Keep the background animated, but dim enough for section text to remain readable.
        const fillAlpha = 0.05 + 0.2 * scrollProgress
        for (const fp of fillParticles) {
          const twinkle = 0.5 + 0.5 * Math.sin(time * 0.002 + fp.phase)
          ctx.fillStyle = `rgba(${fp.r},${fp.g},${fp.b},${fillAlpha * twinkle})`
          ctx.fillRect(fp.x, fp.y, fp.size, fp.size)
        }
      }

      // Expand & cull shockwaves
      for (const sw of shockwaves) { sw.radius += 12; sw.age++ }
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        if (shockwaves[i].radius >= shockwaves[i].maxRadius) shockwaves.splice(i, 1)
      }

      for (const p of particles) {
        const disperse = scrollProgress
        const targetX = p.tx * (1 - disperse) + p.bgx * disperse
        const targetY = p.ty * (1 - disperse) + p.bgy * disperse


        for (const sw of shockwaves) {
          const dx = p.x - sw.x
          const dy = p.y - sw.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const distFromFront = Math.abs(dist - sw.radius)
          if (distFromFront < 55 && dist > 0) {
            const falloff = 1 - distFromFront / 55
            const force = falloff * sw.strength / (dist * 0.08 + 1)
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }

        p.vx += (targetX - p.x) * (0.16 + scrollVelocity * 0.024)
        p.vy += (targetY - p.y) * (0.16 + scrollVelocity * 0.024)
        p.vx *= 0.7
        p.vy *= 0.7
        p.x += p.vx
        p.y += p.vy

        scrollVelocity *= 0.85

        const twinkle = 0.6 + 0.4 * Math.sin(time * 0.003 + p.phase)
        const readabilityDim = 1 - 0.45 * scrollProgress
        ctx.fillStyle = `rgba(${Math.round(p.r)},${Math.round(p.g)},${Math.round(p.b)},${twinkle * readabilityDim})`
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }

      // Draw text below the logo, fades as user scrolls
      const textAlpha = Math.max(0, 1 - scrollProgress * 3)
      if (textAlpha > 0) {
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2 + canvas.height * 0.28
        ctx.save()
        ctx.globalAlpha = textAlpha
        ctx.textAlign = "center"
        const isMobile = window.innerWidth < 768
        const fontSize = Math.round((isMobile ? 5 : 11) * dpr)
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
        ctx.font = `500 ${fontSize}px sans-serif`
        ctx.letterSpacing = `${Math.round(0.2 * fontSize)}px`
        const lineH = (isMobile ? 10 : 20) * dpr
        ctx.fillText("LUMINUS IS MORE THAN A TECH FEST — IT'S A CONVERGENCE OF THE BRIGHTEST", centerX, centerY)
        ctx.fillText("MINDS, BOLDEST IDEAS, AND MOST DISRUPTIVE TECHNOLOGIES. FOR THREE DAYS,", centerX, centerY + lineH)
        ctx.fillText("OUR CAMPUS TRANSFORMS INTO A LAUNCHPAD FOR INNOVATION.", centerX, centerY + lineH * 2)
        ctx.restore()
      }

      if (hideCursor) {
        drawShockwaveRings()
        drawCursor()   // always on top
      }

      rafId = requestAnimationFrame(animate)
    }


    async function init() {
      await loadLogo()
      createParticles()
      createFillParticles()
      animate(0)
    }
    init()

    return () => {
      visible = false
      cancelAnimationFrame(rafId)
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("resize", handleResize)
      if (hideCursor) {
        document.documentElement.style.cursor = ""
        document.body.style.cursor = ""
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("click", handleClick)
      }
      if (!startDispersed) window.removeEventListener("scroll", handleScroll)
    }
  }, [options])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        zIndex: 10,
        pointerEvents: "none",
        cursor: hideCursor ? "none" : "default",
      }}
    />
  )
}