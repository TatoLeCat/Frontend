<template>
  <div class="qr-ticket-container">
    <h1 class="title">Tu Boleto Digital</h1>

    <div class="ticket-card">
      <div class="qr-wrapper">
        <img
          v-if="qrImage"
          :src="qrImage"
          alt="Código QR del boleto"
          class="qr-img"
        />
        <p v-else class="loading-text">Generando tu código QR...</p>
      </div>

      <div class="ticket-info">
        <h2 class="event-name">{{ ticket.eventName }}</h2>

        <div class="info-row">
          <span class="label">ID del Boleto:</span>
          <span class="value">{{ ticket.ticketId }}</span>
        </div>

        <div class="info-row">
          <span class="label">Propietario:</span>
          <span class="value">{{ ticket.ownerName }}</span>
        </div>

        <div class="info-row">
          <span class="label">Estadio:</span>
          <span class="value">{{ ticket.stadium }}</span>
        </div>

        <div class="info-row">
          <span class="label">Evento:</span>
          <span class="value">{{ ticket.eventName }}</span>
        </div>

        <div class="info-row">
          <span class="label">Fecha del Partido:</span>
          <span class="value">{{ ticket.date }}</span>
        </div>

        <!-- NUEVO: Fecha -->
        <div class="info-row">
          <span class="label">Fecha de Compra:</span>
          <span class="value">{{ fechaCompra }}</span>
        </div>

        <!-- NUEVO: Hora -->
        <div class="info-row">
          <span class="label">Hora de Compra:</span>
          <span class="value">{{ horaCompra }}</span>
        </div>

        <button class="download-btn" @click="downloadQR">Descargar QR</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const qrImage = ref(null);
const fechaCompra = ref(null);
const horaCompra = ref(null);

// ⚠ ticketId DEBE SER UN NÚMERO porque el backend espera boleto_id:int
const ticket = {
  ticketId: 1,
  eventName: "Copa Mundial – Fase de Grupos",
  stadium: "Estadio Internacional",
  date: "2025-06-18",
  ownerName: "Nohely Reyes",
};

async function fetchQR() {
  try {
    const response = await axios.post("http://localhost:8080/qr/generate", {
      boleto_id: ticket.ticketId,
      evento: ticket.eventName,
      fecha: ticket.date,
      ubicacion: ticket.stadium,
      propietario: ticket.ownerName,
    });

    qrImage.value = "data:image/png;base64," + response.data.qr_base64;

    // NUEVO: Datos de compra enviados por backend
    fechaCompra.value = response.data.fecha_compra;
    horaCompra.value = response.data.hora_compra;

  } catch (error) {
    console.error("Error generando el QR:", error);
  }
}

function downloadQR() {
  const link = document.createElement("a");
  link.href = qrImage.value;
  link.download = `QR_${ticket.ticketId}.png`;
  link.click();
}

onMounted(fetchQR);
</script>

<style scoped>
.qr-ticket-container {
  max-width: 600px;
  margin: 40px auto;
  text-align: center;
  font-family: "Poppins", sans-serif;
  color: white;
}

.title {
  font-size: 28px;
  margin-bottom: 25px;
  color: #fff;
}

.ticket-card {
  background: #1e1e1e;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.1);
}

.qr-img {
  width: 260px;
  height: 260px;
  margin-bottom: 20px;
  background: white;
  padding: 10px;
  border-radius: 8px;
}

.loading-text {
  font-size: 18px;
  color: #bbb;
}

.ticket-info {
  text-align: left;
  margin-top: 15px;
}

.event-name {
  font-size: 22px;
  margin-bottom: 15px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.label {
  font-weight: bold;
}

.download-btn {
  margin-top: 20px;
  padding: 10px 15px;
  background: #00aaff;
  border: none;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}
</style>
