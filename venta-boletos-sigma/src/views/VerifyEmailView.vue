<template>
  <div class="verify-email-view">
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

<style scoped>
.verify-email-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.verify-email-view h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.verify-email-view h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.verify-email-view > div {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
}

.loading p {
  font-size: 1.1rem;
  color: #6b7280;
}

.success {
  color: #059669;
}

.success a {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.2s;
}

.success a:hover {
  background: #2563eb;
}

.error {
  color: #dc2626;
}

.error button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background 0.2s;
}

.error button:hover {
  background: #b91c1c;
}
</style>
