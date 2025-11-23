<template>
  <div class="profile">
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

<style>
.warning { color: red; }
.btn {
  display: inline-block;
  background: #3b82f6;
  padding: 0.4rem 0.8rem;
  color: white;
  border-radius: 4px;
}
</style>
