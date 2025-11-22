<template>
  <div class="checkout-wrapper">
    <div class="checkout-card">

      <!-- RESUMEN -->
      <section class="ticket-summary">
        <h2>Resumen del Ticket</h2>
        <p><strong>Ticket ID:</strong> {{ ticketId }}</p>
        <p><strong>Usuario:</strong> {{ userId }}</p>
        <p><strong>Monto:</strong> {{ amount }} {{ currency }}</p>
      </section>

      <!-- FORMULARIO -->
      <form class="payment-form" @submit.prevent="onSubmit">
        <h2>Datos del Comprador</h2>

        <label>
          Nombre Completo
          <input v-model="buyerName" class="form-input" required />
        </label>

        <label>
          Email
          <input v-model="buyerEmail" class="form-input" type="email" required />
        </label>

        <label>
          Teléfono
          <input v-model="buyerPhone" class="form-input" required />
        </label>

        <h2>Datos de la Tarjeta</h2>

        <label>
          Número de tarjeta
          <input v-model="cardNumber" class="form-input" maxlength="16" required />
        </label>

        <div class="row">
          <label>
            Expiración (MM/AA)
            <input v-model="expiry" class="form-input" placeholder="12/28" required />
          </label>

          <label>
            CVV
            <input v-model="cvv" class="form-input" maxlength="4" required />
          </label>
        </div>

        <button type="submit" class="pay-btn" :disabled="loading">
          {{ loading ? "Procesando..." : "Pagar ahora" }}
        </button>
      </form>

      <!-- RESULTADO -->
      <section v-if="result" class="payment-result">
        <h2>Resultado del Pago</h2>

        <p><strong>Estado:</strong> {{ result.status }}</p>
        <p><strong>Mensaje:</strong> {{ result.message }}</p>
        <p><strong>ID Transacción:</strong> {{ result.transaction_id }}</p>
        <p><strong>Fecha:</strong> {{ result.created_at }}</p>

        <div v-if="result.qr_payload">
          <h3>Código QR</h3>
          <pre class="qr-box">{{ result.qr_payload }}</pre>
        </div>

        <div v-else>
          <h3>No se generó QR</h3>
          <p>El pago fue rechazado.</p>
        </div>
      </section>

      <p v-if="error" class="error-msg">
        {{ error }}
      </p>

      <button class="back-btn" @click="router.back()">Volver</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { processPayment, type PaymentResponseDto } from "@/services/paymentService";

const route = useRoute();
const router = useRouter();

// Parámetros de URL
const ticketId = computed(() => Number(route.query.ticketId));
const userId = computed(() => Number(route.query.userId));

// Montos reales (más adelante se obtendrán de la API)
const amount = ref(100.0);
const currency = ref("USD");

// Información del comprador
const buyerName = ref("");
const buyerEmail = ref("");
const buyerPhone = ref("");

// Tarjeta
const cardNumber = ref("");
const expiry = ref("");
const cvv = ref("");

const loading = ref(false);
const result = ref<PaymentResponseDto | null>(null);
const error = ref<string | null>(null);

// Generador del token de pago (mock)
function buildPaymentToken(): string {
  if (cardNumber.value.startsWith("5")) return "FAIL_123";
  return "OK_123";
}

async function onSubmit() {
  error.value = null;
  result.value = null;
  loading.value = true;

  try {
    const token = buildPaymentToken();

    const response = await processPayment({
      ticket_id: ticketId.value,
      user_id: userId.value,
      amount: amount.value,
      currency: currency.value,
      payment_token: token,
    });

    result.value = response;

  } catch (e: any) {
    console.error(e);
    error.value =
      e?.response?.data?.detail ??
      "Ocurrió un error al procesar el pago. Intente nuevamente.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Layout principal */
.checkout-wrapper {
  background: #111; /* Fondo oscuro */
  color: #000;
  padding: 2rem;
  display: flex;
  justify-content: center;
}

/* Tarjeta principal */
.checkout-card {
  background: #fff;
  max-width: 600px;
  width: 100%;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}

/* Inputs */
.form-input {
  width: 100%;
  padding: 10px;
  margin-top: 4px;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fdfdfd;
  color: #000 !important;
}

/* Grid */
.row {
  display: flex;
  gap: 1rem;
}

/* Botones */
.pay-btn {
  width: 100%;
  background: #2ecc71;
  border: none;
  padding: 12px;
  border-radius: 8px;
  margin-top: 1rem;
  cursor: pointer;
  font-weight: bold;
  color: white;
}

.pay-btn:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.back-btn {
  margin-top: 1rem;
  padding: 10px 16px;
  background: #444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.error-msg {
  color: red;
  font-weight: bold;
  margin-top: 1rem;
}

/* QR box */
.qr-box {
  background: #eee;
  padding: 1rem;
  border-radius: 6px;
  font-size: 13px;
}
</style>
