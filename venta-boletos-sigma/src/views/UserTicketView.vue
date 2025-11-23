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
  width: 100%;
  padding: 2rem;
  text-align: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.title {
  color: white;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.ticket-box {
  background: #ffffff;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-width: 800px;
  margin: 0 auto;
}

.ticket-box h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.ticket-box p {
  font-size: 1.2rem;
  margin: 0.75rem 0;
  color: #4b5563;
}

.download-btn {
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.download-btn:hover {
  background: #2563eb;
}

.loading,
.error {
  margin-top: 3rem;
  color: white;
  font-size: 1.2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.error {
  background: rgba(220, 38, 38, 0.2);
  border: 2px solid rgba(220, 38, 38, 0.5);
}

@media (max-width: 768px) {
  .ticket-container {
    padding: 1rem;
  }

  .title {
    font-size: 1.75rem;
  }

  .ticket-box {
    padding: 2rem;
  }

  .ticket-box h2 {
    font-size: 1.5rem;
  }

  .ticket-box p {
    font-size: 1rem;
  }
}
</style>
