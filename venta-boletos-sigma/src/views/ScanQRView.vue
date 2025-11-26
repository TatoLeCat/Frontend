<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center px-6 py-10">

    <h1 class="text-3xl font-bold mb-4">Escanear Ticket (QR)</h1>
    <p class="text-gray-300 text-center mb-6">
      Acerque el código QR a la cámara o súbalo desde una imagen.
    </p>

    <!-- ============================
          CÁMARA
    ============================= -->
    <div
      v-if="!cameraFailed"
      class="w-full max-w-md bg-black rounded-xl overflow-hidden shadow-lg border border-gray-700"
    >
      <qrcode-stream
        :paused="isPaused"
        @detect="onDetect"
        @camera-on="onCameraOn"
        @error="onCameraError"
      />
    </div>

    <!-- ============================
          SUBIR QR (FALLBACK)
    ============================= -->
    <div v-if="cameraFailed" class="mt-4 text-center">
      <p class="text-yellow-300 mb-2">La cámara no está disponible</p>

      <button
        class="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
        @click="openFilePicker"
      >
        Subir imagen del QR
      </button>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileSelected"
      />
    </div>

    <!-- ============================
          MENSAJES
    ============================= -->
    <div class="mt-6 w-full max-w-md text-center">

      <div v-if="loading" class="text-yellow-400 font-semibold animate-pulse">
        Validando QR...
      </div>

      <div
        v-if="successMessage"
        class="flex flex-col items-center text-green-400 mt-4 animate-fade-in"
      >
        <svg class="w-16 h-16 text-green-500 animate-scale-in" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path stroke="currentColor" stroke-width="2" d="M8 12l3 3l5-5"/>
        </svg>
        <p class="mt-3 text-xl font-bold">✔ {{ successMessage }}</p>
      </div>

      <div
        v-if="errorMessage"
        class="flex flex-col items-center text-red-400 mt-4 animate-shake"
      >
        <svg class="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path stroke="currentColor" stroke-width="2" d="M8 8l8 8m0-8l-8 8"/>
        </svg>
        <p class="mt-3 text-lg font-bold">✖ {{ errorMessage }}</p>
      </div>

    </div>

    <!-- BOTÓN REINICIAR -->
    <button
      v-if="successMessage || errorMessage"
      class="mt-6 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
      @click="resetScanner"
    >
      Escanear otro QR
    </button>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { QrcodeStream } from "vue-qrcode-reader";
import { validarQR } from "@/services/QRService";

// Estados
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const isPaused = ref(false);
const fileInput = ref(null);

// Control de cámara
const cameraReady = ref(false);
const cameraFailed = ref(false);

// ========== CÁMARA ENCENDIDA ==========
const onCameraOn = () => {
  cameraReady.value = true;
  console.log("📸 Cámara encendida");
};

// ========== ERROR EN CÁMARA ==========
const onCameraError = () => {
  console.log("❌ Error de cámara");
  cameraFailed.value = true;
};

// Detectar fallo automáticamente a los 1.5s
setTimeout(() => {
  if (!cameraReady.value) {
    cameraFailed.value = true;
  }
}, 1500);

// ========== DETECTAR QR ==========
const onDetect = async (detectedCodes) => {
  if (loading.value || successMessage.value || errorMessage.value) return;

  isPaused.value = true;
  loading.value = true;

  const qrImageBase64 = detectedCodes[0].imageDataUrl.split(",")[1];

  try {
    const response = await validarQR({ qr_base64: qrImageBase64 });

    if (response.valid) successMessage.value = response.message;
    else errorMessage.value = response.message;

  } catch (error) {
    errorMessage.value = "Error al validar QR";
  }

  loading.value = false;
};

// ========== SUBIR IMAGEN ==========
const openFilePicker = () => fileInput.value.click();

const onFileSelected = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  loading.value = true;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const imgBase64 = e.target.result.split(",")[1];

    try {
      const response = await validarQR({ qr_base64: imgBase64 });

      if (response.valid) successMessage.value = response.message;
      else errorMessage.value = response.message;

    } catch {
      errorMessage.value = "Error validando la imagen";
    }

    loading.value = false;
  };

  reader.readAsDataURL(file);
};

// ========== RESET ==========
const resetScanner = () => {
  successMessage.value = "";
  errorMessage.value = "";
  loading.value = false;
  isPaused.value = false;
};
</script>

<style>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.4s ease-out; }

@keyframes scale-in {
  from { transform: scale(0); }
  to { transform: scale(1); }
}
.animate-scale-in { animation: scale-in 0.25s ease-out; }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
.animate-shake { animation: shake 0.4s ease-in-out; }
</style>
