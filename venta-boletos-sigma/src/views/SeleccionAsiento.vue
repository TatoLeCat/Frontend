<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold text-gray-800">Selección de Asientos</h2>

    <!-- Selectores de Estadio y Área -->
    <Card class="bg-white shadow-md">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Selector de Estadio -->
          <div class="flex flex-col gap-2">
            <label for="stadium" class="font-semibold text-gray-700">
              Estadio
            </label>
            <Dropdown
              v-model="selectedStadium"
              :options="stadiums"
              optionLabel="name"
              optionValue="id"
              placeholder="Seleccione un estadio"
              class="w-full"
              @change="onStadiumChange"
              :loading="loadingStadiums"
            />
          </div>

          <!-- Selector de Área -->
          <div class="flex flex-col gap-2">
            <label for="area" class="font-semibold text-gray-700">
              Área
            </label>
            <Dropdown
              v-model="selectedArea"
              :options="areas"
              optionLabel="label"
              optionValue="id"
              placeholder="Seleccione un área"
              class="w-full"
              :disabled="!selectedStadium || loadingAreas"
              @change="onAreaChange"
              :loading="loadingAreas"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- Estado de carga y errores -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="flex items-center gap-3">
        <i class="pi pi-spin pi-spinner text-3xl text-blue-500"></i>
        <span class="text-lg text-gray-600">Cargando asientos...</span>
      </div>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center gap-2 text-red-700">
        <i class="pi pi-exclamation-triangle"></i>
        <span class="font-semibold">Error:</span>
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- Información de selección actual -->
    <div v-if="selectedStadium && selectedArea && !loading" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-center gap-2 text-blue-700">
        <i class="pi pi-info-circle"></i>
        <span>
          Mostrando asientos de: 
          <strong>{{ getCurrentStadiumName() }}</strong> - 
          <strong>{{ getCurrentAreaName() }}</strong>
        </span>
      </div>
    </div>

    <!-- Matriz de Asientos -->
    <div v-if="dataFromApi.length > 0 && !loading">
      <Card class="w-full shadow-lg">
        <template #content>
          <SeatMatrix 
            :rows="dataFromApi" 
            @select="onSeatSelect"
          />
        </template>
      </Card>
    </div>

    <!-- Mensaje cuando no hay datos -->
    <div v-if="!loading && dataFromApi.length === 0 && selectedStadium && selectedArea" 
         class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <i class="pi pi-inbox text-4xl text-yellow-600 mb-2"></i>
      <p class="text-gray-700">No hay asientos disponibles para esta área</p>
    </div>

    <!-- Mensaje inicial -->
    <div v-if="!selectedStadium || !selectedArea" 
         class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
      <i class="pi pi-map-marker text-5xl text-gray-400 mb-3"></i>
      <p class="text-gray-600 text-lg">
        Por favor, seleccione un estadio y un área para ver los asientos disponibles
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import Dropdown from 'primevue/dropdown'
import SeatMatrix from '../components/SeatMatrix.vue'
import { ref, onMounted } from 'vue'

interface Stadium {
  id: number
  name: string
}

interface Area {
  id: number
  label: string
  stadium_id: number
}

interface Seat {
  id: number
  seat_number: string
}

interface Row {
  row: string
  seats: Seat[]
}

const selectedStadium = ref<number | null>(null)
const selectedArea = ref<number | null>(null)
const stadiums = ref<Stadium[]>([])
const areas = ref<Area[]>([])
const dataFromApi = ref<Row[]>([])

const loading = ref(false)
const loadingStadiums = ref(false)
const loadingAreas = ref(false)
const error = ref<string | null>(null)


const getCurrentStadiumName = () => {
  const stadium = stadiums.value.find(s => s.id === selectedStadium.value)
  return stadium?.name || ''
}

const getCurrentAreaName = () => {
  const area = areas.value.find(a => a.id === selectedArea.value)
  return area?.label || ''
}

// Obtener lista de estadios
const fetchStadiums = async () => {
  loadingStadiums.value = true
  error.value = null

  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/seats/stadiums', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data = await response.json()
    stadiums.value = data
  } catch (err: any) {
    error.value = `Error al cargar estadios: ${err.message}`
  } finally {
    loadingStadiums.value = false
  }
}

const fetchAreas = async (stadiumId: number) => {
  loadingAreas.value = true
  error.value = null
  areas.value = []
  selectedArea.value = null

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/seats/${stadiumId}/areas`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data = await response.json()
    areas.value = data
  } catch (err: any) {
    error.value = `Error al cargar áreas: ${err.message}`
  } finally {
    loadingAreas.value = false
  }
}

// Obtener filas y asientos
const fetchRows = async () => {
  if (!selectedStadium.value || !selectedArea.value) {
    return
  }

  loading.value = true
  error.value = null
  dataFromApi.value = []

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/seats/stadium/${selectedStadium.value}/area/${selectedArea.value}/rows`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data = await response.json()
    dataFromApi.value = data
    console.log('Data from API:', data)
  } catch (err: any) {
    error.value = `Error al cargar asientos: ${err.message}`
  } finally {
    loading.value = false
  }
}

const onStadiumChange = () => {
  dataFromApi.value = []
  if (selectedStadium.value) {
    fetchAreas(selectedStadium.value)
  }
}

const onAreaChange = () => {
  if (selectedArea.value) {
    fetchRows()
  }
}

const onSeatSelect = (seat: Seat) => {
  }

onMounted(() => {
  fetchStadiums()
})
</script>
