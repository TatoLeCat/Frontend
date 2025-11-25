<template>
  <div class="profile-2fa-view">
    <h1>Mi Perfil</h1>

    <div>
      <p><b>Email:</b> {{ user.email }}</p>
      <p>
        <b>Verificación de correo:</b>
        <span v-if="user.is_verified">Verificado</span>
        <span v-else class="warning">No verificado</span>
      </p>

      <p>
        <b>2FA:</b>
        <span v-if="user.is_2fa_enabled">Activado</span>
        <span v-else class="warning">Desactivado</span>
      </p>

      <div v-if="!user.is_2fa_enabled">
        <router-link to="/enable-2fa" class="btn">Activar 2FA</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const user = ref({});

onMounted(async () => {
  const { data } = await axios.get("http://localhost:8000/auth/me");
  user.value = data;
});
</script>

<style scoped>
.profile-2fa-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.profile-2fa-view h1 {
  color: white;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.5rem;
}

.profile-2fa-view > div {
  background: rgb(44, 41, 41);
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.profile-2fa-view p {
  margin: 1rem 0;
  font-size: 1.1rem;
}

.warning {
  color: red;
  font-weight: 600;
}

.btn {
  display: inline-block;
  background: #3b82f6;
  padding: 0.75rem 1.5rem;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  margin-top: 1rem;
  transition: background 0.2s;
}

.btn:hover {
  background: #2563eb;
}
</style>
