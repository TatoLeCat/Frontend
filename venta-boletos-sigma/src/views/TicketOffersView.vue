<template>
  <div class="bg-surface-50 dark:bg-surface-950 px-6 py-12 md:px-20 lg:px-80">
    <div class="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-2">
        <h1 class="text-surface-900 dark:text-surface-0 text-3xl font-semibold">
          Ofertas de Boletos - Mundial de Fútbol 2026
        </h1>
        <p class="text-surface-700 dark:text-surface-200">
          Selecciona tu boleto para los partidos del mundial y completa la compra en menos de 72 horas
        </p>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="text-surface-900 dark:text-surface-0 font-medium block mb-2">
            Filtrar por fase
          </label>
          <Dropdown
            v-model="selectedPhase"
            :options="phases"
            optionLabel="name"
            optionValue="id"
            placeholder="Todas las fases"
            class="w-full"
          />
        </div>
        <div class="flex-1">
          <label class="text-surface-900 dark:text-surface-0 font-medium block mb-2">
            Rango de precio
          </label>
          <Slider
            v-model="priceRange"
            :min="0"
            :max="500"
            range
            class="w-full"
          />
        </div>
      </div>

      <!-- Tickets Grid -->
      <div v-if="filteredTickets.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="ticket in filteredTickets"
          :key="ticket.id"
          class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-800 hover:shadow-md transition-shadow cursor-pointer"
          @click="selectTicket(ticket)"
        >
          <!-- Ticket Header -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-surface-900 dark:text-surface-0 font-semibold text-lg">
                {{ ticket.team1 }} vs {{ ticket.team2 }}
              </h3>
              <p class="text-surface-600 dark:text-surface-300 text-sm">
                {{ ticket.eventDate }}
              </p>
            </div>
            <Tag
              :value="ticket.phase"
              :severity="getPhaseSeverity(ticket.phase)"
              class="text-xs"
            />
          </div>

          <!-- Ticket Details -->
          <div class="flex flex-col gap-3 mb-6 pb-6 border-b border-surface-200 dark:border-surface-700">
            <!-- Stadium -->
            <div class="flex items-center gap-2">
              <i class="pi pi-map-marker text-primary text-sm"></i>
              <div class="flex flex-col">
                <span class="text-surface-900 dark:text-surface-0 font-semibold text-sm">
                  {{ ticket.stadium }}
                </span>
                <span class="text-surface-600 dark:text-surface-300 text-xs">
                  {{ ticket.city }}, USA
                </span>
              </div>
            </div>

            <!-- Price -->
            <div class="flex items-center gap-2">
              <i class="pi pi-tag text-primary text-sm"></i>
              <span class="text-surface-900 dark:text-surface-0 font-semibold text-lg">
                ${{ ticket.price.toFixed(2) }}
              </span>
            </div>

            <!-- Availability -->
            <div class="flex items-center gap-2">
              <i
                :class="{
                  'pi pi-check-circle text-green-500': ticket.available > 0,
                  'pi pi-times-circle text-red-500': ticket.available === 0,
                }"
                class="text-sm"
              ></i>
              <span
                :class="{
                  'text-green-600 dark:text-green-400': ticket.available > 0,
                  'text-red-600 dark:text-red-400': ticket.available === 0,
                }"
                class="text-sm font-medium"
              >
                {{ ticket.available > 0 ? `${ticket.available} disponibles` : 'Agotado' }}
              </span>
            </div>
          </div>

          <!-- Time Limit -->
          <div class="mb-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p class="text-yellow-800 dark:text-yellow-200 text-xs flex items-center gap-2">
              <i class="pi pi-clock text-sm"></i>
              Oferta válida por: <span class="font-semibold">{{ ticket.timeLimit }} horas</span>
            </p>
          </div>

          <!-- CTA Button -->
          <Button
            label="Ver Detalles"
            @click="selectTicket(ticket)"
            class="w-full py-2 rounded-lg"
            :disabled="ticket.available === 0"
          />
        </div>
      </div>

      <!-- No tickets message -->
      <div v-else class="flex items-center justify-center py-20">
        <div class="text-center">
          <i class="pi pi-inbox text-5xl text-surface-400 mb-4"></i>
          <p class="text-surface-700 dark:text-surface-300 text-lg">
            No hay ofertas disponibles con los filtros seleccionados
          </p>
        </div>
      </div>
    </div>

    <!-- Ticket Detail Dialog -->
    <Dialog
      v-model:visible="showDetailDialog"
      :header="`${selectedTicketData?.team1} vs ${selectedTicketData?.team2}`"
      :modal="true"
      :style="{ width: '90vw', maxWidth: '500px' }"
      class="rounded-2xl"
    >
      <TicketDetailView
        v-if="selectedTicketData"
        :ticket="selectedTicketData"
        @close="showDetailDialog = false"
        @checkout="goToCheckout"
      />
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import Slider from 'primevue/slider';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import TicketDetailView from './TicketDetailView.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const tickets = ref([
  {
    id: 1,
    team1: 'Argentina',
    team2: 'Francia',
    eventDate: '15 de Junio, 2026',
    stadium: 'MetLife Stadium',
    city: 'New Jersey',
    price: 189.99,
    available: 12,
    phase: 'Semifinal',
    timeLimit: 72,
    image: 'https://images.unsplash.com/photo-1516231318713-ef900995ad4d?w=400',
    description: 'Boleto para la semifinal Argentina vs Francia con excelente vista del terreno',
    seatNumber: 'A-125',
    row: 'A',
    sector: 'Sur',
  },
  {
    id: 2,
    team1: 'Brasil',
    team2: 'Alemania',
    eventDate: '14 de Junio, 2026',
    stadium: 'Soldier Field',
    city: 'Chicago',
    price: 159.99,
    available: 25,
    phase: 'Cuartos de Final',
    timeLimit: 72,
    image: 'https://images.unsplash.com/photo-1516231318713-ef900995ad4d?w=400',
    description: 'Boleto para cuartos de final Brasil vs Alemania',
    seatNumber: 'B-350',
    row: 'B',
    sector: 'Oriente',
  },
  {
    id: 3,
    team1: 'España',
    team2: 'Holanda',
    eventDate: '13 de Junio, 2026',
    stadium: 'AT&T Stadium',
    city: 'Dallas',
    price: 145.00,
    available: 0,
    phase: 'Cuartos de Final',
    timeLimit: 72,
    image: 'https://images.unsplash.com/photo-1516231318713-ef900995ad4d?w=400',
    description: 'Boleto para cuartos de final España vs Holanda',
    seatNumber: 'S-100',
    row: 'Sur',
    sector: 'Occidental',
  },
  {
    id: 4,
    team1: 'Italia',
    team2: 'Uruguay',
    eventDate: '10 de Junio, 2026',
    stadium: 'SoFi Stadium',
    city: 'Inglewood',
    price: 125.50,
    available: 8,
    phase: 'Octavos de Final',
    timeLimit: 72,
    image: 'https://images.unsplash.com/photo-1516231318713-ef900995ad4d?w=400',
    description: 'Entrada para octavos de final Italia vs Uruguay',
    seatNumber: 'P-45',
    row: 'Platea',
    sector: 'Norte',
  },
  {
    id: 5,
    team1: 'Bélgica',
    team2: 'Japón',
    eventDate: '9 de Junio, 2026',
    stadium: 'Arrowhead Stadium',
    city: 'Kansas City',
    price: 99.99,
    available: 45,
    phase: 'Octavos de Final',
    timeLimit: 72,
    image: 'https://images.unsplash.com/photo-1516231318713-ef900995ad4d?w=400',
    description: 'Entrada para octavos de final Bélgica vs Japón',
    seatNumber: 'G-200',
    row: 'General',
    sector: 'Este',
  },
  {
    id: 6,
    team1: 'Portugal',
    team2: 'México',
    eventDate: '8 de Junio, 2026',
    stadium: 'NRG Stadium',
    city: 'Houston',
    price: 89.99,
    available: 60,
    phase: 'Fase de Grupos',
    timeLimit: 72,
    image: 'https://images.unsplash.com/photo-1516231318713-ef900995ad4d?w=400',
    description: 'Entrada para fase de grupos Portugal vs México',
    seatNumber: 'G-300',
    row: 'General',
    sector: 'Oeste',
  },
]);

const phases = ref([
  { id: 1, name: 'Fase de Grupos' },
  { id: 2, name: 'Octavos de Final' },
  { id: 3, name: 'Cuartos de Final' },
  { id: 4, name: 'Semifinal' },
  { id: 5, name: 'Final' },
]);

const selectedPhase = ref(null);
const priceRange = ref([0, 500]);
const showDetailDialog = ref(false);
const selectedTicketData = ref(null);

const filteredTickets = computed(() => {
  return tickets.value.filter((ticket) => {
    const phaseMatch =
      !selectedPhase.value || ticket.phase === phases.value.find(p => p.id === selectedPhase.value)?.name;
    const priceMatch = ticket.price >= priceRange.value[0] && ticket.price <= priceRange.value[1];
    return phaseMatch && priceMatch;
  });
});

const getPhaseSeverity = (phase) => {
  const severityMap = {
    'Final': 'danger',
    'Semifinal': 'warning',
    'Cuartos de Final': 'info',
    'Octavos de Final': 'success',
    'Fase de Grupos': 'info',
  };
  return severityMap[phase] || 'info';
};

const selectTicket = (ticket) => {
  selectedTicketData.value = ticket;
  showDetailDialog.value = true;
};

const goToCheckout = (ticket) => {
  showDetailDialog.value = false;
  router.push({
    name: 'checkout',
    params: { ticketId: ticket.id },
  });
};
</script>