<template>
  <div class="card">
    <Menubar :model="items">
      <template #start>
        <div
          class="flex items-center gap-2 cursor-pointer"
          @click="router.push('/')"
        >
          <i class="pi pi-ticket text-3xl text-primary"></i>
          <span class="text-xl font-bold text-surface-900 dark:text-surface-0">
            Sigma
          </span>
        </div>
      </template>
      <template #item="{ item, props, hasSubmenu }">
        <a
          v-ripple
          class="flex items-center gap-2 transition-all duration-200"
          v-bind="props.action"
          :class="{
            'bg-primary-100 dark:bg-primary-500/30 text-primary dark:text-primary-400 font-semibold border-b-2 border-primary dark:border-primary-400':
              isActiveRoute(item.route),
          }"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
          <Badge v-if="item.badge" class="ml-2" :value="item.badge" />
          <i v-if="hasSubmenu" class="pi pi-angle-down ml-auto"></i>
        </a>
      </template>
      <template #end>
        <div class="flex items-center gap-4">
          <Button
            v-if="!isAuthenticated"
            label="Iniciar Sesión"
            icon="pi pi-sign-in"
            @click="router.push('/login')"
            outlined
            size="small"
          />
          <Button
            v-else
            icon="pi pi-sign-out"
            label="Cerrar Sesión"
            @click="handleLogout"
            outlined
            severity="danger"
            size="small"
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import Menubar from "primevue/menubar";
import Button from "primevue/button";
import Badge from "primevue/badge";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import AuthService from "@/services/AuthService";

const router = useRouter();
const route = useRoute();
const toast = useToast();

// Verificar si el usuario está autenticado
const isAuthenticated = computed(() => AuthService.isAuthenticated());

// Función para verificar si una ruta está activa
const isActiveRoute = (routePath) => {
  return route.path === routePath;
};

// Menú de navegación
const items = ref([
  {
    label: "Inicio",
    icon: "pi pi-home",
    route: "/",
    command: () => router.push("/"),
  },
  {
    label: "Partidos",
    icon: "pi pi-calendar",
    route: "/partidos",
    command: () => router.push("/partidos"),
  },
  {
    label: "Mi Perfil",
    icon: "pi pi-user",
    route: "/perfil",
    command: () => router.push("/perfil"),
  },
  {
    label: "Historial",
    icon: "pi pi-receipt",
    route: "/historial",
    command: () => router.push("/historial"),
  },
]);

// Función para cerrar sesión
const handleLogout = () => {
  AuthService.logout();
  toast.add({
    severity: "success",
    summary: "Sesión cerrada",
    detail: "Has cerrado sesión exitosamente",
    life: 3000,
  });
  router.push("/login");
};
</script>

<style scoped>
.card {
  margin-bottom: 0;
}
</style>
