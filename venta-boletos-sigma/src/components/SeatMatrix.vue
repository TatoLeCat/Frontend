<template>
  <div class="space-y-4">
    <div
      v-for="(row, index) in rows"
      :key="index"
      class="flex items-center gap-2"
    >
      <!-- Nombre de la fila -->
      <span class="w-10 text-right font-bold text-gray-600">
        {{ row.row }}
      </span>

      <!-- Asientos -->
      <div class="flex gap-1 flex-wrap">
        <button
          v-for="seat in row.seats"
          :key="seat.id"
          @click="$emit('select', seat)"
          :class="[
            'w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-semibold transition cursor-pointer',
            selectedSeats.has(seat.id)
              ? 'bg-green-600 text-white border-green-700 ring-2 ring-green-400'
              : seat.is_taken
                ? 'bg-red-400 text-white border-red-600 cursor-not-allowed opacity-80'
                : 'bg-gray-100 hover:bg-blue-200 text-gray-700 border-gray-300'
          ]"
          :disabled="seat.is_taken"
        >
          {{ seat.seat_number }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/*
  PROPS:
  - rows: [
      { row: "A", seats: [ { id, seat_number, is_taken, x, y }, ... ] }
    ]
  - selectedSeats: Set()
*/

defineProps({
  rows: {
    type: Array,
    required: true,
  },
  selectedSeats: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
/* Estilo FIFA */
button {
  transition: 0.15s ease-in-out;
}
</style>
