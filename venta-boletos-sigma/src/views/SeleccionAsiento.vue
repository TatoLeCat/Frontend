<template>
  <div class="p-6 space-y-6">

    <h2 class="text-2xl font-bold text-gray-800">Selección de Asientos</h2>

    <!-- Alerta de No Elegido en Rifa -->
    <Message v-if="!hasRaffleAssignment" severity="error" :closable="false" class="mb-4">
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <i class="pi pi-lock text-2xl"></i>
          <div>
            <p class="font-bold text-lg">Acceso Restringido</p>
            <p>Lo sentimos, no has sido elegido en la rifa para poder comprar entradas.</p>
            <p class="text-sm mt-2">Solo los usuarios seleccionados en la rifa pueden acceder a la compra de boletos.</p>
          </div>
        </div>
        <Button
          label="Ir al Inicio"
          icon="pi pi-home"
          severity="secondary"
          @click="goToHome"
          class="w-fit"
        />
      </div>
    </Message>

    <!-- Selectores -->
    <Card v-if="hasRaffleAssignment" class="bg-white shadow-md">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <!-- Estadio -->
          <div class="flex flex-col gap-2">
            <label class="font-semibold text-gray-700">Estadio</label>
            <Dropdown
              v-model="selectedStadium"
              :options="stadiums"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione un estadio"
              class="w-full"
              :loading="loadingStadiums"
              @change="onStadiumChange"
            />
          </div>

          <!-- Área -->
          <div class="flex flex-col gap-2">
            <label class="font-semibold text-gray-700">Área</label>
            <Dropdown
              v-model="selectedArea"
              :options="areas"
              optionLabel="label"
              optionValue="id"
              placeholder="Seleccione un área"
              class="w-full"
              :loading="loadingAreas"
              :disabled="!selectedStadium"
              @change="onAreaChange"
            />
          </div>

        </div>
      </template>
    </Card>

    <!-- Loading General -->
    <div v-if="hasRaffleAssignment && loading" class="flex justify-center items-center py-8">
      <i class="pi pi-spin pi-spinner text-3xl text-blue-500"></i>
    </div>

    <!-- Error -->
    <div v-if="hasRaffleAssignment && error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center gap-2 text-red-700">
        <i class="pi pi-exclamation-triangle"></i>
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- Info selección -->
    <div
      v-if="hasRaffleAssignment && selectedStadium && selectedArea && !loading"
      class="bg-blue-50 border border-blue-200 rounded-lg p-4"
    >
      <div class="flex items-center gap-2 text-blue-700">
        <i class="pi pi-info-circle"></i>
        <span>
          Mostrando asientos de:
          <strong>{{ getCurrentStadiumName() }}</strong> -
          <strong>{{ getCurrentAreaName() }}</strong>
        </span>
      </div>
    </div>

    <!-- NUEVO: STADIUM MAP PRO -->
    <div
      v-if="hasRaffleAssignment && dataFromApi.length > 0 && !loading"
      class="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
    >
      <h2 class="text-xl font-bold mb-4 text-gray-800">Mapa Interactivo del Estadio</h2>

      <StadiumMapPro
        :seats="dataFromApi"
        :selectedSeats="selectedSeats"
        @select="toggleSeat"
      />
    </div>

    <!-- MATRIZ DE ASIENTOS (fallback o modo lista) -->
    <div
      v-if="hasRaffleAssignment && dataFromApi.length > 0 && !loading"
      class="mt-6"
    >
      <Card class="w-full shadow-lg">
        <template #content>
          <SeatMatrix
            :rows="dataFromApi"
            :selectedSeats="selectedSeats"
            @select="toggleSeat"
          />
        </template>
      </Card>
    </div>

    <!-- Mensaje si no hay asientos -->
    <div
      v-if="hasRaffleAssignment && !loading && dataFromApi.length === 0 && selectedStadium && selectedArea"
      class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center"
    >
      <i class="pi pi-inbox text-4xl text-yellow-600 mb-2"></i>
      <p class="text-gray-700">No hay asientos disponibles</p>
    </div>

    <!-- Mensaje inicial -->
    <div
      v-if="hasRaffleAssignment && (!selectedStadium || !selectedArea)"
      class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center"
    >
      <i class="pi pi-map-marker text-5xl text-gray-400 mb-3"></i>
      <p class="text-gray-600 text-lg">Seleccione un estadio y un área</p>
    </div>

    <!-- RESUMEN DE COMPRA -->
    <div
      v-if="hasRaffleAssignment && selectedSeatsList.length > 0"
      class="bg-white p-6 shadow-md rounded-lg"
    >
      <h2 class="text-xl font-bold mb-3">Resumen de Compra</h2>

      <ul class="mb-4">
        <li v-for="seat in selectedSeatsList" :key="seat.id" class="flex justify-between">
          <span class="text-blue-700 font-bold">Asiento: {{ seat.seat_number }}</span>
          <span class="text-gray-700">Precio: L. 100</span>
        </li>
      </ul>

      <p class="text-lg font-bold">Total: L. {{ totalAmount }}</p>

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
import Card from "primevue/card";
import Dropdown from "primevue/dropdown";
import Message from "primevue/message";
import Button from "primevue/button";
import SeatMatrix from "@/components/SeatMatrix.vue";
import StadiumMapPro from "@/components/StadiumMapPro.vue"; 
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import AuthService from "@/services/AuthService";

// Router
const router = useRouter();

// Validación de rifa
const hasRaffleAssignment = ref(false);

// Verificar elegibilidad de rifa
const checkRaffleEligibility = () => {
  const user = AuthService.getUser();
  if (user && user.has_raffle_assignment === true) {
    hasRaffleAssignment.value = true;
  } else {
    hasRaffleAssignment.value = false;
  }
};

// Navegar al inicio
const goToHome = () => {
  router.push("/");
};

// Loading states
const loading = ref(false);
const loadingStadiums = ref(false);
const loadingAreas = ref(false);

// Error global
const error = ref(null);

// Stadium selection
const selectedStadium = ref(null);
const selectedArea = ref(null);
const stadiums = ref([]);
const areas = ref([]);

// Asientos
const dataFromApi = ref([]);
const selectedSeats = ref(new Set());

// Convert Set → Array
const selectedSeatsList = computed(() =>
  Array.from(selectedSeats.value).map(id =>
    dataFromApi.value.flatMap(r => r.seats).find(s => s.id === id)
  )
);

// Total dinámico (100 L por asiento)
const totalAmount = computed(() => selectedSeatsList.value.length * 100);

// Fetch Stadiums
const fetchStadiums = async () => {
  loadingStadiums.value = true;
  try {
    const res = await fetch("http://127.0.0.1:8090/stadium/");
    stadiums.value = await res.json();
  } catch (err) {
    error.value = "Error cargando estadios";
  } finally {
    loadingStadiums.value = false;
  }
};

// Fetch Areas
const fetchAreas = async (stadiumId) => {
  loadingAreas.value = true;
  try {
    const res = await fetch(`http://127.0.0.1:8090/stadium/${stadiumId}/areas`);
    areas.value = await res.json();
  } catch (err) {
    error.value = "Error cargando áreas";
  } finally {
    loadingAreas.value = false;
  }
};

// Fetch Rows (asientos)
const fetchRows = async () => {
  if (!selectedStadium.value || !selectedArea.value) return;

  loading.value = true;
  selectedSeats.value.clear();

  try {
    const res = await fetch(
      `http://127.0.0.1:8090/seats/stadium/${selectedStadium.value}/area/${selectedArea.value}/rows`
    );
    dataFromApi.value = await res.json();
  } catch (err) {
    error.value = "Error cargando asientos";
  } finally {
    loading.value = false;
  }
};

// Selección de asientos
const toggleSeat = (seat) => {
  if (selectedSeats.value.has(seat.id)) {
    selectedSeats.value.delete(seat.id);
  } else {
    selectedSeats.value.add(seat.id);
  }
};

// Crear tickets y enviar a checkout
const goToCheckout = async () => {
  try {
    const ticketIds = [];

    for (const seat of selectedSeatsList.value) {
      const res = await fetch("http://localhost:8090/tickets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seat_id: seat.id,
          user_id: 1,
        }),
      });

      if (!res.ok) throw new Error("Error creando ticket");

      const data = await res.json();

      const id = data.ticket_id;

      if (!id) throw new Error("El backend no devolvió un ID válido");
      ticketIds.push(id);
    }

    router.push({
      name: "Checkout",
      query: {
        ticketIds: JSON.stringify(ticketIds),
        amount: totalAmount.value,
      },
    });

  } catch (err) {
    console.error("Error creando tickets", err);
    error.value = "No se pudieron crear los tickets.";
  }
};


// Helpers
const getCurrentStadiumName = () =>
  stadiums.value.find(s => s.id === selectedStadium.value)?.name || "";

const getCurrentAreaName = () =>
  areas.value.find(a => a.id === selectedArea.value)?.label || "";

// Eventos
const onStadiumChange = () => {
  selectedArea.value = null;
  areas.value = [];
  dataFromApi.value = [];
  fetchAreas(Number(selectedStadium.value));
};

const onAreaChange = () => {
  fetchRows();
};

// Mounted
onMounted(() => {
  checkRaffleEligibility();
  if (hasRaffleAssignment.value) {
    fetchStadiums();
  }
});
</script>


