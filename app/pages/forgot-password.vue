<template>
  <div class="form-wrap">

    <!-- Paso 1: ingresar correo -->
    <template v-if="step === 1">
      <div v-if="error" class="alert alert-error">
        {{ error }}
        <button class="alert-close" @click="error = ''">✕</button>
      </div>

      <p class="form-desc">Ingresa tu correo electrónico y te enviaremos un código de verificación.</p>

      <form class="form" @submit.prevent="sendCode">
        <div class="input-group">
          <span class="input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </span>
          <input
            v-model="email"
            type="email"
            placeholder="Correo electrónico"
            class="form-input"
            autocomplete="email"
            required
          />
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading" class="spinner" />
          <span v-else>Enviar código</span>
        </button>
      </form>
    </template>

    <!-- Paso 2: ingresar código -->
    <template v-else-if="step === 2">
      <div class="alert alert-success" style="margin-bottom: 20px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <span>Código enviado a <strong>{{ email }}</strong></span>
      </div>

      <div v-if="error" class="alert alert-error">
        {{ error }}
        <button class="alert-close" @click="error = ''">✕</button>
      </div>

      <p class="form-desc">Ingresa el código de 6 dígitos que recibiste en tu correo. Expira en 15 minutos.</p>

      <form class="form" @submit.prevent="verifyCode">
        <div class="input-group">
          <span class="input-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <input
            v-model="code"
            type="text"
            placeholder="Código de 6 dígitos"
            class="form-input code-input"
            maxlength="6"
            inputmode="numeric"
            pattern="[0-9]{6}"
            autocomplete="one-time-code"
            required
          />
        </div>

        <button type="submit" class="submit-btn" :disabled="loading || code.length !== 6">
          <span v-if="loading" class="spinner" />
          <span v-else>Verificar código</span>
        </button>
      </form>

      <p class="resend-row">
        ¿No recibiste el código?
        <button class="resend-btn" :disabled="resendCooldown > 0" @click="resendCode">
          {{ resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar' }}
        </button>
      </p>
    </template>

    <p class="back-row">
      <NuxtLink to="/login" class="back-link">← Volver al inicio de sesión</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'auth', middleware: 'guest' })

const router = useRouter()
const api = useApi()

const step = ref(1)
const email = ref('')
const code = ref('')
const loading = ref(false)
const error = ref('')
const resendCooldown = ref(0)

let cooldownTimer: ReturnType<typeof setInterval> | null = null

async function sendCode() {
  loading.value = true
  error.value = ''
  try {
    await api.post('/auth/forgot-password', { email: email.value })
    step.value = 2
    startCooldown()
  } catch (e: any) {
    error.value = e.message || 'Ocurrió un error. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

async function verifyCode() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.post<{ resetToken: string }>('/auth/verify-reset-code', {
      email: email.value,
      code: code.value,
    })
    await router.push(`/reset-password?token=${res.resetToken}`)
  } catch (e: any) {
    error.value = e.message || 'Código incorrecto o expirado.'
    code.value = ''
  } finally {
    loading.value = false
  }
}

async function resendCode() {
  loading.value = true
  error.value = ''
  code.value = ''
  try {
    await api.post('/auth/forgot-password', { email: email.value })
    startCooldown()
  } catch (e: any) {
    error.value = e.message || 'No se pudo reenviar el código.'
  } finally {
    loading.value = false
  }
}

function startCooldown() {
  resendCooldown.value = 60
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldownTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
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
  line-height: 1.5;
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

.code-input {
  font-size: 22px;
  letter-spacing: 6px;
  text-align: center;
  font-weight: 600;
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

/* ── Reenviar ── */
.resend-row {
  text-align: center;
  margin-top: 14px;
  font-size: 13.5px;
  color: rgba(200, 230, 210, 0.6);
}
.resend-btn {
  background: none;
  border: none;
  color: #4cdf80;
  font-size: 13.5px;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  padding: 0;
  transition: color 0.2s;
}
.resend-btn:disabled {
  color: rgba(200, 230, 210, 0.4);
  cursor: not-allowed;
  text-decoration: none;
}
.resend-btn:not(:disabled):hover { color: #80ff9e; }

/* ── Back link ── */
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
