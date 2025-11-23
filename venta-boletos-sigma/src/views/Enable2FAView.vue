<template>
  <div class="enable-2fa-view">
    <h1>Activar 2FA</h1>

    <div v-if="qrImage">
      <p>Escanea este QR con Google Authenticator:</p>
      <img :src="qrImage" class="qr-img" />
    </div>

    <div class="code-input">
      <input v-model="code" maxlength="6" placeholder="Código 2FA (6 dígitos)" />
      <button @click="confirm2FA">Confirmar Código</button>
    </div>

    <p v-if="success" class="success">2FA activado correctamente</p>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const qrImage = ref(null);
const code = ref("");
const success = ref(false);

onMounted(async () => {
  const { data } = await axios.post("http://localhost:8000/auth/2fa/enable");
  qrImage.value = data.qr_base64;
});

async function confirm2FA() {
  try {
    await axios.post("http://localhost:8000/auth/2fa/verify-code", {
      code: code.value
    });
    success.value = true;
  } catch (e) {
    alert("Código incorrecto");
  }
}
</script>

<style scoped>
.enable-2fa-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.enable-2fa-view h1 {
  color: white;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  text-align: center;
}

.enable-2fa-view > div {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.enable-2fa-view p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.qr-img {
  width: 220px;
  height: 220px;
  margin: 1rem auto;
  display: block;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
}

.code-input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.code-input input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1.1rem;
  text-align: center;
}

.code-input button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.code-input button:hover {
  background: #2563eb;
}

.success {
  color: #059669;
  font-weight: 600;
  font-size: 1.2rem;
  margin-top: 1rem;
}
</style>
