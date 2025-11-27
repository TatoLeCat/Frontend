<template>
  <div class="admin-page">
    <div class="page-header">
      <h1 class="text-4xl font-bold text-white">Gestión de Fases</h1>
      <p class="text-surface-300 mt-2">Administra el avance del torneo entre fases</p>
    </div>

    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Avanzar desde Fase de Grupos -->
      <Card>
        <template #title>
          <div class="flex items-center gap-3">
            <i class="pi pi-users text-3xl text-green-500"></i>
            <span>Avanzar desde Fase de Grupos</span>
          </div>
        </template>
        <template #content>
          <p class="text-surface-600 mb-4">
            Selecciona los 16 equipos clasificados para crear los partidos de Octavos de Final.
          </p>

          <div class="space-y-4">
            <div class="field">
              <label class="block mb-2 font-semibold">
                Equipos Clasificados (16 requeridos) <span class="text-red-500">*</span>
              </label>
              <MultiSelect
                v-model="selectedTeams"
                :options="teams"
                optionLabel="name"
                optionValue="id"
                placeholder="Selecciona 16 equipos"
                class="w-full"
                :maxSelectedLabels="3"
                filter
              />
              <small class="text-surface-500">
                Seleccionados: {{ selectedTeams.length }} / 16
              </small>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="field">
                <label class="block mb-2 font-semibold">
                  ID del Estadio <span class="text-red-500">*</span>
                </label>
                <InputNumber
                  v-model="groupsConfig.stadium_id"
                  :min="1"
                  placeholder="ID del estadio"
                  class="w-full"
                />
              </div>

              <div class="field">
                <label class="block mb-2 font-semibold">
                  Fecha/Hora Base <span class="text-red-500">*</span>
                </label>
                <Calendar
                  v-model="groupsConfig.kickoff_base"
                  showTime
                  hourFormat="24"
                  dateFormat="dd/mm/yy"
                  placeholder="Fecha del primer partido"
                  class="w-full"
                  :minDate="new Date()"
                />
              </div>
            </div>

            <Button
              label="Avanzar a Octavos de Final"
              icon="pi pi-arrow-right"
              class="w-full"
              :disabled="selectedTeams.length !== 16 || !groupsConfig.stadium_id || !groupsConfig.kickoff_base"
              @click="advanceFromGroups"
              :loading="loadingGroups"
            />
          </div>
        </template>
      </Card>

      <!-- Avanzar Ganadores (Fases Eliminatorias) -->
      <Card>
        <template #title>
          <div class="flex items-center gap-3">
            <i class="pi pi-trophy text-3xl text-yellow-500"></i>
            <span>Avanzar Ganadores (Fases Eliminatorias)</span>
          </div>
        </template>
        <template #content>
          <p class="text-surface-600 mb-4">
            Avanza automáticamente los ganadores de una fase a la siguiente (Octavos → Cuartos → Semifinal → Final).
          </p>

          <div class="space-y-4">
            <div class="field">
              <label class="block mb-2 font-semibold">
                Fase Actual <span class="text-red-500">*</span>
              </label>
              <Dropdown
                v-model="winnersConfig.phase_id"
                :options="eliminationPhases"
                optionLabel="name"
                optionValue="id"
                placeholder="Selecciona la fase"
                class="w-full"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="field">
                <label class="block mb-2 font-semibold">
                  ID del Estadio <span class="text-red-500">*</span>
                </label>
                <InputNumber
                  v-model="winnersConfig.stadium_id"
                  :min="1"
                  placeholder="ID del estadio"
                  class="w-full"
                />
              </div>

              <div class="field">
                <label class="block mb-2 font-semibold">
                  Fecha/Hora Base <span class="text-red-500">*</span>
                </label>
                <Calendar
                  v-model="winnersConfig.kickoff_base"
                  showTime
                  hourFormat="24"
                  dateFormat="dd/mm/yy"
                  placeholder="Fecha del primer partido"
                  class="w-full"
                  :minDate="new Date()"
                />
              </div>
            </div>

            <Button
              label="Avanzar Ganadores a Siguiente Fase"
              icon="pi pi-forward"
              class="w-full"
              :disabled="!winnersConfig.phase_id || !winnersConfig.stadium_id || !winnersConfig.kickoff_base"
              @click="advanceWinners"
              :loading="loadingWinners"
            />
          </div>
        </template>
      </Card>

      <!-- Información de Fases -->
      <Card>
        <template #title>
          <div class="flex items-center gap-3">
            <i class="pi pi-info-circle text-3xl text-blue-500"></i>
            <span>Información de Fases</span>
          </div>
        </template>
        <template #content>
          <div v-if="loadingPhases" class="text-center py-4">
            <i class="pi pi-spin pi-spinner text-2xl"></i>
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="phase in phases"
              :key="phase.id"
              class="flex items-center justify-between p-3 border rounded-lg hover:bg-surface-50"
            >
              <div class="flex items-center gap-3">
                <Badge :value="phase.order + 1" />
                <span class="font-semibold">{{ phase.name }}</span>
              </div>
              <Button
                label="Ver Partidos"
                icon="pi pi-eye"
                size="small"
                outlined
                @click="viewPhaseMatches(phase)"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Dialog para ver partidos de la fase -->
    <Dialog
      v-model:visible="showMatchesDialog"
      :header="`Partidos - ${selectedPhase?.name}`"
      :style="{ width: '50rem' }"
      modal
    >
      <div v-if="loadingMatches" class="text-center py-8">
        <i class="pi pi-spin pi-spinner text-3xl"></i>
      </div>
      <div v-else-if="phaseMatches.length === 0" class="text-center py-8 text-surface-500">
        No hay partidos registrados para esta fase
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="match in phaseMatches"
          :key="match.id"
          class="p-3 border rounded-lg"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="font-semibold">
                {{ getTeamName(match.home_team_id) }} vs {{ getTeamName(match.away_team_id) }}
              </div>
              <div class="text-sm text-surface-500 mt-1">
                {{ formatDate(match.kickoff_at) }}
              </div>
            </div>
            <div class="text-right">
              <Badge
                v-if="match.is_finished"
                :value="`${match.home_goals} - ${match.away_goals}`"
                severity="success"
              />
              <Badge v-else value="Pendiente" severity="warning" />
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import Card from "primevue/card";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import InputNumber from "primevue/inputnumber";
import Calendar from "primevue/calendar";
import Badge from "primevue/badge";
import Dialog from "primevue/dialog";
import PhaseService from "@/services/PhaseService";
import TeamService from "@/services/TeamService";

const toast = useToast();

const phases = ref([]);
const teams = ref([]);
const selectedTeams = ref([]);
const phaseMatches = ref([]);
const selectedPhase = ref(null);
const showMatchesDialog = ref(false);

const loadingPhases = ref(false);
const loadingGroups = ref(false);
const loadingWinners = ref(false);
const loadingMatches = ref(false);

const groupsConfig = ref({
  stadium_id: null,
  kickoff_base: null,
});

const winnersConfig = ref({
  phase_id: null,
  stadium_id: null,
  kickoff_base: null,
});

const eliminationPhases = computed(() => {
  return phases.value.filter(p => p.name !== "Fase de Grupos" && p.name !== "Final");
});

const loadPhases = async () => {
  loadingPhases.value = true;
  try {
    phases.value = await PhaseService.getPhases();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 3000,
    });
  } finally {
    loadingPhases.value = false;
  }
};

const loadTeams = async () => {
  try {
    teams.value = await TeamService.getTeams();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 3000,
    });
  }
};

const getTeamName = (teamId) => {
  const team = teams.value.find(t => t.id === teamId);
  return team ? team.name : `Equipo ${teamId}`;
};

const advanceFromGroups = async () => {
  if (selectedTeams.value.length !== 16) {
    toast.add({
      severity: "warn",
      summary: "Selección Incompleta",
      detail: "Debes seleccionar exactamente 16 equipos.",
      life: 3000,
    });
    return;
  }

  loadingGroups.value = true;
  try {
    const groupPhase = phases.value.find(p => p.name === "Fase de Grupos");
    if (!groupPhase) {
      throw new Error("No se encontró la Fase de Grupos");
    }

    const kickoffBase = groupsConfig.value.kickoff_base.toISOString();

    const result = await PhaseService.advanceFromGroups(
      groupPhase.id,
      groupsConfig.value.stadium_id,
      kickoffBase,
      selectedTeams.value
    );

    toast.add({
      severity: "success",
      summary: "Equipos Avanzados",
      detail: result.message || `Se crearon ${result.matches_created} partidos de Octavos de Final.`,
      life: 5000,
    });

    // Resetear
    selectedTeams.value = [];
    groupsConfig.value = { stadium_id: null, kickoff_base: null };
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error al Avanzar",
      detail: error.message,
      life: 4000,
    });
  } finally {
    loadingGroups.value = false;
  }
};

const advanceWinners = async () => {
  loadingWinners.value = true;
  try {
    const kickoffBase = winnersConfig.value.kickoff_base.toISOString();

    const result = await PhaseService.advanceWinners(
      winnersConfig.value.phase_id,
      winnersConfig.value.stadium_id,
      kickoffBase
    );

    toast.add({
      severity: "success",
      summary: "Ganadores Avanzados",
      detail: `Se crearon ${result.length} partidos para la siguiente fase.`,
      life: 5000,
    });

    // Resetear
    winnersConfig.value = { phase_id: null, stadium_id: null, kickoff_base: null };
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error al Avanzar",
      detail: error.message,
      life: 4000,
    });
  } finally {
    loadingWinners.value = false;
  }
};

const viewPhaseMatches = async (phase) => {
  selectedPhase.value = phase;
  showMatchesDialog.value = true;
  loadingMatches.value = true;

  try {
    phaseMatches.value = await PhaseService.getPhaseMatches(phase.id);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 3000,
    });
  } finally {
    loadingMatches.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

onMounted(async () => {
  await loadPhases();
  await loadTeams();
});
</script>

<style scoped>
.admin-page {
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}
</style>
