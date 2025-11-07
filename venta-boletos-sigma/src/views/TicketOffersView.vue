<template>
  <div class="bg-surface-50 dark:bg-surface-950 px-6 py-12 md:px-20 lg:px-80">
    <div class="flex flex-col gap-8 w-full max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-2">
        <h1 class="text-surface-900 dark:text-surface-0 text-3xl font-semibold">
          Ofertas de Boletos Disponibles
        </h1>
        <p class="text-surface-700 dark:text-surface-200">
          Selecciona tu boleto y completa la compra en menos de 72 horas
        </p>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-4">
        <div class="flex-1">
          <label class="text-surface-900 dark:text-surface-0 font-medium block mb-2">
            Filtrar por evento
          </label>
          <Dropdown
            v-model="selectedEvent"
            :options="events"
            optionLabel="name"
            optionValue="id"
            placeholder="Todos los eventos"
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
                {{ ticket.eventName }}
              </h3>
              <p class="text-surface-600 dark:text-surface-300 text-sm">
                {{ ticket.eventDate }}
              </p>
            </div>
            <Tag
              :value="ticket.category"
              :severity="getCategorySeverity(ticket.category)"
              class="text-xs"
            />
          </div>

          <!-- Ticket Details -->
          <div class="flex flex-col gap-3 mb-6 pb-6 border-b border-surface-200 dark:border-surface-700">
            <!-- Location -->
            <div class="flex items-center gap-2">
              <i class="pi pi-map-marker text-primary text-sm"></i>
              <span class="text-surface-700 dark:text-surface-300 text-sm">
                {{ ticket.location }}
              </span>
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
              Ofrerta válida por: <span class="font-semibold">{{ ticket.timeLimit }} horas</span>
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
      :header="selectedTicketData?.eventName"
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

// Mock data - reemplazar con datos reales de API
const tickets = ref([
  {
    id: 1,
    eventName: 'Concierto Bruno Mars',
    eventDate: '15 de Diciembre, 2024',
    location: 'Estadio Nacional - Sector A',
    price: 89.99,
    available: 12,
    category: 'VIP',
    timeLimit: 72,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    description: 'Boleto para concierto de Bruno Mars con excelente vista del escenario',
    seatNumber: 'A-125',
    row: 'A',
  },
  {
    id: 2,
    eventName: 'Concierto Bruno Mars',
    eventDate: '15 de Diciembre, 2024',
    location: 'Estadio Nacional - Sector B',
    price: 65.99,
    available: 25,
    category: 'General',
    timeLimit: 72,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    description: 'Boleto general para concierto de Bruno Mars',
    seatNumber: 'B-350',
    row: 'B',
  },
  {
    id: 3,
    eventName: 'Partido Semifinal - Fútbol',
    eventDate: '20 de Diciembre, 2024',
    location: 'Estadio Metropolitano - Tribuna Sur',
    price: 45.00,
    available: 0,
    category: 'General',
    timeLimit: 72,
    image: 'https://images.unsplash.com/photo-1516231318713-ef900995ad4d?w=400',
    description: 'Boleto para partido semifinal',
    seatNumber: 'S-100',
    row: 'Sur',
  },
  {
    id: 4,
    eventName: 'Festival de Teatro',
    eventDate: '22 de Diciembre, 2024',
    location: 'Teatro Municipal - Platea',
    price: 35.50,
    available: 8,
    category: 'Premium',
    timeLimit: 72,
    image: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400',
    description: 'Entrada para festival de teatro',
    seatNumber: 'P-45',
    row: 'Platea',
  },
]);

const events = ref([
  { id: 1, name: 'Concierto Bruno Mars' },
  { id: 2, name: 'Partido Semifinal - Fútbol' },
  { id: 3, name: 'Festival de Teatro' },
]);

const selectedEvent = ref(null);
const priceRange = ref([0, 500]);
const showDetailDialog = ref(false);
const selectedTicketData = ref(null);

const filteredTickets = computed(() => {
  return tickets.value.filter((ticket) => {
    const eventMatch =
      !selectedEvent.value || ticket.eventName.includes(events.value.find(e => e.id === selectedEvent.value)?.name || '');
    const priceMatch = ticket.price >= priceRange.value[0] && ticket.price <= priceRange.value[1];
    return eventMatch && priceMatch;
  });
});

const getCategorySeverity = (category) => {
  const severityMap = {
    VIP: 'danger',
    Premium: 'warning',
    General: 'info',
  };
  return severityMap[category] || 'info';
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