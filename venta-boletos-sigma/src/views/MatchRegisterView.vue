<template>
  <div class="admin-page">
    <div class="page-header">
      <h1 class="text-4xl font-bold text-white">Registrar Partido</h1>
      <p class="text-surface-300 mt-2">Crea un nuevo partido para el torneo</p>
    </div>

    <Card class="max-w-3xl mx-auto">
      <template #title>
        <div class="flex items-center gap-3">
          <i class="pi pi-calendar-plus text-3xl text-primary-500"></i>
          <span>Información del Partido</span>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="createMatch" class="space-y-6">
          <!-- Fase -->
          <div class="field">
            <label for="phase" class="block mb-2 font-semibold">
              Fase <span class="text-red-500">*</span>
            </label>
            <Dropdown
              id="phase"
              v-model="matchData.phase_id"
              :options="phases"
              optionLabel="name"
              optionValue="id"
              placeholder="Selecciona una fase"
              class="w-full"
              :class="{ 'p-invalid': submitted && matchData.phase_id == null }"
              @change="onPhaseChange"
            />
            <small v-if="submitted && matchData.phase_id == null" class="p-error">
              La fase es obligatoria.
            </small>
          </div>

          <!-- Grupo (solo para Fase de Grupos) -->
          <div v-if="isGroupPhase" class="field">
            <label for="group" class="block mb-2 font-semibold">
              Grupo <span class="text-red-500">*</span>
            </label>
            <Dropdown
              id="group"
              v-model="matchData.group_name"
              :options="['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']"
              placeholder="Selecciona un grupo"
              class="w-full"
              :class="{ 'p-invalid': submitted && isGroupPhase && !matchData.group_name }"
            />
            <small v-if="submitted && isGroupPhase && !matchData.group_name" class="p-error">
              El grupo es obligatorio para Fase de Grupos.
            </small>
          </div>

          <!-- Equipos -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Equipo Local -->
            <div class="field">
              <label for="homeTeam" class="block mb-2 font-semibold">
                Equipo Local <span class="text-red-500">*</span>
              </label>
              <Dropdown
                id="homeTeam"
                v-model="matchData.home_team_id"
                :options="teams"
                optionLabel="name"
                optionValue="id"
                placeholder="Selecciona equipo local"
                class="w-full"
                :class="{ 'p-invalid': submitted && !matchData.home_team_id }"
                filter
              />
              <small v-if="submitted && !matchData.home_team_id" class="p-error">
                El equipo local es obligatorio.
              </small>
            </div>

            <!-- Equipo Visitante -->
            <div class="field">
              <label for="awayTeam" class="block mb-2 font-semibold">
                Equipo Visitante <span class="text-red-500">*</span>
              </label>
              <Dropdown
                id="awayTeam"
                v-model="matchData.away_team_id"
                :options="teams"
                optionLabel="name"
                optionValue="id"
                placeholder="Selecciona equipo visitante"
                class="w-full"
                :class="{ 'p-invalid': submitted && !matchData.away_team_id }"
                filter
              />
              <small v-if="submitted && !matchData.away_team_id" class="p-error">
                El equipo visitante es obligatorio.
              </small>
              <small v-if="submitted && matchData.away_team_id === matchData.home_team_id" class="p-error">
                Los equipos deben ser diferentes.
              </small>
            </div>
          </div>

          <!-- Estadio ID (temporal - necesitarás ajustar según tu implementación) -->
          <div class="field">
            <label for="stadium" class="block mb-2 font-semibold">
              ID del Estadio <span class="text-red-500">*</span>
            </label>
            <InputNumber
              id="stadium"
              v-model="matchData.stadium_id"
              :min="1"
              placeholder="Ingresa el ID del estadio"
              class="w-full"
              :class="{ 'p-invalid': submitted && !matchData.stadium_id }"
            />
            <small v-if="submitted && !matchData.stadium_id" class="p-error">
              El estadio es obligatorio.
            </small>
          </div>

          <!-- Fecha y Hora -->
          <div class="field">
            <label for="kickoff" class="block mb-2 font-semibold">
              Fecha y Hora del Partido <span class="text-red-500">*</span>
            </label>
            <Calendar
              id="kickoff"
              v-model="kickoffDate"
              showTime
              hourFormat="24"
              dateFormat="dd/mm/yy"
              placeholder="Selecciona fecha y hora"
              class="w-full"
              :class="{ 'p-invalid': submitted && !kickoffDate }"
              :minDate="new Date()"
            />
            <small v-if="submitted && !kickoffDate" class="p-error">
              La fecha y hora son obligatorias.
            </small>
          </div>

          <!-- Botones -->
          <div class="flex gap-3">
            <Button
              type="submit"
              label="Crear Partido"
              icon="pi pi-check"
              :loading="loading"
              class="flex-1"
            />
            <Button
              type="button"
              label="Limpiar"
              icon="pi pi-times"
              severity="secondary"
              outlined
              @click="resetForm"
              :disabled="loading"
            />
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import Card from "primevue/card";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import Calendar from "primevue/calendar";
import MatchService from "@/services/MatchService";
import TeamService from "@/services/TeamService";
import PhaseService from "@/services/PhaseService";

const toast = useToast();

const matchData = ref({
  stadium_id: null,
  home_team_id: null,
  away_team_id: null,
  phase_id: null,
  group_name: null,
});

const kickoffDate = ref(null);
const teams = ref([]);
const phases = ref([]);
const loading = ref(false);
const submitted = ref(false);

const isGroupPhase = computed(() => {
  const phase = phases.value.find(p => p.id === matchData.value.phase_id);
  return phase && phase.name === "Fase de Grupos";
});

const onPhaseChange = () => {
  // Limpiar grupo si no es fase de grupos
  if (!isGroupPhase.value) {
    matchData.value.group_name = null;
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

const loadPhases = async () => {
  try {
    phases.value = await PhaseService.getPhases();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 3000,
    });
  }
};

const validateForm = () => {
  if (!matchData.value.phase_id) return false;
  if (!matchData.value.home_team_id) return false;
  if (!matchData.value.away_team_id) return false;
  if (matchData.value.home_team_id === matchData.value.away_team_id) return false;
  if (!matchData.value.stadium_id) return false;
  if (!kickoffDate.value) return false;
  if (isGroupPhase.value && !matchData.value.group_name) return false;

  return true;
};

const createMatch = async () => {
  submitted.value = true;

  if (!validateForm()) {
    toast.add({
      severity: "warn",
      summary: "Formulario Incompleto",
      detail: "Por favor completa todos los campos requeridos.",
      life: 3000,
    });
    return;
  }

  loading.value = true;
  try {
    // Convertir fecha a formato ISO 8601
    const kickoff_at = kickoffDate.value.toISOString();

    const payload = {
      stadium_id: matchData.value.stadium_id,
      home_team_id: matchData.value.home_team_id,
      away_team_id: matchData.value.away_team_id,
      phase_id: matchData.value.phase_id,
      kickoff_at,
    };

    // Agregar group_name solo si es fase de grupos
    if (isGroupPhase.value && matchData.value.group_name) {
      payload.group_name = matchData.value.group_name;
    }

    await MatchService.createMatch(payload);

    const homeTeam = teams.value.find(t => t.id === matchData.value.home_team_id);
    const awayTeam = teams.value.find(t => t.id === matchData.value.away_team_id);

    toast.add({
      severity: "success",
      summary: "Partido Creado",
      detail: `${homeTeam?.name} vs ${awayTeam?.name}`,
      life: 4000,
    });

    resetForm();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error al Crear Partido",
      detail: error.message,
      life: 4000,
    });
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  matchData.value = {
    stadium_id: null,
    home_team_id: null,
    away_team_id: null,
    phase_id: null,
    group_name: null,
  };
  kickoffDate.value = null;
  submitted.value = false;
};

onMounted(async () => {
  await loadTeams();
  await loadPhases();
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
