<template>
  <div class="profile-page">

    <div class="page-header fade-up" style="--d:0s">
      <h1 class="page-title">Mi perfil</h1>
      <p class="page-sub">Administra tu información personal</p>
    </div>

    <div class="profile-layout">

      <!-- Avatar card -->
      <div class="avatar-card fade-up" style="--d:0.08s">
        <div class="avatar-circle">
          <span>{{ initials }}</span>
        </div>
        <h2 class="profile-name">{{ authStore.fullName }}</h2>
        <div class="profile-role-badge">
          <v-icon size="13" class="mr-1">mdi-account-outline</v-icon>
          {{ authStore.user?.role || 'Usuario' }}
        </div>
        <p class="profile-email">{{ authStore.user?.email }}</p>
      </div>

      <!-- Form card -->
      <div class="form-card fade-up" style="--d:0.15s">
        <h3 class="form-section-title">Información personal</h3>

        <v-alert v-if="success" type="success" variant="tonal" class="mb-4" rounded="lg" closable @click:close="success = false">
          Perfil actualizado correctamente
        </v-alert>
        <v-alert v-if="error" type="error" variant="tonal" class="mb-4" rounded="lg" closable @click:close="error = ''">
          {{ error }}
        </v-alert>

        <v-form @submit.prevent="handleUpdate">
          <div class="form-row">
            <v-text-field
              v-model="form.firstName"
              label="Nombre"
              prepend-inner-icon="mdi-account-outline"
              variant="outlined"
              density="comfortable"
              color="teal-darken-2"
              rounded="lg"
              :rules="[v => !!v || 'Requerido']"
            />
            <v-text-field
              v-model="form.lastName"
              label="Apellido"
              prepend-inner-icon="mdi-account-outline"
              variant="outlined"
              density="comfortable"
              color="teal-darken-2"
              rounded="lg"
              :rules="[v => !!v || 'Requerido']"
            />
          </div>
          <v-text-field
            v-model="form.email"
            label="Correo electrónico"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="comfortable"
            color="teal-darken-2"
            rounded="lg"
            class="mb-3"
            :rules="[v => !!v || 'Requerido']"
          />
          <v-text-field
            v-model="form.phone"
            label="Teléfono (opcional)"
            prepend-inner-icon="mdi-phone-outline"
            variant="outlined"
            density="comfortable"
            color="teal-darken-2"
            rounded="lg"
            class="mb-5"
          />
          <button type="submit" class="save-btn" :class="{ 'save-btn--loading': loading }">
            <v-progress-circular v-if="loading" size="16" width="2" indeterminate color="white" class="mr-2" />
            <v-icon v-else size="16" class="mr-2">mdi-content-save-outline</v-icon>
            Guardar cambios
          </button>
        </v-form>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const authStore = useAuthStore()
const api = useApi()
const loading = ref(false)
const success = ref(false)
const error = ref('')

const form = reactive({
  firstName: authStore.user?.firstName || '',
  lastName:  authStore.user?.lastName  || '',
  email:     authStore.user?.email     || '',
  phone:     authStore.user?.phone     || '',
})

const initials = computed(() =>
  `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase()
)

async function handleUpdate() {
  loading.value = true
  success.value = false
  error.value   = ''
  try {
    const updated = await api.patch<any>(`/users/${authStore.user?.id}`, form)
    authStore.updateUser(updated)
    success.value = true
  } catch (e: any) {
    error.value = e.message || 'Error al actualizar perfil'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-page { max-width: 860px; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 1.4rem; font-weight: 900; color: #1C1C1E; letter-spacing: -0.02em; margin: 0 0 4px; }
.page-sub { font-size: 0.82rem; color: #8E8E93; margin: 0; }
.profile-layout { display: grid; grid-template-columns: 220px 1fr; gap: 20px; align-items: start; }
@media (max-width: 640px) { .profile-layout { grid-template-columns: 1fr; } }
.avatar-card {
  background: white; border-radius: 18px; padding: 28px 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px;
}
.avatar-circle {
  width: 80px; height: 80px; border-radius: 50%;
  background: linear-gradient(135deg, #4527A0, #7B1FA2);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem; font-weight: 900; color: white;
  box-shadow: 0 6px 20px rgba(69, 39, 160, 0.30);
}
.profile-name { font-size: 1rem; font-weight: 800; color: #1C1C1E; margin: 0; line-height: 1.2; }
.profile-role-badge {
  display: inline-flex; align-items: center;
  background: rgba(69, 39, 160, 0.10); color: #4527A0;
  font-size: 0.72rem; font-weight: 700;
  padding: 4px 12px; border-radius: 10px;
  border: 1px solid rgba(69, 39, 160, 0.20);
  text-transform: capitalize;
}
.profile-email { font-size: 0.75rem; color: #8E8E93; margin: 0; word-break: break-all; }
.form-card { background: white; border-radius: 18px; padding: 24px 26px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.form-section-title { font-size: 0.95rem; font-weight: 800; color: #1C1C1E; margin: 0 0 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
.save-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 100%; padding: 13px 24px; border-radius: 12px;
  background: linear-gradient(90deg, #004D40 0%, #00695C 50%, #00796B 100%);
  color: white; font-size: 0.88rem; font-weight: 700; letter-spacing: 0.03em;
  border: none; cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 77, 64, 0.38);
  transition: transform 0.18s, box-shadow 0.18s;
}
.save-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(0, 77, 64, 0.44); }
.save-btn--loading { opacity: 0.80; cursor: default; pointer-events: none; }
.fade-up { animation: fadeUp 0.5s ease both; animation-delay: var(--d, 0s); }
@keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
</style>
