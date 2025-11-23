<script setup>
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import Toast from "primevue/toast";
import NavBar from "@/components/NavBar.vue";

const route = useRoute();

// Rutas donde NO se debe mostrar el NavBar
const hideNavBarRoutes = ["/login", "/register"];

// Computed para verificar si se debe mostrar el NavBar
const showNavBar = computed(() => {
  return !hideNavBarRoutes.includes(route.path);
});
</script>

<template>
  <div class="min-h-screen">
    <Toast />
    <NavBar v-if="showNavBar" />
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
