<template>
  <div
    class="verify-email-view bg-surface-50 dark:bg-surface-950 min-h-screen flex items-center justify-center px-6"
  >
    <Card class="w-full max-w-md">
      <template #content>
        <div class="text-center">
          <div class="mb-6">
            <i
              v-if="loading"
              class="pi pi-spin pi-spinner text-6xl text-primary"
            ></i>
            <i
              v-else-if="status === 'success'"
              class="pi pi-check-circle text-6xl text-green-500"
            ></i>
            <i
              v-else-if="status === 'error'"
              class="pi pi-times-circle text-6xl text-red-500"
            ></i>
            <i v-else class="pi pi-envelope text-6xl text-primary"></i>
          </div>

          <h1
            class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-2"
          >
            {{ getTitle() }}
          </h1>

          <p class="text-surface-600 dark:text-surface-400 mb-6">
            {{ getMessage() }}
          </p>

          <!-- Loading state -->
          <div v-if="loading" class="flex flex-col gap-3">
            <ProgressSpinner style="width: 50px; height: 50px" />
          </div>

          <!-- Success state -->
          <div v-else-if="status === 'success'" class="flex flex-col gap-3">
            <Message severity="success" :closable="false">
              Tu correo electrónico ha sido verificado correctamente
            </Message>
            <Button
              label="Ir al Perfil"
              icon="pi pi-user"
              @click="goToProfile"
              class="w-full"
            />
            <Button
              label="Ir al Inicio"
              icon="pi pi-home"
              @click="goToHome"
              outlined
              class="w-full"
            />
          </div>

          <!-- Error state -->
          <div v-else-if="status === 'error'" class="flex flex-col gap-3">
            <Message severity="error" :closable="false">
              {{ errorMessage }}
            </Message>
            <Button
              label="Reenviar Email de Verificación"
              icon="pi pi-refresh"
              @click="resendVerification"
              :loading="resending"
              severity="danger"
              class="w-full"
            />
            <Button
              label="Volver al Inicio"
              icon="pi pi-home"
              @click="goToHome"
              outlined
              class="w-full"
            />
          </div>

          <!-- No token state (user came directly to this page) -->
          <div v-else class="flex flex-col gap-3">
            <Message severity="info" :closable="false">
              Hemos enviado un correo de verificación a tu email. Por favor,
              revisa tu bandeja de entrada y haz clic en el enlace.
            </Message>
            <Button
              label="Reenviar Email"
              icon="pi pi-refresh"
              @click="resendVerification"
              :loading="resending"
              outlined
              class="w-full"
            />
            <Button
              label="Volver al Inicio"
              icon="pi pi-home"
              @click="goToHome"
              outlined
              class="w-full"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Card from "primevue/card";
import Button from "primevue/button";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
import { useToast } from "primevue/usetoast";
import AuthService from "@/services/AuthService";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const loading = ref(false);
const status = ref("");
const resending = ref(false);
const errorMessage = ref("El token de verificación es inválido o ha expirado");

onMounted(async () => {
  const token = route.query.token;

  // Si hay un token en la URL, intentar verificar
  if (token) {
    loading.value = true;
    try {
      await axios.get(`${API_URL}/auth/verify?token=${token}`);
      status.value = "success";

      // Actualizar el usuario en el AuthService si está logueado
      const user = AuthService.getUser();
      if (user) {
        user.is_verified = true;
        AuthService.setUser(user);
      }

      toast.add({
        severity: "success",
        summary: "Email Verificado",
        detail: "Tu correo ha sido verificado exitosamente",
        life: 3000,
      });
    } catch (error) {
      status.value = "error";
      errorMessage.value =
        error.response?.data?.detail ||
        "El token de verificación es inválido o ha expirado";

      toast.add({
        severity: "error",
        summary: "Error de Verificación",
        detail: errorMessage.value,
        life: 5000,
      });
    } finally {
      loading.value = false;
    }
  }
});

const getTitle = () => {
  if (loading.value) return "Verificando Email...";
  if (status.value === "success") return "¡Email Verificado!";
  if (status.value === "error") return "Error de Verificación";
  return "Verificación de Email";
};

const getMessage = () => {
  if (loading.value) return "Por favor espera mientras validamos tu email";
  if (status.value === "success")
    return "Tu cuenta ha sido activada correctamente";
  if (status.value === "error") return "No pudimos verificar tu email";
  return "Revisa tu correo para completar la verificación";
};

const goToProfile = () => {
  router.push("/perfil");
};

const goToHome = () => {
  router.push("/");
};

const resendVerification = async () => {
  const user = AuthService.getUser();

  if (!user || !user.email) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudo obtener tu email. Por favor inicia sesión nuevamente",
      life: 3000,
    });
    return;
  }

  resending.value = true;

  try {
    await axios.post(`${API_URL}/auth/verify/send`, {
      email: user.email,
    });

    toast.add({
      severity: "success",
      summary: "Email Enviado",
      detail: "Hemos enviado un nuevo email de verificación",
      life: 3000,
    });

    status.value = "";
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        error.response?.data?.detail ||
        "No se pudo reenviar el email de verificación",
      life: 3000,
    });
  } finally {
    resending.value = false;
  }
};
</script>

<style scoped>
.verify-email-view {
  min-height: 100vh;
}
</style>
