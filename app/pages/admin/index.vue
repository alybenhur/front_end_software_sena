<template>
  <div class="aw">

    <!-- ══ HERO ══ -->
    <div class="hero fade-up" style="--d:0s">
      <div class="hero-left">
        <div class="hero-eyebrow">
          <span class="live-dot" />
          Sistema activo · {{ formattedDate }}
        </div>
        <h1 class="hero-h1">Resumen del <span class="hero-accent">Sistema</span></h1>
        <p class="hero-p">Visión general de la plataforma SENA</p>
      </div>
      <NuxtLink to="/admin/software/nuevo" class="cta-btn">
        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nuevo software
      </NuxtLink>
    </div>

    <!-- ══ STAT CARDS ══ -->
    <div class="sg">
      <template v-if="loading">
        <div v-for="n in 4" :key="n" class="skel" />
      </template>
      <template v-else>
        <div
          v-for="(s, i) in statCards"
          :key="s.label"
          class="sc fade-up"
          :style="`--d:${0.10 + i * 0.09}s`"
        >
          <div class="sc-topbar" :style="{ background: s.gradient }" />
          <div class="sc-head">
            <div class="sc-icon" :style="{ background: s.gradient }">
              <v-icon color="white" size="19">{{ s.icon }}</v-icon>
            </div>
            <span class="sc-delta" :class="s.deltaClass">{{ s.delta }}</span>
          </div>
          <div class="sc-num">{{ s.displayed.toLocaleString('es-CO') }}</div>
          <div class="sc-label">{{ s.label }}</div>
          <div class="sc-bar-track">
            <div
              class="sc-bar-fill"
              :style="{
                width: barsVisible ? s.pct + '%' : '0%',
                background: s.barColor,
                transitionDelay: (0.3 + i * 0.08) + 's'
              }"
            />
          </div>
        </div>
      </template>
    </div>

    <!-- ══ CHARTS ROW ══ -->
    <div class="cr fade-up" style="--d:0.50s">

      <!-- Bar chart -->
      <div class="panel">
        <div class="panel-hd">
          <div>
            <div class="panel-title">Distribución del sistema</div>
            <div class="panel-sub">datos cargados en tiempo real</div>
          </div>
          <span class="live-badge">
            <span class="live-badge-dot" />
            Live
          </span>
        </div>
        <div v-if="!loading" class="barchart">
          <div v-for="(b, bi) in barItems" :key="b.label" class="br" :style="`--bi:${bi}`">
            <span class="br-lbl">{{ b.label }}</span>
            <div class="br-track">
              <div
                class="br-fill"
                :style="{
                  width: barsVisible ? b.pct + '%' : '0%',
                  background: b.color,
                  transitionDelay: (0.15 + bi * 0.08) + 's'
                }"
              />
            </div>
            <span class="br-val">{{ b.value }}</span>
          </div>
        </div>
        <div v-else class="barchart">
          <div v-for="n in 5" :key="n" class="br-skel" />
        </div>
      </div>

      <!-- Donut -->
      <div class="panel panel-sm">
        <div class="panel-hd">
          <div>
            <div class="panel-title">Software activo</div>
            <div class="panel-sub">{{ softwareTotal }} en catálogo</div>
          </div>
        </div>
        <div v-if="!loading" class="dw">
          <svg class="dsv" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="46" fill="none" stroke="#EBEBF0" stroke-width="11" />
            <circle
              cx="60" cy="60" r="46"
              fill="none"
              stroke="#39A900"
              stroke-width="11"
              stroke-linecap="round"
              stroke-dasharray="289"
              :stroke-dashoffset="donutOffset"
              transform="rotate(-90 60 60)"
              class="darc"
            />
          </svg>
          <div class="dcenter">
            <span class="dpct">{{ activePercent }}<sup>%</sup></span>
            <span class="dsub">activos</span>
          </div>
        </div>
        <div v-if="!loading" class="dlg">
          <div class="dli">
            <span class="dld" style="background:#39A900" />
            <span>Activos</span>
            <b>{{ softwareActivos }}</b>
          </div>
          <div class="dli">
            <span class="dld" style="background:#EBEBF0; border:1px solid #D1D1D6" />
            <span>Inactivos</span>
            <b>{{ softwareTotal - softwareActivos }}</b>
          </div>
        </div>
        <div v-if="loading" style="height:180px; display:flex; align-items:center; justify-content:center;">
          <div class="skel" style="width:130px;height:130px;border-radius:50%;margin:0 auto;" />
        </div>
      </div>

    </div>

    <!-- ══ PORTAL LINKS ══ -->
    <div class="sec-h fade-up" style="--d:0.62s">Ir a sección</div>
    <div class="plinks fade-up" style="--d:0.66s">

      <NuxtLink to="/admin/noticias" class="plink">
        <div class="plink-icon" style="background:linear-gradient(135deg,#B85C00,#E07B20)">
          <v-icon color="white" size="22">mdi-newspaper-variant-outline</v-icon>
        </div>
        <div class="plink-info">
          <span class="plink-title">Panel de Noticias</span>
          <span class="plink-desc">Revisar, aprobar y gestionar noticias</span>
        </div>
        <div class="plink-meta">
          <span v-if="!loading" class="plink-badge" style="background:rgba(184,92,0,0.10);color:#B85C00;border-color:rgba(184,92,0,0.22)">
            {{ noticiasData.filter(n => n.estado === 'pendiente').length }} pendientes
          </span>
          <div class="plink-arrow" style="background:linear-gradient(135deg,#B85C00,#E07B20)">
            <v-icon size="15" color="white">mdi-arrow-right</v-icon>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink to="/catalogo" class="plink">
        <div class="plink-icon" style="background:linear-gradient(135deg,#1E6300,#39A900)">
          <v-icon color="white" size="22">mdi-apps</v-icon>
        </div>
        <div class="plink-info">
          <span class="plink-title">Catálogo de Software</span>
          <span class="plink-desc">Vista pública del catálogo SENA</span>
        </div>
        <div class="plink-meta">
          <span v-if="!loading" class="plink-badge" style="background:rgba(57,169,0,0.10);color:#2A7A00;border-color:rgba(57,169,0,0.22)">
            {{ softwareTotal }} apps
          </span>
          <div class="plink-arrow" style="background:linear-gradient(135deg,#1E6300,#39A900)">
            <v-icon size="15" color="white">mdi-arrow-right</v-icon>
          </div>
        </div>
      </NuxtLink>

    </div>

    <!-- ══ QUICK ACTIONS ══ -->
    <div class="sec-h fade-up" style="--d:0.80s">Accesos rápidos</div>
    <div class="ag">
      <NuxtLink
        v-for="(a, i) in quickActions"
        :key="a.to"
        :to="a.to"
        class="ac fade-up"
        :style="`--d:${0.86 + i * 0.07}s`"
      >
        <div class="ac-ic" :style="{ background: a.gradient }">
          <v-icon color="white" size="17">{{ a.icon }}</v-icon>
        </div>
        <div class="ac-bd">
          <span class="ac-tt">{{ a.title }}</span>
          <span class="ac-ds">{{ a.desc }}</span>
        </div>
        <v-icon size="13" color="#C7C7CC" class="ac-ar">mdi-chevron-right</v-icon>
      </NuxtLink>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'dashboard', middleware: 'admin' })

const api       = useApi()
const authStore = useAuthStore()
const loading   = ref(true)

const softwareData  = ref<any[]>([])
const usersData     = ref<any[]>([])
const noticiasData  = ref<any[]>([])

const barsVisible = ref(false)
const donutOffset = ref(289)
const cv          = reactive([0, 0, 0, 0])   // counter values

// ── Derived ─────────────────────────────────────────────────────
const softwareActivos = computed(() =>
  softwareData.value.filter(s => s.estado?.toLowerCase() === 'activo').length
)
const softwareTotal = computed(() => softwareData.value.length)
const activePercent = computed(() => {
  if (!softwareTotal.value) return 0
  return Math.round((softwareActivos.value / softwareTotal.value) * 100)
})

const formattedDate = computed(() =>
  new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
)

// ── Counter animation ────────────────────────────────────────────
function animateCount(to: number, idx: number, duration = 1200) {
  const start = performance.now()
  const step  = (now: number) => {
    const p = Math.min((now - start) / duration, 1)
    const e = 1 - Math.pow(1 - p, 4)
    cv[idx]  = Math.round(e * to)
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// ── Stat cards def ───────────────────────────────────────────────
const statCards = computed(() => {
  const targets = [softwareActivos.value, softwareTotal.value, usersData.value.length,
                   noticiasData.value.filter(n => n.estado === 'pendiente').length]
  const max = Math.max(...targets, 1)
  return [
    {
      label: 'Software activos',
      displayed: cv[0],
      icon: 'mdi-package-variant-closed',
      gradient: 'linear-gradient(135deg, #2A7A00, #39A900)',
      barColor: '#39A900',
      pct: Math.round((targets[0] / max) * 100),
      delta: '+12% este mes',
      deltaClass: 'up',
    },
    {
      label: 'Total software',
      displayed: cv[1],
      icon: 'mdi-apps',
      gradient: 'linear-gradient(135deg, #1A6FA8, #2E9CDF)',
      barColor: '#2E9CDF',
      pct: Math.round((targets[1] / max) * 100),
      delta: '+4% este mes',
      deltaClass: 'up',
    },
    {
      label: 'Usuarios registrados',
      displayed: cv[2],
      icon: 'mdi-account-group-outline',
      gradient: 'linear-gradient(135deg, #5C3D9C, #7C5DBF)',
      barColor: '#7C5DBF',
      pct: Math.round((targets[2] / max) * 100),
      delta: '+7% este mes',
      deltaClass: 'up',
    },
    {
      label: 'Noticias pendientes',
      displayed: cv[3],
      icon: 'mdi-newspaper-variant-outline',
      gradient: 'linear-gradient(135deg, #B85C00, #E07B20)',
      barColor: '#E07B20',
      pct: Math.round((targets[3] / max) * 100),
      delta: targets[3] > 0 ? `${targets[3]} por revisar` : 'Al día',
      deltaClass: targets[3] > 0 ? 'warn' : 'ok',
    },
  ]
})

const barItems = computed(() => {
  const published = noticiasData.value.filter(n => n.estado !== 'pendiente').length
  const pending   = noticiasData.value.filter(n => n.estado === 'pendiente').length
  const rows = [
    { label: 'Sw. activos',  value: softwareActivos.value, color: '#39A900' },
    { label: 'Sw. total',    value: softwareTotal.value,   color: '#2E9CDF' },
    { label: 'Usuarios',     value: usersData.value.length, color: '#7C5DBF' },
    { label: 'Publicadas',   value: published,              color: '#2D9E6B' },
    { label: 'Pendientes',   value: pending,                color: '#E07B20' },
  ]
  const max = Math.max(...rows.map(r => r.value), 1)
  return rows.map(r => ({ ...r, pct: Math.round((r.value / max) * 100) }))
})

const quickActions = [
  { title: 'Nuevo software',     desc: 'Agregar al catálogo',        icon: 'mdi-plus-circle-outline',        gradient: 'linear-gradient(135deg,#2A7A00,#39A900)',  to: '/admin/software/nuevo' },
  { title: 'Gestionar software', desc: 'Ver, editar y eliminar',     icon: 'mdi-package-variant-closed',     gradient: 'linear-gradient(135deg,#1A6FA8,#2E9CDF)',  to: '/admin/software' },
  { title: 'Gestionar usuarios', desc: 'Administrar accesos',        icon: 'mdi-account-group-outline',      gradient: 'linear-gradient(135deg,#5C3D9C,#7C5DBF)',  to: '/admin/usuarios' },
  { title: 'Revisar noticias',   desc: 'Aprobar o rechazar noticias', icon: 'mdi-newspaper-variant-outline', gradient: 'linear-gradient(135deg,#B85C00,#E07B20)',   to: '/admin/noticias' },
]

// ── Data fetch ───────────────────────────────────────────────────
onMounted(async () => {
  try {
    const [sw, users, noticias] = await Promise.all([
      api.get<any[]>('/software/admin'),
      api.get<any[]>('/users'),
      api.get<any[]>('/noticias/admin'),
    ])
    softwareData.value  = sw
    usersData.value     = users
    noticiasData.value  = noticias
  } finally {
    loading.value = false
    await nextTick()

    // Staggered counter animations
    const targets = [
      softwareData.value.filter(s => s.estado?.toLowerCase() === 'activo').length,
      softwareData.value.length,
      usersData.value.length,
      noticiasData.value.filter(n => n.estado === 'pendiente').length,
    ]
    targets.forEach((t, i) => setTimeout(() => animateCount(t, i), i * 110))

    // Bars + donut after a short settle
    setTimeout(() => {
      barsVisible.value = true
      const pct = !softwareData.value.length ? 0
        : Math.round((softwareData.value.filter(s => s.estado?.toLowerCase() === 'activo').length
          / softwareData.value.length) * 100)
      donutOffset.value = 289 - (pct / 100) * 289
    }, 300)
  }
})
</script>

<style scoped>
/* ── Animation ── */
.fade-up {
  animation: fu 0.5s ease both;
  animation-delay: var(--d, 0s);
}
@keyframes fu {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Hero ── */
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}
.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.74rem;
  color: #8E8E93;
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}
.live-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #39A900;
  flex-shrink: 0;
  animation: ldot 2.2s ease-in-out infinite;
}
@keyframes ldot {
  0%,100% { box-shadow: 0 0 0 2px rgba(57,169,0,0.25); }
  50%      { box-shadow: 0 0 0 5px rgba(57,169,0,0.10); }
}
.hero-h1 {
  font-size: 1.6rem;
  font-weight: 900;
  color: #1C1C1E;
  letter-spacing: -0.025em;
  line-height: 1.15;
  margin: 0 0 5px;
}
.hero-accent { color: #39A900; }
.hero-p { font-size: 0.8rem; color: #8E8E93; margin: 0; }

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 22px;
  background: linear-gradient(135deg, #2A7A00, #39A900);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  box-shadow: 0 4px 18px rgba(57,169,0,0.35), 0 1px 3px rgba(0,0,0,0.10);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  white-space: nowrap;
}
.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 26px rgba(57,169,0,0.45), 0 1px 3px rgba(0,0,0,0.10);
}
.cta-btn:active { transform: translateY(0); }

/* ── Stats grid ── */
.sg {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
  margin-bottom: 28px;
}

/* Skeleton */
.skel {
  border-radius: 16px;
  height: 128px;
  background: linear-gradient(90deg, #F2F2F7 25%, #E8E8EE 50%, #F2F2F7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}

/* Stat card */
.sc {
  background: white;
  border-radius: 16px;
  padding: 18px 20px 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.045);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.sc:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06);
}
.sc-topbar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  border-radius: 16px 16px 0 0;
}
.sc-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.sc-icon {
  width: 40px; height: 40px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0,0,0,0.18);
}
.sc-delta {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.sc-delta.up   { background: rgba(57,169,0,0.10);  color: #2A7A00; }
.sc-delta.warn { background: rgba(224,123,32,0.10); color: #B85C00; }
.sc-delta.ok   { background: rgba(57,169,0,0.10);  color: #2A7A00; }

.sc-num {
  font-size: 2.2rem;
  font-weight: 900;
  color: #1C1C1E;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 4px;
}
.sc-label {
  font-size: 0.74rem;
  color: #8E8E93;
  font-weight: 500;
  margin-bottom: 16px;
}
.sc-bar-track {
  height: 3px;
  background: #F2F2F7;
  border-radius: 2px;
  overflow: hidden;
}
.sc-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ── Charts row ── */
.cr {
  display: grid;
  grid-template-columns: 1fr 272px;
  gap: 14px;
  margin-bottom: 28px;
}
@media (max-width: 900px) {
  .cr { grid-template-columns: 1fr; }
}

.panel {
  background: white;
  border-radius: 16px;
  padding: 22px 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.045);
}
.panel-hd {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
}
.panel-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: #1C1C1E;
  letter-spacing: -0.01em;
}
.panel-sub {
  font-size: 0.7rem;
  color: #8E8E93;
  margin-top: 2px;
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(57,169,0,0.10);
  color: #2A7A00;
  border: 1px solid rgba(57,169,0,0.22);
  white-space: nowrap;
  flex-shrink: 0;
}
.live-badge-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #39A900;
  animation: ldot 2.2s ease-in-out infinite;
}

/* Bar chart */
.barchart { display: flex; flex-direction: column; gap: 13px; }

.br {
  display: grid;
  grid-template-columns: 88px 1fr 34px;
  align-items: center;
  gap: 10px;
}
.br-lbl {
  font-size: 0.74rem;
  color: #636366;
  font-weight: 500;
  text-align: right;
  white-space: nowrap;
}
.br-track {
  height: 9px;
  background: #F2F2F7;
  border-radius: 5px;
  overflow: hidden;
}
.br-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.85s cubic-bezier(0.16, 1, 0.3, 1);
}
.br-val {
  font-size: 0.78rem;
  font-weight: 800;
  color: #1C1C1E;
}
.br-skel {
  height: 9px;
  border-radius: 5px;
  background: linear-gradient(90deg, #F2F2F7 25%, #E8E8EE 50%, #F2F2F7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  margin-bottom: 13px;
}

/* Donut */
.dw {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 18px;
}
.dsv { width: 145px; height: 145px; display: block; }
.darc {
  transition: stroke-dashoffset 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
}
.dcenter {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}
.dpct {
  font-size: 1.7rem;
  font-weight: 900;
  color: #1C1C1E;
  letter-spacing: -0.03em;
  line-height: 1;
}
.dpct sup { font-size: 0.85rem; font-weight: 700; vertical-align: super; }
.dsub { font-size: 0.68rem; color: #8E8E93; font-weight: 600; margin-top: 1px; }

.dlg { display: flex; flex-direction: column; gap: 9px; }
.dli {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 0.78rem;
  color: #636366;
}
.dld {
  width: 10px; height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}
.dli b { margin-left: auto; font-weight: 800; color: #1C1C1E; }

/* ── Section heading ── */
.sec-h {
  font-size: 0.95rem;
  font-weight: 800;
  color: #1C1C1E;
  letter-spacing: -0.01em;
  margin-bottom: 14px;
}

/* ── Portal links ── */
.plinks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 28px;
}
@media (max-width: 680px) {
  .plinks { grid-template-columns: 1fr; }
}

.plink {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: white;
  border-radius: 16px;
  text-decoration: none;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.plink:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06);
}
.plink-icon {
  width: 48px; height: 48px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(0,0,0,0.18);
}
.plink-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.plink-title {
  font-size: 0.92rem;
  font-weight: 800;
  color: #1C1C1E;
  letter-spacing: -0.01em;
}
.plink-desc {
  font-size: 0.73rem;
  color: #8E8E93;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.plink-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.plink-badge {
  font-size: 0.69rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid;
  white-space: nowrap;
}
.plink-arrow {
  width: 30px; height: 30px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.18s ease;
}
.plink:hover .plink-arrow { transform: translateX(3px); }

/* ── Quick actions ── */
.ag {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}
.ac {
  background: white;
  border-radius: 14px;
  padding: 15px 17px;
  display: flex;
  align-items: center;
  gap: 13px;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.05);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.ac:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(0,0,0,0.10);
}
.ac-ic {
  width: 38px; height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0,0,0,0.16);
}
.ac-bd {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}
.ac-tt {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1C1C1E;
}
.ac-ds {
  font-size: 0.72rem;
  color: #8E8E93;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ac-ar {
  flex-shrink: 0;
  transition: transform 0.18s ease;
}
.ac:hover .ac-ar { transform: translateX(3px); }
</style>
