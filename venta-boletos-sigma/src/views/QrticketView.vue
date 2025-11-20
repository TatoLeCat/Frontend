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
          <span class="label">Fecha:</span>
          <span class="value">{{ ticket.date }}</span>
        </div>

        <button class="download-btn" @click="downloadQR">
          Descargar QR
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// =====================================
// Estado
// =====================================
const qrImage = ref(null);

const ticket = {
  ticketId: "TCK-982173",
  eventName: "Copa Mundial – Fase de Grupos",
  stadium: "Estadio Internacional",
  date: "2025-06-18",
  ownerName: "Nohely Reyes",
};

// =====================================
// Consumir Microservicio QR
// =====================================
async function fetchQR() {
  try {
    const response = await axios.get(
      "http://localhost:8000/qr/generate",
      {
        params: {
          ticket_id: ticket.ticketId,
          event: ticket.eventName,
          stadium: ticket.stadium,
          date: ticket.date,
          owner: ticket.ownerName
        },
        responseType: "blob", 
    );

    qrImage.value = URL.createObjectURL(response.data);

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
}

.title {
  font-size: 28px;
  margin-bottom: 25px;
}

.ticket-card {
  background: white;
  padding: 25px;
