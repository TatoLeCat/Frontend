<template>
  <div class="verify-container">
    <h1>Verificando tu correo...</h1>

    <div v-if="loading" class="loading">
      <p>Un momento, validando tu token...</p>
    </div>

    <div v-if="status === 'success'" class="success">
      <h2>✔ Email verificado correctamente</h2>
      <router-link to="/perfil">Ir al perfil</router-link>
    </div>

    <div v-if="status === 'error'" class="error">
      <h2>Token inválido o expirado</h2>
      <button @click="resendVerification">Reenviar correo de verificación</button>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const loading = ref(true);
const status = ref("");

onMounted(async () => {
  const token = route.query.token;

  try {
    await axios.get(`http://localhost:8000/auth/verify-email?token=${token}`);
    status.value = "success";
  } catch (e) {
    status.value = "error";
  }

  loading.value = false;
});

async function resendVerification() {
  await axios.post("http://localhost:8000/auth/resend-verification", {
    email: localStorage.getItem("email"),
  });
  alert("Correo reenviado");
}
</script>

<style>
.verify-container {
  text-align: center;
  padding: 2rem;
}
.success { color: green; }
.error { color: red; }
</style>
