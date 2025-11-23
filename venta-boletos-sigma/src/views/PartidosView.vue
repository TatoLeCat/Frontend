<template>
  <div class="partidos-view min-h-screen px-6 py-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1
          class="text-surface-900 dark:text-surface-0 text-3xl font-bold mb-2"
        >
          Partidos de Fútbol
        </h1>
        <p class="text-surface-600 dark:text-surface-400">
          Encuentra y compra boletos para tus partidos favoritos
        </p>
      </div>

      <!-- Grid de partidos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          class="bg-surface-0 dark:bg-surface-900 rounded-lg shadow-sm overflow-hidden border border-surface-200 dark:border-surface-700"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-surface-500 dark:text-surface-400"
                >Fase de grupos</span
              >
              <span
                class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded"
                >Disponible</span
              >
            </div>
            <h3
              class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-2"
            >
              Partido de ejemplo
            </h3>
            <p class="text-surface-600 dark:text-surface-400 text-sm mb-4">
              Próximamente contenido real
            </p>
            <div class="flex items-center justify-between">
              <span class="text-sm text-surface-500">Fecha: Por definir</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.partidos-view {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.partidos-view h1,
.partidos-view h3 {
  color: white !important;
}

.partidos-view p,
.partidos-view span {
  color: rgba(255, 255, 255, 0.9) !important;
}
</style>
