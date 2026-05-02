<template>
  <!-- Modo compacto: imagen izquierda + texto derecha (sidebar) -->
  <v-card
    v-if="compact"
    :to="`/noticias/${noticia.id}`"
    flat
    class="compact-card"
  >
    <div class="d-flex" style="gap: 12px">
      <div class="compact-img-wrapper flex-shrink-0">
        <v-img
          :src="coverImage || 'https://placehold.co/110x82?text=Noticia'"
          width="110"
          height="82"
          cover
          class="compact-img"
        />
      </div>
      <div class="flex-grow-1">
        <p
          class="text-body-2 font-weight-bold compact-title mb-1"
          style="overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;line-height:1.4"
        >
          {{ noticia.titulo }}
        </p>
        <span class="text-caption text-medium-emphasis">
          <v-icon size="11" class="mr-1">mdi-clock-outline</v-icon>
          {{ formatDate(noticia.fechaCreacion) }}
        </span>
      </div>
    </div>
  </v-card>

  <!-- Modo estándar: imagen arriba + texto abajo (grid) -->
  <v-card
    v-else
    :to="`/noticias/${noticia.id}`"
    flat
    height="100%"
    class="d-flex flex-column grid-card"
  >
    <div class="card-img-wrapper">
      <v-img
        :src="coverImage || 'https://placehold.co/400x200?text=Noticia'"
        height="180"
        cover
        class="card-img"
      >
        <template #placeholder>
          <v-skeleton-loader type="image" />
        </template>
      </v-img>
    </div>

    <div class="pa-3 d-flex flex-column flex-grow-1">
      <p
        class="text-body-2 font-weight-bold grid-title mb-2"
        style="overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;line-height:1.4"
      >
        {{ noticia.titulo }}
      </p>
      <p
        class="text-caption text-medium-emphasis mb-3 flex-grow-1"
        style="overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical"
      >
        {{ noticia.resumen || stripHtml(noticia.contenidoTexto) }}
      </p>
      <span class="text-caption text-medium-emphasis">
        <v-icon size="12" class="mr-1">mdi-clock-outline</v-icon>
        {{ formatDate(noticia.fechaCreacion) }}
      </span>
    </div>
    <v-divider />
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{ noticia: any; compact?: boolean }>()

const coverImage = computed(() => {
  const imgs = props.noticia?.imagenes
  if (!imgs) return null
  return imgs.split(',')[0].trim()
})

function stripHtml(html: string) {
  return html?.replace(/<[^>]*>/g, '') || ''
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}
</script>

<style scoped>
/* ── Modo compacto ── */
.compact-card {
  background: transparent !important;
  cursor: pointer;
}
.compact-img-wrapper {
  overflow: hidden;
  border-radius: 6px;
}
.compact-img :deep(.v-img__img) {
  transition: transform 0.45s ease;
}
.compact-card:hover .compact-img :deep(.v-img__img) {
  transform: scale(1.09);
}
.compact-title {
  transition: color 0.18s;
}
.compact-card:hover .compact-title {
  color: #00796B;
}

/* ── Modo grid ── */
.grid-card {
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.grid-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.11) !important;
}
.card-img-wrapper {
  overflow: hidden;
  border-radius: 4px 4px 0 0;
}
.card-img :deep(.v-img__img) {
  transition: transform 0.55s ease;
}
.grid-card:hover .card-img :deep(.v-img__img) {
  transform: scale(1.07);
}
.grid-title {
  transition: color 0.18s;
}
.grid-card:hover .grid-title {
  color: #00796B;
}
</style>
