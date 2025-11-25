<template>
  <div class="bg-surface-50 dark:bg-surface-950 min-h-screen px-6 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="mb-6">
        <h1 class="text-surface-900 dark:text-surface-0 text-3xl font-bold mb-2">Mi Perfil</h1>
        <p class="text-surface-600 dark:text-surface-400">Gestiona tu información personal</p>
      </div>

      <div class="bg-surface-0 dark:bg-surface-900 rounded-lg shadow-sm p-6 border border-surface-200 dark:border-surface-700">
        <div class="flex items-center gap-6 mb-6">
          <div class="w-20 h-20 rounded-full overflow-hidden bg-primary flex items-center justify-center">
            <img v-if="previewImage" :src="previewImage" alt="avatar" class="w-full h-full object-cover" />
            <i v-else class="pi pi-user text-4xl text-white"></i>
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-semibold text-surface-900 dark:text-surface-0">{{ user.name || 'Usuario' }}</h2>
            <p class="text-surface-600 dark:text-surface-400">Información de tu cuenta</p>
          </div>
          <div>
            <button v-if="!editing" @click="startEdit" class="btn btn-primary">Editar</button>
            <button v-else @click="cancelEdit" class="btn btn-ghost">Cancelar</button>
          </div>
        </div>

        <form @submit.prevent="saveProfile" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Nombre</label>
              <input v-model="form.name" :disabled="!editing" type="text" class="input w-full mt-1" />
              <p v-if="errors.name" class="text-sm text-red-500 mt-1">{{ errors.name }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Email</label>
              <input v-model="form.email" :disabled="!editing" type="email" class="input w-full mt-1" />
              <p v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Foto de perfil</label>
            <div class="flex items-center gap-4 mt-2">
              <input ref="fileInput" @change="onFileChange" :disabled="!editing" type="file" accept="image/*" />
              <div v-if="previewImage" class="w-16 h-16 rounded overflow-hidden">
                <img :src="previewImage" alt="preview" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <button v-if="editing" type="submit" class="btn btn-primary">Guardar</button>
            <button v-if="editing" type="button" @click="resetForm" class="btn btn-ghost">Restablecer</button>
            <div v-if="successMessage" class="ml-auto text-green-600">{{ successMessage }}</div>
          </div>
        </form>

        <hr class="my-6" />

        <div>
          <h3 class="text-lg font-semibold mb-3">Cambiar contraseña</h3>
          <form @submit.prevent="changePassword" class="space-y-3 max-w-md">
            <div>
              <label class="text-sm">Contraseña actual</label>
              <input v-model="password.current" type="password" class="input w-full mt-1" />
            </div>
            <div>
              <label class="text-sm">Nueva contraseña</label>
              <input v-model="password.new" type="password" class="input w-full mt-1" />
            </div>
            <div>
              <label class="text-sm">Confirmar nueva contraseña</label>
              <input v-model="password.confirm" type="password" class="input w-full mt-1" />
            </div>
            <div class="flex items-center gap-3">
              <button type="submit" class="btn btn-secondary">Cambiar contraseña</button>
              <p v-if="passwordMessage" class="text-sm text-red-500">{{ passwordMessage }}</p>
            </div>
          </form>
        </div>

        <hr class="my-6" />

        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold">Eliminar cuenta</h3>
            <p class="text-sm text-surface-600">Esta acción es irreversible (mock).</p>
          </div>
          <div>
            <button @click="deleteAccount" class="btn btn-danger">Eliminar cuenta</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import AuthService from '@/services/AuthService'

const user = reactive({ name: '', email: '', avatar: '' })
const editing = ref(false)
const form = reactive({ name: '', email: '', avatar: '' })
const errors = reactive({ name: '', email: '' })
const successMessage = ref('')
const previewImage = ref(null)
const fileInput = ref(null)

const password = reactive({ current: '', new: '', confirm: '' })
const passwordMessage = ref('')

onMounted(() => {
  const u = AuthService.getUser() || {}
  user.name = u.name || u.username || ''
  user.email = u.email || ''
  user.avatar = u.avatar || u.photo || ''
  form.name = user.name
  form.email = user.email
  form.avatar = user.avatar
  previewImage.value = user.avatar || null
})

function startEdit() {
  editing.value = true
  successMessage.value = ''
}

function cancelEdit() {
  editing.value = false
  resetForm()
}

function resetForm() {
  form.name = user.name
  form.email = user.email
  form.avatar = user.avatar
  previewImage.value = user.avatar || null
  errors.name = ''
  errors.email = ''
}

function validate() {
  let ok = true
  errors.name = ''
  errors.email = ''
  if (!form.name || form.name.trim().length < 2) {
    errors.name = 'El nombre es requerido (mín 2 caracteres)'
    ok = false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email || !emailRegex.test(form.email)) {
    errors.email = 'Email inválido'
    ok = false
  }
  return ok
}

function onFileChange(e) {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    previewImage.value = reader.result
    form.avatar = reader.result
  }
  reader.readAsDataURL(file)
}

function saveProfile() {
  if (!validate()) return
  // Mock save locally in AuthService (localStorage)
  const updated = { ...(AuthService.getUser() || {}), name: form.name, email: form.email }
  if (form.avatar) updated.avatar = form.avatar
  AuthService.setUser(updated)
  user.name = updated.name
  user.email = updated.email
  user.avatar = updated.avatar || ''
  editing.value = false
  successMessage.value = 'Perfil actualizado correctamente.'
  setTimeout(() => (successMessage.value = ''), 4000)
}

function changePassword() {
  passwordMessage.value = ''
  if (!password.new || password.new.length < 6) {
    passwordMessage.value = 'La nueva contraseña debe tener al menos 6 caracteres.'
    return
  }
  if (password.new !== password.confirm) {
    passwordMessage.value = 'Las contraseñas no coinciden.'
    return
  }
  // Mock: verify current password if stored
  const stored = AuthService.getUser() || {}
  if (stored.password && password.current !== stored.password) {
    passwordMessage.value = 'Contraseña actual incorrecta.'
    return
  }
  // Store new password locally only for mock/testing
  stored.password = password.new
  AuthService.setUser(stored)
  password.current = ''
  password.new = ''
  password.confirm = ''
  passwordMessage.value = ''
  successMessage.value = 'Contraseña actualizada correctamente.'
  setTimeout(() => (successMessage.value = ''), 4000)
}

function deleteAccount() {
  if (!confirm('¿Estás seguro de eliminar la cuenta? Esta acción es irreversible (mock).')) return
  // Mock remove
  AuthService.logout()
  // Optionally redirect to login or home (no router import here to keep this view self-contained)
  alert('Cuenta eliminada (mock). Se ha cerrado la sesión.')
  window.location.href = '/login'
}
</script>
