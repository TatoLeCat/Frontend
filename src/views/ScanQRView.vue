<template>
  <div
    class="min-h-screen bg-gray-900 text-white flex flex-col items-center px-6 py-10"
  >
    <h1 class="text-3xl font-bold mb-4">Escanear Ticket (QR)</h1>
    <p class="text-gray-300 text-center mb-6">
      Acerque el código QR del boleto a la cámara para validarlo.
    </p>

    <div class="w-full max-w-md bg-black rounded-xl overflow-hidden shadow-lg">
      <qrcode-stream
        @detect="onDetect"
        @camera-on="onCameraOn"
        @error="onCameraError"
      />
    </div>

    <div class="mt-6 w-full max-w-md text-center">
      <div v-if="loading" class="text-yellow-400 font-semibold">
        Validando QR...
      </div>

      <div v-if="successMessage" class="text-green-400 font-bold mt-2">
        ✔ {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="text-red-400 font-semibold mt-2">
        ✖ {{ errorMessage }}
      </div>
    </div>

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
import { QrcodeStream } from "vue-qrcode-reader";   // ⭐ ESTO ES LO QUE FALTABA
import { validarQR } from "@/services/QRService.js"; // opcional pero recomendado

const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const onCameraOn = () => {
  console.log("📸 Cámara encendida");
};

const onCameraError = (error) => {
  console.error("Error con la cámara:", error);
  errorMessage.value = "Error al acceder a la cámara";
};

const onDetect = async (detectedCodes) => {
  const qrImageBase64 = detectedCodes[0].imageDataUrl;
  const cleanBase64 = qrImageBase64.split(",")[1];

  loading.value = true;

  try {
    const response = await validarQR(cleanBase64);

    if (response.valid) {
      successMessage.value = response.message;
    } else {
      errorMessage.value = response.message;
    }
  } catch (err) {
    errorMessage.value = "Error al validar QR";
  }

  loading.value = false;
};

const resetScanner = () => {
  successMessage.value = "";
  errorMessage.value = "";
  loading.value = false;
};
</script>

