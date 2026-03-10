"use client"
import { useEffect, useMemo, useRef } from "react"
import event_logo from "../../assets/luminus_logo.png"

interface LuminusParticlesProps {
  /** When true, particles start scattered (no scroll needed). Default false. */
  startDispersed?: boolean
  /** When false, normal cursor is shown and no custom cursor/shockwaves. Default false (disabled custom cursor). */
  hideCursor?: boolean
  /** Pixel step when sampling logo for particles; larger = fewer particles. Default 3. */
  particleGap?: number
}

export default function LuminusParticles({ startDispersed = false, hideCursor = false, particleGap = 3 }: LuminusParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const options = useMemo(
    () => ({ startDispersed, hideCursor, particleGap }),
    [startDispersed, hideCursor, particleGap]
  )

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    const isMobileViewport = () => (typeof window !== "undefined" ? window.innerWidth < 768 : false)
    const useCustomCursor = hideCursor && typeof window !== "undefined" && window.matchMedia("(pointer:fine)").matches
    const hideDesktopScrollbar =
      typeof window !== "undefined" &&
      window.innerWidth >= 768 &&
      window.location.pathname === "/"

    if (hideDesktopScrollbar) {
      document.documentElement.classList.add("hide-desktop-scrollbar")
      document.body.classList.add("hide-desktop-scrollbar")
    }

    type Particle = {
      x: number; y: number
      tx: number; ty: number
      vx: number; vy: number
      size: number; phase: number
      bgx: number; bgy: number
      r: number; g: number; b: number
      rgbStr: string
    }

    type Shockwave = {
      x: number; y: number
      radius: number
      maxRadius: number
      strength: number
      age: number
    }

    /** Extra particles that fade in on scroll to fill the background when dispersed */
    type FillParticle = { x: number; y: number; size: number; phase: number; r: number; g: number; b: number; rgbStr: string }

    let particles: Particle[] = []
    const shockwaves: Shockwave[] = []
    let fillParticles: FillParticle[] = []

    function createFillParticles() {
      const w = canvas.width
      const h = canvas.height
      const mobile = isMobileViewport()
      // Fewer fill particles when dispersed for performance; logo density is handled by main particles.
      const count = mobile
        ? Math.min(220, Math.floor((w * h) / (90 * 90)))
        : Math.min(550, Math.floor((w * h) / (68 * 68)))
      fillParticles = []
      for (let i = 0; i < count; i++) {
        const r = 200 + Math.floor(Math.random() * 55)
        const g = 180 + Math.floor(Math.random() * 75)
        const b = 255
        fillParticles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 1.4 + 0.4,
          phase: Math.random() * Math.PI * 2,
          r, g, b,
          rgbStr: `rgb(${r},${g},${b})`
        })
      }
    }

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const prevW = canvas.width
      const prevH = canvas.height
      // Keep DPR low on mobile to avoid over-rendering the canvas.
      const dprCap = isMobileViewport() ? 1 : 2
      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, dprCap)
      const nextW = Math.max(1, Math.round(w * dpr))
      const nextH = Math.max(1, Math.round(h * dpr))
      canvas.width = nextW
      canvas.height = nextH

      // When the canvas size changes, keep particle positions coherent by scaling
      // all coordinates into the new space instead of re-seeding randomly.
      if (prevW > 0 && prevH > 0 && (prevW !== nextW || prevH !== nextH)) {
        const sx = nextW / prevW
        const sy = nextH / prevH

        for (const p of particles) {
          p.x *= sx; p.y *= sy
          p.tx *= sx; p.ty *= sy
          p.bgx *= sx; p.bgy *= sy
        }
        for (const fp of fillParticles) {
          fp.x *= sx; fp.y *= sy
        }
      }

      if (fillParticles.length === 0) createFillParticles()
      return dpr
    }

    let dpr = resize()
    const handleResize = () => { dpr = resize() }
    window.addEventListener("resize", handleResize)
    if (useCustomCursor) {
      document.documentElement.style.cursor = "none"
      document.body.style.cursor = "none"
    }

    const mouse = { x: -9999, y: -9999 }
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

    if (useCustomCursor) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("click", handleClick)
    }

    let imageData: ImageData | null = null
    let scrollProgress = 0
    let targetScrollProgress = 0
    let scrollVelocity = 0
    let lastScrollY = 0

    const handleScroll = () => {
      if (startDispersed) return
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      scrollVelocity = Math.abs(window.scrollY - lastScrollY)
      // Cap scroll velocity so large scrolls don't cause physics spikes (smoother on PC/laptop).
      const cap = isMobileViewport() ? 40 : 65
      scrollVelocity = Math.min(scrollVelocity, cap)
      lastScrollY = window.scrollY
      const rawProgress = max > 0 ? Math.min(window.scrollY / max, 1) : 1
      const dispersionEnd = isMobileViewport() ? 0.18 : 0.24
      const normalized = Math.min(rawProgress / dispersionEnd, 1)
      targetScrollProgress = normalized * normalized * (3 - 2 * normalized)
    }
    if (!startDispersed) {
      scrollProgress = 0
      targetScrollProgress = 0
      window.addEventListener("scroll", handleScroll, { passive: true })
    } else {
      scrollProgress = 1
      targetScrollProgress = 1
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
          const scaleMultiplier = window.innerWidth < 768 ? 1.16 : 1.15
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
      // Tighter gap = more particles in the collected logo; we cull drawing when dispersed for performance.
      const isMobile = isMobileViewport()
      const gap = isMobile ? Math.max(3, particleGap) : Math.max(2, particleGap)
      for (let y = 0; y < canvas.height; y += gap) {
        for (let x = 0; x < canvas.width; x += gap) {
          const i = (y * canvas.width + x) * 4
          const r = data[i], g = data[i + 1], b = data[i + 2], alpha = data[i + 3]
          if (alpha > 40) {
            const isTextPixel = Math.abs(r - g) < 20 && Math.abs(r - b) < 20 && Math.abs(g - b) < 20 && r > 100
            const wf = isTextPixel ? 0.75 : 0

            // Thin out non-text particles for smoother performance; text stays dense for legibility.
            if (!isTextPixel) {
              if (!isMobile && Math.random() < 0.6) continue
              if (isMobile && Math.random() < 0.3) continue
            }

            const rVal = Math.round(Math.min(255, r + (255 - r) * wf))
            const gVal = Math.round(Math.min(255, g + (255 - g) * wf))
            const bVal = Math.round(Math.min(255, b + (255 - b) * wf))
            const rgbStr = `rgb(${rVal},${gVal},${bVal})`

            const baseParticle = {
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              tx: x,
              ty: y,
              vx: 0,
              vy: 0,
              size: Math.random() * 1.6 + 0.5,
              phase: Math.random() * Math.PI * 2,
              bgx: Math.random() * canvas.width,
              bgy: Math.random() * canvas.height,
              r: rVal,
              g: gVal,
              b: bVal,
              rgbStr
            }
            particles.push(baseParticle)

            // Make text – especially the lower "2026" band – denser so the logo is clearly legible when collected.
            if (isTextPixel) {
              const extraCount = isMobile
                ? (y > canvas.height * 0.6 ? 2 : 1)
                : (y > canvas.height * 0.6 ? 3 : 2)
              for (let n = 0; n < extraCount; n++) {
                particles.push({
                  x: baseParticle.x + (Math.random() - 0.5) * gap,
                  y: baseParticle.y + (Math.random() - 0.5) * gap,
                  tx: x,
                  ty: y,
                  vx: 0,
                  vy: 0,
                  size: baseParticle.size,
                  phase: Math.random() * Math.PI * 2,
                  bgx: Math.random() * canvas.width,
                  bgy: Math.random() * canvas.height,
                  r: baseParticle.r,
                  g: baseParticle.g,
                  b: baseParticle.b,
                  rgbStr: baseParticle.rgbStr
                })
              }
            }
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

      // Smooth lerp of scroll progress so dispersion/re-collection is lag-free (no sudden jumps).
      const lerpSpeed = isMobileViewport() ? 0.2 : 0.14
      scrollProgress += (targetScrollProgress - scrollProgress) * lerpSpeed

      const isMobile = isMobileViewport()
      // Draw extra background fill particles only on desktop so mobile never
      // turns into an overly noisy/starry background when scrolling.
      if (!isMobile && fillParticles.length > 0 && scrollProgress > 0) {
        const fillAlpha = 0.05 + 0.2 * scrollProgress
        const time002 = time * 0.002
        for (let i = 0; i < fillParticles.length; i++) {
          const fp = fillParticles[i]
          const twinkle = 0.5 + 0.5 * Math.sin(time002 + fp.phase)
          ctx.globalAlpha = fillAlpha * twinkle
          ctx.fillStyle = fp.rgbStr
          ctx.fillRect(fp.x, fp.y, fp.size, fp.size)
        }
      }

      // Expand & cull shockwaves
      for (const sw of shockwaves) { sw.radius += 12; sw.age++ }
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        if (shockwaves[i].radius >= shockwaves[i].maxRadius) shockwaves.splice(i, 1)
      }

      // Pre-compute constants for the particle loop to maximize rendering performance
      const disperse = scrollProgress
      const invDisperse = 1 - disperse
      const baseSpring = isMobile ? 0.18 : 0.14
      const dispersionBoost = invDisperse * (isMobile ? 0.14 : 0.09)
      const scrollBoost = scrollVelocity * (isMobile ? 0.018 : 0.008)
      const spring = baseSpring + dispersionBoost + scrollBoost
      
      const noiseStrength = isMobile ? 0.03 : 0.032
      const maxSpeed = isMobile ? 20 : 24
      const maxSpeedSq = maxSpeed * maxSpeed
      const friction = isMobile ? 0.88 : 0.91
      const readabilityDim = 1 - 0.45 * scrollProgress
      
      const time0015 = time * 0.0015
      const time0013 = time * 0.0013
      const time003 = time * 0.003

      for (let idx = 0; idx < particles.length; idx++) {
        const p = particles[idx]
        const targetX = p.tx * invDisperse + p.bgx * disperse
        const targetY = p.ty * invDisperse + p.bgy * disperse

        // Shockwave interactions
        if (shockwaves.length > 0) {
          for (let i = 0; i < shockwaves.length; i++) {
            const sw = shockwaves[i]
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
        }

        // Spring back toward logo or dispersed position.
        p.vx += (targetX - p.x) * spring
        p.vy += (targetY - p.y) * spring

        // Gentle per-particle drift.
        p.vx += Math.cos(time0015 + p.phase) * noiseStrength
        p.vy += Math.sin(time0013 + p.phase) * noiseStrength

        // Velocity clamping and friction
        const speedSq = p.vx * p.vx + p.vy * p.vy
        if (speedSq > maxSpeedSq) {
          const speed = Math.sqrt(speedSq)
          const scale = maxSpeed / speed
          p.vx *= scale
          p.vy *= scale
        }

        p.vx *= friction
        p.vy *= friction

        p.x += p.vx
        p.y += p.vy

        const twinkle = 0.6 + 0.4 * Math.sin(time003 + p.phase)

        ctx.globalAlpha = twinkle * readabilityDim
        ctx.fillStyle = p.rgbStr
        ctx.fillRect(p.x, p.y, p.size, p.size)
      }

      ctx.globalAlpha = 1.0

      // Decay scroll velocity once per frame, not per particle.
      scrollVelocity *= isMobile ? 0.9 : 0.92

      // Draw text below the logo, fades as user scrolls
      const textAlpha = Math.max(0, 1 - scrollProgress * 3)
      if (textAlpha > 0) {
        const isMobile = window.innerWidth < 768
        const centerX = canvas.width / 2
        // On mobile, keep the copy higher so it sits clearly in view.
        const centerY = canvas.height / 2 + canvas.height * (isMobile ? 0.12 : 0.24)
        ctx.save()
        ctx.globalAlpha = textAlpha
        ctx.textAlign = "center"
        // Make mobile text substantially larger for readability on small screens.
        const baseFont = isMobile ? 16 : 11
        const fontSize = Math.round(baseFont * dpr)
        const lineH = (isMobile ? 24 : 20) * dpr
        const lines = isMobile
          ? [
            "LUMINUS 2026 MARKS A NEW BEGINNING AT RNSIT,",
            "THE FIRST NATIONAL-LEVEL INTERCOLLEGIATE",
            "TECH FEST IN ITS LANDMARK 25TH YEAR.",
            "2,000+ STUDENTS. BOLD IDEAS. ONE STAGE.",
          ]
          : [
            "LUMINUS 2026 IS RNSIT'S FIRST NATIONAL-LEVEL INTERCOLLEGIATE TECH FEST,",
            "LAUNCHED IN ITS LANDMARK 25TH YEAR TO BEGIN A LEGACY OF INNOVATION.",
            "WITH 2,000+ STUDENTS NATIONWIDE, IT BLENDS TECHNICAL AND INTERDISCIPLINARY",
            "CHALLENGES THAT INSPIRE YOU TO COMPETE, GROW, AND SHINE.",
          ]

        const textOpacity = isMobile ? 0.75 : 0.38
        ctx.fillStyle = `rgba(255, 255, 255, ${textOpacity})`
        const letterSpacingRatio = isMobile ? 0.06 : 0.18
        const fontFamily = `"Space Mono", "JetBrains Mono", "SF Mono", Menlo, monospace`
        ctx.font = `500 ${fontSize}px ${fontFamily}`
        ctx.letterSpacing = `${Math.round(letterSpacingRatio * fontSize)}px`

        // Scale font down if the longest line overflows the canvas
        const maxLineWidth = canvas.width * 0.95
        const longestLine = lines.reduce((a, b) => (a.length > b.length ? a : b), "")
        const measuredWidth = ctx.measureText(longestLine).width
        let effectiveFontSize = fontSize
        if (measuredWidth > maxLineWidth) {
          effectiveFontSize = Math.floor(fontSize * (maxLineWidth / measuredWidth))
          ctx.font = `500 ${effectiveFontSize}px ${fontFamily}`
          ctx.letterSpacing = `${Math.round(letterSpacingRatio * effectiveFontSize)}px`
        }
        const effectiveLineH = (lineH / fontSize) * effectiveFontSize

        lines.forEach((line, idx) => {
          ctx.fillText(line, centerX, centerY + effectiveLineH * idx)
        })
        ctx.restore()
      }

      if (useCustomCursor) {
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
      // Clear canvas dimensions so the browser can reclaim resources between navigations.
      if (canvas) {
        canvas.width = 0
        canvas.height = 0
      }
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.removeEventListener("resize", handleResize)
      if (hideDesktopScrollbar) {
        document.documentElement.classList.remove("hide-desktop-scrollbar")
        document.body.classList.remove("hide-desktop-scrollbar")
      }
      if (useCustomCursor) {
        document.documentElement.style.cursor = ""
        document.body.style.cursor = ""
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("click", handleClick)
      }
      if (!startDispersed) window.removeEventListener("scroll", handleScroll)
    }
  }, [options, hideCursor, particleGap, startDispersed])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        zIndex: 10,
        pointerEvents: "none",
        cursor: hideCursor ? "none" : "auto",
      }}
    />
  )
}