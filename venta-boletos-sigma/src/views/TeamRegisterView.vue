<template>
  <div class="admin-page">
    <div class="page-header">
      <h1 class="text-4xl font-bold text-white">Registrar Equipo</h1>
      <p class="text-surface-300 mt-2">Añade un nuevo equipo al torneo</p>
    </div>

    <Card class="max-w-2xl mx-auto">
      <template #title>
        <div class="flex items-center gap-3">
          <i class="pi pi-users text-3xl text-primary-500"></i>
          <span>Información del Equipo</span>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="registerTeam" class="space-y-6">
          <div class="field">
            <label for="teamName" class="block mb-2 font-semibold">
              Nombre del Equipo <span class="text-red-500">*</span>
            </label>
            <InputText
              id="teamName"
              v-model="team.name"
              placeholder="Ej: Argentina, Brasil, España..."
              class="w-full"
              :class="{ 'p-invalid': submitted && !team.name }"
              required
            />
            <small v-if="submitted && !team.name" class="p-error">
              El nombre del equipo es obligatorio.
            </small>
          </div>

          <div class="flex gap-3">
            <Button
              type="submit"
              label="Registrar Equipo"
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

        <Divider />

        <div class="mt-4">
          <h3 class="font-semibold mb-3 flex items-center gap-2">
            <i class="pi pi-list"></i>
            Equipos Registrados
          </h3>
          <div v-if="loadingTeams" class="text-center py-4">
            <i class="pi pi-spin pi-spinner text-2xl"></i>
          </div>
          <div v-else-if="teams.length === 0" class="text-center py-4 text-surface-500">
            No hay equipos registrados
          </div>
          <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Chip
              v-for="team in teams"
              :key="team.id"
              :label="team.name"
              icon="pi pi-shield"
              class="justify-center"
            />
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
import InputText from "primevue/inputtext";
import Divider from "primevue/divider";
import Chip from "primevue/chip";
import TeamService from "@/services/TeamService";

const toast = useToast();

const team = ref({ name: "" });
const teams = ref([]);
const loading = ref(false);
const loadingTeams = ref(false);
const submitted = ref(false);

const loadTeams = async () => {
  loadingTeams.value = true;
  try {
    teams.value = await TeamService.getTeams();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 3000,
    });
  } finally {
    loadingTeams.value = false;
  }
};

const registerTeam = async () => {
  submitted.value = true;

  if (!team.value.name) {
    return;
  }

  loading.value = true;
  try {
    await TeamService.createTeam({ name: team.value.name });
    toast.add({
      severity: "success",
      summary: "Equipo Registrado",
      detail: `El equipo "${team.value.name}" fue registrado exitosamente.`,
      life: 3000,
    });
    resetForm();
    await loadTeams();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error al Registrar",
      detail: error.message,
      life: 4000,
    });
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  team.value = { name: "" };
  submitted.value = false;
};

onMounted(() => {
  loadTeams();
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