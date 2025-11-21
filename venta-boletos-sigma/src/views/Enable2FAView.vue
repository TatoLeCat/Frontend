<template>
  <div class="twofa-container">
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

<style>
.qr-img {
  width: 220px;
  height: 220px;
  margin-bottom: 1rem;
}
.success {
  color: green;
}
</style>
