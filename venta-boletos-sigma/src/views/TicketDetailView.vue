<template>
  <div class="flex flex-col gap-6">
    <!-- Match Image -->
    <div class="w-full h-48 rounded-xl overflow-hidden">
      <img
        :src="ticket.image"
        :alt="`${ticket.team1} vs ${ticket.team2}`"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Match Information -->
    <div class="flex flex-col gap-4">
      <!-- Match Details -->
      <div class="flex flex-col gap-2">
        <h2 class="text-surface-900 dark:text-surface-0 font-semibold text-lg">
          {{ ticket.team1 }} vs {{ ticket.team2 }}
        </h2>
        <p class="text-surface-600 dark:text-surface-300 text-sm">
          {{ ticket.description }}
        </p>
      </div>

      <!-- Event Metadata -->
      <div class="space-y-2 pb-4 border-b border-surface-200 dark:border-surface-700">
        <div class="flex items-center gap-3">
          <i class="pi pi-calendar text-primary text-sm w-5"></i>
          <span class="text-surface-700 dark:text-surface-300 text-sm">{{ ticket.eventDate }}</span>
        </div>
        <div class="flex items-center gap-3">
          <i class="pi pi-map-marker text-primary text-sm w-5"></i>
          <div class="flex flex-col">
            <span class="text-surface-700 dark:text-surface-300 text-sm font-semibold">{{ ticket.stadium }}</span>
            <span class="text-surface-600 dark:text-surface-300 text-xs">{{ ticket.city }}, USA</span>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <i class="pi pi-flag text-primary text-sm w-5"></i>
          <span class="text-surface-700 dark:text-surface-300 text-sm">Fase: {{ ticket.phase }}</span>
        </div>
        <div class="flex items-center gap-3">
          <i class="pi pi-chair text-primary text-sm w-5"></i>
          <span class="text-surface-700 dark:text-surface-300 text-sm">
            Sector {{ ticket.sector }} - Fila {{ ticket.row }} - Asiento {{ ticket.seatNumber }}
          </span>
        </div>
      </div>

      <!-- Availability and Price -->
      <div class="flex items-center justify-between">
        <div>
          <p class="text-surface-600 dark:text-surface-300 text-xs mb-1">Disponibilidad</p>
          <p class="text-green-600 dark:text-green-400 font-semibold">
            {{ ticket.available }} disponibles
          </p>
        </div>
        <div class="text-right">
          <p class="text-surface-600 dark:text-surface-300 text-xs mb-1">Precio</p>
          <p class="text-surface-900 dark:text-surface-0 font-semibold text-2xl">
            ${{ ticket.price.toFixed(2) }}
          </p>
        </div>
      </div>

      <!-- Quantity Selector -->
      <div class="flex items-center gap-4">
        <label class="text-surface-900 dark:text-surface-0 font-medium">Cantidad:</label>
        <div class="flex items-center border border-surface-300 dark:border-surface-600 rounded-lg">
          <button
            @click="quantity > 1 && quantity--"
            class="px-3 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
          >
            <i class="pi pi-minus text-sm"></i>
          </button>
          <span class="px-4 py-2 text-surface-900 dark:text-surface-0 font-medium">
            {{ quantity }}
          </span>
          <button
            @click="quantity < ticket.available && quantity++"
            class="px-3 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800"
          >
            <i class="pi pi-plus text-sm"></i>
          </button>
        </div>
      </div>

      <!-- Time Limit Warning -->
      <div class="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p class="text-yellow-800 dark:text-yellow-200 text-xs flex items-center gap-2">
          <i class="pi pi-exclamation-triangle text-sm"></i>
          Esta oferta vence en <span class="font-semibold">{{ ticket.timeLimit }} horas</span>
        </p>
      </div>

      <!-- Total Price -->
      <div class="bg-surface-100 dark:bg-surface-800 p-4 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <span class="text-surface-700 dark:text-surface-300">Subtotal:</span>
          <span class="text-surface-900 dark:text-surface-0 font-semibold">
            ${{ (ticket.price * quantity).toFixed(2) }}
          </span>
        </div>
        <div class="flex justify-between items-center text-sm text-surface-600 dark:text-surface-400">
          <span>Impuestos estimados:</span>
          <span>${{ ((ticket.price * quantity) * 0.15).toFixed(2) }}</span>
        </div>
        <Divider class="my-3" />
        <div class="flex justify-between items-center">
          <span class="text-surface-900 dark:text-surface-0 font-semibold">Total:</span>
          <span class="text-surface-900 dark:text-surface-0 font-semibold text-xl">
            ${{ (ticket.price * quantity * 1.15).toFixed(2) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col gap-3 pt-4">
      <Button
        label="Proceder al Pago"
        @click="handleCheckout"
        class="w-full py-2 rounded-lg"
        :loading="isLoading"
      />
      <Button
        label="Cancelar"
        severity="secondary"
        @click="$emit('close')"
        class="w-full py-2 rounded-lg"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Button from 'primevue/button';
import Divider from 'primevue/divider';

const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'checkout']);

const quantity = ref(1);
const isLoading = ref(false);

const handleCheckout = () => {
  isLoading.value = true;
  // Simular delay
  setTimeout(() => {
    emit('checkout', {
      ...props.ticket,
      quantity: quantity.value,
      totalPrice: props.ticket.price * quantity.value * 1.15,
    });
    isLoading.value = false;
  }, 500);
};
</script>
