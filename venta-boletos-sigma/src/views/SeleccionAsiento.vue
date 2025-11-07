<template>
  <div>
    <h2>Filas y Asientos</h2>

    <div v-if="loading">Cargando...</div>
    <div v-if="error">{{ error }}</div>

    <div class="flex gap-2 flex-wrap">
      <!-- asientos dentro de esa fila -->
      <SeatMatrix :rows="dataFromApi"></SeatMatrix>
    </div>
  </div>
</template>

<script setup lang="ts">
import  SeatMatrix from '../components/SeatMatrix.vue'
import { ref, onMounted } from 'vue'

const rows = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

// temporalmente quemado
const stadium_id = 1
const area_id = 1
const dataFromApi = ref<any[]>([])

const fetchRows = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/v1/seats/stadium/${stadium_id}/area/${area_id}/rows`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data = await response.json()
    rows.value = data
    dataFromApi.value = data
    console.log('Data from API:', dataFromApi)

    //console.log('Fetched rows:', data)
    //console.log('Rows assigned to ref:', rows.value)
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchRows)
</script>
