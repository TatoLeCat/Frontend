<template>
  <div class="criteria-dashboard-view">
    <div class="criteria-dashboard">
      <header class="criteria-header">
        <h1>Habilitación de Criterios</h1>
        <!-- Si en el futuro agregas endpoint POST /criteria, aquí va el botón de crear -->
        <!-- <button class="btn btn-primary" @click="openCreateModal">+ New criterion</button> -->
        <p class="hint">
          Solo administradores con un API token válido pueden editar criterios.
        </p>
      </header>

      <section v-if="loading" class="state state-loading">
        Loading criteria...
      </section>

      <section v-else-if="error" class="state state-error">
        <p>{{ error }}</p>
        <button class="btn" @click="fetchCriteria">Retry</button>
      </section>

      <!-- CARD WRAPPER AROUND THE TABLE -->
      <section v-else class="criteria-table-wrapper">
        <table class="criteria-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Key</th>
              <th>Name</th>
              <th>Description</th>
              <th>Value (int)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="criteria.length === 0">
              <td colspan="7" class="empty-row">
                No criteria defined yet.
              </td>
            </tr>
            <tr v-for="criterion in criteria" :key="criterion.id">
              <td>{{ criterion.id }}</td>
              <td><code>{{ criterion.key }}</code></td>
              <td>{{ criterion.name }}</td>
              <td>{{ criterion.description }}</td>
              <td>{{ criterion.value_int ?? '—' }}</td>
              <td>
                <span
                  class="badge"
                  :class="criterion.active ? 'badge-active' : 'badge-inactive'"
                >
                  {{ criterion.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="actions">
                <button class="btn btn-sm btn-primary" @click="openEditModal(criterion)">
                  Edit
                </button>
                <button
                  class="btn btn-sm"
                  :class="criterion.active ? 'btn-warning' : 'btn-success'"
                  @click="toggleActive(criterion)"
                >
                  {{ criterion.active ? 'Deactivate' : 'Activate' }}
                </button>
                <button
                  class="btn btn-sm btn-secondary"
                  @click="openAuditModal(criterion)"
                >
                  History
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Modal para editar criterio (no crear, de momento) -->
      <div v-if="showFormModal" class="modal-backdrop">
        <div class="modal">
          <h2>Edit criterion</h2>

          <label>
            Name
            <input v-model="form.name" type="text" />
          </label>

          <label>
            Description
            <textarea v-model="form.description" rows="3"></textarea>
          </label>

          <label>
            Value (integer, optional)
            <input
              v-model.number="form.value_int"
              type="number"
              placeholder="18, 3, 5..."
            />
          </label>

          <label class="checkbox">
            <input v-model="form.active" type="checkbox" />
            Active
          </label>

          <div class="modal-actions">
            <button class="btn" @click="closeFormModal">Cancel</button>
            <button class="btn btn-primary" @click="saveCriterion">
              Save
            </button>
          </div>
        </div>
      </div>

      <!-- Modal historial de auditoría -->
      <div v-if="showAuditModal" class="modal-backdrop">
        <div class="modal modal-large">
          <h2>Audit history – {{ auditCriterion?.name }}</h2>

          <section v-if="auditLoading" class="state state-loading">
            Loading audit history...
          </section>

          <section v-else-if="auditError" class="state state-error">
            <p>{{ auditError }}</p>
          </section>

          <section v-else>
            <table class="audit-table" v-if="filteredAudit.length > 0">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Action</th>
                  <th>Performed by</th>
                  <th>Before</th>
                  <th>After</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entry in filteredAudit" :key="entry.id">
                  <td>{{ formatDate(entry.created_at) }}</td>
                  <td>{{ entry.action }}</td>
                  <td>{{ entry.performed_by || 'system' }}</td>
                  <td>
                    <pre class="audit-json">{{ pretty(entry.before_state) }}</pre>
                  </td>
                  <td>
                    <pre class="audit-json">{{ pretty(entry.after_state) }}</pre>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-else>No audit records for this criterion.</p>
          </section>

          <div class="modal-actions">
            <button class="btn" @click="closeAuditModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8010'

// Lista de criterios
const criteria = ref([])
const loading = ref(false)
const error = ref(null)

// Modal de edición
const showFormModal = ref(false)
const editingCriterion = ref(null)
const form = ref({
  name: '',
  description: '',
  value_int: null,
  active: true,
})

// Modal auditoría
const showAuditModal = ref(false)
const auditCriterion = ref(null)
const audit = ref([])
const auditLoading = ref(false)
const auditError = ref(null)

// Util: headers para admin
function getAdminHeaders () {
  const token = localStorage.getItem('ADMIN_API_TOKEN')
  if (!token) {
    throw new Error(
      'Missing admin token. Please configure ADMIN_API_TOKEN in localStorage.'
    )
  }
  return {
    Authorization: `Bearer ${token}`,
  }
}

function resetForm () {
  form.value = {
    name: '',
    description: '',
    value_int: null,
    active: true,
  }
  editingCriterion.value = null
}

function openEditModal (criterion) {
  editingCriterion.value = criterion
  form.value = {
    name: criterion.name,
    description: criterion.description,
    value_int: criterion.value_int,
    active: criterion.active,
  }
  showFormModal.value = true
}

function closeFormModal () {
  showFormModal.value = false
}

async function fetchCriteria () {
  loading.value = true
  error.value = null
  try {
    const res = await axios.get(`${API_BASE}/criteria/`)
    criteria.value = res.data
  } catch (err) {
    console.error(err)
    error.value = 'Error loading criteria.'
  } finally {
    loading.value = false
  }
}

async function saveCriterion () {
  if (!editingCriterion.value) return

  try {
    const headers = getAdminHeaders()
    const id = editingCriterion.value.id

    // CriterionPatch con campos opcionales: name, description, active, value_int
    const payload = {
      name: form.value.name,
      description: form.value.description,
      active: form.value.active,
      value_int:
        form.value.value_int === null || form.value.value_int === ''
          ? null
          : Number(form.value.value_int),
    }

    const res = await axios.patch(`${API_BASE}/criteria/${id}`, payload, {
      headers,
    })

    // Reemplazar en la lista
    const idx = criteria.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      criteria.value[idx] = res.data
    }

    showFormModal.value = false
  } catch (err) {
    console.error(err)
    if (err.message?.includes('Missing admin token')) {
      alert(
        'Admin token missing. Please set ADMIN_API_TOKEN in localStorage before editing.'
      )
    } else if (err.response?.status === 401) {
      alert('Not authorized. Invalid admin token.')
    } else {
      alert('Error saving criterion.')
    }
  }
}

async function toggleActive (criterion) {
  try {
    const headers = getAdminHeaders()
    const id = criterion.id
    const payload = { active: !criterion.active }

    const res = await axios.patch(`${API_BASE}/criteria/${id}`, payload, {
      headers,
    })

    const idx = criteria.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      criteria.value[idx] = res.data
    }
  } catch (err) {
    console.error(err)
    if (err.message?.includes('Missing admin token')) {
      alert(
        'Admin token missing. Please set ADMIN_API_TOKEN in localStorage before toggling.'
      )
    } else if (err.response?.status === 401) {
      alert('Not authorized. Invalid admin token.')
    } else {
      alert('Error updating criterion.')
    }
  }
}

function openAuditModal (criterion) {
  auditCriterion.value = criterion
  showAuditModal.value = true
  loadAudit()
}

async function loadAudit () {
  if (!auditCriterion.value) return
  auditLoading.value = true
  auditError.value = null
  audit.value = []
  try {
    const headers = getAdminHeaders()

    const res = await axios.get(`${API_BASE}/criteria/audit`, {
      headers,
      params: { limit: 200 },
    })
    audit.value = res.data
  } catch (err) {
    console.error(err)
    if (err.message?.includes('Missing admin token')) {
      auditError.value =
        'Admin token missing. Please set ADMIN_API_TOKEN in localStorage.'
    } else if (err.response?.status === 401) {
      auditError.value = 'Not authorized. Invalid admin token.'
    } else {
      auditError.value = 'Error loading audit history.'
    }
  } finally {
    auditLoading.value = false
  }
}

const filteredAudit = computed(() => {
  if (!auditCriterion.value) return []
  return audit.value.filter(
    entry => entry.criterion_id === auditCriterion.value.id
  )
})

function closeAuditModal () {
  showAuditModal.value = false
  auditCriterion.value = null
  audit.value = []
  auditError.value = null
}

function formatDate (value) {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

function pretty (obj) {
  if (!obj) return ''
  try {
    return JSON.stringify(obj, null, 2)
  } catch {
    return String(obj)
  }
}

onMounted(fetchCriteria)
</script>

<style scoped>
.criteria-dashboard-view {
  min-height: 100vh;
  padding: 2.5rem 1rem;
  background: radial-gradient(circle at top, #1b4fff 0%, #140b3f 40%, #050816 100%);
  display: flex;
  justify-content: center;
}

.criteria-dashboard {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* Header */
.criteria-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.criteria-header h1 {
  margin: 0;
  font-size: 2.3rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #f9fafb;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.45);
}

.criteria-header .hint {
  margin-top: 0.4rem;
  font-size: 0.85rem;
  color: #e5e7eb;
}

/* Card-style wrapper around the table */
.criteria-table-wrapper {
  background: #ffffff;
  border-radius: 18px;
  padding: 1.5rem 1.75rem;
  box-shadow: 0 18px 25px rgba(3, 7, 18, 0.35);
  position: relative;
  overflow: hidden;
}

/* Top accent bar */
.criteria-table-wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 6px;
  width: 100%;
  background: linear-gradient(90deg, #facc15 0%, #1d4ed8 45%, #22c55e 100%);
}

/* Force readable text inside card */
.criteria-table-wrapper,
.criteria-table-wrapper * {
  color: #111827 !important;
}

/* Table */
.criteria-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.75rem;
  font-size: 0.9rem;
}

.criteria-table th {
  background: #f3f4f6;
  padding: 0.6rem;
  color: #111827;
  text-align: left;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.criteria-table td {
  padding: 0.55rem 0.6rem;
  border-bottom: 1px solid #e5e7eb;
}

/* FIX hover row going full white + keep text dark */
.criteria-table tbody tr:hover {
  background-color: rgba(15, 23, 42, 0.06) !important;
}

.criteria-table tbody tr:hover td,
.criteria-table tbody tr:hover td * {
  color: #111827 !important;
}

/* Status pills */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.badge-active {
  background: rgba(22, 163, 74, 0.12);
  color: #16a34a !important;
}

.badge-inactive {
  background: rgba(220, 38, 38, 0.12);
  color: #dc2626 !important;
}

/* Actions & buttons */
.actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
  border: none;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s, background 0.1s;
}

.btn-sm {
  font-size: 0.75rem;
  padding: 0.25rem 0.7rem;
}

.btn-primary {
  background: #2563eb;
  color: #ffffff !important;
}

.btn-warning {
  background: #f97316;
  color: #ffffff !important;
}

.btn-success {
  background: #16a34a;
  color: #ffffff !important;
}

.btn-secondary {
  background: #111827;
  color: #f9fafb !important;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.35);
}

/* States */
.state {
  margin-top: 1rem;
  text-align: center;
}

.state-loading {
  color: #e5e7eb;
}

.state-error {
  color: #fecaca;
}

/* Simple modal styles (if you already had global ones, this just complements) */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}

.modal {
  background: #ffffff;
  border-radius: 14px;
  padding: 1.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 18px 25px rgba(3, 7, 18, 0.45);
}

.modal-large {
  max-width: 900px;
}

.modal h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 700;
}

.modal label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.modal input,
.modal textarea {
  margin-top: 0.25rem;
  width: 100%;
  padding: 0.45rem 0.55rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.modal-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Audit table */
.audit-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.75rem;
  font-size: 0.85rem;
}

.audit-table th,
.audit-table td {
  padding: 0.4rem 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.audit-json {
  background: #0f172a;
  color: #e5e7eb;
  padding: 0.4rem;
  border-radius: 6px;
  font-size: 0.75rem;
  max-height: 220px;
  overflow: auto;
}

/* Small screens */
@media (max-width: 768px) {
  .criteria-table-wrapper {
    padding: 1.1rem 1.1rem;
  }

  .criteria-table {
    font-size: 0.8rem;
  }

  .criteria-header h1 {
    font-size: 1.8rem;
  }
}
</style>
