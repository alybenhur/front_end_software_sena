<template>
  <div class="noticias-page">

    <!-- Franja Colombia -->
    <div class="colombia-stripe" aria-hidden="true">
      <div /><div /><div />
    </div>

    <!-- ════════════════════════════════
         CARRUSEL DINÁMICO (top 5 noticias)
         ════════════════════════════════ -->
    <section class="carousel-section">
      <transition name="bg-fade">
        <div
          v-if="carouselNoticias.length > 0"
          :key="`bg-${currentSlide}`"
          class="carousel-bg"
          :style="getCoverStyle(carouselNoticias[currentSlide])"
        />
        <div v-else key="bg-default" class="carousel-bg carousel-bg--default" />
      </transition>
      <div class="carousel-overlay" />

      <transition name="content-slide" mode="out-in">
        <div
          v-if="carouselNoticias.length > 0"
          :key="`txt-${currentSlide}`"
          class="carousel-text"
        >
          <p class="carousel-label">
            {{ carouselNoticias[currentSlide].categoria || 'SENA · NOTICIAS' }}
          </p>
          <h1 class="carousel-title">{{ carouselNoticias[currentSlide].titulo }}</h1>
          <NuxtLink
            :to="`/noticias/${carouselNoticias[currentSlide].id}`"
            class="carousel-btn"
          >
            CONOCE MÁS
          </NuxtLink>
        </div>
      </transition>

      <button
        v-if="carouselNoticias.length > 1"
        class="carousel-arrow carousel-arrow--left"
        aria-label="Anterior"
        @click="prevSlide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        v-if="carouselNoticias.length > 1"
        class="carousel-arrow carousel-arrow--right"
        aria-label="Siguiente"
        @click="nextSlide"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div v-if="carouselNoticias.length > 1" class="carousel-dots">
        <button
          v-for="(_, i) in carouselNoticias"
          :key="i"
          class="carousel-dot"
          :class="{ active: i === currentSlide }"
          :aria-label="`Ir a slide ${i + 1}`"
          @click="goToSlide(i)"
        />
      </div>
    </section>

    <!-- ════════════════════════════════
         GRID DE NOTICIAS
         ════════════════════════════════ -->
    <section class="grid-section">
      <div class="grid-container">

        <!-- Cargando -->
        <div v-if="loading" class="loading-wrap">
          <div class="spinner" />
          <p>Cargando noticias...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="empty-wrap">
          <p>{{ error }}</p>
        </div>

        <!-- Sin resultados -->
        <div v-else-if="noticias.length === 0" class="empty-wrap">
          <p>No hay noticias publicadas aún</p>
        </div>

        <!-- Layout principal -->
        <div v-else class="news-layout">

          <!-- Sidebar de tabs -->
          <aside class="news-sidebar">
            <button
              class="sidebar-tab"
              :class="{ active: activeTab === 'latest' }"
              @click="activeTab = 'latest'"
            >
              LO ÚLTIMO
            </button>
            <button
              class="sidebar-tab"
              :class="{ active: activeTab === 'regionales' }"
              @click="activeTab = 'regionales'"
            >
              REGIONALES
            </button>
          </aside>

          <!-- Grid noticias destacadas -->
          <div class="news-featured">

            <!-- Card GRANDE -->
            <NuxtLink
              v-if="filteredNoticias[0]"
              :to="`/noticias/${filteredNoticias[0].id}`"
              class="card-large"
              :style="getCoverStyle(filteredNoticias[0])"
            >
              <div class="card-large-overlay" />
              <div class="card-large-body">
                <h2 class="card-large-title">{{ filteredNoticias[0].titulo }}</h2>
                <span class="sena-tag">+ Innovación y Tech</span>
              </div>
            </NuxtLink>

            <!-- Columna derecha -->
            <div class="right-col">
              <!-- Cards medianas (2ª y 3ª) -->
              <div class="mid-col">
                <NuxtLink
                  v-for="n in filteredNoticias.slice(1, 3)"
                  :key="n.id"
                  :to="`/noticias/${n.id}`"
                  class="card-medium"
                >
                  <div class="card-medium-img-wrap">
                    <img
                      :src="getCover(n) || 'https://placehold.co/400x220/1B6B3A/fff?text=SENA'"
                      :alt="n.titulo"
                      class="card-medium-img"
                    />
                    <div class="card-medium-overlay">
                      <h3 class="card-medium-title">{{ n.titulo }}</h3>
                      <span class="sena-tag">+ Innovación y Tech</span>
                    </div>
                  </div>
                </NuxtLink>
              </div>

              <!-- Cards de texto (4ª y 5ª) -->
              <div class="text-col">
                <NuxtLink
                  v-for="n in filteredNoticias.slice(3, 5)"
                  :key="n.id"
                  :to="`/noticias/${n.id}`"
                  class="card-text"
                >
                  <h3 class="card-text-title">{{ n.titulo }}</h3>
                  <span class="sena-tag">+ Innovación y Tech</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Resto de noticias (a partir de la 6ª) -->
        <div v-if="!loading && filteredNoticias.length > 5" class="more-news">
          <div class="more-news-header">
            <span class="more-bar" />
            <span class="more-title">TODAS LAS NOTICIAS</span>
            <span class="more-line" />
          </div>
          <div class="more-grid">
            <NuxtLink
              v-for="n in filteredNoticias.slice(5)"
              :key="n.id"
              :to="`/noticias/${n.id}`"
              class="card-medium"
            >
              <div class="card-medium-img-wrap">
                <img
                  :src="getCover(n) || 'https://placehold.co/400x220/1B6B3A/fff?text=SENA'"
                  :alt="n.titulo"
                  class="card-medium-img"
                />
                <div class="card-medium-overlay">
                  <h3 class="card-medium-title">{{ n.titulo }}</h3>
                  <span class="sena-tag">{{ formatDate(n.fechaCreacion) }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'default' })

const api = useApi()
const noticias = ref<any[]>([])
const loading = ref(false)
const error = ref('')
const currentSlide = ref(0)
const activeTab = ref<'latest' | 'regionales'>('latest')
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const carouselNoticias = computed(() => noticias.value.slice(0, 5))
const filteredNoticias = computed(() => noticias.value)

function getCover(n: any): string | null {
  const imgs = n?.imagenes
  if (!imgs) return null
  return imgs.split(',')[0].trim() || null
}

function getCoverStyle(n: any) {
  const url = getCover(n)
  return url
    ? { backgroundImage: `url('${url}')` }
    : { background: 'linear-gradient(135deg,#0d3320 0%,#1B6B3A 100%)' }
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function nextSlide() {
  if (carouselNoticias.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % carouselNoticias.value.length
  resetAutoplay()
}
function prevSlide() {
  if (carouselNoticias.value.length === 0) return
  currentSlide.value =
    (currentSlide.value - 1 + carouselNoticias.value.length) % carouselNoticias.value.length
  resetAutoplay()
}
function goToSlide(i: number) {
  currentSlide.value = i
  resetAutoplay()
}
function startAutoplay() {
  if (carouselNoticias.value.length <= 1) return
  autoplayTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % carouselNoticias.value.length
  }, 5000)
}
function resetAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer)
  startAutoplay()
}

onMounted(async () => {
  loading.value = true
  try {
    noticias.value = await api.get<any[]>('/noticias')
    startAutoplay()
  } catch (e: any) {
    error.value = e.message || 'Error al cargar noticias'
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (autoplayTimer) clearInterval(autoplayTimer)
})
</script>

<style scoped>
* { box-sizing: border-box; }

.noticias-page {
  min-height: 100vh;
  background: #111a14;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* ── Franja Colombia ── */
.colombia-stripe {
  display: flex;
  height: 4px;
}
.colombia-stripe div:nth-child(1) { background: #FCD116; flex: 2; }
.colombia-stripe div:nth-child(2) { background: #003087; flex: 1; }
.colombia-stripe div:nth-child(3) { background: #CE1126; flex: 1; }

/* ── CARRUSEL ── */
.carousel-section {
  position: relative;
  width: 100%;
  height: 420px;
  overflow: hidden;
  background: #0a2a16;
}

.carousel-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  animation: ken-burns 8s ease-out forwards;
}
.carousel-bg--default {
  background: linear-gradient(135deg, #0d3320 0%, #1B6B3A 60%, #0a2a16 100%);
}

@keyframes ken-burns {
  from { transform: scale(1.04); }
  to   { transform: scale(1.0); }
}

.bg-fade-enter-active { transition: opacity 0.9s ease; position: absolute; inset: 0; z-index: 2; }
.bg-fade-leave-active { transition: opacity 0.9s ease; position: absolute; inset: 0; z-index: 1; }
.bg-fade-enter-from, .bg-fade-leave-to { opacity: 0; }

.carousel-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.1) 100%);
  z-index: 3;
}

.carousel-text {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  max-width: 560px;
  padding: 0 56px 60px;
}

.content-slide-enter-active { transition: opacity 0.45s ease, transform 0.45s ease; }
.content-slide-leave-active { transition: opacity 0.3s ease; }
.content-slide-enter-from   { opacity: 0; transform: translateY(16px); }
.content-slide-leave-to     { opacity: 0; }

.carousel-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.75);
  margin: 0 0 10px;
}

.carousel-title {
  font-size: clamp(1.4rem, 3vw, 2.1rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.25;
  margin: 0 0 20px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.carousel-btn {
  display: inline-block;
  padding: 10px 26px;
  background: #2E8B57;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  border-radius: 6px;
  text-decoration: none;
  transition: background 0.22s, transform 0.2s;
  border: 1.5px solid #3cb869;
}
.carousel-btn:hover { background: #1B6B3A; transform: translateY(-2px); }

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.14);
  backdrop-filter: blur(6px);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.carousel-arrow:hover { background: rgba(255,255,255,0.28); }
.carousel-arrow--left  { left: 16px; }
.carousel-arrow--right { right: 16px; }

.carousel-dots {
  position: absolute;
  bottom: 18px;
  left: 56px;
  display: flex;
  gap: 7px;
  z-index: 10;
}
.carousel-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.55);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: all 0.25s;
}
.carousel-dot.active { background: #fff; border-color: #fff; transform: scale(1.3); }

/* ── GRID SECTION ── */
.grid-section {
  background: #111a14;
  padding: 32px 16px 48px;
}

.grid-container { max-width: 1200px; margin: 0 auto; }

.news-layout {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 20px;
  align-items: start;
}

/* Sidebar */
.news-sidebar { display: flex; flex-direction: column; gap: 4px; padding-top: 4px; }
.sidebar-tab {
  background: none;
  border: none;
  border-left: 3px solid transparent;
  padding: 10px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
  cursor: pointer;
  text-align: left;
  transition: color 0.2s, border-color 0.2s;
}
.sidebar-tab.active { color: #4cdf80; border-left-color: #4cdf80; }
.sidebar-tab:hover  { color: #4cdf80; }

/* Featured grid */
.news-featured {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 10px;
  min-height: 360px;
}

/* Card GRANDE */
.card-large {
  position: relative;
  display: block;
  border-radius: 10px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  text-decoration: none;
  min-height: 360px;
  transition: transform 0.28s;
}
.card-large:hover { transform: scale(1.01); }

.card-large-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 55%, transparent 100%);
}

.card-large-body {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 18px; z-index: 2;
}

.card-large-title {
  font-size: 16px; font-weight: 800; color: #fff;
  line-height: 1.3; margin: 0 0 6px;
  text-shadow: 0 2px 6px rgba(0,0,0,0.5);
}

/* Columna derecha */
.right-col { display: flex; flex-direction: column; gap: 10px; }

/* Cards medianas */
.mid-col { display: flex; flex-direction: column; gap: 8px; flex: 1; }

.card-medium {
  display: block;
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
  flex: 1;
  transition: transform 0.24s;
  position: relative;
}
.card-medium:hover { transform: translateY(-2px); }

.card-medium-img-wrap {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.card-medium-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}
.card-medium:hover .card-medium-img { transform: scale(1.05); }

.card-medium-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%);
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 12px;
}

.card-medium-title {
  font-size: 13px; font-weight: 700; color: #fff;
  line-height: 1.35; margin: 0 0 4px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

/* Cards de texto */
.text-col { display: flex; flex-direction: column; gap: 8px; }

.card-text {
  display: flex; flex-direction: column; gap: 5px;
  padding: 14px 16px;
  background: #1a2b1f;
  border-radius: 10px;
  text-decoration: none;
  flex: 1;
  border-left: 3px solid #2E8B57;
  transition: background 0.22s, transform 0.22s;
}
.card-text:hover { background: #1f3326; transform: translateY(-2px); }

.card-text-title {
  font-size: 13px; font-weight: 700; color: #e8f5e9;
  line-height: 1.4; margin: 0;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}

/* Tag */
.sena-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  color: #4cdf80;
}

/* Sección "todas las noticias" */
.more-news { margin-top: 40px; }
.more-news-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}
.more-bar {
  width: 4px; height: 22px;
  background: #4cdf80;
  border-radius: 2px;
}
.more-title {
  color: #4cdf80;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}
.more-line {
  flex: 1;
  height: 1px;
  background: rgba(76, 223, 128, 0.18);
}
.more-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

/* Loading / Empty */
.loading-wrap {
  display: flex; flex-direction: column; align-items: center; gap: 14px;
  padding: 60px 0; color: #6b8f71;
}
.spinner {
  width: 40px; height: 40px;
  border: 3px solid #1f3326;
  border-top-color: #4cdf80;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.empty-wrap {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 60px 0; color: #6b8f71; text-align: center;
}

/* Responsive */
@media (max-width: 900px) {
  .news-featured { grid-template-columns: 1fr; }
  .right-col { display: none; }
}
@media (max-width: 680px) {
  .news-layout { grid-template-columns: 1fr; }
  .news-sidebar { flex-direction: row; padding: 0; }
  .carousel-section { height: 320px; }
  .carousel-text { padding: 0 20px 48px; }
  .carousel-arrow { display: none; }
  .carousel-dots { left: 20px; }
}
</style>
