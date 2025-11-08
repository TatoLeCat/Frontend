<template>
  <div class="flex flex-col gap-4 p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg">
    <!-- Leyenda de estados (opcional) -->
    <div class="flex items-center gap-6 mb-4 px-4 py-3 bg-white rounded-lg shadow-sm">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-emerald-500 rounded-md border-2 border-emerald-600"></div>
        <span class="text-sm font-medium text-gray-700">Disponible</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-amber-400 rounded-md border-2 border-amber-500"></div>
        <span class="text-sm font-medium text-gray-700">Seleccionado</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-gray-300 rounded-md border-2 border-gray-400"></div>
        <span class="text-sm font-medium text-gray-700">Ocupado</span>
      </div>
    </div>

    <!-- Matriz de asientos -->
    <div class="space-y-3">
      <div 
        v-for="row in rows" 
        :key="row.row" 
        class="flex items-center gap-4 group"
      >
        <!-- Etiqueta de fila -->
        <div 
          class="
            min-w-[40px] h-10 
            flex items-center justify-center
            font-bold text-lg text-slate-700
            bg-white rounded-lg shadow-sm
            border-2 border-slate-200
            group-hover:border-blue-400 group-hover:text-blue-600
            transition-all duration-200
          "
        >
          {{ row.row }}
        </div>

        <!-- Asientos de la fila -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="seat in row.seats"
            :key="seat.id"
            @click="$emit('select', seat)"
            class="
              relative
              min-w-[44px] h-11
              px-3 py-2
              flex items-center justify-center
              font-semibold text-sm
              bg-emerald-500 text-white
              rounded-lg
              border-2 border-emerald-600
              shadow-md
              hover:bg-emerald-600 hover:scale-110 hover:shadow-xl hover:z-10
              active:scale-95
              focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2
              transition-all duration-200
              cursor-pointer
            "
          >
            {{ seat.seat_number.toUpperCase() }}
            
            <!-- Efecto de brillo -->
            <div class="absolute inset-0 bg-white/20 rounded-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none"></div>
          </button>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup lang="ts">
interface Seat {
  id: number
  seat_number: string
}

interface Row {
  row: string
  seats: Seat[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  rows: Row[]
}>()

defineEmits(['select'])
</script>

<style scoped>
/* Opcional: Animación extra para hover */
@keyframes pulse-subtle {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>