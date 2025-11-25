<template>
  <div class="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
    <!-- Header con ID y Estado -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">
          Ticket #{{ ticket.id }}
        </h3>
        <p class="text-sm text-gray-600">
          Orden: #{{ ticket.order_id }} • Asiento: #{{ ticket.seat_id }}
        </p>
      </div>
      <span 
        :class="[
          'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
          statusConfig.classes
        ]"
      >
        {{ statusConfig.label }}
      </span>
    </div>

    <!-- Información del Ticket -->
    <div class="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
      <div>
        <span class="font-medium">Propietario:</span>
        <p>Usuario #{{ ticket.owner_user_id }}</p>
      </div>
      <div>
        <span class="font-medium">Creado:</span>
        <p>{{ formatDate(ticket.created_at) }}</p>
      </div>
      <div>
        <span class="font-medium">Actualizado:</span>
        <p>{{ formatDate(ticket.updated_at) }}</p>
      </div>
      <div>
        <span class="font-medium">QR:</span>
        <p class="truncate" :title="ticket.qr_payload">
          {{ ticket.qr_payload.substring(0, 20) }}...
        </p>
      </div>
    </div>

    <!-- Selector de Estado -->
    <div class="flex items-center gap-3 pt-4 border-t border-gray-200">
      <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
        Cambiar estado:
      </label>
      <select 
        v-model="selectedStatus"
        @change="onStatusChange"
        class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        :disabled="loading"
      >
        <option value="">Seleccionar estado...</option>
        <option 
          v-for="option in validTransitions" 
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <button
        v-if="selectedStatus"
        @click="confirmStatusChange"
        :disabled="loading"
        :class="[
          'px-4 py-2 text-white rounded transition-colors',
          loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        ]"
      >
        {{ loading ? '...' : 'Aplicar' }}
      </button>
    </div>

    <!-- Transiciones válidas info -->
    <div v-if="validTransitions.length === 0" class="mt-3 text-xs text-gray-500">
      Este ticket ha alcanzado su estado final y no puede ser modificado.
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
      classes: 'bg-green-100 text-green-800 border-green-300' 
    },
    onhold: { 
      label: 'Reservado', 
      classes: 'bg-yellow-100 text-yellow-800 border-yellow-300' 
    },
    paid: { 
      label: 'Pagado', 
      classes: 'bg-blue-100 text-blue-800 border-blue-300' 
    },
    isused: { 
      label: 'Usado', 
      classes: 'bg-gray-100 text-gray-800 border-gray-300' 
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
      { value: 'paid', label: 'Marcar como Pagado' }
    ],
    paid: [
      { value: 'isused', label: 'Marcar como Usado' }
    ],
    isused: [] // Estado final - sin transiciones
  }
  
  return transitions[props.ticket.status] || []
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const onStatusChange = () => {
  if (selectedStatus.value) {
    // Opcional: confirmación automática
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