<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1 class="text-4xl font-bold mb-2">Panel de Administración</h1>
      <p class="text-surface-600 dark:text-surface-400">
        Gestiona tickets, usuarios y monitorea la actividad del sistema
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <!-- Card: Gestión de Tickets -->
      <Card class="admin-card hover:shadow-lg transition-shadow cursor-pointer">
        <template #header>
          <div class="p-6 bg-primary-500 text-white rounded-t-lg">
            <i class="pi pi-ticket text-5xl"></i>
          </div>
        </template>
        <template #title>
          <h2 class="text-2xl font-semibold">Gestión de Tickets</h2>
        </template>
        <template #content>
          <p class="text-surface-600 dark:text-surface-400 mb-4">
            Administra el estado de los tickets de usuarios y visualiza información
            detallada de cada boleto.
          </p>
          <Button
            label="Ir a Gestión de Tickets"
            icon="pi pi-arrow-right"
            class="w-full"
            @click="router.push('/admin/tickets')"
          />
        </template>
      </Card>

      <!-- Card: Registrar Equipos -->
      <Card class="admin-card hover:shadow-lg transition-shadow cursor-pointer">
        <template #header>
          <div class="p-6 bg-blue-500 text-white rounded-t-lg">
            <i class="pi pi-shield text-5xl"></i>
          </div>
        </template>
        <template #title>
          <h2 class="text-2xl font-semibold">Registrar Equipos</h2>
        </template>
        <template #content>
          <p class="text-surface-600 dark:text-surface-400 mb-4">
            Añade nuevos equipos al torneo y gestiona el listado de equipos
            participantes.
          </p>
          <Button
            label="Registrar Equipos"
            icon="pi pi-arrow-right"
            class="w-full"
            severity="info"
            @click="router.push('/admin/register-team')"
          />
        </template>
      </Card>

      <!-- Card: Registrar Partidos -->
      <Card class="admin-card hover:shadow-lg transition-shadow cursor-pointer">
        <template #header>
          <div class="p-6 bg-green-500 text-white rounded-t-lg">
            <i class="pi pi-calendar-plus text-5xl"></i>
          </div>
        </template>
        <template #title>
          <h2 class="text-2xl font-semibold">Registrar Partidos</h2>
        </template>
        <template #content>
          <p class="text-surface-600 dark:text-surface-400 mb-4">
            Crea nuevos partidos programando equipos, estadios, fechas y fases del
            torneo.
          </p>
          <Button
            label="Crear Partido"
            icon="pi pi-arrow-right"
            class="w-full"
            severity="success"
            @click="router.push('/admin/register-match')"
          />
        </template>
      </Card>

      <!-- Card: Registrar Resultados -->
      <Card class="admin-card hover:shadow-lg transition-shadow cursor-pointer">
        <template #header>
          <div class="p-6 bg-yellow-500 text-white rounded-t-lg">
            <i class="pi pi-pencil text-5xl"></i>
          </div>
        </template>
        <template #title>
          <h2 class="text-2xl font-semibold">Registrar Resultados</h2>
        </template>
        <template #content>
          <p class="text-surface-600 dark:text-surface-400 mb-4">
            Actualiza los marcadores finales de los partidos ya disputados en el
            torneo.
          </p>
          <Button
            label="Ingresar Resultados"
            icon="pi pi-arrow-right"
            class="w-full"
            severity="warning"
            @click="router.push('/admin/match-results')"
          />
        </template>
      </Card>

      <!-- Card: Gestión de Fases -->
      <Card class="admin-card hover:shadow-lg transition-shadow cursor-pointer">
        <template #header>
          <div class="p-6 bg-purple-500 text-white rounded-t-lg">
            <i class="pi pi-sitemap text-5xl"></i>
          </div>
        </template>
        <template #title>
          <h2 class="text-2xl font-semibold">Gestión de Fases</h2>
        </template>
        <template #content>
          <p class="text-surface-600 dark:text-surface-400 mb-4">
            Administra el avance del torneo entre fases y clasifica equipos
            automáticamente.
          </p>
          <Button
            label="Gestionar Fases"
            icon="pi pi-arrow-right"
            class="w-full"
            severity="help"
            @click="router.push('/admin/phase-management')"
          />
        </template>
      </Card>

      <!-- Card: Tabla de Posiciones -->
      <Card class="admin-card hover:shadow-lg transition-shadow cursor-pointer">
        <template #header>
          <div class="p-6 bg-indigo-500 text-white rounded-t-lg">
            <i class="pi pi-table text-5xl"></i>
          </div>
        </template>
        <template #title>
          <h2 class="text-2xl font-semibold">Tabla de Posiciones</h2>
        </template>
        <template #content>
          <p class="text-surface-600 dark:text-surface-400 mb-4">
            Consulta las clasificaciones y estadísticas de los equipos en la Fase de
            Grupos.
          </p>
          <Button
            label="Ver Clasificación"
            icon="pi pi-arrow-right"
            class="w-full"
            severity="secondary"
            @click="router.push('/admin/standings')"
          />
        </template>
      </Card>

      <!-- Card: Bitácora de Eventos -->
      <Card class="admin-card hover:shadow-lg transition-shadow cursor-pointer">
        <template #header>
          <div class="p-6 bg-teal-500 text-white rounded-t-lg">
            <i class="pi pi-file-edit text-5xl"></i>
          </div>
        </template>
        <template #title>
          <h2 class="text-2xl font-semibold">Bitácora de Eventos</h2>
        </template>
        <template #content>
          <p class="text-surface-600 dark:text-surface-400 mb-4">
            Consulta los logs de auditoría y monitorea todas las acciones realizadas
            en el sistema.
          </p>
          <Button
            label="Ver Bitácora"
            icon="pi pi-arrow-right"
            class="w-full"
            severity="success"
            @click="router.push('/admin/audit-logs')"
          />
        </template>
      </Card>

      <!-- Card: Criterios de Elegibilidad -->
      <Card class="admin-card hover:shadow-lg transition-shadow cursor-pointer">
        <template #header>
          <div class="p-6 bg-orange-500 text-white rounded-t-lg">
            <i class="pi pi-users text-5xl"></i>
          </div>
        </template>
        <template #title>
          <h2 class="text-2xl font-semibold">Criterios de Elegibilidad</h2>
        </template>
        <template #content>
          <p class="text-surface-600 dark:text-surface-400 mb-4">
            Configura los criterios de elegibilidad para la compra de boletos y
            participación en sorteos.
          </p>
          <Button
            label="Configurar Criterios"
            icon="pi pi-arrow-right"
            class="w-full"
            severity="warning"
            @click="router.push('/admin/eligibility-criteria')"
          />
        </template>
      </Card>

      <!-- Card: Sorteos -->
      <Card class="admin-card hover:shadow-lg transition-shadow cursor-pointer">
        <template #header>
          <div class="p-6 bg-pink-500 text-white rounded-t-lg">
            <i class="pi pi-gift text-5xl"></i>
          </div>
        </template>
        <template #title>
          <h2 class="text-2xl font-semibold">Gestión de Sorteos</h2>
        </template>
        <template #content>
          <p class="text-surface-600 dark:text-surface-400 mb-4">
            Administra los sorteos de boletos y realiza la selección de ganadores de
            forma automática.
          </p>
          <Button
            label="Administrar Sorteos"
            icon="pi pi-arrow-right"
            class="w-full"
            severity="danger"
            @click="router.push('/admin/raffle')"
          />
        </template>
      </Card>

      <!-- Card: Monitoreo en Tiempo Real -->
      <Card class="admin-card hover:shadow-lg transition-shadow">
        <template #header>
          <div class="p-6 bg-cyan-500 text-white rounded-t-lg">
            <i class="pi pi-chart-line text-5xl"></i>
          </div>
        </template>
        <template #title>
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-semibold">Monitoreo en Tiempo Real</h2>
            <Badge
              :value="wsConnected ? 'Conectado' : 'Desconectado'"
              :severity="wsConnected ? 'success' : 'danger'"
            />
          </div>
        </template>
        <template #content>
          <p class="text-surface-600 dark:text-surface-400 mb-4">
            Estado de la conexión WebSocket para eventos en tiempo real.
          </p>
          <div class="flex gap-2">
            <Button
              v-if="!wsConnected"
              label="Conectar"
              icon="pi pi-wifi"
              class="flex-1"
              severity="info"
              @click="connectWebSocket"
            />
            <Button
              v-else
              label="Desconectar"
              icon="pi pi-times"
              class="flex-1"
              severity="danger"
              outlined
              @click="disconnectWebSocket"
            />
          </div>
        </template>
      </Card>
    </div>

    <!-- Eventos recientes del WebSocket -->
    <Card v-if="wsConnected && recentEvents.length > 0" class="mt-8">
      <template #title>
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold">Eventos Recientes (Tiempo Real)</h2>
          <Button
            label="Limpiar"
            icon="pi pi-trash"
            size="small"
            severity="secondary"
            outlined
            @click="recentEvents = []"
          />
        </div>
      </template>
      <template #content>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <div
            v-for="(event, index) in recentEvents"
            :key="index"
            class="p-4 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <Badge :value="event.event_type || 'event'" severity="info" />
                  <span class="text-sm text-surface-500">{{ event.timestamp }}</span>
                </div>
                <pre
                  class="text-sm bg-surface-100 dark:bg-surface-900 p-3 rounded overflow-x-auto"
                >{{ JSON.stringify(event, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import Card from "primevue/card";
import Button from "primevue/button";
import Badge from "primevue/badge";
import { useToast } from "primevue/usetoast";
import websocketService from "@/services/WebSocketService";

const router = useRouter();
const toast = useToast();

const wsConnected = ref(false);
const recentEvents = ref([]);

const connectWebSocket = () => {
  websocketService.connect();
};

const disconnectWebSocket = () => {
  websocketService.disconnect();
};

const handleWebSocketConnected = () => {
  wsConnected.value = true;
  toast.add({
    severity: "success",
    summary: "WebSocket Conectado",
    detail: "Ahora recibirás eventos en tiempo real",
    life: 3000,
  });
};

const handleWebSocketDisconnected = () => {
  wsConnected.value = false;
  toast.add({
    severity: "warn",
    summary: "WebSocket Desconectado",
    detail: "La conexión en tiempo real se ha perdido",
    life: 3000,
  });
};

const handleWebSocketMessage = (data) => {
  // Agregar timestamp al evento
  const eventWithTimestamp = {
    ...data,
    timestamp: new Date().toLocaleString(),
  };

  // Agregar al inicio del array (eventos más recientes primero)
  recentEvents.value.unshift(eventWithTimestamp);

  // Limitar a los últimos 20 eventos
  if (recentEvents.value.length > 20) {
    recentEvents.value = recentEvents.value.slice(0, 20);
  }

  // Mostrar notificación toast
  toast.add({
    severity: "info",
    summary: "Nuevo Evento",
    detail: `Tipo: ${data.event_type || "Desconocido"}`,
    life: 2000,
  });
};

onMounted(() => {
  // Registrar listeners del WebSocket
  websocketService.on("connected", handleWebSocketConnected);
  websocketService.on("disconnected", handleWebSocketDisconnected);
  websocketService.on("message", handleWebSocketMessage);

  // Verificar si ya está conectado
  if (websocketService.isConnected()) {
    wsConnected.value = true;
  }
});

onUnmounted(() => {
  // Limpiar listeners al desmontar el componente
  websocketService.off("connected", handleWebSocketConnected);
  websocketService.off("disconnected", handleWebSocketDisconnected);
  websocketService.off("message", handleWebSocketMessage);
});
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.admin-card {
  transition: all 0.3s ease;
}

.admin-card:hover {
  transform: translateY(-5px);
}
</style>
