<template>
  <v-app>

    <!-- Navbar -->
    <v-app-bar
      :elevation="scrolled ? 6 : 1"
      class="sena-navbar"
      height="64"
    >
      <!-- Marca / Logo -->
      <v-app-bar-title class="brand-area">
        <NuxtLink to="/noticias" class="brand-link d-flex align-center text-decoration-none">
          <v-icon size="28" class="brand-icon mr-2">mdi-book-education-outline</v-icon>
          <div>
            <div class="brand-name">Software Management</div>
            <div class="brand-sub d-none d-sm-block">SENA · Colombia</div>
          </div>
        </NuxtLink>
      </v-app-bar-title>

      <!-- Links de navegación (desktop) -->
      <div class="d-none d-md-flex align-center nav-links ml-4">
        <NuxtLink
          to="/noticias"
          class="nav-link"
          :class="{ active: isActive('/noticias') }"
        >
          <v-icon size="15" class="nav-link-icon">mdi-newspaper-variant-outline</v-icon>
          Noticias
        </NuxtLink>
        <NuxtLink
          to="/catalogo"
          class="nav-link"
          :class="{ active: isActive('/catalogo') }"
        >
          <v-icon size="15" class="nav-link-icon">mdi-apps</v-icon>
          Catálogo
        </NuxtLink>
      </div>

      <v-spacer />

      <!-- Área de autenticación (desktop) -->
      <div class="d-none d-md-flex align-center auth-area">

        <!-- No autenticado -->
        <template v-if="!authStore.isAuthenticated">
          <v-btn
            to="/login"
            variant="text"
            class="login-btn"
            rounded="lg"
            size="small"
          >
            <v-icon start size="15">mdi-login-variant</v-icon>
            Ingresar
          </v-btn>
          <v-btn
            to="/register"
            class="register-btn ml-2"
            rounded="lg"
            size="small"
          >
            <v-icon start size="15">mdi-account-plus-outline</v-icon>
            Registrarse
          </v-btn>
        </template>

        <!-- Autenticado -->
        <template v-else>
          <v-btn
            :to="dashboardRoute"
            class="dashboard-btn mr-2"
            rounded="lg"
            size="small"
          >
            <v-icon start size="15">mdi-view-dashboard-outline</v-icon>
            Dashboard
          </v-btn>

          <v-menu :close-on-content-click="true" offset="8">
            <template #activator="{ props }">
              <v-btn v-bind="props" class="user-menu-btn" rounded="xl" size="small">
                <v-avatar size="26" class="user-avatar mr-2">
                  <span class="user-initials">{{ initials }}</span>
                </v-avatar>
                <span class="d-none d-lg-inline user-name">{{ authStore.fullName }}</span>
                <v-icon end size="14" class="chevron-icon">mdi-chevron-down</v-icon>
              </v-btn>
            </template>

            <v-card class="user-dropdown" min-width="210" rounded="xl">
              <v-card-item class="py-3 px-4">
                <template #prepend>
                  <v-avatar size="40" class="user-avatar-lg">
                    <span class="user-initials-lg">{{ initials }}</span>
                  </v-avatar>
                </template>
                <v-card-title class="text-body-2 font-weight-bold pa-0">
                  {{ authStore.fullName }}
                </v-card-title>
                <v-card-subtitle class="text-caption pa-0" style="text-transform:capitalize">
                  {{ authStore.user?.role }}
                </v-card-subtitle>
              </v-card-item>
              <v-divider />
              <v-list density="compact" nav class="py-2">
                <v-list-item
                  prepend-icon="mdi-logout"
                  title="Cerrar sesión"
                  rounded="lg"
                  class="logout-item"
                  @click="logout"
                />
              </v-list>
            </v-card>
          </v-menu>
        </template>
      </div>

      <!-- Botón hamburguesa (móvil) -->
      <v-app-bar-nav-icon
        class="d-md-none mobile-menu-btn"
        @click="drawer = !drawer"
      />
    </v-app-bar>

    <!-- Drawer móvil -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="right"
      class="mobile-drawer"
      width="270"
    >
      <div class="drawer-header pa-5">
        <div class="d-flex align-center mb-1">
          <v-icon size="24" class="mr-2" style="color:rgba(255,255,255,0.95)">
            mdi-book-education-outline
          </v-icon>
          <span class="text-subtitle-2 font-weight-bold" style="color:white">
            Software Management
          </span>
        </div>
        <span class="text-caption" style="color:rgba(255,255,255,0.65)">
          SENA · Colombia
        </span>
      </div>

      <v-list nav class="px-3 pt-2">
        <v-list-item
          to="/noticias"
          prepend-icon="mdi-newspaper-variant-outline"
          title="Noticias"
          rounded="lg"
          class="drawer-item"
          @click="drawer = false"
        />
        <v-list-item
          to="/catalogo"
          prepend-icon="mdi-apps"
          title="Catálogo"
          rounded="lg"
          class="drawer-item"
          @click="drawer = false"
        />

        <v-divider class="my-3" />

        <template v-if="!authStore.isAuthenticated">
          <v-list-item
            to="/login"
            prepend-icon="mdi-login-variant"
            title="Ingresar"
            rounded="lg"
            class="drawer-item"
            @click="drawer = false"
          />
          <v-list-item
            to="/register"
            prepend-icon="mdi-account-plus-outline"
            title="Registrarse"
            rounded="lg"
            class="drawer-item-accent"
            @click="drawer = false"
          />
        </template>
        <template v-else>
          <v-list-item
            :to="dashboardRoute"
            prepend-icon="mdi-view-dashboard-outline"
            title="Dashboard"
            rounded="lg"
            class="drawer-item"
            @click="drawer = false"
          />
          <v-list-item
            prepend-icon="mdi-logout"
            title="Cerrar sesión"
            rounded="lg"
            class="drawer-logout"
            @click="logout"
          />
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>

    <!-- Footer -->
    <footer class="sena-footer">
      <v-container>
        <div class="d-flex flex-column flex-sm-row align-center justify-space-between py-3">
          <div class="d-flex align-center mb-2 mb-sm-0">
            <v-icon size="18" class="mr-2 footer-icon">mdi-school</v-icon>
            <span class="text-caption footer-text font-weight-medium">
              © {{ year }} Software Management
            </span>
          </div>
          <span class="text-caption footer-sub">
            SENA · Servicio Nacional de Aprendizaje · Colombia
          </span>
        </div>
      </v-container>
    </footer>

  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'

const authStore = useAuthStore()
const { logout } = useAuth()
const route = useRoute()

const drawer = ref(false)
const scrolled = ref(false)
const year = new Date().getFullYear()

function handleScroll() {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  authStore.loadFromStorage()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const dashboardRoute = computed(() => {
  const role = authStore.user?.role
  if (role === 'super_admin') return '/admin'
  if (role === 'noticias')    return '/noticias-editor'
  return '/dashboard'
})

const initials = computed(() => {
  const name = authStore.fullName || ''
  return name
    .split(' ')
    .map((n: string) => n[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'
})

function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>

<style scoped>
/* ── Navbar ── */
.sena-navbar {
  background: linear-gradient(90deg, #061410 0%, #0a2014 50%, #06160d 100%) !important;
  border-bottom: 1px solid rgba(76, 223, 128, 0.18) !important;
  animation: navbarSlideDown 0.5s ease both;
  transition: box-shadow 0.35s ease !important;
}

/* ── Marca ── */
.brand-link {
  color: white;
  gap: 0;
}
.brand-icon {
  color: #4cdf80;
  filter: drop-shadow(0 0 6px rgba(76, 223, 128, 0.5));
  transition: transform 0.3s ease;
}
.brand-link:hover .brand-icon {
  transform: rotate(-8deg) scale(1.1);
}
.brand-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: white;
  line-height: 1.2;
  letter-spacing: 0.01em;
}
.brand-sub {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.62);
  letter-spacing: 0.06em;
  line-height: 1;
}

/* ── Links de nav ── */
.nav-links {
  gap: 2px;
}
.nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  font-size: 0.83rem;
  font-weight: 500;
  letter-spacing: 0.025em;
  padding: 6px 14px;
  border-radius: 8px;
  transition: color 0.2s, background 0.2s;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 14px;
  right: 14px;
  height: 2px;
  background: white;
  border-radius: 2px;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.25s ease;
}
.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.10);
}
.nav-link:hover::after,
.nav-link.active::after {
  transform: scaleX(1);
}
.nav-link.active {
  color: white;
  background: rgba(255, 255, 255, 0.13);
}
.nav-link-icon {
  transition: transform 0.2s ease;
}
.nav-link:hover .nav-link-icon {
  transform: scale(1.15);
}

/* ── Área auth ── */
.auth-area {
  gap: 4px;
}

/* Botón Ingresar */
.login-btn {
  color: rgba(255, 255, 255, 0.88) !important;
  font-size: 0.8rem !important;
  font-weight: 500 !important;
  letter-spacing: 0.02em !important;
  transition: color 0.2s, background 0.2s !important;
}
.login-btn:hover {
  color: white !important;
  background: rgba(255, 255, 255, 0.12) !important;
}

/* Botón Registrarse */
.register-btn {
  background: linear-gradient(135deg, #2E8B57 0%, #3cb869 100%) !important;
  color: #ffffff !important;
  border: 1px solid rgba(76, 223, 128, 0.55) !important;
  font-size: 0.8rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.02em !important;
  box-shadow: 0 2px 12px rgba(76, 223, 128, 0.25);
  transition: background 0.2s, transform 0.18s, box-shadow 0.2s !important;
}
.register-btn:hover {
  background: linear-gradient(135deg, #27a050 0%, #46d474 100%) !important;
  box-shadow: 0 4px 18px rgba(76, 223, 128, 0.45);
  transform: translateY(-1px);
}

/* Botón Dashboard */
.dashboard-btn {
  background: rgba(255, 255, 255, 0.13) !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.28) !important;
  font-size: 0.8rem !important;
  font-weight: 500 !important;
  transition: background 0.2s, transform 0.18s !important;
}
.dashboard-btn:hover {
  background: rgba(255, 255, 255, 0.22) !important;
  transform: translateY(-1px);
}

/* Botón usuario */
.user-menu-btn {
  background: rgba(255, 255, 255, 0.12) !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
  font-size: 0.8rem !important;
  transition: background 0.2s !important;
}
.user-menu-btn:hover {
  background: rgba(255, 255, 255, 0.20) !important;
}
.user-avatar {
  background: rgba(255, 255, 255, 0.25) !important;
}
.user-initials {
  font-size: 10px;
  font-weight: 800;
  color: white;
}
.user-name {
  font-weight: 500;
}
.chevron-icon {
  transition: transform 0.2s ease;
}
.user-menu-btn[aria-expanded="true"] .chevron-icon {
  transform: rotate(180deg);
}

/* Dropdown usuario */
.user-dropdown {
  background: #143020 !important;
  border: 1px solid rgba(76, 223, 128, 0.2) !important;
  color: #e8f5e9 !important;
}
.user-avatar-lg {
  background: rgba(76, 223, 128, 0.2) !important;
  border: 1px solid rgba(76, 223, 128, 0.4);
}
.user-initials-lg {
  font-size: 14px;
  font-weight: 800;
  color: #4cdf80;
}
.logout-item {
  color: #FF6B6B !important;
  transition: background 0.18s;
}
.logout-item:hover {
  background: rgba(255, 107, 107, 0.1) !important;
}

/* Hamburguesa móvil */
.mobile-menu-btn {
  color: white !important;
}

/* ── Drawer móvil ── */
.mobile-drawer {
  background: #0a2014 !important;
  border-left: 1px solid rgba(76, 223, 128, 0.18) !important;
}
.drawer-header {
  background: linear-gradient(135deg, #061410 0%, #0a2014 60%, #06160d 100%);
  border-bottom: 1px solid rgba(76, 223, 128, 0.2);
}
.drawer-item {
  color: #e8f5e9 !important;
  font-weight: 500;
  transition: background 0.18s, color 0.18s;
  margin-bottom: 2px;
}
.drawer-item:hover,
.drawer-item:focus {
  background: rgba(76, 223, 128, 0.10) !important;
  color: #4cdf80 !important;
}
.drawer-item-accent {
  color: #4cdf80 !important;
  font-weight: 600;
  background: rgba(76, 223, 128, 0.10) !important;
  margin-bottom: 2px;
  border-radius: 8px;
  border: 1px solid rgba(76, 223, 128, 0.25);
}
.drawer-logout {
  color: #FF6B6B !important;
  font-weight: 500;
  transition: background 0.18s;
}
.drawer-logout:hover {
  background: rgba(255, 107, 107, 0.1) !important;
}

/* ── Footer ── */
.sena-footer {
  background: linear-gradient(90deg, #061410 0%, #0a2014 50%, #06160d 100%);
  border-top: 1px solid rgba(76, 223, 128, 0.18);
}
.footer-icon {
  color: rgba(76, 223, 128, 0.75);
}
.footer-text {
  color: rgba(232, 245, 233, 0.92);
}
.footer-sub {
  color: rgba(200, 230, 210, 0.55);
  letter-spacing: 0.02em;
}

/* ── Animaciones ── */
@keyframes navbarSlideDown {
  from { transform: translateY(-100%); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
}
</style>
