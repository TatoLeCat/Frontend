<template>
  <div class="bg-surface-50 dark:bg-surface-950 min-h-screen px-6 py-12 md:px-20 lg:px-80 flex items-center justify-center">
    <div
      class="bg-surface-0 dark:bg-surface-900 p-8 md:p-12 shadow-sm rounded-2xl w-full max-w-sm mx-auto flex flex-col gap-8"
    >
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-center gap-4"></div>
        <div class="flex flex-col items-center gap-2 w-full">
          <div
            class="text-surface-900 dark:text-surface-0 text-2xl font-semibold leading-tight text-center w-full"
          >
            Bienvenido
          </div>
          <div class="text-center w-full">
            <span class="text-surface-700 dark:text-surface-200 leading-normal"
              >¿No tienes una cuenta?</span
            >
            <a
              @click="router.push('/register')"
              class="text-primary font-medium ml-1 cursor-pointer hover:text-primary-emphasis"
              >Unete ahora!</a
            >
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-6 w-full">
        <div class="flex flex-col gap-2 w-full">
          <label
            for="email1"
            class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
            >Correo</label
          >
          <InputText
            id="email1"
            type="text"
            v-model="email"
            placeholder="Email address"
            class="w-full px-3 py-2 shadow-sm rounded-lg"
          />
        </div>
        <div class="flex flex-col gap-2 w-full">
          <label
            for="password1"
            class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
            >Contraseña</label
          >

          <Password
            id="password1"
            v-model="password"
            placeholder="Password"
            :toggleMask="true"
            :feedback="false"
            input-class="w-full!"
          />
        </div>
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-0"
        >
          <a
            class="text-primary font-medium cursor-pointer hover:text-primary-emphasis"
            >¿Olvido su contraseña?</a
          >
        </div>
      </div>
      <Button
        label="Iniciar sesión"
        icon="pi pi-user"
        :loading="loading"
        @click="handleLogin"
        class="w-full py-2 rounded-lg flex justify-center items-center gap-2"
      >
        <template #icon>
          <i class="pi pi-user text-base! leading-normal!" />
        </template>
      </Button>
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { useRouter } from "vue-router";
import AuthService from "@/services/AuthService";

const router = useRouter();
const toast = useToast();

const password = ref("");
const email = ref("");
const loading = ref(false);

const handleLogin = async () => {
  // Validación básica
  if (!email.value || !password.value) {
    toast.add({
      severity: "warn",
      summary: "Campos requeridos",
      detail: "Por favor ingresa tu email y contraseña",
      life: 3000,
    });
    return;
  }

  loading.value = true;

  try {
    await AuthService.login(email.value, password.value);

    toast.add({
      severity: "success",
      summary: "Login exitoso",
      detail: "Bienvenido de nuevo!",
      life: 3000,
    });

    // Redirigir al usuario a la página principal
    router.push("/");
  } catch (error) {
    console.error("Error en login:", error);

    let errorDetail = "Email o contraseña incorrectos";

    if (error.status === 405) {
      errorDetail =
        "Método no permitido. Verifica la URL de la API o el endpoint.";
    } else if (error.message) {
      errorDetail = error.message;
    }

    toast.add({
      severity: "error",
      summary: `Error ${error.status || ""} de autenticación`,
      detail: errorDetail,
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};
</script>
