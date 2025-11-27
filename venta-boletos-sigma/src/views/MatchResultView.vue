<template>
  <div>
    <h1>Registrar Resultados</h1>
    <div v-for="match in finishedMatches" :key="match.id">
      <p>{{ match.teamA }} vs {{ match.teamB }}</p>
      <input v-model.number="match.resultA" placeholder="Goles equipo A" />
      <input v-model.number="match.resultB" placeholder="Goles equipo B" />
      <button @click="saveResult(match)">Guardar Resultado</button>
    </div>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import MatchService from "@/services/MatchService";

export default {
  data() {
    return {
      finishedMatches: [],
      message: "",
    };
  },
  async mounted() {
    this.finishedMatches = await MatchService.getFinishedMatches();
  },
  methods: {
    async saveResult(match) {
      if (match.resultA == null || match.resultB == null) {
        this.message = "Ingrese los resultados correctamente.";
        return;
      }
      try {
        await MatchService.saveResult(match.id, match.resultA, match.resultB);
        this.message = "Resultado guardado correctamente.";
      } catch (error) {
        this.message = error.message || "Error al guardar el resultado.";
      }
    },
  },
};
</script>
