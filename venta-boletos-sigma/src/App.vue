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

      <!-- Tabs Navigation -->
      <div class="bg-surface-0 dark:bg-surface-900 rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="tab in tabs"
            :key="tab.id"
            :label="tab.label"
            :severity="activeTab === tab.id ? 'primary' : 'secondary'"
            @click="activeTab = tab.id"
            class="px-4 py-2 rounded-lg transition-all"
            :outlined="activeTab !== tab.id"
          />
        </div>
      </div>

      <!-- Views Container -->
      <div class="bg-surface-0 dark:bg-surface-900 rounded-lg shadow-sm p-6 md:p-8">
        <!-- Login View -->
        <div v-if="activeTab === 'login'" class="w-full">
          <Login />
        </div>

        <!-- Ticket Offers View -->
        <div v-if="activeTab === 'offers'" class="w-full">
          <TicketOffers />
        </div>

        <!-- Ticket Detail View -->
        <div v-if="activeTab === 'detail'" class="w-full">
          <TicketDetail />
        </div>

        <!-- Checkout View -->
        <div v-if="activeTab === 'checkout'" class="w-full">
          <Checkout />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "primevue/button";

// <CHANGE> Importar todas las vistas
import Login from "./views/LoginView.vue";
import TicketOffers from "./views/TicketOffersView.vue";
import TicketDetail from "./views/TicketDetailView.vue";
import Checkout from "./views/CheckoutView.vue";

// <CHANGE> Control del tab activo
const activeTab = ref("login");

// <CHANGE> Configuración de tabs para navegar entre vistas
const tabs = [
  { id: "login", label: "🔐 Login" },
  { id: "offers", label: "🎟️ Ofertas de Boletos" },
  { id: "detail", label: "📋 Detalle del Boleto" },
  { id: "checkout", label: "💳 Checkout" },
];
</script>

<style scoped>
/* Animación suave entre vistas */
.view-enter-active,
.view-leave-active {
  transition: opacity 0.2s ease;
}

.view-enter-from,
.view-leave-to {
  opacity: 0;
}
</style>