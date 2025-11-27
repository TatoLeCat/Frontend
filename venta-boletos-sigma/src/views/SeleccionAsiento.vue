<template>
  <div class="p-6 space-y-6">

    <h2 class="text-2xl font-bold text-gray-800">Selección de Asientos</h2>

    <!-- MENSAJE SI NO TIENE ASIGNACIÓN DE RIFA -->
    <Message v-if="!hasRaffleAssignment" severity="error" :closable="false" class="mb-4">
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <i class="pi pi-lock text-2xl"></i>
          <div>
            <p class="font-bold text-lg">Acceso Restringido</p>
            <p>No fuiste elegido en la rifa, por lo tanto no puedes comprar boletos.</p>
          </div>
        </div>
        <Button
          label="Ir al Inicio"
          icon="pi pi-home"
          severity="secondary"
          @click="goToHome"
        />
      </div>
    </Message>

    <!-- SELECTORES -->
    <Card v-if="hasRaffleAssignment" class="bg-white shadow-md">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <!-- ESTADIO FIJO -->
          <div class="flex flex-col gap-2">
            <label class="font-semibold text-gray-700">Estadio</label>

            <Dropdown
              v-model="selectedStadium"
              :options="stadiums"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione un estadio"
              :disabled="true"
              class="w-full"
            />
          </div>

          <!-- ÁREA -->
          <div class="flex flex-col gap-2">
            <label class="font-semibold text-gray-700">Área</label>

            <Dropdown
              v-model="selectedArea"
              :options="areas"
              optionLabel="label"
              optionValue="id"
              placeholder="Seleccione un área"
              :loading="loadingAreas"
              :disabled="!selectedStadium"
              class="w-full"
              @change="onAreaChange"
            />
          </div>

        </div>
      </template>
    </Card>

    <!-- INFO -->
    <div
      v-if="hasRaffleAssignment && selectedStadium && selectedArea"
      class="bg-blue-50 border border-blue-200 p-4 rounded-lg"
    >
      <div class="flex items-center gap-2 text-blue-700">
        <i class="pi pi-info-circle"></i>
        <span>
          {{ getCurrentStadiumName() }} — {{ getCurrentAreaName() }}
          <strong class="ml-2">(Precio: L. {{ currentAreaPrice }})</strong>
        </span>
      </div>
    </div>

    <!-- SOLO SEATMATRIX -->
    <div v-if="groupedRows.length > 0" class="mt-6">
      <Card>
        <template #content>
          <SeatMatrix
            :rows="groupedRows"
            :selectedSeats="selectedSeats"
            @select="toggleSeat"
          />
        </template>
      </Card>
    </div>

    <!-- NO HAY ASIENTOS -->
    <div
      v-if="selectedStadium && selectedArea && groupedRows.length === 0"
      class="bg-yellow-50 border border-yellow-200 p-6 rounded text-center"
    >
      <i class="pi pi-inbox text-4xl text-yellow-600 mb-2"></i>
      <p>No hay asientos disponibles</p>
    </div>

<!-- RESUMEN DE COMPRA -->
<div
  v-if="selectedSeatsList.length > 0"
  class="bg-white p-6 shadow-md rounded-lg"
>
  <h2 class="text-xl font-bold mb-3 text-gray-900">Resumen de Compra</h2>

  <ul class="mb-4">
    <li
      v-for="seat in selectedSeatsList"
      :key="seat.id"
      class="flex justify-between text-gray-800"
    >
      <span>Asiento: {{ seat.seat_number }}</span>
      <span class="font-bold">L. {{ currentAreaPrice }}</span>
    </li>
  </ul>

  <p class="text-lg font-bold text-gray-900">
    Total: L. {{ totalAmount }}
  </p>

    <button
      @click="goToCheckout"
      class="w-full bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-bold mt-4"
  >
        Ir a pagar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import Card from "primevue/card";
import Dropdown from "primevue/dropdown";
import Message from "primevue/message";
import Button from "primevue/button";

import SeatMatrix from "@/components/SeatMatrix.vue";
import AuthService from "@/services/AuthService";
import { createTicket } from "@/services/ticketService";

const goToCheckout = async () => {
  try {
    loading.value = true;
    const createdIds = [];
      console.log("SELECCIONADOS:", selectedSeatsList.value);

    for (const seat of selectedSeatsList.value) {
      const newTicketId = await createTicket(seat.id);

      console.log("CREADO TICKET:", newTicketId);

      if (!newTicketId) {
        alert("No se pudo crear uno de los tickets.");
        return;
      }

      createdIds.push(newTicketId);
    }

    console.log("TICKETS FINALES:", createdIds);

 
    router.push({
      name: "Checkout",
      query: {
        ticketIds: JSON.stringify(createdIds),
        amount: totalAmount.value
      }
    });

  } finally {
    loading.value = false;
  }
};

const route = useRoute();
const router = useRouter();
const matchId = Number(route.params.matchId);

const hasRaffleAssignment = ref(false);
const loadingAreas = ref(false);
const loading = ref(false);

const selectedStadium = ref(null);
const selectedArea = ref(null);

const stadiums = ref([]);
const areas = ref([]);
const dataFromApi = ref([]);

const selectedSeats = ref(new Set());
const currentAreaPrice = ref(0);

// Agrupar filas para SeatMatrix
const groupedRows = computed(() => {
  const groups = {};
  dataFromApi.value.forEach(seat => {
    if (!groups[seat.row]) groups[seat.row] = [];
    groups[seat.row].push(seat);
  });

  return Object.keys(groups).map(r => ({
    row: r,
    seats: groups[r]
  }));
});

// Lista de asientos seleccionados
const selectedSeatsList = computed(() =>
  dataFromApi.value.filter(seat => selectedSeats.value.has(seat.id))
);

// Total
const totalAmount = computed(() =>
  selectedSeatsList.value.length * currentAreaPrice.value
);

// Verificar rifa
const checkRaffleEligibility = () => {
  const user = AuthService.getUser();
  hasRaffleAssignment.value = user?.has_raffle_assignment === true;
};

// Obtener estadio del partido
const fetchMatchStadium = async () => {
  const res = await fetch(`http://localhost:8090/matches/${matchId}`);
  const match = await res.json();

  selectedStadium.value = match.stadium.id;

  stadiums.value = [{ id: match.stadium.id, name: match.stadium.name }];

  await fetchAreas(match.stadium.id);
};

// Fetch áreas
const fetchAreas = async (stadiumId) => {
  loadingAreas.value = true;
  const res = await fetch(`http://localhost:8090/stadium/${stadiumId}/areas`);
  areas.value = await res.json();
  loadingAreas.value = false;

  if (areas.value.length > 0) {
  selectedArea.value = areas.value[0].id;
  await fetchRows();
  await fetchAreaPrice();
  }
};

// Precio por área
const fetchAreaPrice = async () => {
  const res = await fetch(
    `http://localhost:8090/pricing/match/${matchId}/area/${selectedArea.value}`
  );
  const data = await res.json();
  currentAreaPrice.value = data.base_price;
};

// Asientos
const fetchRows = async () => {
  loading.value = true;
  selectedSeats.value.clear();

  const res = await fetch(
    `http://localhost:8090/seats/stadium/${selectedStadium.value}/area/${selectedArea.value}/rows`
  );

  dataFromApi.value = await res.json();
  loading.value = false;

  await fetchAreaPrice();
};

const onAreaChange = async () => {
  await fetchRows();
  await fetchAreaPrice();
};


const toggleSeat = (seat) => {
  if (selectedSeats.value.has(seat.id))
    selectedSeats.value.delete(seat.id);
  else
    selectedSeats.value.add(seat.id);
};

const getCurrentStadiumName = () =>
  stadiums.value.find(s => s.id === selectedStadium.value)?.name || "";

const getCurrentAreaName = () =>
  areas.value.find(a => a.id === selectedArea.value)?.label || "";

onMounted(() => {
  checkRaffleEligibility();

  if (hasRaffleAssignment.value) {
    fetchMatchStadium();
  }
});
</script>
