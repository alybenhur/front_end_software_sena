<template>
  <div>

    <!-- ── Cabecera ── -->
    <div class="page-header fade-up" style="--d:0s">
      <div>
        <h1 class="page-title">Catálogo de Software</h1>
        <p class="page-sub">Explora las aplicaciones desarrolladas en el SENA</p>
      </div>
    </div>

    <!-- ── Buscador ── -->
    <div class="search-box fade-up" style="--d:0.08s">
      <div class="search-inner">
        <v-icon size="17" color="#8E8E93">mdi-magnify</v-icon>
        <input
          v-model="searchTag"
          type="text"
          class="search-input"
          placeholder="Buscar por etiqueta o nombre..."
          @keyup.enter="fetchSoftware"
        />
        <button v-if="searchTag" class="search-clear" @click="clearSearch">
          <v-icon size="14" color="#8E8E93">mdi-close</v-icon>
        </button>
      </div>
      <button class="search-btn" @click="fetchSoftware">Buscar</button>
    </div>

    <!-- ── Loading ── -->
    <div v-if="loading" class="cards-grid">
      <div v-for="n in 8" :key="n" class="card-skeleton" />
    </div>

    <!-- ── Empty ── -->
    <div v-else-if="softwareList.length === 0" class="empty-state fade-up" style="--d:0.12s">
      <v-icon size="56" color="#C7C7CC">mdi-package-variant-remove</v-icon>
      <p class="empty-title">No hay resultados</p>
      <p class="empty-sub">Prueba con otra etiqueta o elimina el filtro</p>
    </div>

    <!-- ── Grid de tarjetas ── -->
    <div v-else class="cards-grid">
      <div
        v-for="(item, i) in softwareList"
        :key="item.id"
        class="fade-up"
        :style="`--d:${0.06 + (i % 8) * 0.04}s`"
      >
        <SoftwareCard :software="item" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const api = useApi()
const searchTag = ref('')
const softwareList = ref<any[]>([])
const loading = ref(false)

async function fetchSoftware() {
  loading.value = true
  try {
    if (searchTag.value?.trim()) {
      softwareList.value = await api.get<any[]>('/software/search', { tag: searchTag.value.trim() })
    } else {
      softwareList.value = await api.get<any[]>('/software')
    }
  } finally {
    loading.value = false
  }
}

function clearSearch() {
  searchTag.value = ''
  fetchSoftware()
}

onMounted(fetchSoftware)
</script>

<style scoped>
/* Header */
.page-header { margin-bottom: 20px; }
.page-title { font-size: 1.4rem; font-weight: 900; color: #1C1C1E; letter-spacing: -0.02em; margin: 0 0 4px; }
.page-sub { font-size: 0.82rem; color: #8E8E93; margin: 0; }

/* Search */
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  max-width: 560px;
}
.search-inner {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.10);
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: border-color 0.18s, box-shadow 0.18s;
}
.search-inner:focus-within {
  border-color: rgba(0, 121, 107, 0.45);
  box-shadow: 0 0 0 3px rgba(0, 121, 107, 0.10);
}
.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 0.87rem;
  color: #1C1C1E;
}
.search-input::placeholder { color: #8E8E93; }
.search-clear { background: none; border: none; cursor: pointer; padding: 0; display: flex; }
.search-btn {
  padding: 10px 20px;
  background: linear-gradient(90deg, #004D40, #00796B);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 77, 64, 0.30);
  transition: transform 0.15s, box-shadow 0.15s;
  white-space: nowrap;
}
.search-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 14px rgba(0, 77, 64, 0.38); }

/* Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

/* Skeleton */
.card-skeleton {
  height: 280px;
  border-radius: 18px;
  background: linear-gradient(90deg, #EAEAEA 25%, #D8D8D8 50%, #EAEAEA 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

/* Empty */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 16px;
  gap: 8px;
}
.empty-title { font-size: 1rem; font-weight: 700; color: #1C1C1E; margin: 0; }
.empty-sub { font-size: 0.82rem; color: #8E8E93; margin: 0; }

/* Animations */
.fade-up { animation: fadeUp 0.5s ease both; animation-delay: var(--d, 0s); }
@keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
</style>
