<template>
  <div class="payment-page">
    <h1>Pago de boleto</h1>

    <section class="ticket-summary">
      <h2>Resumen de compra</h2>
      <p><strong>Ticket ID:</strong> {{ ticketId }}</p>
      <p><strong>Monto:</strong> {{ amount }} {{ currency }}</p>
    </section>

    <form class="payment-form" @submit.prevent="onSubmit">
      <h2>Datos de la tarjeta</h2>

      <label>
        Nombre en la tarjeta
        <input v-model="cardholderName" required />
      </label>

      <label>
        Número de tarjeta
        <input v-model="cardNumber" maxlength="16" required />
      </label>

      <div class="row">
        <label>
          Expiración (MM/AA)
          <input v-model="expiry" placeholder="12/28" required />
        </label>

        <label>
          CVV
          <input v-model="cvv" maxlength="4" required />
        </label>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Procesando..." : "Pagar ahora" }}
      </button>
    </form>

    <section v-if="result" class="payment-result" :class="{ 'success': result.status === 'approved' }">
      <h2>{{ result.status === 'approved' ? '✓ Pago Exitoso' : '✗ Pago Rechazado' }}</h2>
      <p><strong>Estado:</strong> {{ result.status }}</p>
      <p><strong>Mensaje:</strong> {{ result.message }}</p>
      <p><strong>ID transacción:</strong> {{ result.transaction_id }}</p>
      <p><strong>Fecha:</strong> {{ result.created_at }}</p>

      <div v-if="result.qr_payload">
        <h3>✓ QR generado exitosamente</h3>
        <p class="redirect-msg">Redirigiendo a "Mis Tickets" en unos segundos...</p>
        <!-- Por ahora mostramos el payload en texto.
             Más adelante podemos convertir esto en imagen QR -->
        <pre>{{ result.qr_payload }}</pre>
      </div>
      <div v-else>
        <h3>No se generó QR</h3>
        <p>Revise sus datos o intente con otro método de pago.</p>
      </div>
    </section>

    <p v-if="error" class="error">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { processPayment, type PaymentResponseDto } from "@/services/paymentService";

// 🚩 Aquí es donde conectamos con tu flujo real:
const route = useRoute();
const router = useRouter();
const ticketId = computed(() => Number(route.query.ticketId));
const userId = computed(() => Number(route.query.userId));
const amount = computed(() => Number(route.query.amount) || 100.0);
const currency = computed(() => String(route.query.currency) || "USD");

const cardholderName = ref("");
const cardNumber = ref("");
const expiry = ref("");
const cvv = ref("");

const loading = ref(false);
const result = ref<PaymentResponseDto | null>(null);
const error = ref<string | null>(null);

// Por ahora simulamos el token según la tarjeta:
function buildPaymentToken(): string {
  // Ejemplo para pruebas con tu backend:
  // - Si la tarjeta empieza con "4" => aprobado
  // - Si empieza con "5" => rechazado
  if (cardNumber.value.startsWith("5")) {
    return "FAIL_123";
  }
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

    // Si el pago fue exitoso, redirigir a "Mis Tickets" después de 2 segundos
    if (response.status === 'approved' && response.qr_payload) {
      setTimeout(() => {
        router.push({
          name: 'ticket',
          query: { paymentSuccess: 'true' }
        });
      }, 2000);
    }
  } catch (e: any) {
    console.error(e);
    error.value =
      e?.response?.data?.detail ??
      "Ocurrió un error al procesar el pago. Inténtelo nuevamente.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.payment-page {
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.ticket-summary,
.payment-form,
.payment-result {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.row {
  display: flex;
  gap: 1rem;
}

.row label {
  flex: 1;
}

button {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
}

.error {
  color: red;
  font-weight: 600;
}

.payment-result.success {
  background: #d4edda;
  border-color: #c3e6cb;
}

.payment-result.success h2 {
  color: #155724;
}

.redirect-msg {
  background: #fff3cd;
  border: 1px solid #ffc107;
  padding: 0.5rem;
  border-radius: 4px;
  margin: 1rem 0;
  font-weight: 600;
  color: #856404;
  text-align: center;
}
</style>
