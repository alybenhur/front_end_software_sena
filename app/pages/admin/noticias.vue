<template>
  <div>

    <!-- ── Cabecera ── -->
    <div class="page-header fade-up" style="--d:0s">
      <div>
        <h1 class="page-title">Gestión de Noticias</h1>
        <p class="page-sub">Revisa, aprueba o rechaza las noticias de los redactores</p>
      </div>
    </div>

    <!-- ── Stat mini-cards ── -->
    <div class="stats-row fade-up" style="--d:0.07s">
      <div
        v-for="(stat, i) in stats"
        :key="stat.label"
        class="mini-stat"
        :class="`mini-stat--${stat.key}`"
      >
        <v-icon size="16" :color="stat.iconColor">{{ stat.icon }}</v-icon>
        <span class="mini-stat-value">{{ stat.value }}</span>
        <span class="mini-stat-label">{{ stat.label }}</span>
      </div>
    </div>

    <!-- ── Tabla ── -->
    <div class="table-card fade-up" style="--d:0.14s">

      <!-- Toolbar -->
      <div class="table-toolbar">
        <!-- Filtro estado -->
        <div class="filter-tabs">
          <button
            v-for="f in filters"
            :key="f.value"
            class="filter-tab"
            :class="{ 'filter-tab--active': filtroEstado === f.value }"
            @click="filtroEstado = f.value"
          >
            {{ f.label }}
            <span v-if="f.value" class="filter-count">{{ countByEstado(f.value) }}</span>
          </button>
        </div>
        <!-- Buscador -->
        <div class="search-wrap">
          <v-icon size="15" color="#8E8E93">mdi-magnify</v-icon>
          <input
            v-model="search"
            type="text"
            class="search-input"
            placeholder="Buscar..."
          />
        </div>
      </div>

      <!-- Loader -->
      <div v-if="loading" class="table-loader">
        <div v-for="n in 5" :key="n" class="row-skeleton" />
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
              v-for="item in paginatedNoticias"
              :key="item.id"
              class="data-row"
            >
              <!-- Título -->
              <td>
                <div class="noticia-titulo">{{ item.titulo }}</div>
                <div v-if="item.resumen" class="noticia-resumen">{{ item.resumen }}</div>
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
                  <button
                    class="action-btn action-view"
                    title="Ver contenido"
                    @click="openPreview(item)"
                  >
                    <v-icon size="15">mdi-eye-outline</v-icon>
                  </button>
                  <button
                    class="action-btn action-approve"
                    :disabled="item.estado === 'aprobada'"
                    title="Aprobar"
                    @click="confirmAction('aprobar', item)"
                  >
                    <v-icon size="15">mdi-check-circle-outline</v-icon>
                  </button>
                  <button
                    class="action-btn action-reject"
                    :disabled="item.estado === 'rechazada'"
                    title="Rechazar"
                    @click="confirmAction('rechazar', item)"
                  >
                    <v-icon size="15">mdi-close-circle-outline</v-icon>
                  </button>
                  <button
                    class="action-btn action-delete"
                    title="Eliminar"
                    @click="confirmAction('eliminar', item)"
                  >
                    <v-icon size="15">mdi-trash-can-outline</v-icon>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-if="paginatedNoticias.length === 0">
              <td colspan="4" class="empty-cell">
                <v-icon size="40" color="#C7C7CC">mdi-newspaper-check</v-icon>
                <p>No hay noticias para mostrar</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="pagination">
        <button class="page-btn" :disabled="page === 1" @click="page--">
          <v-icon size="14">mdi-chevron-left</v-icon>
        </button>
        <span class="page-info">{{ page }} / {{ totalPages }}</span>
        <button class="page-btn" :disabled="page === totalPages" @click="page++">
          <v-icon size="14">mdi-chevron-right</v-icon>
        </button>
      </div>
    </div>

    <!-- ── Confirm dialog ── -->
    <ConfirmDialog
      v-model="confirmDialog"
      :title="dialogConfig.title"
      :message="dialogConfig.message"
      :confirm-text="dialogConfig.confirmText"
      :confirm-color="dialogConfig.color"
      :icon="dialogConfig.icon"
      @confirm="executeAction"
      @cancel="confirmDialog = false"
    />

    <!-- ── Preview dialog ── -->
    <v-dialog v-model="previewDialog" max-width="720" scrollable>
      <div class="preview-dialog">
        <!-- Header -->
        <div class="preview-header">
          <div class="preview-header-info">
            <h3 class="preview-title">{{ previewItem?.titulo }}</h3>
            <div class="preview-meta">
              <EstadoChip v-if="previewItem" :estado="previewItem.estado" />
              <span class="preview-date">
                <v-icon size="12">mdi-calendar</v-icon>
                {{ formatDate(previewItem?.fechaCreacion) }}
              </span>
            </div>
          </div>
          <button class="preview-close" @click="previewDialog = false">
            <v-icon size="18" color="#636366">mdi-close</v-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="preview-body">
          <div v-if="previewImages.length" class="preview-img-wrap">
            <v-img :src="previewImages[0]" cover height="220" class="preview-img" />
          </div>
          <p v-if="previewItem?.resumen" class="preview-resumen">{{ previewItem.resumen }}</p>
          <div class="preview-content" v-html="previewItem?.contenidoHtml || previewItem?.contenidoTexto" />
        </div>

        <!-- Footer -->
        <div class="preview-footer">
          <button
            v-if="previewItem?.estado !== 'aprobada'"
            class="pf-btn pf-approve"
            @click="confirmAction('aprobar', previewItem); previewDialog = false"
          >
            <v-icon size="15" class="mr-1">mdi-check-circle-outline</v-icon>
            Aprobar
          </button>
          <button
            v-if="previewItem?.estado !== 'rechazada'"
            class="pf-btn pf-reject"
            @click="confirmAction('rechazar', previewItem); previewDialog = false"
          >
            <v-icon size="15" class="mr-1">mdi-close-circle-outline</v-icon>
            Rechazar
          </button>
          <div style="flex:1" />
          <button class="pf-btn pf-close" @click="previewDialog = false">Cerrar</button>
        </div>
      </div>
    </v-dialog>

  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'admin' })

const api = useApi()
const loading = ref(false)
const actionLoading = ref('')
const search = ref('')
const filtroEstado = ref('')
const noticias = ref<any[]>([])
const page = ref(1)
const perPage = 10

// Preview
const previewDialog = ref(false)
const previewItem = ref<any>(null)
const previewImages = computed(() => {
  const imgs = previewItem.value?.imagenes
  if (!imgs) return []
  return imgs.split(',').map((u: string) => u.trim()).filter(Boolean)
})

// Confirm
const confirmDialog = ref(false)
const pendingAction = ref<{ type: string; item: any } | null>(null)

const filters = [
  { label: 'Todas', value: '' },
  { label: 'Pendientes', value: 'pendiente' },
  { label: 'Aprobadas', value: 'aprobada' },
  { label: 'Rechazadas', value: 'rechazada' },
]

const dialogConfig = computed(() => {
  const action = pendingAction.value?.type
  const titulo = pendingAction.value?.item?.titulo || ''
  if (action === 'aprobar')
    return { title: 'Aprobar noticia', message: `¿Aprobar "${titulo}"? Será visible públicamente.`, confirmText: 'Aprobar', color: 'success', icon: 'mdi-check-circle' }
  if (action === 'rechazar')
    return { title: 'Rechazar noticia', message: `¿Rechazar "${titulo}"?`, confirmText: 'Rechazar', color: 'warning', icon: 'mdi-close-circle' }
  return { title: 'Eliminar noticia', message: `¿Eliminar permanentemente "${titulo}"?`, confirmText: 'Eliminar', color: 'error', icon: 'mdi-delete' }
})

const noticiasFiltradas = computed(() => {
  let list = filtroEstado.value ? noticias.value.filter(n => n.estado === filtroEstado.value) : noticias.value
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(n => n.titulo?.toLowerCase().includes(q) || n.resumen?.toLowerCase().includes(q))
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(noticiasFiltradas.value.length / perPage)))
const paginatedNoticias = computed(() => {
  const start = (page.value - 1) * perPage
  return noticiasFiltradas.value.slice(start, start + perPage)
})

watch([filtroEstado, search], () => { page.value = 1 })

const stats = computed(() => [
  { key: 'total',     label: 'Total',      value: noticias.value.length,             icon: 'mdi-newspaper-variant-outline', iconColor: '#004D40' },
  { key: 'pending',   label: 'Pendientes', value: countByEstado('pendiente'),         icon: 'mdi-clock-outline',             iconColor: '#F57C00' },
  { key: 'approved',  label: 'Aprobadas',  value: countByEstado('aprobada'),          icon: 'mdi-check-circle-outline',      iconColor: '#388E3C' },
  { key: 'rejected',  label: 'Rechazadas', value: countByEstado('rechazada'),         icon: 'mdi-close-circle-outline',      iconColor: '#E53935' },
])

function countByEstado(estado: string) {
  return noticias.value.filter(n => n.estado === estado).length
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

function openPreview(item: any) {
  previewItem.value = item
  previewDialog.value = true
}

function confirmAction(type: string, item: any) {
  pendingAction.value = { type, item }
  confirmDialog.value = true
}

async function executeAction() {
  confirmDialog.value = false
  if (!pendingAction.value) return
  const { type, item } = pendingAction.value
  actionLoading.value = `${type}-${item.id}`
  try {
    if (type === 'aprobar') {
      const updated = await api.patch<any>(`/noticias/${item.id}/aprobar`)
      updateItem(updated)
    } else if (type === 'rechazar') {
      const updated = await api.patch<any>(`/noticias/${item.id}/rechazar`)
      updateItem(updated)
    } else if (type === 'eliminar') {
      await api.delete(`/noticias/${item.id}`)
      noticias.value = noticias.value.filter(n => n.id !== item.id)
    }
  } catch (e: any) {
    alert(e.message || 'Error al ejecutar la acción')
  } finally {
    actionLoading.value = ''
    pendingAction.value = null
  }
}

function updateItem(updated: any) {
  const idx = noticias.value.findIndex(n => n.id === updated.id)
  if (idx !== -1) noticias.value[idx] = updated
}

onMounted(async () => {
  loading.value = true
  try {
    noticias.value = await api.get<any[]>('/noticias/admin')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* ── Cabecera ── */
.page-header { margin-bottom: 20px; }
.page-title { font-size: 1.4rem; font-weight: 900; color: #1C1C1E; letter-spacing: -0.02em; margin: 0 0 4px; }
.page-sub { font-size: 0.82rem; color: #8E8E93; margin: 0; }

/* ── Stats row ── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
.mini-stat {
  background: white;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 3px solid transparent;
}
.mini-stat--total   { border-left-color: #00796B; }
.mini-stat--pending { border-left-color: #F57C00; }
.mini-stat--approved{ border-left-color: #388E3C; }
.mini-stat--rejected{ border-left-color: #E53935; }
.mini-stat-value { font-size: 1.4rem; font-weight: 900; color: #1C1C1E; line-height: 1; }
.mini-stat-label { font-size: 0.72rem; color: #8E8E93; font-weight: 600; }

/* ── Table card ── */
.table-card { background: white; border-radius: 16px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06); overflow: hidden; }

/* Toolbar */
.table-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
}
.filter-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
.filter-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  background: none;
  border: 1px solid rgba(0, 0, 0, 0.09);
  font-size: 0.78rem;
  font-weight: 600;
  color: #636366;
  cursor: pointer;
  transition: all 0.18s;
}
.filter-tab:hover { background: #F2F2F7; }
.filter-tab--active {
  background: rgba(0, 121, 107, 0.10);
  border-color: rgba(0, 121, 107, 0.25);
  color: #004D40;
}
.filter-count {
  background: #00796B;
  color: white;
  font-size: 9.5px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 6px;
  line-height: 1.4;
}
.search-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #F2F2F7;
  border-radius: 8px;
  padding: 7px 10px;
  min-width: 160px;
}
.search-input {
  background: none;
  border: none;
  outline: none;
  font-size: 0.82rem;
  color: #1C1C1E;
  width: 130px;
}
.search-input::placeholder { color: #8E8E93; }

/* Table */
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th {
  font-size: 0.72rem;
  font-weight: 700;
  color: #8E8E93;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 10px 16px;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  white-space: nowrap;
}
.th-actions { width: 140px; text-align: center; }
.data-row { border-bottom: 1px solid rgba(0, 0, 0, 0.04); transition: background 0.15s; }
.data-row:hover { background: #FAFAFA; }
.data-row:last-child { border-bottom: none; }
.data-row td { padding: 10px 16px; vertical-align: middle; }

.noticia-titulo { font-size: 0.875rem; font-weight: 600; color: #1C1C1E; line-height: 1.3; }
.noticia-resumen {
  font-size: 0.75rem;
  color: #8E8E93;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  max-width: 320px;
  margin-top: 2px;
}
.fecha-text { font-size: 0.78rem; color: #8E8E93; }

/* Actions */
.actions-cell { display: flex; align-items: center; justify-content: center; gap: 4px; }
.action-btn {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
}
.action-btn:disabled { opacity: 0.28; cursor: default; }
.action-btn:not(:disabled):hover { transform: scale(1.08); }
.action-view    { background: rgba(0, 121, 107, 0.10); color: #00796B; }
.action-view:hover { background: rgba(0, 121, 107, 0.18); }
.action-approve { background: rgba(56, 142, 60, 0.10); color: #388E3C; }
.action-approve:not(:disabled):hover { background: rgba(56, 142, 60, 0.18); }
.action-reject  { background: rgba(245, 124, 0, 0.10); color: #F57C00; }
.action-reject:not(:disabled):hover { background: rgba(245, 124, 0, 0.18); }
.action-delete  { background: rgba(239, 83, 80, 0.10); color: #EF5350; }
.action-delete:hover { background: rgba(239, 83, 80, 0.18); }

/* Empty */
.empty-cell { text-align: center; padding: 48px 16px !important; color: #8E8E93; font-size: 0.85rem; }
.empty-cell p { margin: 8px 0 0; }

/* Skeleton */
.table-loader { padding: 12px 16px; display: flex; flex-direction: column; gap: 10px; }
.row-skeleton {
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(90deg, #F2F2F7 25%, #E5E5EA 50%, #F2F2F7 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

/* Pagination */
.pagination { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 14px; border-top: 1px solid rgba(0, 0, 0, 0.06); }
.page-btn { width: 32px; height: 32px; border-radius: 8px; background: #F2F2F7; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
.page-btn:disabled { opacity: 0.38; cursor: default; }
.page-btn:not(:disabled):hover { background: #E5E5EA; }
.page-info { font-size: 0.8rem; font-weight: 600; color: #636366; }

/* ── Preview dialog ── */
.preview-dialog {
  background: white;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 85vh;
}
.preview-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 22px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}
.preview-title { font-size: 1.05rem; font-weight: 800; color: #1C1C1E; margin: 0 0 8px; }
.preview-meta { display: flex; align-items: center; gap: 10px; }
.preview-date { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: #8E8E93; }
.preview-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #F2F2F7;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}
.preview-close:hover { background: #E5E5EA; }

.preview-body { overflow-y: auto; padding: 20px 22px; flex: 1; }
.preview-img-wrap { border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
.preview-img { display: block; }
.preview-resumen { font-size: 0.875rem; font-weight: 600; color: #636366; margin: 0 0 14px; font-style: italic; }
.preview-content :deep(h1) { font-size: 1.4rem; font-weight: 700; margin: 12px 0 8px; }
.preview-content :deep(h2) { font-size: 1.15rem; font-weight: 700; margin: 10px 0 6px; }
.preview-content :deep(p)  { margin-bottom: 10px; line-height: 1.7; font-size: 0.875rem; color: #3A3A3C; }
.preview-content :deep(ul), .preview-content :deep(ol) { padding-left: 20px; margin-bottom: 10px; }
.preview-content :deep(blockquote) { border-left: 3px solid #00796B; padding-left: 12px; color: #636366; font-style: italic; }

.preview-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 22px;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
}
.pf-btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 9px;
  border: none;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 700;
  transition: background 0.18s, transform 0.15s;
}
.pf-btn:hover { transform: translateY(-1px); }
.pf-approve { background: rgba(56, 142, 60, 0.12); color: #1B5E20; }
.pf-approve:hover { background: rgba(56, 142, 60, 0.20); }
.pf-reject  { background: rgba(245, 124, 0, 0.12); color: #E65100; }
.pf-reject:hover { background: rgba(245, 124, 0, 0.20); }
.pf-close   { background: #F2F2F7; color: #636366; }
.pf-close:hover { background: #E5E5EA; }

/* Animations */
.fade-up { animation: fadeUp 0.5s ease both; animation-delay: var(--d, 0s); }
@keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }

/* Responsive */
@media (max-width: 640px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
}
</style>
