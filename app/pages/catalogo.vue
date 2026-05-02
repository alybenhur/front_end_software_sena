<template>
  <div class="catalog-page">

    <!-- ══════════════════════════════════════
         CARRUSEL DE IMÁGENES
         ══════════════════════════════════════ -->
    <div
      class="carousel"
      @mouseenter="pauseCarousel"
      @mouseleave="resumeCarousel"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <!-- Track deslizante -->
      <div class="car-track" :style="{ transform: `translateX(-${current * 100}%)` }">
        <div v-for="(slide, i) in slides" :key="i" class="car-slide">
          <img
            :src="slide.src"
            :alt="slide.alt"
            class="car-img"
            draggable="false"
          />
          <div class="car-overlay" />
          <div v-if="slide.caption" class="car-caption">
            <span class="car-caption-text">{{ slide.caption }}</span>
          </div>
        </div>
      </div>

      <!-- Barra de progreso -->
      <div class="car-progress">
        <div
          class="car-progress-fill"
          :key="`prog-${current}`"
          :style="{ animationDuration: AUTOPLAY + 'ms' }"
        />
      </div>

      <!-- Botón anterior -->
      <button class="car-btn car-btn-l" @click="prev" aria-label="Imagen anterior">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <!-- Botón siguiente -->
      <button class="car-btn car-btn-r" @click="next" aria-label="Imagen siguiente">
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <!-- Dots -->
      <div class="car-dots" role="tablist" aria-label="Slides">
        <button
          v-for="(_, i) in slides"
          :key="i"
          role="tab"
          class="car-dot"
          :class="{ 'car-dot--active': i === current }"
          :aria-selected="i === current"
          :aria-label="`Ir a imagen ${i + 1}`"
          @click="goTo(i)"
        />
      </div>

      <!-- Contador -->
      <div class="car-counter" aria-live="polite">
        <span class="car-counter-cur">{{ current + 1 }}</span>
        <span class="car-counter-sep">/</span>
        <span class="car-counter-total">{{ slides.length }}</span>
      </div>

      <!-- Badge -->
      <div class="car-badge">
        <span class="car-badge-dot" />
        SENA · Catálogo
      </div>

      <!-- Título superpuesto -->
      <div class="car-hero-text">
        <h1 class="car-hero-title">Catálogo de Software</h1>
        <p class="car-hero-sub">Explora aplicaciones desarrolladas en el SENA</p>
      </div>
    </div>
    <!-- ══ FIN CARRUSEL ══ -->

    <!-- ── Barra de búsqueda fija ── -->
    <div class="search-strip">
      <v-container>
        <div class="search-bar-wrap">
          <v-text-field
            v-model="searchTag"
            placeholder="Buscar por etiqueta: web, mobile, backend…"
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            density="comfortable"
            clearable
            hide-details
            rounded="xl"
            class="search-field"
            bg-color="white"
            @keyup.enter="fetchSoftware"
            @click:clear="clearSearch"
          />
        </div>
      </v-container>
    </div>

    <!-- ── Cuerpo ── -->
    <div class="catalog-body">

      <!-- Cargando -->
      <div v-if="loading" class="d-flex justify-center align-center py-20">
        <v-progress-circular indeterminate color="teal-darken-2" size="60" />
      </div>

      <!-- Error -->
      <v-container v-else-if="error" class="py-8">
        <v-alert type="error" variant="tonal" rounded="xl">{{ error }}</v-alert>
      </v-container>

      <!-- Sin resultados -->
      <div v-else-if="softwareList.length === 0" class="text-center py-20">
        <v-icon size="80" color="grey-lighten-2">mdi-package-variant-remove</v-icon>
        <p class="text-h6 text-medium-emphasis mt-4">No se encontraron resultados</p>
        <v-btn variant="text" color="teal-darken-2" class="mt-2" @click="clearSearch">
          Ver todos
        </v-btn>
      </div>

      <template v-else>

        <!-- ① CARTA EDITORIAL DESTACADA -->
        <v-container v-if="!searchTag" class="pt-10 pb-4">
          <div class="section-eyebrow">DESTACADO</div>
          <h2 class="section-title">Software del día</h2>

          <div
            class="editorial-card slide-up"
            style="--delay: 0.05s"
            :style="{ cursor: 'pointer' }"
            @click="navigateTo(`/software/${softwareList[0].id}`)"
          >
            <v-img
              :src="getCover(softwareList[0]) || ''"
              :lazy-src="getCover(softwareList[0]) || ''"
              cover
              height="360"
              class="editorial-img"
            >
              <template #error>
                <div class="editorial-fallback" :style="{ background: fallbackGradient(softwareList[0]) }" />
              </template>
            </v-img>

            <div class="editorial-overlay">
              <v-chip class="editorial-tag mb-3" size="x-small" label>
                {{ getFirstTag(softwareList[0]) || 'SOFTWARE' }}
              </v-chip>
              <h3 class="editorial-title">{{ softwareList[0].nombre }}</h3>
              <p class="editorial-desc">
                {{ softwareList[0].descripcion || 'Aplicación desarrollada en el SENA.' }}
              </p>
              <div class="d-flex align-center justify-space-between mt-4">
                <div class="d-flex align-center">
                  <v-rating
                    :model-value="parseFloat(softwareList[0].valoracion) || 0"
                    readonly density="compact" color="amber" size="small" half-increments
                  />
                  <span class="text-caption ml-2" style="color:rgba(255,255,255,0.8)">
                    {{ parseFloat(softwareList[0].valoracion) || 0 }}/5
                  </span>
                </div>
                <v-btn class="ver-btn" rounded="xl" size="small">
                  <v-icon start size="14">mdi-eye-outline</v-icon>
                  Ver
                </v-btn>
              </div>
            </div>
          </div>
        </v-container>

        <!-- ② GRID COMPLETO -->
        <v-container class="py-8">
          <div class="d-flex align-center justify-space-between mb-1">
            <div>
              <div class="section-eyebrow">{{ searchTag ? 'BÚSQUEDA' : 'CATÁLOGO' }}</div>
              <h2 class="section-title-sm">
                {{ searchTag ? `"${searchTag}"` : 'Todos los programas' }}
                <span class="count-badge">{{ softwareList.length }}</span>
              </h2>
            </div>
            <v-btn
              v-if="searchTag"
              variant="text" size="small" color="teal-darken-2" rounded="lg"
              @click="clearSearch"
            >
              Ver todos
            </v-btn>
          </div>

          <v-row class="mt-2">
            <v-col
              v-for="(item, idx) in softwareList"
              :key="item.id"
              cols="12" sm="6" md="4" lg="3"
              class="slide-up"
              :style="{ '--delay': (idx * 0.05) + 's' }"
            >
              <SoftwareCard :software="item" />
            </v-col>
          </v-row>
        </v-container>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'default' })

// ═══════════════════════════════════════════════
//  CARRUSEL — Agrega tus imágenes aquí
//  Coloca los archivos en: /public/carousel/
//  Ejemplo: { src: '/carousel/mi-foto.jpg', alt: 'Descripción', caption: 'Texto opcional' }
// ═══════════════════════════════════════════════
const slides = [
  { src: '/carousel/sena1.jpg', alt: 'SENA imagen 1', caption: '' },
  { src: '/carousel/sena2.jpg', alt: 'SENA imagen 2', caption: '' },
  { src: '/carousel/sena3.jpg', alt: 'SENA imagen 3', caption: '' },
]

const AUTOPLAY = 5000
const current  = ref(0)
let   timer: ReturnType<typeof setInterval> | null = null
let   touchStartX = 0

function next()  { current.value = (current.value + 1) % slides.length }
function prev()  { current.value = (current.value - 1 + slides.length) % slides.length; startTimer() }
function goTo(i: number) { current.value = i; startTimer() }

function startTimer() {
  if (timer) clearInterval(timer)
  timer = setInterval(next, AUTOPLAY)
}
function pauseCarousel()  { if (timer) { clearInterval(timer); timer = null } }
function resumeCarousel() { startTimer() }

function onTouchStart(e: TouchEvent) { touchStartX = e.touches[0].clientX }
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 40) { dx < 0 ? next() : prev() }
}

// ═══════════════════════════════════════════════
//  CATÁLOGO
// ═══════════════════════════════════════════════
const api          = useApi()
const searchTag    = ref('')
const softwareList = ref<any[]>([])
const loading      = ref(false)
const error        = ref('')

const gradients = [
  'linear-gradient(135deg, #004D40, #00796B)',
  'linear-gradient(135deg, #1A237E, #283593)',
  'linear-gradient(135deg, #1B5E20, #388E3C)',
  'linear-gradient(135deg, #311B92, #512DA8)',
  'linear-gradient(135deg, #880E4F, #C2185B)',
  'linear-gradient(135deg, #E65100, #F57C00)',
]

function fallbackGradient(item: any) {
  return gradients[(item.id || 0) % gradients.length]
}
function getCover(item: any) {
  const url = item?.urlImagen
  if (!url) return null
  return url.split(',')[0].trim()
}
function getFirstTag(item: any) {
  const t = item?.tags
  if (!t) return ''
  return t.split(',')[0].trim()
}

async function fetchSoftware() {
  loading.value = true
  error.value   = ''
  try {
    softwareList.value = searchTag.value?.trim()
      ? await api.get<any[]>('/software/search', { tag: searchTag.value.trim() })
      : await api.get<any[]>('/software')
  } catch (e: any) {
    error.value = e.message || 'Error al cargar el catálogo'
  } finally {
    loading.value = false
  }
}

function clearSearch() {
  searchTag.value = ''
  fetchSoftware()
}

onMounted(() => {
  startTimer()
  fetchSoftware()
})

onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
/* ── Página ── */
.catalog-page {
  background: #F2F2F7;
  min-height: 100vh;
}

/* ════════════════════════════════
   CARRUSEL (idéntico a noticias)
   ════════════════════════════════ */
.carousel {
  position: relative;
  width: 100%;
  height: 440px;
  overflow: hidden;
  background: #0d110d;
  cursor: grab;
}
.carousel:active { cursor: grabbing; }

@media (max-width: 768px) { .carousel { height: 300px; } }
@media (max-width: 480px) { .carousel { height: 220px; } }

.car-track {
  display: flex;
  height: 100%;
  transition: transform 0.70s cubic-bezier(0.77, 0, 0.175, 1);
  will-change: transform;
}
.car-slide {
  flex: 0 0 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.car-img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
  animation: kenBurns 8s ease-in-out infinite alternate;
}
@keyframes kenBurns {
  from { transform: scale(1.00); }
  to   { transform: scale(1.06); }
}
.car-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top,  rgba(0,0,0,0.72) 0%,  rgba(0,0,0,0.25) 45%, transparent 65%),
    linear-gradient(to right, rgba(0,0,0,0.20) 0%, transparent 30%);
  pointer-events: none;
}
.car-caption {
  position: absolute;
  bottom: 44px; left: 0; right: 0;
  padding: 0 80px 0 24px;
  z-index: 5;
}
.car-caption-text {
  display: inline-block;
  font-size: 0.82rem; font-weight: 600;
  color: rgba(255,255,255,0.88);
  background: rgba(0,0,0,0.32);
  backdrop-filter: blur(6px);
  padding: 5px 12px; border-radius: 6px;
  border-left: 3px solid #39A900;
}

/* Título superpuesto */
.car-hero-text {
  position: absolute;
  bottom: 52px;
  left: 0; right: 0;
  text-align: center;
  z-index: 6;
  pointer-events: none;
  padding: 0 24px;
}
.car-hero-title {
  font-size: 2.2rem;
  font-weight: 900;
  color: white;
  letter-spacing: -0.02em;
  line-height: 1.1;
  text-shadow: 0 2px 20px rgba(0,0,0,0.5);
  margin-bottom: 6px;
}
.car-hero-sub {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.80);
  font-weight: 500;
  text-shadow: 0 1px 8px rgba(0,0,0,0.4);
}
@media (max-width: 480px) {
  .car-hero-title { font-size: 1.4rem; }
  .car-hero-sub   { font-size: 0.8rem; }
}

/* Progreso */
.car-progress {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: rgba(255,255,255,0.15);
  z-index: 20;
  overflow: hidden;
}
.car-progress-fill {
  height: 100%; width: 0;
  background: linear-gradient(90deg, #2A7A00 0%, #39A900 50%, #5CCB00 100%);
  animation: carProg linear forwards;
  box-shadow: 0 0 8px rgba(57,169,0,0.8);
}
@keyframes carProg {
  from { width: 0%; }
  to   { width: 100%; }
}

/* Botones */
.car-btn {
  position: absolute;
  top: 50%; transform: translateY(-50%);
  z-index: 15;
  width: 48px; height: 48px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
  border: 1.5px solid rgba(255,255,255,0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: white;
  transition: background 0.22s, border-color 0.22s, transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s;
}
.car-btn:hover {
  background: rgba(57,169,0,0.72);
  border-color: rgba(57,169,0,0.55);
  transform: translateY(-50%) scale(1.12);
  box-shadow: 0 0 20px rgba(57,169,0,0.5);
}
.car-btn:active { transform: translateY(-50%) scale(0.95); }
.car-btn-l { left: 20px; }
.car-btn-r { right: 20px; }

@media (max-width: 480px) {
  .car-btn { width: 38px; height: 38px; }
  .car-btn-l { left: 10px; }
  .car-btn-r { right: 10px; }
}

/* Dots */
.car-dots {
  position: absolute;
  bottom: 18px; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: 6px;
  z-index: 15;
}
.car-dot {
  width: 7px; height: 7px;
  border-radius: 4px;
  background: rgba(255,255,255,0.40);
  border: none; cursor: pointer; padding: 0;
  transition: all 0.38s cubic-bezier(0.16,1,0.3,1);
  flex-shrink: 0;
}
.car-dot--active {
  background: #39A900; width: 28px;
  box-shadow: 0 0 12px rgba(57,169,0,0.75), 0 0 4px rgba(57,169,0,0.5);
}
.car-dot:hover:not(.car-dot--active) {
  background: rgba(255,255,255,0.75);
  transform: scale(1.25);
}

/* Contador */
.car-counter {
  position: absolute;
  top: 16px; right: 20px;
  z-index: 15;
  display: flex; align-items: baseline; gap: 3px;
  background: rgba(0,0,0,0.36);
  backdrop-filter: blur(10px);
  padding: 5px 12px; border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.14);
}
.car-counter-cur  { font-size: 0.9rem; font-weight: 800; color: #39A900; line-height: 1; }
.car-counter-sep  { font-size: 0.7rem; color: rgba(255,255,255,0.45); margin: 0 1px; }
.car-counter-total{ font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.65); line-height: 1; }

/* Badge */
.car-badge {
  position: absolute;
  top: 16px; left: 20px;
  z-index: 15;
  display: flex; align-items: center; gap: 7px;
  background: rgba(0,0,0,0.36);
  backdrop-filter: blur(10px);
  padding: 5px 14px; border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.14);
  font-size: 0.7rem; font-weight: 700;
  color: rgba(255,255,255,0.85);
  letter-spacing: 0.08em; text-transform: uppercase;
}
.car-badge-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #39A900; box-shadow: 0 0 6px #39A900;
  animation: bdot 2s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes bdot {
  0%,100% { box-shadow: 0 0 6px rgba(57,169,0,0.8); }
  50%      { box-shadow: 0 0 12px rgba(57,169,0,0.4); opacity: 0.6; }
}

/* ════════════════════════════════
   SEARCH STRIP
   ════════════════════════════════ */
.search-strip {
  background: white;
  padding: 14px 0;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}
.search-bar-wrap {
  max-width: 520px;
  margin: 0 auto;
}

/* ════════════════════════════════
   CATÁLOGO BODY (sin cambios)
   ════════════════════════════════ */
.catalog-body { background: #F2F2F7; }

.section-eyebrow {
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.1em; color: #00796B;
  margin-bottom: 4px; text-transform: uppercase;
}
.section-title {
  font-size: 1.75rem; font-weight: 800;
  color: #1C1C1E; margin-bottom: 20px; letter-spacing: -0.02em;
}
.section-title-sm {
  font-size: 1.35rem; font-weight: 800;
  color: #1C1C1E; margin-bottom: 0; letter-spacing: -0.01em;
  display: flex; align-items: center; gap: 8px;
}
.count-badge {
  font-size: 0.75rem; font-weight: 600; color: #8E8E93;
  background: rgba(0,0,0,0.07); padding: 2px 8px; border-radius: 10px;
}

.editorial-card {
  position: relative; border-radius: 22px; overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.16);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 360px; background: #1C1C1E;
}
.editorial-card:hover {
  transform: scale(1.012);
  box-shadow: 0 16px 48px rgba(0,0,0,0.22);
}
.editorial-img { position: absolute !important; inset: 0; height: 100% !important; }
.editorial-fallback { position: absolute; inset: 0; }
.editorial-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0) 100%);
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 28px 32px; z-index: 1;
}
.editorial-tag {
  background: rgba(255,255,255,0.22) !important; color: white !important;
  font-size: 10px !important; font-weight: 700 !important;
  letter-spacing: 0.08em !important; border: 1px solid rgba(255,255,255,0.35) !important;
  backdrop-filter: blur(4px); align-self: flex-start;
}
.editorial-title {
  font-size: 1.7rem; font-weight: 800; color: white;
  line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 8px;
}
.editorial-desc {
  color: rgba(255,255,255,0.72); font-size: 0.875rem; line-height: 1.45;
  overflow: hidden; display: -webkit-box;
  -webkit-line-clamp: 2; -webkit-box-orient: vertical; margin: 0;
}
.ver-btn {
  background: rgba(255,255,255,0.22) !important; color: white !important;
  border: 1px solid rgba(255,255,255,0.4) !important;
  font-weight: 600 !important; font-size: 0.8rem !important;
  backdrop-filter: blur(6px); transition: background 0.2s !important;
}
.ver-btn:hover { background: rgba(255,255,255,0.32) !important; }

.slide-up {
  animation: fadeSlideUp 0.55s ease both;
  animation-delay: var(--delay, 0s);
}
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0);    }
}
</style>
