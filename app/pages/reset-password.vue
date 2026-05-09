<template>
  <div class="form-wrap">
    <!-- Sin token en URL -->
    <div v-if="!token" class="alert alert-error">
      Enlace inválido. Solicita un nuevo enlace de recuperación.
      <NuxtLink to="/forgot-password" class="alert-link">Solicitar nuevo enlace</NuxtLink>
    </div>

    <!-- Éxito -->
    <div v-else-if="done" class="alert alert-success">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <div>
        <strong>Contraseña actualizada.</strong>
        <NuxtLink to="/login" class="alert-link" style="margin-left: 6px;">Iniciar sesión</NuxtLink>
      </div>
    </div>

    <template v-else>
      <!-- Error -->
      <div v-if="error" class="alert alert-error">
        {{ error }}
        <button class="alert-close" @click="error = ''">✕</button>
      </div>

      <p class="form-desc">Ingresa tu nueva contraseña.</p>

      <form class="form" @submit.prevent="handleSubmit">
        <!-- Nueva contraseña -->
        <div class="input-group">
          <span class="input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <input
            v-model="form.password"
            :type="showPass ? 'text' : 'password'"
            placeholder="Nueva contraseña"
            class="form-input"
            autocomplete="new-password"
            required
            minlength="6"
          />
          <button type="button" class="input-eye" tabindex="-1" @click="showPass = !showPass">
            <svg v-if="!showPass" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        </div>

        <!-- Confirmar contraseña -->
        <div class="input-group" :class="{ 'input-group--error': confirmError }">
          <span class="input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <input
            v-model="form.confirm"
            :type="showConfirm ? 'text' : 'password'"
            placeholder="Confirmar contraseña"
            class="form-input"
            autocomplete="new-password"
            required
          />
          <button type="button" class="input-eye" tabindex="-1" @click="showConfirm = !showConfirm">
            <svg v-if="!showConfirm" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          </button>
        </div>
        <p v-if="confirmError" class="field-error">Las contraseñas no coinciden</p>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading" class="spinner" />
          <span v-else>Restablecer contraseña</span>
        </button>
      </form>
    </template>

    <p class="back-row">
      <NuxtLink to="/login" class="back-link">← Volver al inicio de sesión</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const route = useRoute()
const api = useApi()

const token = computed(() => route.query.token as string | undefined)
const form = reactive({ password: '', confirm: '' })
const showPass = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const error = ref('')
const done = ref(false)

const confirmError = computed(() => form.confirm.length > 0 && form.password !== form.confirm)

async function handleSubmit() {
  if (form.password !== form.confirm) return
  if (!token.value) return
  loading.value = true
  error.value = ''
  try {
    await api.post('/auth/reset-password', { resetToken: token.value, newPassword: form.password })
    done.value = true
  } catch (e: any) {
    error.value = e.message || 'El enlace es inválido o ha expirado.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-wrap {
  width: 100%;
  background: rgba(20, 40, 28, 0.55);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(76, 223, 128, 0.18);
  border-radius: 18px;
  padding: 32px 32px 26px;
  box-shadow:
    0 18px 50px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

@media (max-width: 600px) {
  .form-wrap { padding: 24px 20px 20px; }
}

.form-desc {
  color: rgba(200, 230, 210, 0.75);
  font-size: 14px;
  margin: 0 0 20px;
}

/* ── Alerts ── */
.alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 14px;
  margin-bottom: 18px;
  line-height: 1.5;
}
.alert-success {
  background: rgba(46, 139, 87, 0.2);
  border: 1px solid rgba(76, 223, 128, 0.4);
  color: #4cdf80;
}
.alert-error {
  background: rgba(220, 50, 50, 0.18);
  border: 1px solid rgba(220, 80, 80, 0.4);
  color: #ff9999;
  justify-content: space-between;
  flex-wrap: wrap;
}
.alert-link {
  color: #4cdf80;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.alert-close {
  background: none;
  border: none;
  color: #ff9999;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  flex-shrink: 0;
}

/* ── Form ── */
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.07);
  border: 1.5px solid rgba(46, 180, 90, 0.35);
  border-radius: 10px;
  padding: 0 14px;
  transition: border-color 0.25s, box-shadow 0.25s;
}
.input-group:focus-within {
  border-color: rgba(46, 200, 100, 0.7);
  box-shadow: 0 0 0 3px rgba(46, 200, 100, 0.12), 0 0 12px rgba(46, 200, 80, 0.15);
}
.input-group--error {
  border-color: rgba(220, 80, 80, 0.6) !important;
}

.input-icon {
  color: rgba(46, 200, 90, 0.8);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 10px;
}

.form-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #e8f5e9;
  font-size: 15px;
  padding: 14px 0;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}
.form-input::placeholder { color: rgba(200, 230, 210, 0.45); }
.form-input:-webkit-autofill,
.form-input:-webkit-autofill:focus {
  -webkit-text-fill-color: #e8f5e9;
  -webkit-box-shadow: 0 0 0 1000px transparent inset;
  transition: background-color 5000s ease-in-out 0s;
}

.input-eye {
  background: none;
  border: none;
  color: rgba(46, 200, 90, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  transition: color 0.2s;
}
.input-eye:hover { color: rgba(46, 200, 90, 1); }

.field-error {
  color: #ff9999;
  font-size: 12.5px;
  margin: -8px 0 0 4px;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  margin-top: 4px;
  background: linear-gradient(135deg, #2E8B57 0%, #3cb869 60%, #27a050 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.04em;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 20px rgba(46, 139, 87, 0.45), 0 0 24px rgba(46, 200, 80, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
}
.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #27a050 0%, #46d474 60%, #2E8B57 100%);
  box-shadow: 0 6px 28px rgba(46, 200, 80, 0.6);
  transform: translateY(-1px);
}
.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.back-row {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}
.back-link {
  color: rgba(200, 230, 210, 0.75);
  text-decoration: underline;
  text-decoration-color: rgba(200, 230, 210, 0.3);
  text-underline-offset: 3px;
  transition: color 0.2s;
}
.back-link:hover { color: #4cdf80; }
</style>
