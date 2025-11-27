<template>
  <div class="admin-audit-logs">
    <div class="header mb-6">
      <h1 class="text-4xl font-bold mb-2">Bitácora de Eventos (Audit Logs)</h1>
      <p class="text-surface-600 dark:text-surface-400">
        Consulta el historial de todas las acciones realizadas en el sistema
      </p>
    </div>

    <!-- Filtros y controles -->
    <Card class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex flex-col gap-2">
            <label for="entityFilter" class="font-semibold">Filtrar por Entidad</label>
            <Select
              id="entityFilter"
              v-model="selectedEntity"
              :options="entityOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Todas las entidades"
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="limitFilter" class="font-semibold">Límite de Registros</label>
            <Select
              id="limitFilter"
              v-model="selectedLimit"
              :options="limitOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="50 registros"
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-2 justify-end">
            <Button
              label="Cargar Logs"
              icon="pi pi-refresh"
              @click="loadAuditLogs"
              class="w-full"
            />
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <Button
            label="Auto-actualizar"
            :icon="autoRefresh ? 'pi pi-pause' : 'pi pi-play'"
            @click="toggleAutoRefresh"
            :severity="autoRefresh ? 'success' : 'secondary'"
            outlined
          />
          <Button
            label="Limpiar Filtros"
            icon="pi pi-times"
            @click="clearFilters"
            outlined
          />
          <div class="ml-auto flex items-center gap-2">
            <Badge
              v-if="autoRefresh"
              value="Auto-actualización activa"
              severity="success"
            />
            <small class="text-surface-500">
              Última actualización: {{ lastUpdate }}
            </small>
          </div>
        </div>
      </template>
    </Card>

    <!-- Estadísticas rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <template #content>
          <div class="flex items-center gap-4">
            <i class="pi pi-file-edit text-4xl text-primary"></i>
            <div>
              <p class="text-sm text-surface-600 dark:text-surface-400">
                Total de Logs
              </p>
              <p class="text-2xl font-bold">{{ auditLogs.length }}</p>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="flex items-center gap-4">
            <i class="pi pi-check-circle text-4xl text-green-500"></i>
            <div>
              <p class="text-sm text-surface-600 dark:text-surface-400">
                Acciones Exitosas
              </p>
              <p class="text-2xl font-bold">{{ successCount }}</p>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle text-4xl text-orange-500"></i>
            <div>
              <p class="text-sm text-surface-600 dark:text-surface-400">Errores</p>
              <p class="text-2xl font-bold">{{ errorCount }}</p>
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="flex items-center gap-4">
            <i class="pi pi-ticket text-4xl text-blue-500"></i>
            <div>
              <p class="text-sm text-surface-600 dark:text-surface-400">
                Tickets Afectados
              </p>
              <p class="text-2xl font-bold">{{ uniqueTickets }}</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Tabla de logs -->
    <Card>
      <template #content>
        <DataTable
          :value="auditLogs"
          :loading="loading"
          stripedRows
          paginator
          :rows="20"
          :rowsPerPageOptions="[10, 20, 50, 100]"
          tableStyle="min-width: 60rem"
          sortField="timestamp"
          :sortOrder="-1"
        >
          <Column field="id" header="Log ID" sortable style="width: 8%"></Column>
          <Column field="entity" header="Entidad" sortable style="width: 10%">
            <template #body="slotProps">
              <Badge :value="slotProps.data.entity" severity="info" />
            </template>
          </Column>
          <Column field="entity_id" header="Entity ID" sortable style="width: 10%"></Column>
          <Column field="action" header="Acción" sortable style="width: 15%"></Column>
          <Column field="actor" header="Actor" sortable style="width: 15%"></Column>
          <Column field="old_status" header="Estado Anterior" style="width: 12%">
            <template #body="slotProps">
              <Badge
                v-if="slotProps.data.old_status"
                :value="slotProps.data.old_status"
                :severity="getStatusSeverity(slotProps.data.old_status)"
              />
              <span v-else class="text-surface-400">-</span>
            </template>
          </Column>
          <Column field="new_status" header="Estado Nuevo" style="width: 12%">
            <template #body="slotProps">
              <Badge
                v-if="slotProps.data.new_status"
                :value="slotProps.data.new_status"
                :severity="getStatusSeverity(slotProps.data.new_status)"
              />
              <span v-else class="text-surface-400">-</span>
            </template>
          </Column>
          <Column field="timestamp" header="Fecha/Hora" sortable style="width: 18%">
            <template #body="slotProps">
              {{ formatDate(slotProps.data.timestamp) }}
            </template>
          </Column>
          <Column header="Detalles" style="width: 8%">
            <template #body="slotProps">
              <Button
                icon="pi pi-eye"
                size="small"
                severity="help"
                @click="viewLogDetails(slotProps.data)"
                v-tooltip.top="'Ver Detalles'"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Dialog para ver detalles del log -->
    <Dialog
      :visible="detailsDialogVisible"
      @update:visible="detailsDialogVisible = $event"
      modal
      header="Detalles del Log de Auditoría"
      :style="{ width: '45rem' }"
    >
      <div v-if="selectedLog" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="font-semibold text-surface-600 dark:text-surface-400">Log ID:</p>
            <p class="text-lg">{{ selectedLog.id }}</p>
          </div>
          <div>
            <p class="font-semibold text-surface-600 dark:text-surface-400">Entidad:</p>
            <Badge :value="selectedLog.entity" severity="info" />
          </div>
          <div>
            <p class="font-semibold text-surface-600 dark:text-surface-400">
              Entity ID:
            </p>
            <p class="text-lg">{{ selectedLog.entity_id }}</p>
          </div>
          <div>
            <p class="font-semibold text-surface-600 dark:text-surface-400">Acción:</p>
            <p class="text-lg">{{ selectedLog.action }}</p>
          </div>
          <div>
            <p class="font-semibold text-surface-600 dark:text-surface-400">Actor:</p>
            <p class="text-lg">{{ selectedLog.actor }}</p>
          </div>
          <div>
            <p class="font-semibold text-surface-600 dark:text-surface-400">
              Fecha/Hora:
            </p>
            <p class="text-lg">{{ formatDate(selectedLog.timestamp) }}</p>
          </div>
        </div>

        <Divider />

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="font-semibold text-surface-600 dark:text-surface-400 mb-2">
              Estado Anterior:
            </p>
            <Badge
              v-if="selectedLog.old_status"
              :value="selectedLog.old_status"
              :severity="getStatusSeverity(selectedLog.old_status)"
            />
            <span v-else class="text-surface-400">-</span>
          </div>
          <div>
            <p class="font-semibold text-surface-600 dark:text-surface-400 mb-2">
              Estado Nuevo:
            </p>
            <Badge
              v-if="selectedLog.new_status"
              :value="selectedLog.new_status"
              :severity="getStatusSeverity(selectedLog.new_status)"
            />
            <span v-else class="text-surface-400">-</span>
          </div>
        </div>

        <Divider />

        <div>
          <p class="font-semibold text-surface-600 dark:text-surface-400 mb-2">
            Metadata:
          </p>
          <pre
            class="bg-surface-100 dark:bg-surface-800 p-4 rounded overflow-x-auto text-sm"
            >{{ JSON.stringify(selectedLog.metadata || {}, null, 2) }}</pre>
          >
        </div>

        <div>
          <p class="font-semibold text-surface-600 dark:text-surface-400 mb-2">
            Objeto Completo:
          </p>
          <pre
            class="bg-surface-100 dark:bg-surface-800 p-4 rounded overflow-x-auto text-sm"
            >{{ JSON.stringify(selectedLog, null, 2) }}</pre>
          >
        </div>
      </div>

      <template #footer>
        <Button label="Cerrar" icon="pi pi-times" @click="detailsDialogVisible = false" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Badge from "primevue/badge";
import Select from "primevue/select";
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import Tooltip from "primevue/tooltip";
import { useToast } from "primevue/usetoast";
import AdminService from "@/services/AdminService";

// Registrar la directiva tooltip
const vTooltip = Tooltip;

const toast = useToast();

const auditLogs = ref([]);
const loading = ref(false);
const selectedEntity = ref(null);
const selectedLimit = ref(50);
const autoRefresh = ref(false);
const lastUpdate = ref("-");
let refreshInterval = null;

const detailsDialogVisible = ref(false);
const selectedLog = ref(null);

const entityOptions = ref([
  { label: "Todas", value: null },
  { label: "Ticket", value: "ticket" },
]);

const limitOptions = ref([
  { label: "10 registros", value: 10 },
  { label: "50 registros", value: 50 },
  { label: "100 registros", value: 100 },
  { label: "200 registros", value: 200 },
  { label: "500 registros", value: 500 },
]);

// Computed properties para estadísticas
const successCount = computed(() => {
  return auditLogs.value.filter((log) => log.action !== "error").length;
});

const errorCount = computed(() => {
  return auditLogs.value.filter((log) => log.action === "error").length;
});

const uniqueTickets = computed(() => {
  const ticketIds = new Set(
    auditLogs.value
      .filter((log) => log.entity === "ticket")
      .map((log) => log.entity_id)
  );
  return ticketIds.size;
});

const getStatusSeverity = (status) => {
  const severityMap = {
    available: "success",
    onhold: "warn",
    paid: "info",
    isused: "contrast",
  };
  return severityMap[status] || "secondary";
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString();
};

const loadAuditLogs = async () => {
  loading.value = true;
  try {
    const response = await AdminService.getAuditLogs(
      selectedLimit.value,
      selectedEntity.value
    );
    auditLogs.value = Array.isArray(response) ? response : [];
    lastUpdate.value = new Date().toLocaleTimeString();

    toast.add({
      severity: "success",
      summary: "Logs Cargados",
      detail: `Se cargaron ${auditLogs.value.length} registros`,
      life: 2000,
    });
  } catch (error) {
    console.error("Error cargando logs de auditoría:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudieron cargar los logs de auditoría",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const clearFilters = () => {
  selectedEntity.value = null;
  selectedLimit.value = 50;
  auditLogs.value = [];
  lastUpdate.value = "-";
};

const viewLogDetails = (log) => {
  selectedLog.value = { ...log };
  detailsDialogVisible.value = true;
};

const toggleAutoRefresh = () => {
  autoRefresh.value = !autoRefresh.value;

  if (autoRefresh.value) {
    // Iniciar auto-actualización cada 10 segundos
    refreshInterval = setInterval(() => {
      loadAuditLogs();
    }, 10000);

    toast.add({
      severity: "info",
      summary: "Auto-actualización Activada",
      detail: "Los logs se actualizarán cada 10 segundos",
      life: 3000,
    });
  } else {
    // Detener auto-actualización
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }

    toast.add({
      severity: "info",
      summary: "Auto-actualización Desactivada",
      detail: "La actualización automática ha sido detenida",
      life: 3000,
    });
  }
};

onMounted(() => {
  // Cargar logs inicialmente
  loadAuditLogs();
});

onUnmounted(() => {
  // Limpiar interval si existe
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>

<style scoped>
.admin-audit-logs {
  padding: 2rem;
  max-width: 1800px;
  margin: 0 auto;
}
</style>
