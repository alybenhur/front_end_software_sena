<template>
  <div>

    <!-- ── Cabecera ── -->
    <div class="page-header fade-up" style="--d:0s">
      <div>
        <h1 class="page-title">Gestión de Usuarios</h1>
        <p class="page-sub">Administra los usuarios registrados en la plataforma</p>
      </div>
      <div class="header-badge">
        <v-icon size="14" class="mr-1">mdi-account-group-outline</v-icon>
        {{ users.length }} usuarios
      </div>
    </div>

    <!-- ── Tabla ── -->
    <div class="table-card fade-up" style="--d:0.1s">

      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="search-wrap">
          <v-icon size="16" color="#8E8E93" class="search-icon">mdi-magnify</v-icon>
          <input
            v-model="search"
            type="text"
            class="search-input"
            placeholder="Buscar por nombre, email o rol..."
          />
          <button v-if="search" class="search-clear" @click="search = ''">
            <v-icon size="14" color="#8E8E93">mdi-close</v-icon>
          </button>
        </div>
        <span class="table-count">{{ filteredUsers.length }} resultados</span>
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
              <th class="th-ava" />
              <th>Nombre</th>
              <th class="d-none d-md-table-cell">Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th class="th-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in paginatedUsers"
              :key="user.id"
              class="data-row"
            >
              <!-- Avatar -->
              <td>
                <div class="user-ava" :style="{ background: roleGradient(user.role) }">
                  <span>{{ initials(user) }}</span>
                </div>
              </td>
              <!-- Nombre -->
              <td>
                <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
              </td>
              <!-- Email -->
              <td class="d-none d-md-table-cell">
                <span class="user-email">{{ user.email }}</span>
              </td>
              <!-- Rol -->
              <td>
                <span class="role-badge" :class="`role-${user.role?.replace('_', '-')}`">
                  {{ roleLabel(user.role) }}
                </span>
              </td>
              <!-- Estado -->
              <td>
                <span class="estado-chip" :class="user.isActive ? 'estado-active' : 'estado-inactive'">
                  {{ user.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <!-- Acciones -->
              <td>
                <div class="actions-cell">
                  <button
                    v-if="user.isActive"
                    class="action-btn action-deactivate"
                    title="Desactivar usuario"
                    @click="confirmDeactivate(user)"
                  >
                    <v-icon size="15">mdi-account-off-outline</v-icon>
                  </button>
                  <span v-else class="inactive-note">—</span>
                </div>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-if="paginatedUsers.length === 0">
              <td colspan="6" class="empty-cell">
                <v-icon size="40" color="#C7C7CC">mdi-account-search-outline</v-icon>
                <p>No hay usuarios que coincidan</p>
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

    <!-- Confirm dialog -->
    <ConfirmDialog
      v-model="deactivateDialog"
      title="Desactivar usuario"
      :message="`¿Deseas desactivar a ${selectedUser?.firstName} ${selectedUser?.lastName}? No podrá iniciar sesión.`"
      confirm-text="Desactivar"
      icon="mdi-account-off-outline"
      @confirm="deactivateUser"
      @cancel="deactivateDialog = false"
    />

  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'admin' })

const api = useApi()
const loading = ref(false)
const search = ref('')
const users = ref<any[]>([])
const deactivateDialog = ref(false)
const selectedUser = ref<any>(null)
const page = ref(1)
const perPage = 10

const filteredUsers = computed(() => {
  if (!search.value.trim()) return users.value
  const q = search.value.toLowerCase()
  return users.value.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
    u.email?.toLowerCase().includes(q) ||
    u.role?.toLowerCase().includes(q)
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / perPage)))
const paginatedUsers = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredUsers.value.slice(start, start + perPage)
})
watch(search, () => { page.value = 1 })

function initials(user: any) {
  return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
}

function roleLabel(role: string) {
  if (role === 'super_admin') return 'Super Admin'
  if (role === 'noticias')    return 'Redactor'
  return 'Usuario'
}

function roleGradient(role: string) {
  if (role === 'super_admin') return 'linear-gradient(135deg, #004D40, #00796B)'
  if (role === 'noticias')    return 'linear-gradient(135deg, #E65100, #F57C00)'
  return 'linear-gradient(135deg, #4527A0, #7B1FA2)'
}

function confirmDeactivate(user: any) {
  selectedUser.value = user
  deactivateDialog.value = true
}

async function deactivateUser() {
  if (!selectedUser.value) return
  deactivateDialog.value = false
  try {
    await api.delete(`/users/${selectedUser.value.id}`)
    const idx = users.value.findIndex(u => u.id === selectedUser.value.id)
    if (idx !== -1) users.value[idx].isActive = false
  } catch (e: any) {
    alert(e.message || 'Error al desactivar usuario')
  }
}

onMounted(async () => {
  loading.value = true
  try {
    users.value = await api.get<any[]>('/users')
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
.header-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(0, 121, 107, 0.10);
  color: #004D40;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 7px 14px;
  border-radius: 10px;
  border: 1px solid rgba(0, 121, 107, 0.20);
}

/* ── Table card ── */
.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

/* Toolbar */
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
.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 0.85rem;
  color: #1C1C1E;
}
.search-input::placeholder { color: #8E8E93; }
.search-clear { background: none; border: none; cursor: pointer; padding: 0; display: flex; }
.table-count { font-size: 0.75rem; font-weight: 600; color: #8E8E93; white-space: nowrap; }

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
.th-ava { width: 52px; }
.th-actions { width: 90px; text-align: center; }
.data-row { border-bottom: 1px solid rgba(0, 0, 0, 0.04); transition: background 0.15s; }
.data-row:hover { background: #FAFAFA; }
.data-row:last-child { border-bottom: none; }
.data-row td { padding: 10px 16px; vertical-align: middle; }

/* Avatar */
.user-ava {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: white;
}

/* Name / Email */
.user-name { font-size: 0.875rem; font-weight: 600; color: #1C1C1E; }
.user-email { font-size: 0.8rem; color: #636366; }

/* Role badge */
.role-badge {
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 8px;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.role-super-admin { color: #004D40; background: rgba(0, 121, 107, 0.12); }
.role-noticias     { color: #E65100; background: rgba(230, 81, 0, 0.10); }
.role-usuario, .role-user, .role-client { color: #4527A0; background: rgba(69, 39, 160, 0.10); }

/* Estado */
.estado-chip {
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 8px;
}
.estado-active   { color: #1B5E20; background: rgba(56, 142, 60, 0.12); }
.estado-inactive { color: #B71C1C; background: rgba(198, 40, 40, 0.10); }

/* Actions */
.actions-cell { display: flex; align-items: center; justify-content: center; }
.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
}
.action-btn:hover { transform: scale(1.08); }
.action-deactivate { background: rgba(239, 83, 80, 0.10); color: #EF5350; }
.action-deactivate:hover { background: rgba(239, 83, 80, 0.18); }
.inactive-note { font-size: 0.85rem; color: #C7C7CC; padding: 0 8px; }

/* Empty */
.empty-cell { text-align: center; padding: 48px 16px !important; color: #8E8E93; font-size: 0.85rem; }
.empty-cell p { margin: 8px 0 0; }

/* Loader */
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

/* Animations */
.fade-up { animation: fadeUp 0.5s ease both; animation-delay: var(--d, 0s); }
@keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
</style>
