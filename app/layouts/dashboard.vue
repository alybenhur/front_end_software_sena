<template>
  <v-app>

    <!-- ══════════════════════════════════
         SIDEBAR
         ══════════════════════════════════ -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      :permanent="!isMobile"
      class="dash-sidebar"
      width="256"
      rail-width="72"
    >

      <!-- ── Brand header ── -->
      <div class="sidebar-brand" :class="{ 'sidebar-brand--rail': rail }">
        <div class="sidebar-logo-wrap">
          <v-icon size="20" color="white">mdi-book-education-outline</v-icon>
        </div>
        <div v-if="!rail" class="sidebar-brand-text">
          <span class="sidebar-app-name">Software Mgmt</span>
          <span class="sidebar-app-sub">SENA · Colombia</span>
        </div>
        <button
          v-if="!isMobile"
          class="sidebar-collapse-btn"
          :class="{ 'sidebar-collapse-btn--rail': rail }"
          @click="rail = !rail"
        >
          <v-icon size="16" color="rgba(255,255,255,0.75)">
            {{ rail ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
          </v-icon>
        </button>
      </div>

      <!-- ── Navigation ── -->
      <div class="sidebar-nav">
        <div v-if="!rail" class="nav-section-label">MENÚ</div>

        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="{ 'nav-item--active': isActive(item.to) }"
        >
          <div class="nav-icon-box">
            <v-icon size="17">{{ item.icon }}</v-icon>
          </div>
          <span v-if="!rail" class="nav-item-label">{{ item.title }}</span>
          <div v-if="!rail && isActive(item.to)" class="nav-active-pill" />
        </NuxtLink>
      </div>

      <!-- ── Footer: user + logout ── -->
      <template #append>
        <div class="sidebar-footer" :class="{ 'sidebar-footer--rail': rail }">
          <div class="footer-user">
            <div class="footer-avatar">
              <span>{{ initials }}</span>
            </div>
            <div v-if="!rail" class="footer-user-info">
              <span class="footer-user-name">{{ authStore.fullName }}</span>
              <span class="footer-user-role">{{ roleLabel }}</span>
            </div>
          </div>
          <button class="footer-logout" :title="rail ? 'Cerrar sesión' : ''" @click="logout">
            <v-icon size="15" color="#EF5350">mdi-logout</v-icon>
            <span v-if="!rail" class="footer-logout-text">Salir</span>
          </button>
        </div>
      </template>

    </v-navigation-drawer>

    <!-- ══════════════════════════════════
         APP BAR
         ══════════════════════════════════ -->
    <v-app-bar class="dash-appbar" elevation="0" height="60">
      <!-- Hamburguesa (mobile) -->
      <v-btn
        icon
        variant="text"
        class="d-lg-none ml-1"
        color="#1C1C1E"
        size="small"
        @click="drawer = !drawer"
      >
        <v-icon size="20">mdi-menu</v-icon>
      </v-btn>

      <span class="dash-page-title">{{ pageTitle }}</span>
      <v-spacer />

      <div class="appbar-role-chip">
        <div class="role-dot" />
        {{ authStore.user?.role }}
      </div>
    </v-app-bar>

    <!-- ══════════════════════════════════
         MAIN CONTENT
         ══════════════════════════════════ -->
    <v-main class="dash-main">
      <div class="dash-content">
        <slot />
      </div>
    </v-main>

  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'

const authStore = useAuthStore()
const { logout } = useAuth()
const route = useRoute()

const drawer = ref(true)
const rail   = ref(false)

// Mobile detection
const isMobile = ref(false)
function checkMobile() {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) drawer.value = false
}

onMounted(() => {
  authStore.loadFromStorage()
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
onUnmounted(() => window.removeEventListener('resize', checkMobile))

// ── Nav items by role ────────────────────────────
const adminItems = [
  { title: 'Inicio',    icon: 'mdi-view-dashboard-outline',  to: '/admin' },
  { title: 'Software',  icon: 'mdi-package-variant-closed',   to: '/admin/software' },
  { title: 'Noticias',  icon: 'mdi-newspaper-variant-outline', to: '/admin/noticias' },
  { title: 'Usuarios',  icon: 'mdi-account-group-outline',     to: '/admin/usuarios' },
  { title: 'Mi perfil', icon: 'mdi-account-circle-outline',    to: '/admin/perfil' },
]
const noticiasItems = [
  { title: 'Mis noticias',  icon: 'mdi-newspaper-variant-outline', to: '/noticias-editor' },
  { title: 'Nueva noticia', icon: 'mdi-plus-circle-outline',        to: '/noticias-editor/nueva' },
  { title: 'Mi perfil',     icon: 'mdi-account-circle-outline',     to: '/noticias-editor/perfil' },
]
const clientItems = [
  { title: 'Catálogo',  icon: 'mdi-apps',                   to: '/dashboard' },
  { title: 'Mi perfil', icon: 'mdi-account-circle-outline',  to: '/dashboard/perfil' },
]

const allItems = [...adminItems, ...noticiasItems, ...clientItems]

const navItems = computed(() => {
  const role = authStore.user?.role
  if (role === 'super_admin') return adminItems
  if (role === 'noticias')    return noticiasItems
  return clientItems
})

const roleLabel = computed(() => {
  const r = authStore.user?.role
  if (r === 'super_admin') return 'Super Admin'
  if (r === 'noticias')    return 'Redactor'
  return 'Usuario'
})

const pageTitle = computed(() =>
  allItems.find(i => i.to === route.path)?.title || 'Dashboard'
)

const initials = computed(() => {
  const name = authStore.fullName || ''
  return name.split(' ').map((n: string) => n[0] ?? '').join('').toUpperCase().slice(0, 2) || '?'
})

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped>
/* ══════════════════════════════════
   SIDEBAR BASE
   ══════════════════════════════════ */
.dash-sidebar {
  background: #0a2014 !important;
  border-right: 1px solid rgba(76, 223, 128, 0.18) !important;
  box-shadow: 2px 0 18px rgba(0, 0, 0, 0.4) !important;
}

/* ── Brand area ── */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  height: 64px;
  background: linear-gradient(135deg, #061410 0%, #0a2014 55%, #06160d 100%);
  border-bottom: 1px solid rgba(76, 223, 128, 0.2);
  flex-shrink: 0;
  position: relative;
}
.sidebar-brand--rail {
  padding: 0;
  justify-content: center;
  gap: 0;
}

.sidebar-logo-wrap {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(76, 223, 128, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(76, 223, 128, 0.35);
  box-shadow: 0 0 12px rgba(76, 223, 128, 0.2);
}

.sidebar-brand-text {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}
.sidebar-app-name {
  font-size: 0.87rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  letter-spacing: 0.01em;
  white-space: nowrap;
}
.sidebar-app-sub {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.62);
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.sidebar-collapse-btn {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.18s;
}
.sidebar-collapse-btn:hover { background: rgba(255, 255, 255, 0.22); }
.sidebar-collapse-btn--rail { display: none; }

/* ── Navigation ── */
.sidebar-nav {
  padding: 16px 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.nav-section-label {
  font-size: 9.5px;
  font-weight: 800;
  color: rgba(200, 230, 210, 0.4);
  letter-spacing: 0.08em;
  padding: 0 8px 8px;
}

/* Nav item */
.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 10px;
  text-decoration: none;
  color: rgba(232, 245, 233, 0.72);
  font-size: 0.85rem;
  font-weight: 500;
  transition: background 0.18s, color 0.18s;
  cursor: pointer;
}
.nav-item:hover {
  background: rgba(76, 223, 128, 0.08);
  color: #4cdf80;
}
.nav-item--active {
  background: rgba(76, 223, 128, 0.12);
  color: #4cdf80;
  font-weight: 700;
  border: 1px solid rgba(76, 223, 128, 0.25);
}

.nav-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: transparent;
  transition: background 0.18s;
  color: inherit;
}
.nav-item:hover .nav-icon-box {
  background: rgba(76, 223, 128, 0.12);
}
.nav-item--active .nav-icon-box {
  background: linear-gradient(135deg, #2E8B57, #4cdf80);
  color: #061410 !important;
  box-shadow: 0 0 14px rgba(76, 223, 128, 0.4);
}
.nav-item--active .nav-icon-box :deep(.v-icon) { color: #061410 !important; }

.nav-item-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-active-pill {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4cdf80;
  box-shadow: 0 0 8px rgba(76, 223, 128, 0.7);
  flex-shrink: 0;
}

/* ── Sidebar footer ── */
.sidebar-footer {
  padding: 12px 10px;
  border-top: 1px solid rgba(76, 223, 128, 0.18);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.sidebar-footer--rail {
  padding: 12px 10px;
  align-items: center;
}

.footer-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 6px;
  border-radius: 10px;
  background: rgba(76, 223, 128, 0.08);
  border: 1px solid rgba(76, 223, 128, 0.15);
}
.footer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2E8B57, #4cdf80);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: #061410;
  flex-shrink: 0;
  box-shadow: 0 0 12px rgba(76, 223, 128, 0.35);
}
.footer-user-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.footer-user-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #e8f5e9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.footer-user-role {
  font-size: 0.68rem;
  color: rgba(200, 230, 210, 0.55);
  letter-spacing: 0.03em;
}

.footer-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255, 107, 107, 0.08);
  border: 1px solid rgba(255, 107, 107, 0.18);
  cursor: pointer;
  color: #FF6B6B;
  font-size: 0.8rem;
  font-weight: 600;
  transition: background 0.18s;
}
.footer-logout:hover { background: rgba(255, 107, 107, 0.16); }
.footer-logout-text { color: #FF6B6B; }

/* ══════════════════════════════════
   APP BAR
   ══════════════════════════════════ */
.dash-appbar {
  background: #0a2014 !important;
  border-bottom: 1px solid rgba(76, 223, 128, 0.18) !important;
}
.dash-page-title {
  font-size: 1rem;
  font-weight: 800;
  color: #e8f5e9;
  letter-spacing: -0.01em;
  margin-left: 4px;
}
.appbar-role-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4cdf80;
  background: rgba(76, 223, 128, 0.10);
  padding: 5px 14px;
  border-radius: 20px;
  border: 1px solid rgba(76, 223, 128, 0.25);
  margin-right: 16px;
  text-transform: capitalize;
}
.role-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4cdf80;
  box-shadow: 0 0 8px rgba(76, 223, 128, 0.7);
}

/* ══════════════════════════════════
   MAIN
   ══════════════════════════════════ */
.dash-main {
  background: #06160d !important;
}
.dash-content {
  padding: 28px 28px;
  min-height: 100%;
  animation: dashFadeIn 0.4s ease both;
}
@keyframes dashFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 1023px) {
  .dash-content { padding: 20px 16px; }
}
</style>
