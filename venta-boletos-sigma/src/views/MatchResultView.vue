<template>
  <div class="admin-page">
    <div class="page-header">
      <h1 class="text-4xl font-bold text-white">Registrar Resultados</h1>
      <p class="text-surface-300 mt-2">Actualiza los marcadores de los partidos disputados</p>
    </div>

    <Card class="max-w-4xl mx-auto">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <i class="pi pi-pencil text-3xl text-primary-500"></i>
            <span>Partidos Pendientes</span>
          </div>
          <Button
            icon="pi pi-refresh"
            label="Actualizar"
            outlined
            size="small"
            @click="loadMatches"
            :loading="loading"
          />
        </div>
      </template>
      <template #content>
        <div v-if="loading" class="text-center py-8">
          <i class="pi pi-spin pi-spinner text-4xl text-primary-500"></i>
          <p class="mt-3 text-surface-500">Cargando partidos...</p>
        </div>

        <div v-else-if="pendingMatches.length === 0" class="text-center py-8">
          <i class="pi pi-check-circle text-6xl text-green-500"></i>
          <h3 class="text-xl font-semibold mt-4">No hay partidos pendientes</h3>
          <p class="text-surface-500 mt-2">Todos los partidos tienen sus resultados registrados</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="match in pendingMatches"
            :key="match.id"
            class="match-card p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <Badge :value="getPhaseName(match.phase_id)" severity="info" />
              <span v-if="match.group_name" class="text-sm text-gray-600">
                Grupo {{ match.group_name }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <!-- Equipo Local -->
              <div class="text-center">
                <p class="font-semibold text-lg mb-2 text-gray-800">{{ getTeamName(match.home_team_id) }}</p>
                <InputNumber
                  v-model="match.home_goals"
                  :min="0"
                  :max="20"
                  showButtons
                  buttonLayout="horizontal"
                  class="w-full"
                  placeholder="Goles"
                  :inputStyle="{ textAlign: 'center' }"
                />
              </div>

              <!-- VS -->
              <div class="text-center">
                <span class="text-2xl font-bold text-gray-600">VS</span>
                <p class="text-xs text-gray-500 mt-2">
                  {{ formatDate(match.kickoff_at) }}
                </p>
              </div>

              <!-- Equipo Visitante -->
              <div class="text-center">
                <p class="font-semibold text-lg mb-2 text-gray-800">{{ getTeamName(match.away_team_id) }}</p>
                <InputNumber
                  v-model="match.away_goals"
                  :min="0"
                  :max="20"
                  showButtons
                  buttonLayout="horizontal"
                  class="w-full"
                  placeholder="Goles"
                  :inputStyle="{ textAlign: 'center' }"
                />
              </div>
            </div>

            <div class="mt-4">
              <Button
                label="Guardar Resultado"
                icon="pi pi-save"
                class="w-full"
                @click="saveResult(match)"
                :disabled="match.home_goals == null || match.away_goals == null"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import Card from "primevue/card";
import Button from "primevue/button";
import Badge from "primevue/badge";
import InputNumber from "primevue/inputnumber";
import MatchService from "@/services/MatchService";
import TeamService from "@/services/TeamService";
import PhaseService from "@/services/PhaseService";

const toast = useToast();

const pendingMatches = ref([]);
const teams = ref([]);
const phases = ref([]);
const loading = ref(false);

const loadMatches = async () => {
  loading.value = true;
  try {
    const matches = await MatchService.getPendingMatches();
    pendingMatches.value = matches.map(match => ({
      ...match,
      home_goals: null,
      away_goals: null,
    }));
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const loadTeams = async () => {
  try {
    teams.value = await TeamService.getTeams();
  } catch (error) {
    console.error("Error al cargar equipos:", error);
  }
};

const loadPhases = async () => {
  try {
    phases.value = await PhaseService.getPhases();
  } catch (error) {
    console.error("Error al cargar fases:", error);
  }
};

const getTeamName = (teamId) => {
  const team = teams.value.find(t => t.id === teamId);
  return team ? team.name : `Equipo ${teamId}`;
};

const getPhaseName = (phaseId) => {
  const phase = phases.value.find(p => p.id === phaseId);
  return phase ? phase.name : 'Sin fase';
};

const saveResult = async (match) => {
  if (match.home_goals == null || match.away_goals == null) {
    toast.add({
      severity: "warn",
      summary: "Datos Incompletos",
      detail: "Por favor ingresa los goles de ambos equipos.",
      life: 3000,
    });
    return;
  }

  try {
    await MatchService.saveResult(match.id, match.home_goals, match.away_goals);
    toast.add({
      severity: "success",
      summary: "Resultado Guardado",
      detail: `${getTeamName(match.home_team_id)} ${match.home_goals} - ${match.away_goals} ${getTeamName(match.away_team_id)}`,
      life: 4000,
    });

    // Remover el partido de la lista de pendientes
    pendingMatches.value = pendingMatches.value.filter(m => m.id !== match.id);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error al Guardar",
      detail: error.message,
      life: 4000,
    });
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

onMounted(async () => {
  await loadPhases();
  await loadTeams();
  await loadMatches();
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

.match-card {
  background: white;
  border: 1px solid #e5e7eb;
}

.match-card:hover {
  border-color: #667eea;
}
</style>
