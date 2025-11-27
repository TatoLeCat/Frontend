<template>
  <div class="flex justify-center mt-10">
    <div class="bg-white text-black p-8 rounded-xl shadow-xl w-[450px]">

      <img :src="qrImage" alt="QR" class="mx-auto w-60 h-60" />

    <div class="mt-6 text-black">
      <p><strong>Transacción:</strong> {{ transactionId }}</p>
      <p><strong>Comprador:</strong> {{ comprador }}</p>
      <p><strong>Total Pagado:</strong> L. {{ total }}</p>
      <p><strong>Fecha:</strong> {{ fechaCompra }}</p>

   <p class="mt-4 font-semibold">Tickets Comprados:</p>
      <ul class="list-disc ml-6">
        <li v-for="t in detalleTickets" :key="t.ticket_id">
          Ticket {{ t.ticket_id }} –
          {{ t.asiento }} –
          {{ t.fila }} –
          {{ t.area }} –
          {{ t.estadio }}
        </li>
      </ul>
    </div>

      <button
        class="mt-6 w-full bg-emerald-500 text-white py-2 rounded-lg"
        @click="downloadPDF"
      >
        Descargar PDF
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import jsPDF from "jspdf";

const route = useRoute();

/** @type {import('vue').Ref<string|null>} */
const qrImage = ref(null);

/** @type {import('vue').Ref<string|null>} */
const comprador = ref(null);

/** @type {import('vue').Ref<number|null>} */
const total = ref(null);

/** @type {import('vue').Ref<Array<any>>} */
const detalleTickets = ref([]);

/** @type {import('vue').Ref<number|null>} */
const transactionId = ref(null);

/** @type {import('vue').Ref<string>} */
const fechaCompra = ref("");

onMounted(() => {
  const rawQR = route.query.qr;
  const det = route.query.detalle;

  transactionId.value = Number(route.query.tx) || null;
  comprador.value = route.query.comprador || "Desconocido";
  total.value = Number(route.query.total) || null;

  if (!rawQR) {
    return;
  }

  qrImage.value = `data:image/png;base64,${rawQR}`;

  if (det) {
    try {
      detalleTickets.value = JSON.parse(String(det));
    } catch {
      detalleTickets.value = [];
    }
  }

  fechaCompra.value = new Date().toLocaleString("es-HN");
});

function downloadPDF() {
  if (!qrImage.value) return;
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("Boleto Digital – Copa Mundial 2026", 20, 20);

  doc.addImage(qrImage.value, "PNG", 60, 30, 90, 90);

  doc.setFontSize(12);
  doc.text(`Transacción: ${transactionId.value}`, 20, 140);
  doc.text(`Comprador: ${comprador.value}`, 20, 150);
  doc.text(`Total Pagado: L. ${total.value}`, 20, 160);
  doc.text(`Fecha: ${fechaCompra.value}`, 20, 170);

  doc.text("Detalles de los Tickets:", 20, 185);

  detalleTickets.value.forEach((d, i) => {
    doc.text(
      `• Ticket ${d.ticket_id} – Asiento ${d.seat_number} – Fila ${d.row} – Área ${d.area} – Estadio ${d.stadium}`,
      25,
      195 + i * 8
    );
  });

  doc.save(`boleto_${transactionId.value}.pdf`);
}
</script>


<style scoped>
.qr-ticket-container {
  max-width: 400px;
  margin: 40px auto;
  text-align: center;
  background: #fff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0px 4px 20px rgba(0,0,0,0.1);
}

.title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.qr-wrapper {
  margin: 20px 0;
}

.qr-img {
  width: 240px;
  height: 240px;
  border-radius: 12px;
  border: 2px solid #ddd;
}

.ticket-info {
  margin-top: 20px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin: 6px 0;
}

.label {
  font-weight: bold;
  color: #444;
}

.value {
  color: #222;
}

.download-btn {
  margin-top: 20px;
  padding: 10px 18px;
  background-color: #10b981;
  color: white;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.download-btn:hover {
  background-color: #059669;
}

.error-text {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>
