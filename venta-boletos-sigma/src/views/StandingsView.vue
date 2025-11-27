<template>
  <div class="standings-page">
    <div class="page-header">
      <h1 class="text-4xl font-bold text-white">Tabla de Posiciones</h1>
      <p class="text-surface-300 mt-2">Consulta las clasificaciones del torneo</p>
    </div>

    <div class="max-w-6xl mx-auto">
      <Card>
        <template #title>
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="flex items-center gap-3">
              <i class="pi pi-table text-3xl text-primary-500"></i>
              <span>Clasificación</span>
            </div>
            <div class="flex gap-2 flex-wrap">
              <Dropdown
                v-model="selectedPhase"
                :options="phases"
                optionLabel="name"
                optionValue="id"
                placeholder="Selecciona una fase"
                class="w-56"
                @change="onPhaseChange"
              />
              <Dropdown
                v-if="showGroupSelector"
                v-model="selectedGroup"
                :options="groupOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Todos los grupos"
                class="w-48"
                @change="loadStandings"
              />
              <Button
                icon="pi pi-refresh"
                label="Actualizar"
                outlined
                @click="loadStandings"
                :loading="loading"
              />
            </div>
          </div>
        </template>
        <template #content>
          <div v-if="loading" class="text-center py-12">
            <i class="pi pi-spin pi-spinner text-5xl text-primary-500"></i>
            <p class="mt-4 text-surface-500">Cargando tabla de posiciones...</p>
          </div>

          <div v-else-if="!standingsData || standingsData.standings?.length === 0" class="text-center py-12">
            <i class="pi pi-info-circle text-6xl text-surface-300"></i>
            <h3 class="text-xl font-semibold mt-4 text-surface-600">Sin Datos Disponibles</h3>
            <p class="text-surface-500 mt-2">
              {{ standingsData?.message || 'No hay partidos finalizados aún para mostrar la tabla de posiciones.' }}
            </p>
          </div>

          <div v-else class="space-y-6">
            <!-- Información General -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div class="flex items-center gap-3">
                  <i class="pi pi-flag text-2xl text-blue-600"></i>
                  <div>
                    <p class="text-sm text-surface-600">Fase</p>
                    <p class="text-lg font-bold text-blue-600">{{ standingsData.phase }}</p>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-center gap-3">
                  <i class="pi pi-users text-2xl text-green-600"></i>
                  <div>
                    <p class="text-sm text-surface-600">Equipos</p>
                    <p class="text-lg font-bold text-green-600">{{ standingsData.total_teams }}</p>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div class="flex items-center gap-3">
                  <i class="pi pi-calendar text-2xl text-purple-600"></i>
                  <div>
                    <p class="text-sm text-surface-600">Partidos</p>
                    <p class="text-lg font-bold text-purple-600">{{ standingsData.total_matches }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabla de Posiciones -->
            <div class="standings-table-wrapper">
              <DataTable
                :value="standingsData.standings"
                stripedRows
                class="standings-table"
                responsiveLayout="scroll"
              >
                <Column field="position" header="#" :style="{ width: '60px' }">
                  <template #body="{ data }">
                    <Badge
                      :value="data.position"
                      :severity="getPositionSeverity(data.position)"
                      size="large"
                    />
                  </template>
                </Column>

                <Column field="team_name" header="Equipo">
                  <template #body="{ data }">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-shield text-primary-500"></i>
                      <span class="font-semibold">{{ data.team_name }}</span>
                    </div>
                  </template>
                </Column>

                <Column field="played" header="PJ" class="text-center" headerClass="text-center" />
                <Column field="won" header="G" class="text-center" headerClass="text-center">
                  <template #body="{ data }">
                    <span class="text-green-600 font-semibold">{{ data.won }}</span>
                  </template>
                </Column>
                <Column field="drawn" header="E" class="text-center" headerClass="text-center">
                  <template #body="{ data }">
                    <span class="text-yellow-600 font-semibold">{{ data.drawn }}</span>
                  </template>
                </Column>
                <Column field="lost" header="P" class="text-center" headerClass="text-center">
                  <template #body="{ data }">
                    <span class="text-red-600 font-semibold">{{ data.lost }}</span>
                  </template>
                </Column>
                <Column field="goals_for" header="GF" class="text-center" headerClass="text-center" />
                <Column field="goals_against" header="GC" class="text-center" headerClass="text-center" />
                <Column field="goal_difference" header="DIF" class="text-center" headerClass="text-center">
                  <template #body="{ data }">
                    <span :class="getDifferenceClass(data.goal_difference)" class="font-semibold">
                      {{ data.goal_difference > 0 ? '+' : '' }}{{ data.goal_difference }}
                    </span>
                  </template>
                </Column>
                <Column field="points" header="PTS" class="text-center" headerClass="text-center">
                  <template #body="{ data }">
                    <span class="text-primary-600 font-bold text-lg">{{ data.points }}</span>
                  </template>
                </Column>
              </DataTable>
            </div>

            <!-- Leyenda -->
            <div class="mt-4 p-4 bg-surface-50 rounded-lg">
              <h4 class="font-semibold mb-3">Leyenda:</h4>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div><span class="font-semibold">PJ:</span> Partidos Jugados</div>
                <div><span class="font-semibold">G:</span> Ganados</div>
                <div><span class="font-semibold">E:</span> Empatados</div>
                <div><span class="font-semibold">P:</span> Perdidos</div>
                <div><span class="font-semibold">GF:</span> Goles a Favor</div>
                <div><span class="font-semibold">GC:</span> Goles en Contra</div>
                <div><span class="font-semibold">DIF:</span> Diferencia de Goles</div>
                <div><span class="font-semibold">PTS:</span> Puntos</div>
              </div>
              <div class="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                <i class="pi pi-info-circle text-blue-600"></i>
                <span class="ml-2 text-sm text-blue-900">
                  Los equipos en las primeras 2 posiciones de cada grupo clasifican a Octavos de Final.
                </span>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import Card from "primevue/card";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Badge from "primevue/badge";
import PhaseService from "@/services/PhaseService";

const toast = useToast();

const standingsData = ref(null);
const selectedPhase = ref(null);
const selectedGroup = ref(null);
const phases = ref([]);
const loading = ref(false);

const groupOptions = ref([
  { label: "Todos los Grupos", value: null },
  { label: "Grupo A", value: "A" },
  { label: "Grupo B", value: "B" },
  { label: "Grupo C", value: "C" },
  { label: "Grupo D", value: "D" },
  { label: "Grupo E", value: "E" },
  { label: "Grupo F", value: "F" },
  { label: "Grupo G", value: "G" },
  { label: "Grupo H", value: "H" },
]);

// Mostrar selector de grupo solo si es Fase de Grupos
const showGroupSelector = computed(() => {
  const phase = phases.value.find(p => p.id === selectedPhase.value);
  return phase && phase.name === "Fase de Grupos";
});

const loadPhases = async () => {
  try {
    phases.value = await PhaseService.getPhases();
    // Seleccionar Fase de Grupos por defecto
    const groupPhase = phases.value.find(p => p.name === "Fase de Grupos");
    if (groupPhase) {
      selectedPhase.value = groupPhase.id;
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 3000,
    });
  }
};

const onPhaseChange = () => {
  // Resetear grupo al cambiar de fase
  selectedGroup.value = null;
  loadStandings();
};

const loadStandings = async () => {
  if (!selectedPhase.value) return;

  loading.value = true;
  try {
    standingsData.value = await PhaseService.getStandings(
      selectedPhase.value,
      showGroupSelector.value ? selectedGroup.value : null
    );
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error al Cargar",
      detail: error.message,
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const getPositionSeverity = (position) => {
  if (position <= 2) return "success"; // Clasificados
  if (position === 3) return "warning"; // Cerca
  return "secondary"; // Eliminados
};

const getDifferenceClass = (difference) => {
  if (difference > 0) return "text-green-600";
  if (difference < 0) return "text-red-600";
  return "text-surface-600";
};

onMounted(async () => {
  await loadPhases();
  await loadStandings();
});
</script>

<style scoped>
.standings-page {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.standings-table-wrapper {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.standings-table :deep(.p-datatable-thead > tr > th) {
  background: #667eea;
  color: white;
  font-weight: 600;
}

.standings-table :deep(.p-datatable-tbody > tr:nth-child(1)),
.standings-table :deep(.p-datatable-tbody > tr:nth-child(2)) {
  background: #f0fdf4 !important;
  border-left: 4px solid #22c55e;
}

.standings-table :deep(.p-datatable-tbody > tr:hover) {
  background: #f8fafc !important;
}
</style>
