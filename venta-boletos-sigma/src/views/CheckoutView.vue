<template>
  <div class="flex justify-center py-10 bg-gray-100 min-h-screen">
    <div
      class="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-gray-200"
    >
      <!-- TÍTULO -->
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Resumen de Compra
      </h2>

      <!-- LISTA DE TICKETS -->
      <p class="font-semibold text-gray-700 mb-2">Tickets seleccionados:</p>

      <div
        v-for="id in ticketIds"
        :key="id"
        class="bg-indigo-50 text-indigo-800 px-4 py-2 rounded-lg mb-2 flex items-center gap-2"
      >
        <i class="pi pi-ticket"></i> Ticket #{{ id }}
      </div>

      <!-- TOTAL -->
      <p class="text-lg mt-4 mb-6">
        <strong>Total:</strong>
        <span class="text-green-600 font-bold">L. {{ totalAmount }}</span>
      </p>

      <!-- FORMULARIO -->
      <form class="space-y-4" @submit.prevent="onSubmit">

        <p class="text-sm font-semibold text-gray-700 mt-4">
          Datos del Comprador
        </p>

        <input
          v-model="buyerName"
          class="w-full border border-gray-300 rounded-lg px-4 py-2"
          placeholder="Nombre Completo"
          required
        />

        <input
          v-model="buyerEmail"
          class="w-full border border-gray-300 rounded-lg px-4 py-2"
          type="email"
          placeholder="Correo electrónico"
          required
        />

        <input
          v-model="buyerPhone"
          class="w-full border border-gray-300 rounded-lg px-4 py-2"
          placeholder="Teléfono"
          required
        />

        <!-- TARJETA -->
        <p class="text-sm font-semibold text-gray-700 mt-6">
          Datos de la Tarjeta
        </p>

        <input
          v-model="cardNumber"
          class="w-full border border-gray-300 rounded-lg px-4 py-2"
          maxlength="16"
          placeholder="Número de tarjeta (1234 5678 9012 3456)"
          required
        />

        <div class="flex gap-4">
          <input
            v-model="expiry"
            class="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="MM/AA"
            required
          />

          <input
            v-model="cvv"
            class="w-full border border-gray-300 rounded-lg px-4 py-2"
            maxlength="4"
            placeholder="CVV"
            required
          />
        </div>

        <!-- PAGAR -->
        <button
          type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-4"
          :disabled="loading"
        >
          {{ loading ? "Procesando..." : "Pagar Ahora" }}
        </button>
      </form>

      <!-- ERROR -->
      <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>

      <!-- VOLVER -->
      <button
        class="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-lg mt-4"
        @click="router.back()"
      >
        Volver
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { processPayment } from "@/services/paymentService";

const route = useRoute();
const router = useRouter();

/* ================== TICKETS ================== */
const ticketIds = ref<number[]>([]);
const amountFromQuery = ref(0);  // <-- precio total REAL que viene desde Seleccionar Asiento

onMounted(() => {
  const raw = route.query.ticketIds;
  if (raw) ticketIds.value = JSON.parse(String(raw));

  if (route.query.amount) {
    amountFromQuery.value = Number(route.query.amount);
  }
});

/* ================== PRECIO ================== */
const ticketPrice = computed(() => {
  return ticketIds.value.length > 0
    ? amountFromQuery.value / ticketIds.value.length
    : 0;
});

const totalAmount = computed(() => amountFromQuery.value);

/* ================== FORM ================== */
const buyerName = ref("");
const buyerEmail = ref("");
const buyerPhone = ref("");

const cardNumber = ref("");
const expiry = ref("");
const cvv = ref("");

const loading = ref(false);
const error = ref<string | null>(null);

/* ================== TOKEN MOCK ================== */
function buildPaymentToken(): string {
  return cardNumber.value.startsWith("5") ? "FAIL_123" : "OK_123";
}

/* ================== SUBMIT ================== */
async function onSubmit() {
  try {
    loading.value = true;
    error.value = null;

    const ticketsPayload = ticketIds.value.map(id => ({
      ticket_id: id,
      amount: ticketPrice.value    // <-- PRECIO REAL POR TICKET
    }));

    const payload = {
      tickets: ticketsPayload,
      user_id: 1,
      currency: "HNL",
      payment_token: buildPaymentToken()
    };

    console.log("Payload enviado:", payload);

    const response = await processPayment(payload);

    if (response.status === "Pagado") {
      router.push({
        name: "ticket-qr",
        query: {
          qr: response.qr_payload,
          tx: response.transaction_id,
          total: response.total,
          comprador: response.comprador,
          detalle: JSON.stringify(response.detalle_tickets)
        }
      });
    } else {
      error.value = "El pago fue rechazado.";
    }
  } catch (e: any) {
    error.value = e?.message || "Error procesando el pago.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
input { color: #111 !important; }
input::placeholder { color: #777 !important; }
</style>
