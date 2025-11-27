<template>
  <div class="admin-ticket-manager">
    <div class="header mb-6">
      <h1 class="text-4xl font-bold mb-2">Gestión de Tickets</h1>
      <p class="text-surface-600 dark:text-surface-400">
        Administra el estado de los tickets de usuarios
      </p>
    </div>

    <!-- Filtros -->
    <Card class="mb-6">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex flex-col gap-2">
            <label for="filterStatus" class="font-semibold">Filtrar por Estado</label>
            <Select
              id="filterStatus"
              v-model="selectedStatus"
              :options="statusOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar estado"
              class="w-full"
              @change="loadTicketsByStatus"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="userId" class="font-semibold">Buscar por Usuario ID</label>
            <InputText
              id="userId"
              v-model="userIdFilter"
              placeholder="Ingresa ID de usuario"
              class="w-full"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="ticketId" class="font-semibold">Buscar por Ticket ID</label>
            <InputText
              id="ticketId"
              v-model="ticketIdFilter"
              placeholder="Ingresa ID de ticket"
              class="w-full"
            />
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <Button
            label="Buscar por Usuario"
            icon="pi pi-search"
            @click="searchByUser"
            :disabled="!userIdFilter"
          />
          <Button
            label="Buscar por Ticket"
            icon="pi pi-search"
            @click="searchByTicket"
            :disabled="!ticketIdFilter"
            severity="secondary"
          />
          <Button
            label="Limpiar Filtros"
            icon="pi pi-times"
            @click="clearFilters"
            outlined
          />
        </div>
      </template>
    </Card>

    <!-- Tabla de Tickets -->
    <Card>
      <template #content>
        <DataTable
          :value="tickets"
          :loading="loading"
          stripedRows
          paginator
          :rows="10"
          :rowsPerPageOptions="[10, 20, 50]"
          tableStyle="min-width: 50rem"
        >
          <Column field="id" header="ID" sortable style="width: 10%"></Column>
          <Column field="order_id" header="Order ID" sortable></Column>
          <Column field="seat_id" header="Asiento ID" sortable></Column>
          <Column field="owner_user_id" header="Usuario ID" sortable></Column>
          <Column field="status" header="Estado" sortable>
            <template #body="slotProps">
              <Badge
                :value="slotProps.data.status"
                :severity="getStatusSeverity(slotProps.data.status)"
              />
            </template>
          </Column>
          <Column field="created_at" header="Creado" sortable>
            <template #body="slotProps">
              {{ formatDate(slotProps.data.created_at) }}
            </template>
          </Column>
          <Column header="Acciones" style="width: 15%">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  size="small"
                  severity="info"
                  @click="openEditDialog(slotProps.data)"
                  v-tooltip.top="'Editar Estado'"
                />
                <Button
                  icon="pi pi-eye"
                  size="small"
                  severity="help"
                  @click="viewTicketDetails(slotProps.data)"
                  v-tooltip.top="'Ver Detalles'"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Dialog para editar estado -->
    <Dialog
      :visible="editDialogVisible"
      @update:visible="editDialogVisible = $event"
      modal
      header="Actualizar Estado del Ticket"
      :style="{ width: '30rem' }"
    >
      <div v-if="selectedTicket" class="flex flex-col gap-4">
        <div>
          <p class="font-semibold mb-1">Ticket ID:</p>
          <p>{{ selectedTicket.id }}</p>
        </div>
        <div>
          <p class="font-semibold mb-1">Usuario ID:</p>
          <p>{{ selectedTicket.owner_user_id }}</p>
        </div>
        <div>
          <p class="font-semibold mb-1">Estado Actual:</p>
          <Badge
            :value="selectedTicket.status"
            :severity="getStatusSeverity(selectedTicket.status)"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="newStatus" class="font-semibold">Nuevo Estado</label>
          <Select
            id="newStatus"
            v-model="newStatus"
            :options="availableStatusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccionar nuevo estado"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="actor" class="font-semibold">Actor (quién realiza el cambio)</label>
          <InputText
            id="actor"
            v-model="actor"
            placeholder="Ej: admin_usuario123"
            class="w-full"
          />
        </div>
      </div>

      <template #footer>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          @click="editDialogVisible = false"
          outlined
        />
        <Button
          label="Actualizar"
          icon="pi pi-check"
          @click="updateTicketStatus"
          :disabled="!newStatus || !actor"
        />
      </template>
    </Dialog>

    <!-- Dialog para ver detalles -->
    <Dialog
      :visible="detailsDialogVisible"
      @update:visible="detailsDialogVisible = $event"
      modal
      header="Detalles del Ticket"
      :style="{ width: '40rem' }"
    >
      <div v-if="selectedTicket" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="font-semibold text-surface-600 dark:text-surface-400">ID:</p>
            <p class="text-lg">{{ selectedTicket.id }}</p>
          </div>
          <div>
            <p class="font-semibold text-surface-600 dark:text-surface-400">Order ID:</p>
            <p class="text-lg">{{ selectedTicket.order_id }}</p>
          </div>
          <div>
            <p class="font-semibold text-surface-600 dark:text-surface-400">Seat ID:</p>
            <p class="text-lg">{{ selectedTicket.seat_id }}</p>
          </div>
          <div>
            <p class="font-semibold text-surface-600 dark:text-surface-400">
              Usuario ID:
            </p>
            <p class="text-lg">{{ selectedTicket.owner_user_id }}</p>
          </div>
          <div>
            <p class="font-semibold text-surface-600 dark:text-surface-400">Estado:</p>
            <Badge
              :value="selectedTicket.status"
              :severity="getStatusSeverity(selectedTicket.status)"
            />
          </div>
          <div>
            <p class="font-semibold text-surface-600 dark:text-surface-400">Creado:</p>
            <p class="text-lg">{{ formatDate(selectedTicket.created_at) }}</p>
          </div>
        </div>

        <Divider />

        <div>
          <p class="font-semibold text-surface-600 dark:text-surface-400 mb-2">
            QR Payload:
          </p>
          <pre
            class="bg-surface-100 dark:bg-surface-800 p-3 rounded overflow-x-auto text-sm"
            >{{ selectedTicket.qr_payload }}</pre>
        </div>

        <div>
          <p class="font-semibold text-surface-600 dark:text-surface-400 mb-2">
            Signature:
          </p>
          <pre
            class="bg-surface-100 dark:bg-surface-800 p-3 rounded overflow-x-auto text-sm"
            >{{ selectedTicket.signature }}</pre>
        </div>

        <Divider />

        <div>
          <Button
            label="Ver Historial de Auditoría"
            icon="pi pi-history"
            @click="viewAuditHistory"
            class="w-full"
            severity="secondary"
          />
        </div>
      </div>
    </Dialog>

    <!-- Dialog para historial de auditoría del ticket -->
    <Dialog
      :visible="auditDialogVisible"
      @update:visible="auditDialogVisible = $event"
      modal
      header="Historial de Auditoría"
      :style="{ width: '50rem' }"
    >
      <DataTable :value="auditLogs" :loading="loadingAudit" stripedRows>
        <Column field="id" header="Log ID" style="width: 10%"></Column>
        <Column field="action" header="Acción"></Column>
        <Column field="actor" header="Actor"></Column>
        <Column field="old_status" header="Estado Anterior">
          <template #body="slotProps">
            <Badge
              v-if="slotProps.data.old_status"
              :value="slotProps.data.old_status"
              :severity="getStatusSeverity(slotProps.data.old_status)"
            />
            <span v-else>-</span>
          </template>
        </Column>
        <Column field="new_status" header="Estado Nuevo">
          <template #body="slotProps">
            <Badge
              v-if="slotProps.data.new_status"
              :value="slotProps.data.new_status"
              :severity="getStatusSeverity(slotProps.data.new_status)"
            />
            <span v-else>-</span>
          </template>
        </Column>
        <Column field="timestamp" header="Fecha/Hora">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.timestamp) }}
          </template>
        </Column>
      </DataTable>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Badge from "primevue/badge";
import Select from "primevue/select";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Divider from "primevue/divider";
import Tooltip from "primevue/tooltip";
import { useToast } from "primevue/usetoast";
import AdminService from "@/services/AdminService";

// Registrar la directiva tooltip
const vTooltip = Tooltip;

const toast = useToast();

const tickets = ref([]);
const loading = ref(false);
const selectedStatus = ref(null);
const userIdFilter = ref("");
const ticketIdFilter = ref("");

const editDialogVisible = ref(false);
const detailsDialogVisible = ref(false);
const auditDialogVisible = ref(false);

const selectedTicket = ref(null);
const newStatus = ref(null);
const actor = ref("");
const auditLogs = ref([]);
const loadingAudit = ref(false);

const statusOptions = ref([
  { label: "Todos", value: null },
  { label: "Disponible", value: "available" },
  { label: "En Espera", value: "onhold" },
  { label: "Pagado", value: "paid" },
  { label: "Usado", value: "isused" },
]);

const availableStatusOptions = ref([
  { label: "Disponible", value: "available" },
  { label: "En Espera", value: "onhold" },
  { label: "Pagado", value: "paid" },
  { label: "Usado", value: "isused" },
]);

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

const loadTicketsByStatus = async () => {
  if (!selectedStatus.value) {
    tickets.value = [];
    return;
  }

  loading.value = true;
  try {
    const response = await AdminService.getTicketsByStatus(selectedStatus.value);
    tickets.value = Array.isArray(response) ? response : [];
    toast.add({
      severity: "success",
      summary: "Tickets Cargados",
      detail: `Se encontraron ${tickets.value.length} tickets`,
      life: 3000,
    });
  } catch (error) {
    console.error("Error cargando tickets:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudieron cargar los tickets",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const searchByUser = async () => {
  loading.value = true;
  try {
    const response = await AdminService.getTicketsByUser(parseInt(userIdFilter.value));
    tickets.value = Array.isArray(response) ? response : [];
    toast.add({
      severity: "success",
      summary: "Búsqueda Completada",
      detail: `Se encontraron ${tickets.value.length} tickets`,
      life: 3000,
    });
  } catch (error) {
    console.error("Error buscando tickets:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudieron encontrar tickets para este usuario",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const searchByTicket = async () => {
  loading.value = true;
  try {
    const response = await AdminService.getTicketById(parseInt(ticketIdFilter.value));
    tickets.value = [response];
    toast.add({
      severity: "success",
      summary: "Ticket Encontrado",
      detail: "Se ha cargado el ticket",
      life: 3000,
    });
  } catch (error) {
    console.error("Error buscando ticket:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudo encontrar el ticket",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const clearFilters = () => {
  selectedStatus.value = null;
  userIdFilter.value = "";
  ticketIdFilter.value = "";
  tickets.value = [];
};

const openEditDialog = (ticket) => {
  selectedTicket.value = { ...ticket };
  newStatus.value = null;
  actor.value = "";
  editDialogVisible.value = true;
};

const viewTicketDetails = (ticket) => {
  selectedTicket.value = { ...ticket };
  detailsDialogVisible.value = true;
};

const updateTicketStatus = async () => {
  try {
    await AdminService.updateTicketStatus(
      selectedTicket.value.id,
      newStatus.value,
      actor.value
    );

    toast.add({
      severity: "success",
      summary: "Estado Actualizado",
      detail: "El estado del ticket se ha actualizado correctamente",
      life: 3000,
    });

    editDialogVisible.value = false;

    // Recargar la lista actual
    if (selectedStatus.value) {
      await loadTicketsByStatus();
    } else if (userIdFilter.value) {
      await searchByUser();
    }
  } catch (error) {
    console.error("Error actualizando estado:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        error.response?.data?.detail || "No se pudo actualizar el estado del ticket",
      life: 5000,
    });
  }
};

const viewAuditHistory = async () => {
  loadingAudit.value = true;
  auditDialogVisible.value = true;

  try {
    const response = await AdminService.getTicketAuditLogs(selectedTicket.value.id);
    auditLogs.value = Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Error cargando historial de auditoría:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudo cargar el historial de auditoría",
      life: 3000,
    });
  } finally {
    loadingAudit.value = false;
  }
};
</script>

<style scoped>
.admin-ticket-manager {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}
</style>
