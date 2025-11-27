<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 py-10 px-6">
    <div class="max-w-7xl mx-auto">

      <!-- Título -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold text-white drop-shadow-lg">
          Partidos del Mundial
        </h1>
        <p class="text-blue-200 mt-2">
          Selecciona un partido para comprar tus boletos
        </p>
      </div>

      <!-- Si hay error -->
      <div v-if="error" class="text-center text-red-300 font-semibold text-lg mb-8">
        {{ error }}
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <i class="pi pi-spin pi-spinner text-5xl text-white"></i>
        <p class="text-white mt-4">Cargando partidos...</p>
      </div>

      <!-- Grid de partidos -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <div
          v-for="match in matches"
          :key="match.id"
          class="bg-white/90 backdrop-blur shadow-xl rounded-2xl p-6 hover:scale-[1.03] transition-all cursor-pointer border border-white/20"
        >
          <!-- Info del partido -->
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm font-semibold text-blue-700">
              {{ match.phase_name }}
            </span>
            <span class="py-1 px-3 bg-green-100 text-green-700 text-xs rounded-full">
              Disponible
            </span>
          </div>

          <!-- Equipos -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex flex-col items-center">
              <img
                :src="getTeamFlag(match.home_team_name)"
                class="w-14 h-14 rounded-full shadow"
              />
              <span class="font-semibold mt-2 text-gray-800">
                {{ match.home_team_name }}
              </span>
            </div>

            <span class="text-xl font-bold text-gray-700">VS</span>

            <div class="flex flex-col items-center">
              <img
                :src="getTeamFlag(match.away_team_name)"
                class="w-14 h-14 rounded-full shadow"
              />
              <span class="font-semibold mt-2 text-gray-800">
                {{ match.away_team_name }}
              </span>
            </div>
          </div>

          <!-- Fecha y Estadio -->
          <div class="space-y-2 mb-6">
            <p class="text-sm text-gray-700 flex gap-2">
              <i class="pi pi-calendar text-blue-600"></i>
              {{ formatDate(match.kickoff_at) }}
            </p>
            <p class="text-sm text-gray-700 flex gap-2">
              <i class="pi pi-map-marker text-red-600"></i>
              {{ match.stadium_name }}
            </p>
          </div>

          <!-- Botón -->
          <button
            @click="goToSeats(match.id)"
            class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow"
          >
            Comprar
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const matches = ref([]);
const loading = ref(true);
const error = ref(null);

const router = useRouter();

// URL base del backend (ajusta según tu .env)
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8090";

onMounted(() => {
  loadMatches();
});

async function loadMatches() {
  try {
    const response = await axios.get(`${API_BASE}/matches`);
    matches.value = response.data.map(m => ({
      ...m,
      home_team_name: m.home_team.name,
      away_team_name: m.away_team.name,
      stadium_name: m.stadium.name,
      phase_name: m.phase.name
    }));
  } catch (err) {
    error.value = "No se pudieron cargar los partidos.";
  } finally {
    loading.value = false;
  }
}

function goToSeats(matchId) {
  router.push({ name: "SelectSeats", params: { matchId } });
}

function formatDate(date) {
  return new Date(date).toLocaleString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTeamFlag(teamName) {
  // Puedes cambiar esta base si luego agregas logos reales
  return `https://countryflagsapi.com/png/${teamName}`;
}
</script>


