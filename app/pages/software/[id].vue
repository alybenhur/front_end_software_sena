<template>
  <div class="detail-page">

    <!-- ── Loader ── -->
    <div v-if="loading" class="loader-screen">
      <div class="loader-ring" />
    </div>

    <!-- ── No encontrado ── -->
    <div v-else-if="!software" class="not-found">
      <v-icon size="80" color="#8E8E93">mdi-alert-circle-outline</v-icon>
      <p class="nf-title">Software no encontrado</p>
      <NuxtLink to="/catalogo" class="back-pill">
        <v-icon size="16" class="mr-1">mdi-arrow-left</v-icon>Volver al catálogo
      </NuxtLink>
    </div>

    <!-- ── Contenido ── -->
    <template v-else>

      <!-- ════════════════════════════════
           HERO BANNER
           ════════════════════════════════ -->
      <div class="hero" :style="heroStyle">
        <!-- overlay degradado -->
        <div class="hero-overlay" />

        <!-- Botón volver -->
        <NuxtLink to="/catalogo" class="hero-back">
          <v-icon size="18" color="white">mdi-arrow-left</v-icon>
        </NuxtLink>

        <!-- Centro del hero: ícono + nombre + autor + chips -->
        <div class="hero-body">

          <div class="app-icon-wrap fade-up" style="--d:.08s">
            <v-img
              v-if="coverImage"
              :src="coverImage"
              contain
              width="88"
              height="88"
              class="app-icon-img"
            >
              <template #error>
                <div class="app-icon-fallback" :style="{ background: fallbackGradient }">
                  <span>{{ software.nombre?.[0]?.toUpperCase() }}</span>
                </div>
              </template>
            </v-img>
            <div v-else class="app-icon-fallback" :style="{ background: fallbackGradient }">
              <span>{{ software.nombre?.[0]?.toUpperCase() }}</span>
            </div>
          </div>

          <h1 class="hero-title fade-up" style="--d:.16s">{{ software.nombre }}</h1>
          <p class="hero-author fade-up" style="--d:.22s">{{ software.autores || 'SENA' }}</p>

          <div v-if="tags.length" class="hero-chips fade-up" style="--d:.28s">
            <span v-for="tag in tags" :key="tag" class="hero-chip">{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- ════════════════════════════════
           BARRA DE STATS
           ════════════════════════════════ -->
      <div class="stats-bar fade-up" style="--d:.34s">

        <!-- Rating -->
        <div class="stat-cell">
          <span class="stat-big">{{ ratingValue.toFixed(1) }}</span>
          <div class="stat-stars">
            <v-icon
              v-for="n in 5"
              :key="n"
              size="11"
              :color="n <= Math.round(ratingValue) ? '#F9A825' : '#C7C7CC'"
            >mdi-star</v-icon>
          </div>
          <span class="stat-label">Valoración</span>
        </div>

        <div class="stat-sep" />

        <!-- Categoría -->
        <div class="stat-cell">
          <span class="stat-big stat-trunc">{{ firstTag || 'Software' }}</span>
          <span class="stat-label">Categoría</span>
        </div>

        <div class="stat-sep" />

        <!-- Año -->
        <div class="stat-cell">
          <span class="stat-big">{{ formatYear(software.fechaCreacion) }}</span>
          <span class="stat-label">Año</span>
        </div>

      </div>

      <!-- ════════════════════════════════
           BOTÓN CTA
           ════════════════════════════════ -->
      <div class="cta-area fade-up" style="--d:.40s">
        <a
          v-if="software.urlAplicacion"
          :href="software.urlAplicacion"
          target="_blank"
          rel="noopener"
          class="cta-btn"
        >
          <v-icon size="17" class="mr-2">mdi-open-in-new</v-icon>
          Abrir aplicación
        </a>
        <div v-else class="cta-btn cta-disabled">
          <v-icon size="17" class="mr-2">mdi-lock-outline</v-icon>
          No disponible públicamente
        </div>
      </div>

      <!-- ════════════════════════════════
           CAPTURAS / IMÁGENES
           ════════════════════════════════ -->
      <section v-if="images.length" class="page-section fade-up" style="--d:.46s">
        <h2 class="section-title">Capturas de pantalla</h2>
        <div class="screenshots-track">
          <div
            v-for="(img, i) in images"
            :key="i"
            class="screenshot-thumb"
            @click="openLightbox(i)"
          >
            <v-img :src="img" cover width="200" height="130" class="screenshot-img" />
            <div class="screenshot-zoom">
              <v-icon size="20" color="white">mdi-magnify-plus-outline</v-icon>
            </div>
          </div>
        </div>
      </section>

      <!-- ════════════════════════════════
           DESCRIPCIÓN
           ════════════════════════════════ -->
      <section class="page-section fade-up" style="--d:.52s">
        <h2 class="section-title">Acerca de este software</h2>
        <div class="about-card">
          <p class="about-text" :class="{ 'about-clamp': !descOpen }">
            {{ software.descripcion || 'Aplicación desarrollada en el SENA para optimizar procesos de aprendizaje y gestión.' }}
          </p>
          <button
            v-if="hasLongDesc"
            class="read-more-btn"
            @click="descOpen = !descOpen"
          >
            {{ descOpen ? 'Ver menos' : 'Ver más' }}
            <v-icon size="14" class="ml-1">{{ descOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </button>
        </div>
      </section>

      <!-- ════════════════════════════════
           METADATA / INFORMACIÓN
           ════════════════════════════════ -->
      <section class="page-section fade-up" style="--d:.58s">
        <h2 class="section-title">Información</h2>
        <div class="info-card">

          <!-- Autores -->
          <div v-if="software.autores" class="info-row">
            <div class="info-icon-box">
              <v-icon size="17" color="#00796B">mdi-account-group-outline</v-icon>
            </div>
            <div class="info-text">
              <span class="info-key">Autores</span>
              <span class="info-val">{{ software.autores }}</span>
            </div>
          </div>

          <div v-if="software.autores" class="info-sep" />

          <!-- Fecha -->
          <div class="info-row">
            <div class="info-icon-box">
              <v-icon size="17" color="#00796B">mdi-calendar-check-outline</v-icon>
            </div>
            <div class="info-text">
              <span class="info-key">Fecha de creación</span>
              <span class="info-val">{{ formatDate(software.fechaCreacion) }}</span>
            </div>
          </div>

          <!-- Tags -->
          <template v-if="tags.length">
            <div class="info-sep" />
            <div class="info-row">
              <div class="info-icon-box">
                <v-icon size="17" color="#00796B">mdi-tag-multiple-outline</v-icon>
              </div>
              <div class="info-text">
                <span class="info-key">Etiquetas</span>
                <div class="info-tags-row">
                  <span v-for="tag in tags" :key="tag" class="info-tag-chip">{{ tag }}</span>
                </div>
              </div>
            </div>
          </template>

        </div>
      </section>

      <!-- Espaciado final -->
      <div style="height: 56px" />

    </template>

    <!-- ════════════════════════════════
         LIGHTBOX
         ════════════════════════════════ -->
    <Transition name="lb-fade">
      <div v-if="lbOpen" class="lightbox" @click.self="closeLb">

        <button class="lb-close" @click="closeLb">
          <v-icon color="white" size="22">mdi-close</v-icon>
        </button>

        <button
          v-if="lbIdx > 0"
          class="lb-arrow lb-prev"
          @click="lbIdx--"
        >
          <v-icon color="white" size="26">mdi-chevron-left</v-icon>
        </button>

        <div class="lb-img-wrap">
          <v-img
            :src="images[lbIdx]"
            contain
            max-width="90vw"
            max-height="78vh"
            class="lb-img"
          />
        </div>

        <button
          v-if="lbIdx < images.length - 1"
          class="lb-arrow lb-next"
          @click="lbIdx++"
        >
          <v-icon color="white" size="26">mdi-chevron-right</v-icon>
        </button>

        <div class="lb-dots">
          <span
            v-for="(_, i) in images"
            :key="i"
            class="lb-dot"
            :class="{ active: i === lbIdx }"
            @click="lbIdx = i"
          />
        </div>

      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'default' })

const route  = useRoute()
const api    = useApi()

const software  = ref<any>(null)
const loading   = ref(true)
const descOpen  = ref(false)
const lbOpen    = ref(false)
const lbIdx     = ref(0)

/* ── Computeds ─────────────────────────────────── */

const ratingValue = computed(() => parseFloat(software.value?.valoracion) || 0)

const images = computed(() =>
  software.value?.urlImagen
    ? software.value.urlImagen.split(',').map((u: string) => u.trim()).filter(Boolean)
    : []
)

const coverImage   = computed(() => images.value[0] ?? null)
const tags         = computed(() => {
  const t = software.value?.tags
  return t ? t.split(',').map((s: string) => s.trim()).filter(Boolean) : []
})
const firstTag     = computed(() => tags.value[0] ?? '')
const hasLongDesc  = computed(() => (software.value?.descripcion ?? '').length > 160)

const gradients = [
  'linear-gradient(135deg, #004D40, #00796B)',
  'linear-gradient(135deg, #1A237E, #283593)',
  'linear-gradient(135deg, #1B5E20, #388E3C)',
  'linear-gradient(135deg, #311B92, #512DA8)',
  'linear-gradient(135deg, #880E4F, #C2185B)',
  'linear-gradient(135deg, #E65100, #F57C00)',
]

const fallbackGradient = computed(() => {
  const idx = (software.value?.id ?? 0) % gradients.length
  return gradients[idx]
})

const heroStyle = computed(() => {
  if (coverImage.value) {
    return {
      backgroundImage: `url(${coverImage.value})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return { background: fallbackGradient.value }
})

/* ── Utilidades ────────────────────────────────── */

function formatDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
}
function formatYear(d: string) {
  if (!d) return '—'
  return new Date(d).getFullYear().toString()
}

function openLightbox(i: number) {
  lbIdx.value = i
  lbOpen.value = true
  document.body.style.overflow = 'hidden'
}
function closeLb() {
  lbOpen.value = false
  document.body.style.overflow = ''
}

/* ── Fetch ─────────────────────────────────────── */

onMounted(async () => {
  try {
    software.value = await api.get<any>(`/software/${route.params.id}`)
  } catch {
    software.value = null
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* ── Base ── */
.detail-page {
  min-height: 100vh;
  background: #F2F2F7;
}

/* ── Loader ── */
.loader-screen {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loader-ring {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 4px solid rgba(0, 121, 107, 0.18);
  border-top-color: #00796B;
  animation: spin 0.85s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── No encontrado ── */
.not-found {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
}
.nf-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1C1C1E;
  margin: 0;
}
.back-pill {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(90deg, #004D40, #00796B);
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 10px 22px;
  border-radius: 22px;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(0, 77, 64, 0.35);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.back-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(0, 77, 64, 0.42);
}

/* ══════════════════════════════════
   HERO
   ══════════════════════════════════ */
.hero {
  position: relative;
  min-height: 320px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 30, 22, 0.28) 0%,
    rgba(0, 30, 22, 0.68) 55%,
    rgba(0, 30, 22, 0.93) 100%
  );
}

/* Botón volver */
.hero-back {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  border: 1.5px solid rgba(255, 255, 255, 0.42);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: background 0.2s;
}
.hero-back:hover {
  background: rgba(255, 255, 255, 0.30);
}

/* Cuerpo del hero */
.hero-body {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 56px 20px 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Ícono app */
.app-icon-wrap {
  width: 88px;
  height: 88px;
  border-radius: 22px;
  overflow: hidden;
  border: 2.5px solid rgba(255, 255, 255, 0.42);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.38);
  margin-bottom: 14px;
  flex-shrink: 0;
  background: #F2F2F7;
}
.app-icon-img {
  width: 88px;
  height: 88px;
}
.app-icon-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.9);
}

.hero-title {
  font-size: 1.6rem;
  font-weight: 900;
  color: white;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 6px;
}
.hero-author {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.70);
  margin: 0 0 12px;
}
.hero-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}
.hero-chip {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.35);
  padding: 3px 11px;
  border-radius: 10px;
  backdrop-filter: blur(6px);
}

/* ══════════════════════════════════
   STATS BAR
   ══════════════════════════════════ */
.stats-bar {
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 14px 20px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.07);
}
.stat-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}
.stat-big {
  font-size: 1.3rem;
  font-weight: 900;
  color: #1C1C1E;
  line-height: 1;
}
.stat-trunc {
  font-size: 0.9rem;
  max-width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.stat-stars {
  display: flex;
  gap: 1px;
}
.stat-label {
  font-size: 8.5px;
  font-weight: 700;
  color: #8E8E93;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.stat-sep {
  width: 1px;
  height: 34px;
  background: rgba(0, 0, 0, 0.1);
}

/* ══════════════════════════════════
   CTA BUTTON
   ══════════════════════════════════ */
.cta-area {
  padding: 16px 18px 4px;
  max-width: 640px;
  margin: 0 auto;
}
.cta-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 14px 24px;
  border-radius: 14px;
  background: linear-gradient(90deg, #004D40 0%, #00695C 50%, #00796B 100%);
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(0, 77, 64, 0.42);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}
.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 77, 64, 0.50);
}
.cta-disabled {
  background: linear-gradient(90deg, #9E9E9E, #BDBDBD) !important;
  box-shadow: none !important;
  cursor: default;
  pointer-events: none;
}

/* ══════════════════════════════════
   SECCIONES
   ══════════════════════════════════ */
.page-section {
  padding: 20px 18px 0;
  max-width: 768px;
  margin-left: auto;
  margin-right: auto;
}
.section-title {
  font-size: 1rem;
  font-weight: 800;
  color: #1C1C1E;
  letter-spacing: -0.01em;
  margin: 0 0 12px;
}

/* ── Screenshots ── */
.screenshots-track {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: none;
}
.screenshots-track::-webkit-scrollbar { display: none; }

.screenshot-thumb {
  position: relative;
  flex-shrink: 0;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.14);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}
.screenshot-thumb:hover {
  transform: scale(1.04);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
}
.screenshot-img {
  display: block;
  pointer-events: none;
}
.screenshot-zoom {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  opacity: 0;
}
.screenshot-thumb:hover .screenshot-zoom {
  background: rgba(0, 0, 0, 0.3);
  opacity: 1;
}

/* ── About ── */
.about-card {
  background: white;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}
.about-text {
  font-size: 0.875rem;
  color: #3A3A3C;
  line-height: 1.65;
  margin: 0;
  transition: all 0.3s ease;
}
.about-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.read-more-btn {
  display: inline-flex;
  align-items: center;
  margin-top: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #00796B;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.18s;
}
.read-more-btn:hover { color: #004D40; }

/* ── Info card ── */
.info-card {
  background: white;
  border-radius: 16px;
  padding: 4px 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}
.info-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
}
.info-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(0, 121, 107, 0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.info-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.info-key {
  font-size: 9.5px;
  font-weight: 700;
  color: #8E8E93;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.info-val {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1C1C1E;
}
.info-sep {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
}
.info-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}
.info-tag-chip {
  font-size: 11px;
  font-weight: 600;
  color: #00695C;
  background: rgba(0, 105, 92, 0.10);
  padding: 3px 10px;
  border-radius: 8px;
}

/* ══════════════════════════════════
   LIGHTBOX
   ══════════════════════════════════ */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}
.lb-close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.25);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.lb-close:hover { background: rgba(255, 255, 255, 0.25); }
.lb-arrow {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.25);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.lb-arrow:hover { background: rgba(255, 255, 255, 0.26); }
.lb-prev { left: 16px; }
.lb-next { right: 16px; }
.lb-img-wrap {
  max-width: 90vw;
  max-height: 78vh;
  border-radius: 14px;
  overflow: hidden;
}
.lb-img { display: block; }
.lb-dots {
  position: absolute;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 7px;
  align-items: center;
}
.lb-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.36);
  cursor: pointer;
  transition: background 0.25s, width 0.25s;
}
.lb-dot.active {
  background: white;
  width: 22px;
  border-radius: 4px;
}

/* Lightbox transition */
.lb-fade-enter-active,
.lb-fade-leave-active { transition: opacity 0.25s ease; }
.lb-fade-enter-from,
.lb-fade-leave-to { opacity: 0; }

/* ══════════════════════════════════
   ANIMACIONES DE ENTRADA
   ══════════════════════════════════ */
.fade-up {
  animation: fadeUp 0.55s ease both;
  animation-delay: var(--d, 0s);
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0);    }
}

/* ══════════════════════════════════
   RESPONSIVE — pantallas anchas
   ══════════════════════════════════ */
@media (min-width: 640px) {
  .hero { min-height: 380px; }
  .hero-title { font-size: 2rem; }
  .app-icon-wrap { width: 100px; height: 100px; }
}
@media (min-width: 960px) {
  .hero { min-height: 440px; }
  .hero-title { font-size: 2.3rem; }
}
</style>
