<template>
  <div class="bg-neutral-600 rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
    <!-- Layout Horizontal Compacto -->
    <div class="flex items-center justify-between gap-4">
      <!-- Información del Ticket en Línea -->
      <div class="flex items-center gap-6 flex-1">
        <!-- ID del Ticket -->
        <div class="flex items-center gap-2">
          <span class="text-lg font-semibold text-white">#{{ ticket.id }}</span>
          <span 
            :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
              statusConfig.classes
            ]"
          >
            {{ statusConfig.label }}
          </span>
        </div>

        <div class="h-6 w-px bg-gray-500"></div>

        <!-- Información de Orden y Asiento -->
        <div class="flex items-center gap-1 text-sm text-gray-200">
          <span class="font-medium">Orden:</span>
          <span>#{{ ticket.order_id }}</span>
        </div>

        <div class="h-6 w-px bg-gray-500"></div>

        <!-- Información de Asiento -->
        <div class="flex items-center gap-1 text-sm text-gray-200">
          <span class="font-medium">Asiento:</span>
          <span>#{{ ticket.seat_id }}</span>
        </div>

        <div class="h-6 w-px bg-gray-500"></div>

        <!-- Información de Propietario -->
        <div class="flex items-center gap-1 text-sm text-gray-200">
          <span class="font-medium">Usuario:</span>
          <span>#{{ ticket.owner_user_id }}</span>
        </div>

        <div class="h-6 w-px bg-gray-500"></div>

        <!-- Fechas -->
        <div class="flex items-center gap-4 text-xs text-gray-300">
          <div class="flex items-center gap-1">
            <span class="font-medium">Creado:</span>
            <span>{{ formatDateShort(ticket.created_at) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="font-medium">Actualizado:</span>
            <span>{{ formatDateShort(ticket.updated_at) }}</span>
          </div>
        </div>

        <div class="h-6 w-px bg-gray-500"></div>

        <!-- QR Info -->
        <div class="flex items-center gap-1 text-sm text-gray-200 max-w-32">
          <span class="font-medium">QR:</span>
          <span class="truncate" :title="ticket.qr_payload">
            {{ ticket.qr_payload.substring(0, 12) }}...
          </span>
        </div>
      </div>

      <!-- Selector de Estado (Lado Derecho) -->
      <div class="w-48 flex-shrink-0">
        <div class="flex items-center gap-2">
          <select 
            v-model="selectedStatus"
            @change="onStatusChange"
            class="flex-1 px-3 py-2 border border-gray-500 bg-neutral-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
            :disabled="loading || validTransitions.length === 0"
          >
            <option value="" class="bg-neutral-700">Cambiar estado</option>
            <option 
              v-for="option in validTransitions" 
              :key="option.value"
              :value="option.value"
              class="bg-neutral-700"
            >
              {{ option.label }}
            </option>
          </select>
          
          <button
            v-if="selectedStatus && validTransitions.length > 0"
            @click="confirmStatusChange"
            :disabled="loading"
            :class="[
              'px-3 py-2 text-white rounded transition-colors text-sm font-medium',
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            ]"
            title="Aplicar cambio de estado"
          >
            {{ loading ? '...' : '✓' }}
          </button>

          <!-- Indicador de estado final -->
          <div v-if="validTransitions.length === 0" class="text-xs text-gray-400 px-2">
            Final
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  ticket: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['statusChange'])

const loading = ref(false)
const selectedStatus = ref('')

// Configuración de estados
const statusConfig = computed(() => {
  const config = {
    available: { 
      label: 'Disponible', 
      classes: 'bg-green-500 text-white border-green-600' 
    },
    onhold: { 
      label: 'Reservado', 
      classes: 'bg-yellow-500 text-white border-yellow-600' 
    },
    paid: { 
      label: 'Pagado', 
      classes: 'bg-blue-500 text-white border-blue-600' 
    },
    isused: { 
      label: 'Usado', 
      classes: 'bg-gray-500 text-white border-gray-600' 
    }
  }
  return config[props.ticket.status] || config.available
})

// Transiciones válidas basadas en el estado actual
const validTransitions = computed(() => {
  const transitions = {
    available: [
      { value: 'onhold', label: 'Reservar' }
    ],
    onhold: [
      { value: 'available', label: 'Liberar' },
      { value: 'paid', label: 'Pagar' }
    ],
    paid: [
      { value: 'isused', label: 'Usar' }
    ],
    isused: [] // Estado final - sin transiciones
  }
  
  return transitions[props.ticket.status] || []
})

const formatDateShort = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const onStatusChange = () => {
  if (selectedStatus.value) {
    // Cambio automático al seleccionar (opcional)
    // confirmStatusChange()
  }
}

const confirmStatusChange = async () => {
  if (!selectedStatus.value) return
  
  loading.value = true
  try {
    await emit('statusChange', props.ticket.id, selectedStatus.value)
    selectedStatus.value = ''
  } catch (error) {
    console.error('Error al cambiar estado:', error)
  } finally {
    loading.value = false
  }
}
</script>