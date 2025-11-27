<template>
  <div>
    <h1>Registrar Equipo</h1>
    <form @submit.prevent="registerTeam">
      <input v-model="team.name" placeholder="Nombre del equipo" required />
      <input v-model="team.city" placeholder="Ciudad" required />
      <button type="submit">Registrar</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>

<script>
import TeamService from "@/services/TeamService";

export default {
  data() {
    return {
      team: { name: "", city: "" },
      errorMessage: "",
      successMessage: "",
    };
  },
  methods: {
    async registerTeam() {
      if (!this.team.name || !this.team.city) {
        this.errorMessage = "Todos los campos son obligatorios.";
        return;
      }
      try {
        const response = await TeamService.createTeam(this.team);
        this.successMessage = "Equipo registrado con éxito.";
        this.errorMessage = "";
      } catch (error) {
        this.errorMessage = error.message || "Error al registrar el equipo.";
      }
    },
  },
};
</script>