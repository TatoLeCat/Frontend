<template>
  <div class="bg-surface-50 dark:bg-surface-950 min-h-screen px-6 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1
          class="text-surface-900 dark:text-surface-0 text-3xl font-bold mb-2"
        >
          Mi Perfil
        </h1>
        <p class="text-surface-600 dark:text-surface-400">
          Gestiona tu información personal
        </p>
      </div>

      <div
        class="bg-surface-0 dark:bg-surface-900 rounded-lg shadow-sm p-8 border border-surface-200 dark:border-surface-700"
      >
        <div class="flex items-center gap-6 mb-8">
          <div
            class="w-24 h-24 rounded-full bg-primary flex items-center justify-center"
          >
            <i class="pi pi-user text-4xl text-white"></i>
          </div>
          <div>
            <h2
              class="text-2xl font-semibold text-surface-900 dark:text-surface-0"
            >
              {{ user?.first_name }} {{ user?.last_name }}
            </h2>
            <p class="text-surface-600 dark:text-surface-400">
              {{ user?.email }}
            </p>
            <div class="flex gap-2 mt-2">
              <Badge
                v-if="user?.is_verified"
                value="Verificado"
                severity="success"
              />
              <Badge v-else value="No Verificado" severity="warn" />
              <Badge
                v-if="user?.role === 'admin'"
                value="Administrador"
                severity="info"
              />
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                class="text-sm font-medium text-surface-700 dark:text-surface-300"
                >Nombre</label
              >
              <p class="text-surface-900 dark:text-surface-0 mt-1">
                {{ user?.first_name || "-" }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-surface-700 dark:text-surface-300"
                >Apellido</label
              >
              <p class="text-surface-900 dark:text-surface-0 mt-1">
                {{ user?.last_name || "-" }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-surface-700 dark:text-surface-300"
                >Email</label
              >
              <p class="text-surface-900 dark:text-surface-0 mt-1">
                {{ user?.email || "-" }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-surface-700 dark:text-surface-300"
                >Teléfono</label
              >
              <p class="text-surface-900 dark:text-surface-0 mt-1">
                {{ user?.phone ? `+${user.country_code} ${user.phone}` : "-" }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-surface-700 dark:text-surface-300"
                >Fecha de Nacimiento</label
              >
              <p class="text-surface-900 dark:text-surface-0 mt-1">
                {{ user?.date_of_birth ? formatDate(user.date_of_birth) : "-" }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-surface-700 dark:text-surface-300"
                >ID de Usuario</label
              >
              <p class="text-surface-900 dark:text-surface-0 mt-1">
                {{ user?.id || "-" }}
              </p>
            </div>
            <div>
              <label
                class="text-sm font-medium text-surface-700 dark:text-surface-300"
                >Estado de Verificación</label
              >
              <div class="mt-1">
                <Badge
                  v-if="user?.is_verified"
                  value="Email Verificado"
                  severity="success"
                />
                <div v-else class="flex items-center gap-2">
                  <Badge value="Email No Verificado" severity="warn" />
                  <Button
                    label="Verificar Email"
                    size="small"
                    severity="warning"
                    @click="sendVerificationEmail"
                  />
                </div>
              </div>
            </div>
            <div>
              <label
                class="text-sm font-medium text-surface-700 dark:text-surface-300"
                >Rol</label
              >
              <div class="mt-1">
                <Badge
                  :value="user?.role || 'user'"
                  :severity="user?.role === 'admin' ? 'info' : 'secondary'"
                />
              </div>
            </div>
          </div>

          <div
            v-if="user?.has_raffle_assignment"
            class="pt-4 border-t border-surface-200 dark:border-surface-700"
          >
            <div class="flex items-center gap-2">
              <i class="pi pi-gift text-primary text-xl"></i>
              <p class="text-surface-900 dark:text-surface-0 font-medium">
                Tienes asignación de rifa activa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AuthService from "@/services/AuthService";
import { ref, onMounted } from "vue";
import Badge from "primevue/badge";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import axios from "axios";

const toast = useToast();
const user = ref(null);

onMounted(() => {
  user.value = AuthService.getUser();
});

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const sendVerificationEmail = async () => {
  if (!user.value || !user.value.email) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudo obtener tu email",
      life: 3000,
    });
    return;
  }

  try {
    toast.add({
      severity: "info",
      summary: "Enviando...",
      detail: "Se está enviando el email de verificación",
      life: 2000,
    });

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

    await axios.post(`${API_URL}/auth/verify/send`, {
      email: user.value.email,
    });

    toast.add({
      severity: "success",
      summary: "Email Enviado",
      detail: "Revisa tu bandeja de entrada para verificar tu correo",
      life: 5000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        error.response?.data?.detail ||
        "No se pudo enviar el email de verificación",
      life: 3000,
    });
  }
};
</script>
