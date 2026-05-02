<template>
  <div>

    <!-- ── Cabecera ── -->
    <div class="page-header fade-up" style="--d:0s">
      <div>
        <h1 class="page-title">Mis Noticias</h1>
        <p class="page-sub">Gestiona las noticias que has creado</p>
      </div>
      <NuxtLink to="/noticias-editor/nueva" class="add-btn">
        <v-icon size="15" class="mr-1">mdi-plus</v-icon>
        Nueva noticia
      </NuxtLink>
    </div>

    <!-- ── Filtro ── -->
    <div class="filter-row fade-up" style="--d:0.07s">
      <button
        v-for="f in filters"
        :key="f.value"
        class="filter-tab"
        :class="{ 'filter-tab--active': filtroEstado === f.value }"
        @click="filtroEstado = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- ── Alerta error ── -->
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      rounded="lg"
      closable
      @click:close="error = ''"
    >
      {{ error }}
    </v-alert>

    <!-- ── Tabla ── -->
    <div class="table-card fade-up" style="--d:0.14s">

      <!-- Skeleton -->
      <div v-if="loading" class="table-loader">
        <div v-for="n in 4" :key="n" class="row-skeleton" />
      </div>

      <!-- Tabla -->
      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Estado</th>
              <th class="d-none d-md-table-cell">Fecha</th>
              <th class="th-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in noticias"
              :key="item.id"
              class="data-row"
            >
              <!-- Título -->
              <td>
                <span class="noticia-titulo">{{ item.titulo }}</span>
              </td>
              <!-- Estado -->
              <td>
                <EstadoChip :estado="item.estado" />
              </td>
              <!-- Fecha -->
              <td class="d-none d-md-table-cell">
                <span class="fecha-text">{{ formatDate(item.fechaCreacion) }}</span>
              </td>
              <!-- Acciones -->
              <td>
                <div class="actions-cell">
                  <NuxtLink
                    v-if="item.estado === 'pendiente'"
                    :to="`/noticias-editor/${item.id}/editar`"
                    class="action-btn action-edit"
                    title="Editar noticia"
                  >
                    <v-icon size="15">mdi-pencil-outline</v-icon>
                  </NuxtLink>
                  <v-tooltip
                    v-else
                    text="Solo se pueden editar noticias pendientes"
                    location="top"
                  >
                    <template #activator="{ props }">
                      <span v-bind="props" class="action-locked">
                        <v-icon size="14" color="#C7C7CC">mdi-lock-outline</v-icon>
                      </span>
                    </template>
                  </v-tooltip>
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-if="noticias.length === 0">
              <td colspan="4" class="empty-cell">
                <v-icon size="40" color="#C7C7CC">mdi-newspaper-remove</v-icon>
                <p>
                  {{ filtroEstado ? `No tienes noticias en estado "${filtroEstado}"` : 'No tienes noticias aún' }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'noticias' })

const api = useApi()
const loading = ref(false)
const noticias = ref<any[]>([])
const filtroEstado = ref('')
const error = ref('')

const filters = [
  { label: 'Todas',      value: '' },
  { label: 'Pendientes', value: 'pendiente' },
  { label: 'Aprobadas',  value: 'aprobada' },
  { label: 'Rechazadas', value: 'rechazada' },
]

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

async function fetchMisNoticias() {
  loading.value = true
  error.value = ''
  try {
    const params: Record<string, string> = {}
    if (filtroEstado.value) params.estado = filtroEstado.value
    noticias.value = await api.get<any[]>('/noticias/mis-noticias', params)
  } catch (e: any) {
    error.value = e.message || 'Error al cargar tus noticias'
    noticias.value = []
  } finally {
    loading.value = false
  }
}

watch(filtroEstado, fetchMisNoticias)
onMounted(fetchMisNoticias)
</script>

<style scoped>
/* Header */
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; flex-wrap: wrap; }
.page-title { font-size: 1.4rem; font-weight: 900; color: #1C1C1E; letter-spacing: -0.02em; margin: 0 0 4px; }
.page-sub { font-size: 0.82rem; color: #8E8E93; margin: 0; }
.add-btn {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(90deg, #004D40, #00796B);
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 9px 18px;
  border-radius: 10px;
  text-decoration: none;
  box-shadow: 0 3px 12px rgba(0, 77, 64, 0.35);
  transition: transform 0.18s, box-shadow 0.18s;
  white-space: nowrap;
}
.add-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0, 77, 64, 0.42); }

/* Filter */
.filter-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; }
.filter-tab {
  padding: 6px 14px;
  border-radius: 8px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.10);
  font-size: 0.78rem;
  font-weight: 600;
  color: #636366;
  cursor: pointer;
  transition: all 0.18s;
}
.filter-tab:hover { background: #F2F2F7; }
.filter-tab--active { background: rgba(0, 121, 107, 0.10); border-color: rgba(0, 121, 107, 0.28); color: #004D40; }

/* Table card */
.table-card { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06); overflow: hidden; }

/* Table */
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { font-size: 0.72rem; font-weight: 700; color: #8E8E93; letter-spacing: 0.05em; text-transform: uppercase; padding: 10px 16px; text-align: left; border-bottom: 1px solid rgba(0,0,0,0.06); white-space: nowrap; }
.th-actions { width: 90px; text-align: center; }
.data-row { border-bottom: 1px solid rgba(0,0,0,0.04); transition: background 0.15s; }
.data-row:hover { background: #FAFAFA; }
.data-row:last-child { border-bottom: none; }
.data-row td { padding: 11px 16px; vertical-align: middle; }

.noticia-titulo { font-size: 0.875rem; font-weight: 600; color: #1C1C1E; }
.fecha-text { font-size: 0.78rem; color: #8E8E93; }

/* Actions */
.actions-cell { display: flex; align-items: center; justify-content: center; gap: 6px; }
.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: background 0.15s, transform 0.15s;
}
.action-btn:hover { transform: scale(1.08); }
.action-edit { background: rgba(0, 121, 107, 0.10); color: #00796B; }
.action-edit:hover { background: rgba(0, 121, 107, 0.18); }
.action-locked { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; }

/* Empty */
.empty-cell { text-align: center; padding: 48px 16px !important; color: #8E8E93; font-size: 0.85rem; }
.empty-cell p { margin: 8px 0 0; }

/* Skeleton */
.table-loader { padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; }
.row-skeleton { height: 48px; border-radius: 10px; background: linear-gradient(90deg, #F2F2F7 25%, #E5E5EA 50%, #F2F2F7 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }

/* Animations */
.fade-up { animation: fadeUp 0.5s ease both; animation-delay: var(--d, 0s); }
@keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
</style>
