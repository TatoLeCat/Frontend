<template>
  <div class="raffle-admin-view">
    <div class="raffle-admin">
      <header class="header">
        <h1>Rifa de Ingreso</h1>
        <p class="hint">
          Solo administradores con un API token válido pueden ejecutar la rifa y ver el historial.
        </p>
      </header>

      <!-- Formulario para correr rifa -->
      <section class="card">
        <h2>Ejecutar nueva rifa</h2>

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
            {{ loading ? 'Running...' : 'Ejecutar rifa' }}
          </button>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
      </section>

      <!-- Resultado de la rifa -->
      <section v-if="result" class="card">
        <h2>Resultado de la rifa</h2>
        <p>
          Candidatos: <strong>{{ result.total_candidates }}</strong> ·
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
          <h2>Historial de rifas</h2>
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
              <td>{{ formatDate(entry.created_at) }}</td>
              <td>{{ entry.actor || '—' }}</td>
              <td>{{ entry.action }}</td>
              <td>{{ entry.entity_type }}</td>
              <td>{{ entry.entity_id }}</td>
            </tr>
          </tbody>
        </table>

        <p v-else class="muted">
          No raffle runs have been logged yet.
        </p>
      </section>
    </div>
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
    } else if (err.response?.data?.detail) {
      auditError.value = JSON.stringify(err.response.data.detail)
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
.raffle-admin-view {
  min-height: 100vh;
  padding: 2.5rem 1rem;
  background: radial-gradient(circle at top, #1b4fff 0%, #140b3f 40%, #050816 100%);
  display: flex;
  justify-content: center;
}

.raffle-admin {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 0.5rem;
}

.header h1 {
  margin: 0;
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #f9fafb; /* white */
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.45);
}

.hint {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  color: #e5e7eb;
}

/* FIFA-style card */
.card {
  position: relative;
  background: #ffffff;
  border-radius: 18px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 18px 25px rgba(3, 7, 18, 0.35);
  overflow: hidden;
}

/* top accent bar in FIFA blue/yellow */
.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 6px;
  width: 100%;
  background: linear-gradient(90deg, #facc15 0%, #1d4ed8 45%, #22c55e 100%);
}

.card h2 {
  margin: 0 0 0.9rem 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
}

/* Make sure all card text is readable */
.card,
.card * {
  color: #111827;
}

/* Layout */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 0.5rem;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  font-weight: 600;
}

input {
  margin-top: 0.25rem;
  padding: 0.5rem 0.6rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}

input:focus {
  outline: none;
  border-color: #1d4ed8;
  background: #ffffff;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.4);
}

.actions {
  margin-top: 0.8rem;
}

/* Buttons */
.btn {
  border-radius: 999px;
  padding: 0.5rem 1.1rem;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  transition: transform 0.1s, box-shadow 0.1s, background 0.1s;
}

.btn-primary {
  background: linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 45%, #22c55e 100%);
  color: #f9fafb;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.45);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 22px rgba(15, 23, 42, 0.55);
}

.btn-sm {
  font-size: 0.8rem;
  padding: 0.35rem 0.8rem;
  background: #111827;
  color: #e5e7eb;
}

.btn-sm:hover {
  background: #020617;
}

.btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

/* Table */
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

.table th {
  background: #f3f4f6;
  color: #111827;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.table th,
.table td {
  border-bottom: 1px solid #e5e7eb;
  padding: 0.45rem 0.6rem;
  text-align: left;
}

.table tbody tr:hover {
  background: #f9fafb;
}

/* States */
.error {
  color: #b91c1c;
  margin-top: 0.5rem;
  font-weight: 600;
}

.muted {
  color: #6b7280;
  font-size: 0.85rem;
}

/* Small screens */
@media (max-width: 640px) {
  .raffle-admin-view {
    padding: 1.5rem 0.75rem;
  }

  .header h1 {
    font-size: 1.8rem;
  }

  .card {
    padding: 1rem 1.1rem;
  }
}
</style>