<template>
  <div class="raffle-admin">
    <header class="header">
      <h1>Run Raffle</h1>
      <p class="hint">
        Only admins with a valid API token can run raffles and see audit history.
      </p>
    </header>

    <!-- Formulario para correr rifa -->
    <section class="card">
      <h2>Run new raffle</h2>

      <div class="form-grid">
        <label>
          Match ID
          <input v-model.number="form.match_id" type="number" min="1" />
        </label>

        <label>
          Number of winners
          <input v-model.number="form.num_winners" type="number" min="1" />
        </label>
      </div>

      <div class="actions">
        <button class="btn btn-primary" @click="runRaffle" :disabled="loading">
          {{ loading ? 'Running...' : 'Run raffle' }}
        </button>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </section>

    <!-- Resultado de la rifa -->
    <section v-if="result" class="card">
      <h2>Raffle result</h2>
      <p>
        Candidates: <strong>{{ result.total_candidates }}</strong> ·
        Eligible: <strong>{{ result.total_eligible }}</strong> ·
        Winners: <strong>{{ result.total_winners }}</strong>
      </p>

      <table v-if="result.winners.length > 0" class="table">
        <thead>
          <tr>
            <th>Assignment ID</th>
            <th>User ID</th>
            <th>Email</th>
            <th>Expires at</th>
            <th>Purchase link</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="w in result.winners" :key="w.assignment_id">
            <td>{{ w.assignment_id }}</td>
            <td>{{ w.user_id }}</td>
            <td>{{ w.email || '—' }}</td>
            <td>{{ formatDate(w.expires_at) }}</td>
            <td>
              <a :href="w.purchase_link" target="_blank" rel="noopener noreferrer">
                Open
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else>No winners selected.</p>
    </section>

    <!-- Historial de ejecución de rifas -->
    <section class="card">
      <div class="card-header">
        <h2>Raffle audit log</h2>
        <button class="btn btn-sm" @click="fetchAudit" :disabled="auditLoading">
          {{ auditLoading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>

      <p v-if="auditError" class="error">{{ auditError }}</p>

      <table v-if="audit.length > 0" class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>When</th>
            <th>Actor</th>
            <th>Action</th>
            <th>Entity</th>
            <th>Entity ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in audit" :key="entry.id">
            <td>{{ entry.id }}</td>
            <td>{{ formatDate(entry.at) }}</td>
            <td>{{ entry.actor }}</td>
            <td>{{ entry.action }}</td>
            <td>{{ entry.entity }}</td>
            <td>{{ entry.entity_id }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="muted">No raffle runs have been logged yet.</p>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const form = ref({
  match_id: null,
  num_winners: 1,
})

const loading = ref(false)
const error = ref(null)
const result = ref(null)

const audit = ref([])
const auditLoading = ref(false)
const auditError = ref(null)

function getAdminHeaders () {
  const token = localStorage.getItem('ADMIN_API_TOKEN')
  if (!token) {
    throw new Error('Missing admin token in localStorage (ADMIN_API_TOKEN)')
  }
  return {
    Authorization: `Bearer ${token}`,
  }
}

async function runRaffle () {
  error.value = null
  result.value = null

  if (!form.value.match_id || !form.value.num_winners) {
    error.value = 'Please provide match_id and num_winners.'
    return
  }

  loading.value = true
  try {
    const headers = getAdminHeaders()
    const res = await axios.post(
      `${API_BASE}/raffle/run`,
      {
        match_id: form.value.match_id,
        num_winners: form.value.num_winners,
      },
      { headers }
    )
    result.value = res.data
    // Actualiza auditoría después de correr rifa
    fetchAudit()
  } catch (err) {
    console.error(err)
    if (err.message?.includes('Missing admin token')) {
      error.value = 'Missing admin token. Set ADMIN_API_TOKEN in localStorage.'
    } else if (err.response?.status === 401) {
      error.value = 'Not authorized. Invalid or missing admin token.'
    } else if (err.response?.data?.detail) {
      error.value = JSON.stringify(err.response.data.detail)
    } else {
      error.value = 'Error running raffle.'
    }
  } finally {
    loading.value = false
  }
}

async function fetchAudit () {
  auditLoading.value = true
  auditError.value = null
  try {
    const headers = getAdminHeaders()
    const res = await axios.get(`${API_BASE}/raffle/audit`, {
      headers,
      params: { limit: 50 },
    })
    audit.value = res.data
  } catch (err) {
    console.error(err)
    if (err.message?.includes('Missing admin token')) {
      auditError.value = 'Missing admin token. Set ADMIN_API_TOKEN in localStorage.'
    } else if (err.response?.status === 401) {
      auditError.value = 'Not authorized. Invalid or missing admin token.'
    } else {
      auditError.value = 'Error loading raffle audit log.'
    }
  } finally {
    auditLoading.value = false
  }
}

function formatDate (value) {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

onMounted(() => {
  fetchAudit()
})
</script>

<style scoped>
.raffle-admin {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header h1 {
  margin: 0;
}

.hint {
  font-size: 0.85rem;
  color: #6b7280;
}

.card {
  background: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

input {
  margin-top: 0.25rem;
  padding: 0.4rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #d1d5db;
}

.actions {
  margin-top: 0.8rem;
}

.btn {
  border: none;
  border-radius: 4px;
  padding: 0.35rem 0.9rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-primary {
  background-color: #2563eb;
  color: #fff;
}

.btn-sm {
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.6rem;
  font-size: 0.85rem;
}

.table th,
.table td {
  border-bottom: 1px solid #e5e7eb;
  padding: 0.4rem 0.5rem;
  text-align: left;
}

.error {
  color: #b91c1c;
  margin-top: 0.5rem;
}

.muted {
  color: #6b7280;
  font-size: 0.85rem;
}
</style>
