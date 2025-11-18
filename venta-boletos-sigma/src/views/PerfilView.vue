<template>
  <div class="bg-surface-50 dark:bg-surface-950 min-h-screen px-6 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-surface-900 dark:text-surface-0 text-3xl font-bold mb-2">
          Mi Perfil
        </h1>
        <p class="text-surface-600 dark:text-surface-400">
          Gestiona tu información personal
        </p>
      </div>

      <div
        class="bg-surface-0 dark:bg-surface-900 rounded-lg shadow-sm p-8 border border-surface-200 dark:border-surface-700"
      >
        <div class="flex items-center gap-6 mb-8">
          <div
            class="w-24 h-24 rounded-full bg-primary flex items-center justify-center"
          >
            <i class="pi pi-user text-4xl text-white"></i>
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0">
              Usuario
            </h2>
            <p class="text-surface-600 dark:text-surface-400">
              Información de tu cuenta
            </p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300"
                >Nombre</label
              >
              <p class="text-surface-900 dark:text-surface-0 mt-1">-</p>
            </div>
            <div>
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300"
                >Email</label
              >
              <p class="text-surface-900 dark:text-surface-0 mt-1">-</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AuthService from "@/services/AuthService";
import { ref, onMounted } from "vue";

const user = ref(null);

onMounted(() => {
  user.value = AuthService.getUser();
});
</script>
