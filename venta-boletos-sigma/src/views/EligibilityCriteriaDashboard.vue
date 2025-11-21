<template>
  <div class="criteria-dashboard">
    <header class="criteria-header">
      <h1>Eligibility Criteria</h1>
      <!-- Si en el futuro agregas endpoint POST /criteria, aquí va el botón de crear -->
      <!-- <button class="btn btn-primary" @click="openCreateModal">+ New criterion</button> -->
      <p class="hint">
        Only admins with a valid API token can edit criteria.
      </p>
    </header>

    <section v-if="loading" class="state state-loading">
      Loading criteria...
    </section>

    <section v-else-if="error" class="state state-error">
      <p>{{ error }}</p>
      <button class="btn" @click="fetchCriteria">Retry</button>
    </section>

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
              <button class="btn btn-sm" @click="openEditModal(criterion)">
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
.criteria-dashboard {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
}
.criteria-header {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}
.criteria-header h1 {
  margin: 0;
}
.hint {
  font-size: 0.8rem;
  color: #6b7280;
}
.criteria-table-wrapper {
  overflow-x: auto;
}
.criteria-table {
  width: 100%;
  border-collapse: collapse;
}
.criteria-table th,
.criteria-table td {
  padding: 0.6rem 0.8rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
  vertical-align: top;
}
.criteria-table th {
  background: #f3f4f6;
}
.empty-row {
  text-align: center;
  color: #6b7280;
}
.badge {
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.8rem;
}
.badge-active {
  background-color: #d1fae5;
  color: #065f46;
}
.badge-inactive {
  background-color: #fee2e2;
  color: #991b1b;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.btn {
  border: none;
  border-radius: 4px;
  padding: 0.3rem 0.7rem;
  cursor: pointer;
  font-size: 0.85rem;
}
.btn-primary {
  background-color: #2563eb;
  color: white;
}
.btn-warning {
  background-color: #f97316;
  color: white;
}
.btn-success {
  background-color: #16a34a;
  color: white;
}
.btn-secondary {
  background-color: #6b7280;
  color: white;
}
.btn-sm {
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
}
.state {
  padding: 1rem 0;
}
.state-error {
  color: #b91c1c;
}

/* Modal styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 40;
}
.modal {
  background: white;
  border-radius: 8px;
  padding: 1.2rem;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.3);
}
.modal-large {
  max-width: 900px;
}
.modal label {
  display: block;
  margin-bottom: 0.6rem;
  font-size: 0.9rem;
}
.modal input,
.modal textarea {
  width: 100%;
  padding: 0.4rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  font-size: 0.9rem;
}
.checkbox {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1rem;
}
.audit-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.8rem;
}
.audit-table th,
.audit-table td {
  border-bottom: 1px solid #e5e7eb;
  padding: 0.4rem 0.5rem;
  vertical-align: top;
  font-size: 0.8rem;
}
.audit-json {
  background: #f9fafb;
  border-radius: 4px;
  padding: 0.25rem 0.35rem;
  max-height: 140px;
  overflow: auto;
}
</style>
