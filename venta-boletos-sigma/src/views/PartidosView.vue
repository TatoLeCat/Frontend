<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 py-10 px-6">
    <div class="max-w-7xl mx-auto">

      <!-- TÍTULO -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-extrabold text-white drop-shadow-lg">
          Partidos del Mundial
        </h1>
        <p class="text-blue-200 mt-2">
          Selecciona un partido para comprar tus boletos
        </p>
      </div>

      <!-- ERROR -->
      <div v-if="error" class="text-center text-red-300 font-semibold text-lg mb-8">
        {{ error }}
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="text-center py-20">
        <i class="pi pi-spin pi-spinner text-5xl text-white"></i>
        <p class="text-white mt-4">Cargando partidos...</p>
      </div>

      <!-- CONTENIDO -->
      <div v-else>
        
        <div
          v-for="(groupMatches, phaseName) in matches"
          :key="phaseName"
          class="mb-14"
        >

          <!-- FASE -->
          <h2 class="text-2xl font-bold text-white mb-6 border-l-4 border-yellow-400 pl-3">
            {{ phaseName }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            <!-- TARJETA DE PARTIDO -->
            <div
              v-for="match in groupMatches"
              :key="match.id"
              class="bg-white/95 shadow-xl rounded-2xl p-6 hover:scale-[1.03] transition-all border border-white/30"
            >

              <!-- EQUIPOS -->
              <div class="flex items-center justify-between mb-6">

                <!-- HOME TEAM -->
                <div class="flex flex-col items-center">
                  <img
                    :src="getTeamImage(match.home_team.name)"
                    class="w-16 h-16 rounded-full shadow-lg object-cover"
                  />
                  <span class="font-semibold mt-2 text-gray-800">
                    {{ match.home_team.name }}
                  </span>
                </div>

                <span class="text-xl font-bold text-gray-700">VS</span>

                <!-- AWAY TEAM -->
                <div class="flex flex-col items-center">
                  <img
                    :src="getTeamImage(match.away_team.name)"
                    class="w-16 h-16 rounded-full shadow-lg object-cover"
                  />
                  <span class="font-semibold mt-2 text-gray-800">
                    {{ match.away_team.name }}
                  </span>
                </div>

              </div>

              <!-- FECHA Y ESTADIO -->
              <div class="space-y-2 mb-6">
                <p class="text-sm text-gray-700 flex gap-2">
                  <i class="pi pi-calendar text-blue-600"></i>
                  {{ formatDate(match.kickoff_at) }}
                </p>

                <p class="text-sm text-gray-700 flex gap-2">
                  <i class="pi pi-map-marker text-red-600"></i>
                  {{ match.stadium.name }}
                </p>
              </div>

              <!-- BOTÓN -->
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

    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// IMPORTA EL MAPA DE LOGOS
import { TEAM_LOGOS } from "@/utils/teamLogos";

const matches = ref([]);
const loading = ref(true);
const error = ref(null);

const router = useRouter();

// URL base del backend
const API_BASE = "http://localhost:8090";

// Cargar partidos al montar
onMounted(() => {
  loadMatches();
});

async function loadMatches() {
  try {
    const response = await axios.get(`${API_BASE}/matches`);

    const grouped = {};

    response.data.forEach(m => {
      const phaseName = m.phase.name;

      if (!grouped[phaseName]) {
        grouped[phaseName] = [];
      }

      grouped[phaseName].push(m);
    });

    // ORDEN CORRECTO DE FASES
    const PHASE_ORDER = [
      "Fase de Grupos",
      "Octavos de Final",
      "Cuartos de Final",
      "Semifinal",
      "Final"
    ];

    matches.value = Object.fromEntries(
      PHASE_ORDER
        .filter(phase => grouped[phase])
        .map(phase => [phase, grouped[phase]])
    );

  } catch (err) {
    error.value = "No se pudieron cargar los partidos.";
  } finally {
    loading.value = false;
  }
}


// Obtener logo del equipo
function getTeamImage(teamName) {
  return TEAM_LOGOS[teamName] ?? "https://via.placeholder.com/128?text=No+Logo";
}


// Navegar a selección de asientos
function goToSeats(matchId) {
  router.push({ name: "SelectSeats", params: { matchId } });
}


// Formatear fecha
function formatDate(date) {
  return new Date(date).toLocaleString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>
