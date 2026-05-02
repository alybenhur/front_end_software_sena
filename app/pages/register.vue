<template>
  <div class="register-form-wrap">

    <!-- Alert de error -->
    <div v-if="error" class="register-alert">
      {{ error }}
      <button class="register-alert-close" aria-label="Cerrar" @click="error = ''">✕</button>
    </div>

    <form class="register-form" @submit.prevent="handleRegister">

      <!-- Nombre + Apellido -->
      <div class="input-row">
        <div class="input-group">
          <span class="input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </span>
          <input
            v-model="form.firstName"
            type="text"
            placeholder="Nombre"
            class="register-input"
            autocomplete="given-name"
            required
          />
        </div>

        <div class="input-group">
          <span class="input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </span>
          <input
            v-model="form.lastName"
            type="text"
            placeholder="Apellido"
            class="register-input"
            autocomplete="family-name"
            required
          />
        </div>
      </div>

      <!-- Correo electrónico -->
      <div class="input-group">
        <span class="input-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M2 7l10 7 10-7" />
          </svg>
        </span>
        <input
          v-model="form.email"
          type="email"
          placeholder="Correo electrónico"
          class="register-input"
          autocomplete="email"
          required
        />
      </div>

      <!-- Teléfono -->
      <div class="input-group">
        <span class="input-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.09 4.18 2 2 0 0 1 5.07 2h3a2 2 0 0 1 2 1.72c.13 1 .37 1.97.72 2.9a2 2 0 0 1-.45 2.11L9.1 9.91a16 16 0 0 0 5 5l1.18-1.18a2 2 0 0 1 2.11-.45c.93.35 1.9.59 2.9.72A2 2 0 0 1 22 16.92z" />
          </svg>
        </span>
        <input
          v-model="form.phone"
          type="tel"
          placeholder="Teléfono (opcional)"
          class="register-input"
          autocomplete="tel"
        />
      </div>

      <!-- Contraseña -->
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
          placeholder="Contraseña"
          class="register-input"
          autocomplete="new-password"
          required
        />
        <button
          type="button"
          class="input-eye"
          tabindex="-1"
          :aria-label="showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'"
          @click="showPass = !showPass"
        >
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

      <!-- Botón -->
      <button type="submit" class="register-btn" :disabled="loading">
        <span v-if="loading" class="register-spinner" />
        <span v-else>Registrarse</span>
      </button>

    </form>

    <!-- Inicio de sesión -->
    <p class="login-row">
      ¿Ya tienes cuenta?
      <NuxtLink to="/login" class="login-link">Inicia sesión</NuxtLink>
    </p>

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
.register-form-wrap {
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
  .register-form-wrap { padding: 24px 20px 20px; }
}

/* ── Alert ── */
.register-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(220, 50, 50, 0.18);
  border: 1px solid rgba(220, 80, 80, 0.4);
  border-radius: 10px;
  padding: 12px 16px;
  color: #ff9999;
  font-size: 14px;
  margin-bottom: 18px;
}
.register-alert-close {
  background: none;
  border: none;
  color: #ff9999;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  line-height: 1;
}

/* ── Form ── */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ── Fila de dos campos ── */
.input-row {
  display: flex;
  gap: 12px;
}
.input-row .input-group {
  flex: 1;
}

/* ── Input group ── */
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

.input-icon {
  color: rgba(46, 200, 90, 0.8);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-right: 10px;
}

.register-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #e8f5e9;
  font-size: 15px;
  padding: 14px 0;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  min-width: 0;
}
.register-input::placeholder { color: rgba(200, 230, 210, 0.45); }

/* Anular autofill amarillo de Chrome */
.register-input:-webkit-autofill,
.register-input:-webkit-autofill:hover,
.register-input:-webkit-autofill:focus {
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

/* ── Botón ── */
.register-btn {
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
.register-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #27a050 0%, #46d474 60%, #2E8B57 100%);
  box-shadow: 0 6px 28px rgba(46, 200, 80, 0.6);
  transform: translateY(-1px);
}
.register-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.register-spinner {
  width: 20px;
  height: 20px;
  border: 2.5px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Login link ── */
.login-row {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}
.login-link {
  color: #4cdf80;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 600;
  transition: color 0.2s;
}
.login-link:hover { color: #80ff9e; }

@media (max-width: 480px) {
  .input-row {
    flex-direction: column;
  }
}
</style>
