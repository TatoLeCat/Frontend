<template>
  <div class="bg-surface-50 dark:bg-surface-950 min-h-screen px-6 py-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1
          class="text-surface-900 dark:text-surface-0 text-4xl md:text-5xl font-bold mb-4"
        >
          Bienvenido a Sigma Venta de Boletos
        </h1>
        <p class="text-surface-600 dark:text-surface-400 text-lg">
          Compra tus boletos para los mejores partidos de fútbol
        </p>
      </div>

      <!-- Sección de características -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div
          class="bg-surface-0 dark:bg-surface-900 rounded-lg shadow-sm p-6 text-center border border-surface-200 dark:border-surface-700"
        >
          <i class="pi pi-ticket text-4xl text-primary mb-4"></i>
          <h3
            class="text-xl font-semibold text-surface-900 dark:text-surface-0 mb-2"
          >
            Boletos Fáciles
          </h3>
          <p class="text-surface-600 dark:text-surface-400">
            Compra tus boletos de forma rápida y segura
          </p>
        </div>

        <div
          class="bg-surface-0 dark:bg-surface-900 rounded-lg shadow-sm p-6 text-center border border-surface-200 dark:border-surface-700"
        >
          <i class="pi pi-calendar text-4xl text-primary mb-4"></i>
          <h3
            class="text-xl font-semibold text-surface-900 dark:text-surface-0 mb-2"
          >
            Partidos
          </h3>
          <p class="text-surface-600 dark:text-surface-400">
            Visualiza todos los proximos partidos
          </p>
        </div>

        <div
          class="bg-surface-0 dark:bg-surface-900 rounded-lg shadow-sm p-6 text-center border border-surface-200 dark:border-surface-700"
        >
          <i class="pi pi-shield text-4xl text-primary mb-4"></i>
          <h3
            class="text-xl font-semibold text-surface-900 dark:text-surface-0 mb-2"
          >
            Seguro y Confiable
          </h3>
          <p class="text-surface-600 dark:text-surface-400">
            Tus pagos están protegidos en todo momento
          </p>
        </div>
      </div>

      <div class="text-center">
        <Button
          label="Ver Partidos Disponibles"
          icon="pi pi-arrow-right"
          iconPos="right"
          size="large"
          @click="router.push('/partidos')"
          class="px-8 py-3"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style scoped></style>
