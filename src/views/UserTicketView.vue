<template>
  <div class="ticket-container">
    <h1 class="title">Tu Ticket</h1>

    <div v-if="loading" class="loading">Cargando ticket...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="ticket-box">
      <h2>{{ ticket.event_name }}</h2>
      <p><strong>Fecha:</strong> {{ ticket.date }}</p>
      <p><strong>Estadio:</strong> {{ ticket.stadium }}</p>
      <p><strong>Asiento:</strong> {{ ticket.seat }}</p>

      <QrDisplay :qrData="ticket.qrData" />

      <button class="download-btn" @click="downloadQR">
        Descargar QR
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import QrDisplay from '@/components/QrDisplay.vue'

const route = useRoute()
const ticketId = route.params.ticketId

const ticket = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await axios.get(
      `http://localhost:8080/qr/ticket/${ticketId}`
    )
    ticket.value = response.data
  } catch (err) {
    error.value = "No se pudo cargar tu ticket."
  } finally {
    loading.value = false
  }
})

function downloadQR() {
  const link = document.createElement('a')
  link.href = ticket.value.qrData
  link.download = `qr-ticket-${ticketId}.png`
  link.click()
}
</script>

<style scoped>
.ticket-container {
  max-width: 480px;
  margin: auto;
  padding: 20px;
  text-align: center;
}
.ticket-box {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
.download-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background: #0057ff;
  color: white;
  border-radius: 8px;
}
.loading, .error {
  margin-top: 40px;
}
</style>
