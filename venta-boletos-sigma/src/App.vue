<template>
  <div class="bg-surface-50 dark:bg-surface-950 min-h-screen px-6 py-6 md:px-20">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2">
          Plataforma de Boletos
        </h1>
        <p class="text-surface-600 dark:text-surface-300">
          Prueba rápida de todas las vistas del sistema
        </p>
      </div>

      <!-- Navegación principal -->
      <div class="bg-surface-0 dark:bg-surface-900 rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-wrap gap-2">
          <RouterLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="px-4 py-2 rounded-lg transition-all font-medium"
            :class="isActive(link.to)
              ? 'bg-primary text-white shadow-md'
              : 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700'"
          >
            {{ link.label }}
          </RouterLink>
        </div>
      </div>

      <!-- Contenedor de vistas -->
      <div class="bg-surface-0 dark:bg-surface-900 rounded-lg shadow-sm p-6 md:p-8">
        <RouterView v-slot="{ Component }">
          <transition name="view" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// Enlaces de navegación (coinciden con tus rutas definidas)
const links = [
  { to: '/TicketOffers', label: '🎟️ Ofertas de Boletos' },
  { to: '/ticket/:1', label: '📋 Detalle del Boleto' },
  { to: '/checkout', label: '💳 Checkout' },
]

// Función para marcar enlace activo
const isActive = (path) => {
  return computed(() => route.path === path).value
}
</script>

<style scoped>
/* Transición suave entre vistas */
.view-enter-active,
.view-leave-active {
  transition: opacity 0.25s ease;
}
.view-enter-from,
.view-leave-to {
  opacity: 0;
}

/* Estilos base */
.router-link-active {
  font-weight: 600;
}
</style>"