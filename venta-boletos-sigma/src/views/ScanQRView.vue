<template>
  <div
    class="min-h-screen bg-gray-900 text-white flex flex-col items-center px-6 py-10"
  >
    <!-- Título -->
    <h1 class="text-3xl font-bold mb-4">Escanear Ticket (QR)</h1>
    <p class="text-gray-300 text-center mb-6">
      Acerque el código QR del boleto a la cámara para validarlo.
    </p>

    <!-- Componente de Escaneo -->
    <div class="w-full max-w-md bg-black rounded-xl overflow-hidden shadow-lg">
      <qrcode-stream
        @detect="onDetect"
        @camera-on="onCameraOn"
        @error="onCameraError"
      />
    </div>

    <!-- Estados -->
    <div class="mt-6 w-full max-w-md text-center">
      <!-- Loading -->
      <div v-if="loading" class="text-yellow-400 font-semibold">
        Validando QR...
      </div>

      <!-- Éxito -->
      <div v-if="successMessage" class="text-green-400 font-bold mt-2">
        ✔ {{ successMessage }}
      </div>

      <!-- Error -->
      <div v-if="errorMessage" class="text-red-400 font-semibold mt-2">
        ✖ {{ errorMessage }}
      </div>
    </div>

    <!-- Botón Reset -->
    <button
      v-if="successMessage || errorMessage"
      class="mt-6 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
      @click="resetScanner"
    >
      Escanear otro QR
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
//import { QrcodeStream } from "vue-qrcode-reader";  -- dependencia que se debe instalar, primero realizar investigacion
import axios from "axios";

// Estados
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Cuando la cámara funciona
const onCameraOn = () => {
  console.log("📸 Cámara encendida");
};

// Error con la cámara
const onCameraError = (error) => {
  console.error("❌ Error con la cámara:", error);
  errorMessage.value = "Error al acceder a la cámara";
};

// Cuando detecta un QR
const onDetect = async (content) => {
  console.log("QR Detectado:", content);

  loading.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    // Llamada al microservicio QR
    const response = await axios.post("http://localhost:8000/qr/validate", {
      qr_content: content[0].rawValue,
    });

    successMessage.value = response.data.message;
  } catch (err) {
    errorMessage.value = err.response?.data?.detail || "QR inválido";
  }

  loading.value = false;
};

// Reset del escáner
const resetScanner = () => {
  successMessage.value = "";
  errorMessage.value = "";
  loading.value = false;
};
</script>

<style>
/* Puedes agregar estilos personalizados si querés */
</style>
