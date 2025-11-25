<template>
  <div class="perfil-view min-h-screen px-6 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-surface-900 dark:text-surface-0 text-3xl font-bold mb-2">
          Mi Perfil
        </h1>
        <p class="text-surface-600 dark:text-surface-400">
          Gestiona tu información personal
        </p>
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
            <Button v-if="!editing" @click="startEdit" icon="pi pi-pencil" label="Editar" class="p-button-outlined" />
            <Button v-else @click="cancelEdit" icon="pi pi-times" label="Cancelar" class="p-button-secondary" />
          </div>
        </div>

        <form @submit.prevent="saveProfile" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Nombre</label>
              <InputText v-model="form.name" :disabled="!editing" class="w-full mt-1" />
              <p v-if="errors.name" class="text-sm text-red-500 mt-1">{{ errors.name }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-surface-700 dark:text-surface-300">Email</label>
              <InputText v-model="form.email" :disabled="!editing" type="email" class="w-full mt-1" />
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
            <Button v-if="editing" type="submit" icon="pi pi-check" label="Guardar" class="p-button-success" />
            <Button v-if="editing" type="button" @click="resetForm" icon="pi pi-undo" label="Restablecer" class="p-button-text" />
            <div class="ml-auto"></div>
          </div>
        </form>

        <hr class="my-6" />

        <div>
          <h3 class="text-lg font-semibold mb-3">Cambiar contraseña</h3>
          <form @submit.prevent="changePassword" class="space-y-3 max-w-md">
            <div>
              <label class="text-sm">Contraseña actual</label>
              <Password v-model="password.current" toggleMask class="w-full mt-1" />
            </div>
            <div>
              <label class="text-sm">Nueva contraseña</label>
              <Password v-model="password.new" toggleMask :feedback="false" class="w-full mt-1" />
            </div>
            <div>
              <label class="text-sm">Confirmar nueva contraseña</label>
              <Password v-model="password.confirm" toggleMask class="w-full mt-1" />
            </div>
            <div class="flex items-center gap-3">
              <Button type="submit" icon="pi pi-key" label="Cambiar contraseña" class="p-button-warning" />
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
            <Button @click="deleteAccount" icon="pi pi-trash" label="Eliminar cuenta" class="p-button-danger" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthService from '@/services/AuthService'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { useToast } from 'primevue/usetoast'

const user = reactive({ name: '', email: '', avatar: '' })
const editing = ref(false)
const form = reactive({ name: '', email: '', avatar: '' })
const errors = reactive({ name: '', email: '' })
const previewImage = ref(null)
const toast = useToast()

const password = reactive({ current: '', new: '', confirm: '' })
const passwordMessage = ref('')
const router = useRouter()

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
  toast.add({ severity: 'success', summary: 'Perfil', detail: 'Perfil actualizado correctamente.', life: 3000 })
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
  toast.add({ severity: 'success', summary: 'Contraseña', detail: 'Contraseña actualizada correctamente.', life: 3000 })
}

function deleteAccount() {
  if (!confirm('¿Estás seguro de eliminar la cuenta? Esta acción es irreversible (mock).')) return
  // Mock remove
  AuthService.logout()
  // Show toast and redirect via router for SPA navigation
  toast.add({ severity: 'info', summary: 'Cuenta', detail: 'Cuenta eliminada (mock).', life: 3000 })
  router.push('/login')
}
</script>

<style scoped>
.perfil-view {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.perfil-view h1,
.perfil-view h2 {
  color: white !important;
}

.perfil-view > div > div > p {
  color: rgba(255, 255, 255, 0.9) !important;
}
</style>
