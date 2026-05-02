<template>
  <div>

    <!-- ── Cabecera ── -->
    <div class="page-header fade-up" style="--d:0s">
      <div>
        <h1 class="page-title">Gestión de Software</h1>
        <p class="page-sub">Administra las aplicaciones del catálogo</p>
      </div>
      <NuxtLink to="/admin/software/nuevo" class="add-btn">
        <v-icon size="16" class="mr-1">mdi-plus</v-icon>
        Nuevo software
      </NuxtLink>
    </div>

    <!-- ── Tabla ── -->
    <div class="table-card fade-up" style="--d:0.1s">

      <!-- Buscador -->
      <div class="table-toolbar">
        <div class="search-wrap">
          <v-icon size="16" color="#8E8E93" class="search-icon">mdi-magnify</v-icon>
          <input
            v-model="search"
            type="text"
            class="search-input"
            placeholder="Buscar software por nombre o etiqueta..."
          />
          <button v-if="search" class="search-clear" @click="search = ''">
            <v-icon size="14" color="#8E8E93">mdi-close</v-icon>
          </button>
        </div>
        <span class="table-count">{{ filteredList.length }} elementos</span>
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
              <th class="th-img" />
              <th>Nombre</th>
              <th class="d-none d-md-table-cell">Etiquetas</th>
              <th>Valoración</th>
              <th>Estado</th>
              <th class="th-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in paginatedList"
              :key="item.id"
              class="data-row"
            >
              <!-- Avatar -->
              <td>
                <div class="sw-avatar">
                  <v-img
                    v-if="coverImage(item.urlImagen)"
                    :src="coverImage(item.urlImagen)"
                    contain
                    width="36"
                    height="36"
                  />
                  <div v-else class="sw-avatar-fallback">
                    {{ item.nombre?.[0]?.toUpperCase() }}
                  </div>
                </div>
              </td>
              <!-- Nombre -->
              <td>
                <span class="sw-name">{{ item.nombre }}</span>
              </td>
              <!-- Tags -->
              <td class="d-none d-md-table-cell">
                <div class="tags-row">
                  <span
                    v-for="tag in parseTags(item.tags).slice(0, 2)"
                    :key="tag"
                    class="tag-badge"
                  >{{ tag }}</span>
                </div>
              </td>
              <!-- Valoración -->
              <td>
                <div class="rating-cell">
                  <v-icon size="13" color="#F9A825">mdi-star</v-icon>
                  <span class="rating-val">{{ parseFloat(item.valoracion) || 0 }}</span>
                </div>
              </td>
              <!-- Estado -->
              <td>
                <span class="estado-chip" :class="item.estado?.toLowerCase() === 'activo' ? 'estado-active' : 'estado-inactive'">
                  {{ item.estado }}
                </span>
              </td>
              <!-- Acciones -->
              <td>
                <div class="actions-cell">
                  <NuxtLink :to="`/admin/software/${item.id}/editar`" class="action-btn action-edit" title="Editar">
                    <v-icon size="15">mdi-pencil-outline</v-icon>
                  </NuxtLink>
                  <button class="action-btn action-delete" title="Eliminar" @click="confirmDelete(item)">
                    <v-icon size="15">mdi-trash-can-outline</v-icon>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-if="paginatedList.length === 0">
              <td colspan="6" class="empty-cell">
                <v-icon size="40" color="#C7C7CC">mdi-package-variant-remove</v-icon>
                <p>No hay software que coincida</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          class="page-btn"
          :disabled="page === 1"
          @click="page--"
        >
          <v-icon size="14">mdi-chevron-left</v-icon>
        </button>
        <span class="page-info">{{ page }} / {{ totalPages }}</span>
        <button
          class="page-btn"
          :disabled="page === totalPages"
          @click="page++"
        >
          <v-icon size="14">mdi-chevron-right</v-icon>
        </button>
      </div>
    </div>

    <!-- ── Diálogo confirmación ── -->
    <ConfirmDialog
      v-model="deleteDialog"
      title="Eliminar software"
      :message="`¿Deseas eliminar '${selectedItem?.nombre}'? Esta acción no se puede deshacer.`"
      confirm-text="Eliminar"
      @confirm="deleteSoftware"
      @cancel="deleteDialog = false"
    />

  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'admin' })

const api = useApi()
const loading = ref(false)
const search = ref('')
const softwareList = ref<any[]>([])
const deleteDialog = ref(false)
const selectedItem = ref<any>(null)
const page = ref(1)
const perPage = 10

const filteredList = computed(() => {
  if (!search.value.trim()) return softwareList.value
  const q = search.value.toLowerCase()
  return softwareList.value.filter(s =>
    s.nombre?.toLowerCase().includes(q) || s.tags?.toLowerCase().includes(q)
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredList.value.length / perPage)))

const paginatedList = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredList.value.slice(start, start + perPage)
})

watch(search, () => { page.value = 1 })

function coverImage(url: string) {
  if (!url) return ''
  return url.split(',')[0].trim()
}

function parseTags(tags: string) {
  if (!tags) return []
  return tags.split(',').map((t: string) => t.trim()).filter(Boolean)
}

function confirmDelete(item: any) {
  selectedItem.value = item
  deleteDialog.value = true
}

async function deleteSoftware() {
  if (!selectedItem.value) return
  deleteDialog.value = false
  try {
    await api.delete(`/software/${selectedItem.value.id}`)
    softwareList.value = softwareList.value.filter(s => s.id !== selectedItem.value.id)
  } catch (e: any) {
    alert(e.message || 'Error al eliminar')
  }
}

onMounted(async () => {
  loading.value = true
  try {
    softwareList.value = await api.get<any[]>('/software/admin')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* ── Cabecera ── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.page-title {
  font-size: 1.4rem;
  font-weight: 900;
  color: #1C1C1E;
  letter-spacing: -0.02em;
  margin: 0 0 4px;
}
.page-sub {
  font-size: 0.82rem;
  color: #8E8E93;
  margin: 0;
}
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
.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 77, 64, 0.42);
}

/* ── Table card ── */
.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* ── Toolbar ── */
.table-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  flex-wrap: wrap;
}
.search-wrap {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F2F2F7;
  border-radius: 10px;
  padding: 8px 12px;
}
.search-icon { flex-shrink: 0; }
.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 0.85rem;
  color: #1C1C1E;
}
.search-input::placeholder { color: #8E8E93; }
.search-clear {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
}
.table-count {
  font-size: 0.75rem;
  font-weight: 600;
  color: #8E8E93;
  white-space: nowrap;
}

/* ── Table ── */
.table-wrap { overflow-x: auto; }
.data-table {
  width: 100%;
  border-collapse: collapse;
}
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
.th-img { width: 56px; }
.th-actions { width: 100px; text-align: center; }

.data-row {
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  transition: background 0.15s;
}
.data-row:hover { background: #FAFAFA; }
.data-row:last-child { border-bottom: none; }
.data-row td { padding: 10px 16px; vertical-align: middle; }

/* Avatar */
.sw-avatar {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  overflow: hidden;
  background: #F2F2F7;
  border: 1px solid rgba(0, 0, 0, 0.07);
  display: flex;
  align-items: center;
  justify-content: center;
}
.sw-avatar-fallback {
  font-size: 1rem;
  font-weight: 900;
  color: #00796B;
}

/* Name */
.sw-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1C1C1E;
}

/* Tags */
.tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.tag-badge {
  font-size: 10px;
  font-weight: 600;
  color: #00695C;
  background: rgba(0, 105, 92, 0.10);
  padding: 2px 8px;
  border-radius: 6px;
}

/* Rating */
.rating-cell {
  display: flex;
  align-items: center;
  gap: 4px;
}
.rating-val {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1C1C1E;
}

/* Estado */
.estado-chip {
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 8px;
  letter-spacing: 0.03em;
}
.estado-active {
  color: #1B5E20;
  background: rgba(56, 142, 60, 0.12);
}
.estado-inactive {
  color: #B71C1C;
  background: rgba(198, 40, 40, 0.10);
}

/* Actions */
.actions-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}
.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s, transform 0.15s;
}
.action-btn:hover { transform: scale(1.08); }
.action-edit {
  background: rgba(0, 121, 107, 0.10);
  color: #00796B;
}
.action-edit:hover { background: rgba(0, 121, 107, 0.18); }
.action-delete {
  background: rgba(239, 83, 80, 0.10);
  color: #EF5350;
}
.action-delete:hover { background: rgba(239, 83, 80, 0.18); }

/* Empty */
.empty-cell {
  text-align: center;
  padding: 48px 16px !important;
  color: #8E8E93;
  font-size: 0.85rem;
}
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
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}
.page-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #F2F2F7;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.page-btn:disabled { opacity: 0.38; cursor: default; }
.page-btn:not(:disabled):hover { background: #E5E5EA; }
.page-info { font-size: 0.8rem; font-weight: 600; color: #636366; }

/* Animations */
.fade-up {
  animation: fadeUp 0.5s ease both;
  animation-delay: var(--d, 0s);
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
</style>
