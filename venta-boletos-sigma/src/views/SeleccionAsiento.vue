<template>
  <div class="p-6 space-y-6">

    <h2 class="text-2xl font-bold text-gray-800">Selección de Asientos</h2>

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

          <!-- ESTADIO -->
          <div class="flex flex-col gap-2">
            <label class="font-semibold text-gray-700">Estadio</label>
            <Dropdown
              v-model="selectedStadium"
              :options="stadiums"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione un estadio"
              :loading="loadingStadiums"
              class="w-full"
              @change="onStadiumChange"
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

    <!-- INFO DE SELECCIÓN -->
    <div
      v-if="hasRaffleAssignment && selectedStadium && selectedArea"
      class="bg-blue-50 border border-blue-200 p-4 rounded-lg"
    >
      <div class="flex items-center gap-2 text-blue-700">
        <i class="pi pi-info-circle"></i>
        <span>
          {{ getCurrentStadiumName() }} —
          {{ getCurrentAreaName() }}
          <strong class="ml-2">(Precio: L. {{ currentAreaPrice }})</strong>
        </span>
      </div>
    </div>

    <!-- STADIUM MAP PRO -->
    <div
      v-if="hasRaffleAssignment && dataFromApi.length > 0"
      class="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
    >
      <h2 class="text-xl font-bold mb-4 text-gray-800">Mapa Interactivo del Estadio</h2>

      <StadiumMapPro
        :seats="dataFromApi"
        :selectedSeats="selectedSeats"
        @select="toggleSeat"
      />
    </div>

    <!-- MATRIZ -->
    <div v-if="dataFromApi.length > 0" class="mt-6">
      <Card>
        <template #content>
          <SeatMatrix
            :rows="dataFromApi"
            :selectedSeats="selectedSeats"
            @select="toggleSeat"
          />
        </template>
      </Card>
    </div>

    <!-- SI NO HAY ASIENTOS -->
    <div
      v-if="selectedStadium && selectedArea && dataFromApi.length === 0"
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
      <h2 class="text-xl font-bold mb-3">Resumen de Compra</h2>

      <ul class="mb-4">
        <li
          v-for="seat in selectedSeatsList"
          :key="seat.id"
          class="flex justify-between"
        >
          <span>Asiento: {{ seat.seat_number }}</span>
          <span>L. {{ currentAreaPrice }}</span>
        </li>
      </ul>

      <p class="text-lg font-bold">
        Total: L. {{ totalAmount }}
      </p>

      <button
        @click="goToCheckout"
        class="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-bold w-full"
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
import StadiumMapPro from "@/components/StadiumMapPro.vue";

import AuthService from "@/services/AuthService";

// ROUTER
const route = useRoute();
const router = useRouter();

// MATCH ID RECIBIDO DESDE PartidosView
const matchId = Number(route.params.matchId);

// RAFFLE
const hasRaffleAssignment = ref(false);
const checkRaffleEligibility = () => {
  const user = AuthService.getUser();
  hasRaffleAssignment.value = user?.has_raffle_assignment === true;
};

// LOADING
const loading = ref(false);
const loadingStadiums = ref(false);
const loadingAreas = ref(false);

// ERRORES
const error = ref(null);

// SELECCIÓN
const selectedStadium = ref(null);
const selectedArea = ref(null);
const stadiums = ref([]);
const areas = ref([]);

// ASIENTOS
const dataFromApi = ref([]);
const selectedSeats = ref(new Set());

// PRECIO DEL ÁREA SELECCIONADA
const currentAreaPrice = ref(0);

// GETTER PARA RESUMEN
const selectedSeatsList = computed(() =>
  Array.from(selectedSeats.value).map(id =>
    dataFromApi.value.flatMap(r => r.seats).find(s => s.id === id)
  )
);

const totalAmount = computed(() =>
  selectedSeatsList.value.length * currentAreaPrice.value
);

// FETCH ESTADIOS
const fetchStadiums = async () => {
  loadingStadiums.value = true;
  const res = await fetch("http://localhost:8090/stadium/");
  stadiums.value = await res.json();
  loadingStadiums.value = false;
};

// FETCH ÁREAS
const fetchAreas = async stadiumId => {
  loadingAreas.value = true;
  const res = await fetch(`http://localhost:8090/stadium/${stadiumId}/areas`);
  areas.value = await res.json();
  loadingAreas.value = false;
};

// FETCH PRECIO DEL ÁREA ACTUAL
const fetchAreaPrice = async () => {
  if (!selectedArea.value) return;
  const res = await fetch(
    `http://localhost:8090/pricing/match/${matchId}/area/${selectedArea.value}`
  );
  const data = await res.json();
  currentAreaPrice.value = data.base_price;
};

// FETCH ASIENTOS
const fetchRows = async () => {
  if (!selectedStadium.value || !selectedArea.value) return;

  loading.value = true;
  selectedSeats.value.clear();

  const res = await fetch(
    `http://localhost:8090/seats/stadium/${selectedStadium.value}/area/${selectedArea.value}/rows`
  );

  dataFromApi.value = await res.json();
  loading.value = false;

  await fetchAreaPrice();
};

// TOGGLE ASIENTOS
const toggleSeat = seat => {
  if (selectedSeats.value.has(seat.id)) {
    selectedSeats.value.delete(seat.id);
  } else {
    selectedSeats.value.add(seat.id);
  }
};

// CHECKOUT
const goToCheckout = () => {
  router.push({
    name: "Checkout",
    query: {
      matchId,
      areaId: selectedArea.value,
      seatIds: JSON.stringify(selectedSeatsList.value.map(s => s.id)),
      amount: totalAmount.value
    }
  });
};

// HELPERS
const getCurrentStadiumName = () =>
  stadiums.value.find(s => s.id === selectedStadium.value)?.name || "";

const getCurrentAreaName = () =>
  areas.value.find(a => a.id === selectedArea.value)?.label || "";

// EVENTOS
const onStadiumChange = () => {
  selectedArea.value = null;
  areas.value = [];
  dataFromApi.value = [];
  fetchAreas(selectedStadium.value);
};

const onAreaChange = () => {
  fetchRows();
};

// MOUNTED
onMounted(() => {
  checkRaffleEligibility();
  console.log("Usuario autenticado:", AuthService.getUser());
  
  if (hasRaffleAssignment.value) {
    fetchStadiums();
  }

});
</script>
