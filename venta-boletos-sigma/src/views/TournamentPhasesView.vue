<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950 px-6 py-8">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-surface-900 dark:text-surface-0 mb-2">Fases del Torneo</h1>
        <p class="text-lg text-surface-600 dark:text-surface-400">Sigue el progreso del campeonato</p>
      </div>

      <div class="space-y-4">
        <div
          v-for="phase in phases"
          :key="phase.id"
          @click="selectPhase(phase)"
          class="cursor-pointer transform transition-all hover:scale-105"
        >
          <Card class="border-l-4" :class="getPhaseCardClass(phase)">
            <template #content>
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <i :class="getPhaseIcon(phase.status)" class="text-2xl"></i>
                    <div>
                      <h3 class="text-xl font-bold text-surface-900 dark:text-surface-0">{{ phase.name }}</h3>
                      <p class="text-sm text-surface-500">{{ formatDateRange(phase.startDate, phase.endDate) }}</p>
                    </div>
                  </div>
                  <ProgressBar :value="phase.progress" class="mb-2"></ProgressBar>
                  <p class="text-sm text-surface-600 dark:text-surface-400">
                    {{ getPhaseStatusText(phase.status) }}
                  </p>
                </div>
                <div class="text-right">
                  <Badge :value="phase.progress + '%'" :severity="getPhaseStatusBadge(phase.status)"></Badge>
                  <i class="pi pi-chevron-right text-2xl mt-4 text-primary"></i>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <Dialog v-model:visible="showDetail" :header="selectedPhase?.name" :modal="true" class="w-full max-w-4xl">
        <div v-if="selectedPhase" class="space-y-6">
          <div>
            <h4 class="text-lg font-bold mb-2">Descripción</h4>
            <p class="text-surface-600 dark:text-surface-400">{{ selectedPhase.description || 'Sin descripción disponible' }}</p>
          </div>

          <div v-if="selectedPhase.groups" class="space-y-4">
            <h4 class="text-lg font-bold">Grupos</h4>
            <div v-for="group in selectedPhase.groups" :key="group.name" class="border rounded-lg p-4 dark:border-surface-700">
              <h5 class="font-bold mb-3 text-surface-900 dark:text-surface-0">{{ group.name }}</h5>
              <DataTable :value="group.teams" size="small" responsiveLayout="scroll">
                <Column field="name" header="Equipo" style="width: 40%"></Column>
                <Column field="points" header="Puntos" style="width: 15%"></Column>
                <Column field="wins" header="G" style="width: 10%"></Column>
                <Column field="draws" header="E" style="width: 10%"></Column>
                <Column field="losses" header="P" style="width: 10%"></Column>
                <Column field="goalsFor" header="GF" style="width: 10%"></Column>
                <Column field="goalsAgainst" header="GC" style="width: 10%"></Column>
              </DataTable>
            </div>
          </div>

          <div v-if="selectedPhase.matches" class="space-y-4">
            <h4 class="text-lg font-bold">Partidos</h4>
            <div v-for="match in selectedPhase.matches" :key="match.id" class="border rounded-lg p-4 dark:border-surface-700">
              <div class="flex items-center justify-between gap-4">
                <div class="text-right flex-1">
                  <p class="font-bold text-surface-900 dark:text-surface-0">{{ match.team1 }}</p>
                </div>
                <div class="text-center">
                  <p v-if="match.score1 !== null" class="text-2xl font-bold text-primary">
                    {{ match.score1 }} - {{ match.score2 }}
                  </p>
                  <p v-else class="text-sm text-surface-500">{{ formatDate(match.date) }}</p>
                </div>
                <div class="text-left flex-1">
                  <p class="font-bold text-surface-900 dark:text-surface-0">{{ match.team2 }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import ProgressBar from 'primevue/progressbar'
import Badge from 'primevue/badge'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import TournamentService from '@/services/TournamentService'

const phases = ref([])
const selectedPhase = ref(null)
const showDetail = ref(false)

onMounted(() => {
  phases.value = TournamentService.getTournamentPhases()
})

function selectPhase(phase) {
  selectedPhase.value = TournamentService.getPhaseDetail(phase.id)
  showDetail.value = true
}

function formatDateRange(start, end) {
  const startDate = new Date(start).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  const endDate = new Date(end).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${startDate} - ${endDate}`
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getPhaseIcon(status) {
  const icons = {
    completed: 'pi pi-check-circle text-green-500',
    'in-progress': 'pi pi-play-circle text-yellow-500',
    upcoming: 'pi pi-clock text-blue-500',
  }
  return icons[status] || 'pi pi-question'
}

function getPhaseStatusText(status) {
  const texts = {
    completed: 'Completado',
    'in-progress': 'En progreso',
    upcoming: 'Próximo',
  }
  return texts[status] || 'Desconocido'
}

function getPhaseStatusBadge(status) {
  const severities = {
    completed: 'success',
    'in-progress': 'warning',
    upcoming: 'info',
  }
  return severities[status] || 'secondary'
}

function getPhaseCardClass(phase) {
  const borderClasses = {
    completed: 'border-green-500',
    'in-progress': 'border-yellow-500',
    upcoming: 'border-blue-500',
  }
  return borderClasses[phase.status] || 'border-gray-500'
}
</script>

<style scoped>
</style>
