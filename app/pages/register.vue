<template>
  <div class="glass-card">

    <!-- Cabecera SENA -->
    <div class="glass-header">
      <div class="header-brand">
        <v-icon size="30" class="header-icon">mdi-book-education-outline</v-icon>
        <span class="header-title">Software Management</span>
      </div>
      <div class="header-divider" />
      <h2 class="header-subtitle">Crear cuenta</h2>
      <p class="header-desc">Completa el formulario para registrarte</p>
    </div>

    <!-- Cuerpo del formulario -->
    <div class="glass-body">

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

      <v-form @submit.prevent="handleRegister">

        <v-row dense class="mb-1">
          <v-col cols="6">
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
          </v-col>
          <v-col cols="6">
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
          </v-col>
        </v-row>

        <v-text-field
          v-model="form.email"
          label="Correo electrónico"
          type="email"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          density="comfortable"
          color="teal-darken-2"
          class="mb-3"
          rounded="lg"
          :rules="[v => !!v || 'Requerido']"
        />

        <v-text-field
          v-model="form.phone"
          label="Teléfono (opcional)"
          prepend-inner-icon="mdi-phone-outline"
          variant="outlined"
          density="comfortable"
          color="teal-darken-2"
          class="mb-3"
          rounded="lg"
        />

        <v-text-field
          v-model="form.password"
          label="Contraseña"
          :type="showPass ? 'text' : 'password'"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPass ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          variant="outlined"
          density="comfortable"
          color="teal-darken-2"
          class="mb-5"
          rounded="lg"
          :rules="[v => !!v || 'Requerido', v => v.length >= 6 || 'Mínimo 6 caracteres']"
          @click:append-inner="showPass = !showPass"
        />

        <v-btn
          type="submit"
          size="large"
          block
          :loading="loading"
          class="register-btn"
          rounded="lg"
        >
          <v-icon start size="18">mdi-account-plus-outline</v-icon>
          Registrarse
        </v-btn>

      </v-form>
    </div>

    <!-- Pie de la tarjeta -->
    <div class="glass-footer">
      <span class="footer-text">¿Ya tienes cuenta?</span>
      <v-btn to="/login" variant="text" size="small" class="footer-link ml-1" rounded="lg">
        Inicia sesión
      </v-btn>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const { register } = useAuth()
const form = reactive({ firstName: '', lastName: '', email: '', password: '', phone: '' })
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

async function handleRegister() {
  if (!form.firstName || !form.lastName || !form.email || !form.password) return
  loading.value = true
  error.value = ''
  try {
    await register(form)
  } catch (e: any) {
    error.value = e.message || 'Error al registrar usuario'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ── Tarjeta de vidrio esmerilado ── */
.glass-card {
  background: rgba(255, 255, 255, 0.91) !important;
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 20px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

/* ── Cabecera ── */
.glass-header {
  padding: 24px 32px 18px;
  background: linear-gradient(135deg, #004D40 0%, #00695C 60%, #00796B 100%);
  text-align: center;
}
.header-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}
.header-icon {
  color: rgba(255, 255, 255, 0.92);
}
.header-title {
  font-size: 1rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.01em;
}
.header-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.22);
  margin: 0 0 12px;
}
.header-subtitle {
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 4px;
}
.header-desc {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.68);
  margin: 0;
}

/* ── Cuerpo ── */
.glass-body {
  padding: 24px 32px 16px;
}

/* ── Botón principal ── */
.register-btn {
  background: linear-gradient(90deg, #004D40 0%, #00695C 50%, #00796B 100%) !important;
  color: white !important;
  font-weight: 600 !important;
  letter-spacing: 0.04em !important;
  font-size: 0.9rem !important;
  transition: transform 0.18s ease, box-shadow 0.18s ease !important;
  box-shadow: 0 4px 16px rgba(0, 77, 64, 0.38) !important;
}
.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 77, 64, 0.45) !important;
}
.register-btn:active {
  transform: translateY(0);
}

/* ── Pie ── */
.glass-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
}
.footer-text {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.5);
}
.footer-link {
  color: #00695C !important;
  font-weight: 600 !important;
  font-size: 0.8rem !important;
}
.footer-link:hover {
  background: rgba(0, 105, 92, 0.08) !important;
}
</style>
