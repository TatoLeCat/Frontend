<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-950 px-6 py-8">
    <div class="max-w-6xl mx-auto">
      <div class="mb-8 flex items-center gap-4">
        <Button icon="pi pi-arrow-left" @click="goBack" text rounded />
        <div>
          <h1 class="text-4xl font-bold text-surface-900 dark:text-surface-0 mb-2">{{ phase?.name }}</h1>
          <p class="text-lg text-surface-600 dark:text-surface-400">{{ formatDateRange(phase?.startDate, phase?.endDate) }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card class="lg:col-span-3">
          <template #content>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-surface-500 mb-2">Progreso de la Fase</p>
                <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ phase?.progress }}%</h3>
              </div>
              <ProgressBar :value="phase?.progress" class="flex-1 mx-6"></ProgressBar>
              <Tag :value="getPhaseStatusText(phase?.status)" :severity="getPhaseStatusBadge(phase?.status)"></Tag>
            </div>
          </template>
        </Card>

        <Card v-if="teamCount > 0" class="text-center">
          <template #content>
            <i class="pi pi-users text-4xl text-primary mb-2"></i>
            <p class="text-sm text-surface-500 mb-1">Equipos Involucrados</p>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ teamCount }}</p>
          </template>
        </Card>

        <Card v-if="matchCount > 0" class="text-center">
          <template #content>
            <i class="pi pi-list text-4xl text-primary mb-2"></i>
            <p class="text-sm text-surface-500 mb-1">Partidos</p>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ matchCount }}</p>
          </template>
        </Card>

        <Card v-if="groupCount > 0" class="text-center">
          <template #content>
            <i class="pi pi-th-large text-4xl text-primary mb-2"></i>
            <p class="text-sm text-surface-500 mb-1">Grupos</p>
            <p class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ groupCount }}</p>
          </template>
        </Card>
      </div>

      <div v-if="phase?.groups" class="space-y-6 mb-8">
        <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Grupos</h2>
        <div v-for="group in phase.groups" :key="group.name" class="space-y-3">
          <Card>
            <template #header>
              <div class="bg-primary p-4 text-white font-bold text-lg">{{ group.name }}</div>
            </template>
            <template #content>
              <DataTable :value="group.teams" responsiveLayout="scroll" size="small" striped-rows>
                <Column field="name" header="Equipo" style="width: 30%"></Column>
                <Column field="points" header="PTS" style="width: 10%" class="text-center"></Column>
                <Column field="wins" header="G" style="width: 10%" class="text-center"></Column>
                <Column field="draws" header="E" style="width: 10%" class="text-center"></Column>
                <Column field="losses" header="P" style="width: 10%" class="text-center"></Column>
                <Column field="goalsFor" header="GF" style="width: 10%" class="text-center"></Column>
                <Column field="goalsAgainst" header="GC" style="width: 10%" class="text-center"></Column>
                <Column header="DG" style="width: 10%" class="text-center">
                  <template #body="{ data }">
                    {{ data.goalsFor - data.goalsAgainst }}
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </div>
      </div>

      <div v-if="phase?.matches" class="space-y-6 mb-8">
        <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Partidos</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card v-for="match in phase.matches" :key="match.id" class="hover:shadow-lg transition-shadow">
            <template #content>
              <div class="text-center space-y-3">
                <p class="text-sm font-semibold text-surface-500 uppercase">{{ match.stage }}</p>
                <div class="flex items-center justify-between gap-4">
                  <div class="flex-1 text-right">
                    <p class="font-bold text-surface-900 dark:text-surface-0">{{ match.team1 }}</p>
                  </div>
                  <div class="text-center min-w-max">
                    <p v-if="match.score1 !== null" class="text-3xl font-bold text-primary">
                      {{ match.score1 }} - {{ match.score2 }}
                    </p>
                    <p v-else class="text-sm font-semibold text-surface-500">
                      {{ formatDate(match.date) }}
                    </p>
                  </div>
                  <div class="flex-1 text-left">
                    <p class="font-bold text-surface-900 dark:text-surface-0">{{ match.team2 }}</p>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <div v-if="teams && teams.length > 0" class="space-y-6">
        <h2 class="text-2xl font-bold text-surface-900 dark:text-surface-0">Equipos Participantes</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card v-for="team in teams" :key="team.id || team.name" class="text-center p-4">
            <template #content>
              <p class="text-3xl mb-2">{{ team.flag }}</p>
              <p class="font-bold text-surface-900 dark:text-surface-0 text-sm">{{ team.name }}</p>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Tag from 'primevue/tag'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import TournamentService from '@/services/TournamentService'

const router = useRouter()
const route = useRoute()

const phase = ref(null)
const teams = ref([])

const teamCount = computed(() => {
  if (phase.value?.groups) {
    let count = 0
    phase.value.groups.forEach((group) => {
      count += group.teams.length
    })
    return count
  }
  if (phase.value?.matches) {
    const teamNames = new Set()
    phase.value.matches.forEach((match) => {
      if (match.team1 !== 'TBD') teamNames.add(match.team1)
      if (match.team2 !== 'TBD') teamNames.add(match.team2)
    })
    return teamNames.size
  }
  return 0
})

const matchCount = computed(() => {
  return phase.value?.matches?.length || 0
})

const groupCount = computed(() => {
  return phase.value?.groups?.length || 0
})

onMounted(() => {
  const phaseId = parseInt(route.params.id)
  phase.value = TournamentService.getPhaseDetail(phaseId)
  teams.value = TournamentService.getTeamsByPhase(phaseId)
})

function goBack() {
  router.back()
}

function formatDateRange(start, end) {
  if (!start || !end) return ''
  const startDate = new Date(start).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  const endDate = new Date(end).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${startDate} - ${endDate}`
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })
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
</script>

<style scoped>
</style>
