<template>
  <div class="bg-surface-50 dark:bg-surface-950 min-h-screen px-6 py-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1
          class="text-surface-900 dark:text-surface-0 text-3xl font-bold mb-2"
        >
          Historial de Compras
        </h1>
        <p class="text-surface-600 dark:text-surface-400">
          Revisa todas tus compras de boletos
        </p>
      </div>

      <!-- Lista de compras -->
      <div class="space-y-4">
        <!-- Card de ejemplo -->
        <div
          class="bg-surface-0 dark:bg-surface-900 rounded-lg shadow-sm p-6 border border-surface-200 dark:border-surface-700"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3
                class="text-lg font-semibold text-surface-900 dark:text-surface-0 mb-1"
              >
                No hay compras registradas
              </h3>
              <p class="text-surface-600 dark:text-surface-400 text-sm">
                Cuando realices tu primera compra, aparecerá aquí
              </p>
            </div>
            <i
              class="pi pi-receipt text-4xl text-surface-300 dark:text-surface-600"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
