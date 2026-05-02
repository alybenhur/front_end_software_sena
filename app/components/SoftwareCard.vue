<template>
  <div class="store-card" @click="navigateTo(`/software/${software.id}`)">

    <!-- Imagen / Icono de la app -->
    <div class="card-img-wrapper">
      <v-img
        v-if="coverImage"
        :src="coverImage"
        contain
        width="100%"
        height="160"
        class="card-img"
      >
        <template #placeholder>
          <div class="card-img-fallback" :style="{ background: fallbackGradient }" />
        </template>
        <template #error>
          <div class="card-img-fallback" :style="{ background: fallbackGradient }">
            <span class="fallback-letter">{{ software.nombre?.[0]?.toUpperCase() }}</span>
          </div>
        </template>
      </v-img>
      <div v-else class="card-img-fallback" :style="{ background: fallbackGradient }">
        <span class="fallback-letter">{{ software.nombre?.[0]?.toUpperCase() }}</span>
      </div>
    </div>

    <!-- Contenido -->
    <div class="card-body">

      <!-- Tag de categoría -->
      <p v-if="firstTag" class="card-category">{{ firstTag }}</p>

      <!-- Nombre -->
      <p class="card-name">{{ software.nombre }}</p>

      <!-- Descripción -->
      <p class="card-desc">
        {{ software.descripcion || 'Aplicación desarrollada en el SENA.' }}
      </p>

      <!-- Tags chips -->
      <div v-if="tags.length" class="card-tags">
        <span
          v-for="tag in tags"
          :key="tag"
          class="tag-chip"
        >{{ tag }}</span>
      </div>
    </div>

    <!-- Footer: rating + botón -->
    <div class="card-footer">
      <div class="d-flex align-center">
        <v-icon size="13" color="amber-darken-1">mdi-star</v-icon>
        <span class="rating-text ml-1">{{ ratingValue }}</span>
      </div>
      <div class="get-pill">VER</div>
    </div>

  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ software: any }>()

const ratingValue = computed(() => parseFloat(props.software?.valoracion) || 0)

const coverImage = computed(() => {
  const url = props.software?.urlImagen
  if (!url) return null
  return url.split(',')[0].trim()
})

const tags = computed(() => {
  const t = props.software?.tags
  if (!t) return []
  return t.split(',').map((s: string) => s.trim()).filter(Boolean).slice(0, 3)
})

const firstTag = computed(() => tags.value[0] || '')

const gradients = [
  'linear-gradient(135deg, #004D40, #00796B)',
  'linear-gradient(135deg, #1A237E, #283593)',
  'linear-gradient(135deg, #1B5E20, #388E3C)',
  'linear-gradient(135deg, #311B92, #512DA8)',
  'linear-gradient(135deg, #880E4F, #C2185B)',
  'linear-gradient(135deg, #E65100, #F57C00)',
]

const fallbackGradient = computed(() => {
  const idx = (props.software?.id || 0) % gradients.length
  return gradients[idx]
})
</script>

<style scoped>
/* ── Tarjeta estilo Apple App Store ── */
.store-card {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.store-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.13);
}

/* ── Imagen / Icono ── */
.card-img-wrapper {
  width: 100%;
  height: 160px;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  background: linear-gradient(180deg, #FAFAFA 0%, #F2F2F7 100%);
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-img {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.card-img :deep(.v-img__img) {
  object-fit: contain !important;
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
}
.store-card:hover .card-img :deep(.v-img__img) {
  transform: scale(1.05);
}
.card-img-fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fallback-letter {
  font-size: 3rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1;
}

/* ── Cuerpo ── */
.card-body {
  padding: 14px 16px 8px;
  flex: 1;
}

.card-category {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: #00796B;
  text-transform: uppercase;
  margin: 0 0 4px;
}

.card-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1C1C1E;
  margin: 0 0 6px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  letter-spacing: -0.01em;
}

.card-desc {
  font-size: 0.78rem;
  color: #8E8E93;
  line-height: 1.45;
  margin: 0 0 10px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* ── Tags chips ── */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 4px;
}
.tag-chip {
  font-size: 10px;
  font-weight: 600;
  color: #00695C;
  background: rgba(0, 105, 92, 0.09);
  padding: 2px 9px;
  border-radius: 8px;
  letter-spacing: 0.02em;
}

/* ── Footer ── */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.rating-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #8E8E93;
}

/* Botón "GET" estilo Apple */
.get-pill {
  font-size: 0.72rem;
  font-weight: 700;
  color: #00796B;
  background: rgba(0, 121, 107, 0.1);
  padding: 4px 16px;
  border-radius: 12px;
  letter-spacing: 0.05em;
  transition: background 0.2s;
}
.store-card:hover .get-pill {
  background: rgba(0, 121, 107, 0.18);
}
</style>
