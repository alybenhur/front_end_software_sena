<template>
  <v-app style="background: transparent !important">
    <v-main>
      <div class="auth-page">

        <!-- Fondo base -->
        <div class="bg-base" aria-hidden="true" />

        <!-- Canvas: red de constelación animada -->
        <canvas ref="canvasRef" class="bg-canvas" aria-hidden="true" />

        <!-- Contenido centrado -->
        <div class="auth-layout">
          <div class="form-panel">

            <!-- Branding -->
            <div class="brand-header slide-up" style="--delay: 0s">
              <img src="/senalogo.png" alt="SENA" class="brand-logo" />
              <h1 class="brand-title">SENA</h1>
              <p class="brand-subtitle">CATÁLOGO DE SOFTWARE</p>
            </div>

            <!-- Slot del formulario -->
            <div class="form-wrapper slide-in-right" style="--delay: 0.18s">
              <slot />
            </div>

          </div>
        </div>

      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

const canvasRef = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let animationId: number | null = null

function initParticles() {
  if (!canvasRef.value) return
  const w = canvasRef.value.width
  const h = canvasRef.value.height
  const count = Math.min(110, Math.max(40, Math.floor((w * h) / 14000)))
  particles = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    })
  }
}

function resize() {
  if (!canvasRef.value) return
  canvasRef.value.width = canvasRef.value.offsetWidth
  canvasRef.value.height = canvasRef.value.offsetHeight
  initParticles()
}

function draw() {
  if (!canvasRef.value || !ctx) return
  const w = canvasRef.value.width
  const h = canvasRef.value.height
  ctx.clearRect(0, 0, w, h)

  // Update positions
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < 0 || p.x > w) p.vx *= -1
    if (p.y < 0 || p.y > h) p.vy *= -1
  }

  // Connecting lines (proximity-based)
  const maxDist = 135
  ctx.lineWidth = 1
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.4
        ctx.strokeStyle = `rgba(76, 223, 128, ${alpha})`
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.stroke()
      }
    }
  }

  // Glowing dots
  ctx.shadowBlur = 8
  ctx.shadowColor = 'rgba(76, 223, 128, 0.85)'
  ctx.fillStyle = '#4cdf80'
  for (const p of particles) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.shadowBlur = 0

  animationId = requestAnimationFrame(draw)
}

onMounted(() => {
  if (!canvasRef.value) return
  ctx = canvasRef.value.getContext('2d')
  resize()
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    // Render once, sin loop
    if (ctx && canvasRef.value) {
      ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
      ctx.shadowBlur = 8
      ctx.shadowColor = 'rgba(76, 223, 128, 0.85)'
      ctx.fillStyle = '#4cdf80'
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  } else {
    draw()
  }
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', resize)
  }
})
</script>

<style scoped>
/* ── Página completa ── */
.auth-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

/* Fondo base */
.bg-base {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse at 30% 20%, #0d3320 0%, transparent 60%),
    radial-gradient(ellipse at 70% 80%, #0a2618 0%, transparent 55%),
    linear-gradient(135deg, #06160d 0%, #0a2014 50%, #061410 100%);
}

/* Canvas (constelación) */
.bg-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}

/* ── Layout centrado ── */
.auth-layout {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 32px 16px;
}

.form-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 460px;
}

/* ── Branding ── */
.brand-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 28px;
}

.brand-logo {
  width: 110px;
  height: auto;
  margin-bottom: 14px;
  filter: drop-shadow(0 0 18px rgba(76, 223, 128, 0.45));
  animation: logoFloat 4s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}

.brand-title {
  font-size: 2rem;
  font-weight: 900;
  color: #4cdf80;
  letter-spacing: 0.18em;
  margin: 0 0 6px;
  text-shadow: 0 0 24px rgba(76, 223, 128, 0.4);
}

.brand-subtitle {
  font-size: 0.78rem;
  font-weight: 700;
  color: rgba(220, 240, 230, 0.65);
  letter-spacing: 0.32em;
  text-transform: uppercase;
  margin: 0;
}

/* Wrapper del slot */
.form-wrapper { width: 100%; }

/* ── Animaciones de entrada ── */
.slide-up {
  animation: fadeSlideUp 0.6s ease both;
  animation-delay: var(--delay, 0s);
}
.slide-in-right {
  animation: fadeSlideRight 0.6s ease both;
  animation-delay: var(--delay, 0s);
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0);    }
}
@keyframes fadeSlideRight {
  from { opacity: 0; transform: translateX(36px); }
  to   { opacity: 1; transform: translateX(0);    }
}

@media (prefers-reduced-motion: reduce) {
  .brand-logo { animation: none; }
  .slide-up, .slide-in-right { animation: none; }
}

@media (max-width: 600px) {
  .brand-logo { width: 90px; }
  .brand-title { font-size: 1.65rem; }
  .brand-subtitle { font-size: 0.7rem; letter-spacing: 0.24em; }
}
</style>
