<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-200">Gestión de Tickets</h1>
      <p class="text-gray-300 mt-2">
        Gestiona y filtra todos los tickets del sistema
      </p>
    </div>

    <!-- Filtros por Estado bg-primary-100 dark:bg-primary-500/30 -->
    <div class="mb-6 bg-primary-900 p-4 rounded-lg shadow border">
      <h3 class="text-lg font-semibold mb-3">Filtrar por Estado:</h3>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="status in statusOptions"
          :key="status.value"
          @click="setStatusFilter(status.value)"
          :class="[
            'px-4 py-2 rounded-full border font-medium transition-colors',
            statusFilter === status.value
              ? status.classes.selected
              : status.classes.default
          ]"
        >
          {{ status.label }}
        </button>
        <button
          @click="clearFilters"
          class="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>

    <!-- Contador y Estadísticas -->
    <div class="mb-4 flex justify-between items-center">
      <div class="text-sm text-gray-300">
        Mostrando {{ filteredTickets.length }} de {{ tickets.length }} tickets
      </div>
      <button
        @click="fetchTickets"
        :disabled="loading"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {{ loading ? 'Cargando...' : 'Actualizar' }}
      </button>
    </div>

    <!-- Lista de Tickets -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center">
        <div class="text-red-400 mr-3">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="filteredTickets.length === 0" class="text-center py-8">
      <p class="text-gray-500 text-lg">No se encontraron tickets</p>
    </div>

    <div v-else class="grid gap-6">
      <TicketCard
        v-for="ticket in filteredTickets"
        :key="ticket.id"
        :ticket="ticket"
        @status-change="handleStatusChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TicketCard from '../components/TicketCard.vue'

// Estado reactivo
const tickets = ref([])
const loading = ref(false)
const error = ref(null)
const statusFilter = ref(null)

// Opciones de estado
const statusOptions = ref([
  { 
    value: 'available', 
    label: 'Disponible',
    classes: {
      default: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
      selected: 'bg-green-500 text-white border-green-600'
    }
  },
  { 
    value: 'onhold', 
    label: 'Reservado',
    classes: {
      default: 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200',
      selected: 'bg-yellow-500 text-white border-yellow-600'
    }
  },
  { 
    value: 'paid', 
    label: 'Pagado',
    classes: {
      default: 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200',
      selected: 'bg-blue-500 text-white border-blue-600'
    }
  },
  { 
    value: 'isused', 
    label: 'Usado',
    classes: {
      default: 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200',
      selected: 'bg-gray-500 text-white border-gray-600'
    }
  }
])

// Tickets filtrados
const filteredTickets = computed(() => {
  if (!statusFilter.value) {
    return tickets.value
  }
  return tickets.value.filter(ticket => ticket.status === statusFilter.value)
})

// Servicio para obtener tickets (simulado - reemplaza con tu API real)
const fetchTickets = async () => {
  loading.value = true
  error.value = null
  
  try {
    // Reemplaza esto con tu llamada real a la API
    const response = await fetch('http://localhost:8000/api/tickets/all/tickets')
    if (!response.ok) throw new Error('Error al cargar tickets')
    
    tickets.value = await response.json()
  } catch (err) {
    error.value = err.message
    
  } finally {
    loading.value = false
  }
}

// Manejar cambio de estado
const handleStatusChange = async (ticketId, newStatus) => {
  try {
    const response = await fetch(`http://localhost:8000/api/tickets/${ticketId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({
        status: newStatus,
        actor: `admin_${localStorage.getItem('userId')}`
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Error al cambiar estado')
    }

    // Actualizar el ticket en la lista
    const updatedTicket = await response.json()
    const index = tickets.value.findIndex(t => t.id === ticketId)
    if (index !== -1) {
      tickets.value[index] = updatedTicket
    }

    console.log('✅ Estado actualizado:', updatedTicket)
  } catch (err) {
    console.error('❌ Error:', err.message)
    alert(`Error: ${err.message}`)
  }
}

// Filtros
const setStatusFilter = (status) => {
  statusFilter.value = statusFilter.value === status ? null : status
}

const clearFilters = () => {
  statusFilter.value = null
}

// Cargar tickets al montar el componente
onMounted(() => {
  fetchTickets()
})
</script>