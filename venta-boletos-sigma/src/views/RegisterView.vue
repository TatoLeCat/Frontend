<template>
  <div class="bg-surface-50 dark:bg-surface-950 min-h-screen px-6 py-8 md:px-20 lg:px-80">
    <div
      class="bg-surface-0 dark:bg-surface-900 p-8 md:p-12 shadow-sm rounded-2xl w-full max-w-2xl mx-auto flex flex-col gap-8"
    >
      <div class="flex flex-col items-center gap-4">
        <div class="flex flex-col items-center gap-2 w-full">
          <div
            class="text-surface-900 dark:text-surface-0 text-2xl font-semibold leading-tight text-center w-full"
          >
            Crear cuenta
          </div>
          <div class="text-center w-full">
            <span class="text-surface-700 dark:text-surface-200 leading-normal"
              >¿Ya tienes una cuenta?</span
            >
            <a
              @click="router.push('/login')"
              class="text-primary font-medium ml-1 cursor-pointer hover:text-primary-emphasis"
              >Inicia sesión</a
            >
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-6 w-full">
        <!-- Nombre y Apellido -->
        <div class="flex flex-col sm:flex-row gap-4 w-full">
          <div class="flex flex-col gap-2 w-full sm:w-1/2">
            <label
              for="firstname"
              class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
              >Nombre</label
            >
            <InputText
              id="firstname"
              type="text"
              v-model="form.firstname"
              placeholder="Ingresa tu nombre"
              class="w-full px-3 py-2 shadow-sm rounded-lg"
            />
          </div>
          <div class="flex flex-col gap-2 w-full sm:w-1/2">
            <label
              for="lastname"
              class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
              >Apellido</label
            >
            <InputText
              id="lastname"
              type="text"
              v-model="form.lastname"
              placeholder="Ingresa tu apellido"
              class="w-full px-3 py-2 shadow-sm rounded-lg"
            />
          </div>
        </div>

        <!-- Email -->
        <div class="flex flex-col gap-2 w-full">
          <label
            for="email"
            class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
            >Correo electrónico</label
          >
          <InputText
            id="email"
            type="email"
            v-model="form.email"
            placeholder="ejemplo@correo.com"
            class="w-full px-3 py-2 shadow-sm rounded-lg"
          />
        </div>

        <!-- Fecha de nacimiento -->
        <div class="flex flex-col gap-2 w-full">
          <label
            for="dob"
            class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
            >Fecha de nacimiento</label
          >
          <DatePicker
            v-model="form.dob"
            id="dob"
            dateFormat="dd/mm/yy"
            placeholder="Selecciona tu fecha de nacimiento"
            class="w-full"
            showIcon
            :maxDate="maxDate"
          />
        </div>

        <!-- País y Teléfono -->
        <div class="flex flex-col sm:flex-row gap-4 w-full">
          <div class="flex flex-col gap-2 w-full sm:w-2/5">
            <label
              for="country"
              class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
              >País</label
            >
            <Select
              v-model="selectedCountry"
              :options="countries"
              optionLabel="name"
              placeholder="Selecciona país"
              class="w-full"
              filter
            >
              <template #value="slotProps">
                <div v-if="slotProps.value" class="flex items-center gap-2">
                  <span>{{ slotProps.value.flag }}</span>
                  <span>{{ slotProps.value.phoneCode }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="flex items-center gap-2">
                  <span>{{ slotProps.option.flag }}</span>
                  <span>{{ slotProps.option.name }}</span>
                  <span class="text-surface-500"
                    >({{ slotProps.option.phoneCode }})</span
                  >
                </div>
              </template>
            </Select>
          </div>
          <div class="flex flex-col gap-2 w-full sm:w-3/5">
            <label
              for="phone"
              class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
              >Teléfono</label
            >
            <div class="flex gap-2">
              <InputText
                :value="selectedCountry?.phoneCode || '+00'"
                disabled
                class="w-20 px-3 py-2 shadow-sm rounded-lg bg-surface-100 dark:bg-surface-800"
              />
              <InputText
                id="phone"
                type="tel"
                v-model="form.phone"
                placeholder="999999999"
                class="flex-1 px-3 py-2 shadow-sm rounded-lg"
              />
            </div>
          </div>
        </div>

        <!-- Contraseña -->
        <div class="flex flex-col gap-2 w-full">
          <label
            for="password"
            class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
            >Contraseña</label
          >
          <Password
            id="password"
            v-model="form.password"
            placeholder="Ingresa tu contraseña"
            :toggleMask="true"
            :feedback="true"
            inputClass="w-full"
          >
            <template #header>
              <div class="font-semibold text-xm mb-4">Elige una contraseña</div>
            </template>
            <template #footer>
              <Divider />
              <ul class="pl-2 ml-2 my-0 leading-normal">
                <li>Al menos una minúscula</li>
                <li>Al menos una mayúscula</li>
                <li>Al menos un número</li>
                <li>Mínimo 8 caracteres</li>
              </ul>
            </template>
          </Password>
        </div>

        <!-- Confirmar Contraseña -->
        <div class="flex flex-col gap-2 w-full">
          <label
            for="confirmPassword"
            class="text-surface-900 dark:text-surface-0 font-medium leading-normal"
            >Confirmar contraseña</label
          >
          <Password
            id="confirmPassword"
            v-model="form.confirmPassword"
            placeholder="Confirma tu contraseña"
            :toggleMask="true"
            :feedback="false"
            inputClass="w-full"
          />
        </div>
      </div>

      <Button
        label="Registrarse"
        icon="pi pi-user-plus"
        :loading="loading"
        @click="handleSubmit"
        class="w-full py-2 rounded-lg flex justify-center items-center gap-2"
      >
        <template #icon>
          <i class="pi pi-user-plus text-base! leading-normal!" />
        </template>
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
import Password from "primevue/password";
import Select from "primevue/select";
import Divider from "primevue/divider";
import AuthService from "@/services/AuthService";

const router = useRouter();
const toast = useToast();
const loading = ref(false);

// Formulario
const form = ref({
  firstname: "",
  lastname: "",
  email: "",
  dob: null,
  phone: "",
  password: "",
  confirmPassword: "",
});

// País seleccionado
const selectedCountry = ref(null);

// Fecha máxima (18 años atrás)
const maxDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date;
});

// Lista de países con códigos telefónicos y códigos ISO
const countries = ref([
  { name: "México", phoneCode: "+52", countryCode: "MX", flag: "🇲🇽" },
  { name: "Estados Unidos", phoneCode: "+1", countryCode: "US", flag: "🇺🇸" },
  { name: "España", phoneCode: "+34", countryCode: "ES", flag: "🇪🇸" },
  { name: "Argentina", phoneCode: "+54", countryCode: "AR", flag: "🇦🇷" },
  { name: "Colombia", phoneCode: "+57", countryCode: "CO", flag: "🇨🇴" },
  { name: "Chile", phoneCode: "+56", countryCode: "CL", flag: "🇨🇱" },
  { name: "Perú", phoneCode: "+51", countryCode: "PE", flag: "🇵🇪" },
  { name: "Venezuela", phoneCode: "+58", countryCode: "VE", flag: "🇻🇪" },
  { name: "Ecuador", phoneCode: "+593", countryCode: "EC", flag: "🇪🇨" },
  { name: "Guatemala", phoneCode: "+502", countryCode: "GT", flag: "🇬🇹" },
  { name: "Cuba", phoneCode: "+53", countryCode: "CU", flag: "🇨🇺" },
  { name: "Bolivia", phoneCode: "+591", countryCode: "BO", flag: "🇧🇴" },
  {
    name: "República Dominicana",
    phoneCode: "+1-809",
    countryCode: "DO",
    flag: "🇩🇴",
  },
  { name: "Honduras", phoneCode: "+504", countryCode: "HN", flag: "🇭🇳" },
  { name: "Paraguay", phoneCode: "+595", countryCode: "PY", flag: "🇵🇾" },
  { name: "El Salvador", phoneCode: "+503", countryCode: "SV", flag: "🇸🇻" },
  { name: "Nicaragua", phoneCode: "+505", countryCode: "NI", flag: "🇳🇮" },
  { name: "Costa Rica", phoneCode: "+506", countryCode: "CR", flag: "🇨🇷" },
  { name: "Panamá", phoneCode: "+507", countryCode: "PA", flag: "🇵🇦" },
  { name: "Uruguay", phoneCode: "+598", countryCode: "UY", flag: "🇺🇾" },
  { name: "Brasil", phoneCode: "+55", countryCode: "BR", flag: "🇧🇷" },
  { name: "Canadá", phoneCode: "+1", countryCode: "CA", flag: "🇨🇦" },
  { name: "Reino Unido", phoneCode: "+44", countryCode: "GB", flag: "🇬🇧" },
  { name: "Francia", phoneCode: "+33", countryCode: "FR", flag: "🇫🇷" },
  { name: "Alemania", phoneCode: "+49", countryCode: "DE", flag: "🇩🇪" },
  { name: "Italia", phoneCode: "+39", countryCode: "IT", flag: "🇮🇹" },
  { name: "Portugal", phoneCode: "+351", countryCode: "PT", flag: "🇵🇹" },
]);

// Validaciones
const validateForm = () => {
  if (!form.value.firstname || !form.value.lastname) {
    toast.add({
      severity: "warn",
      summary: "Campos requeridos",
      detail: "Por favor ingresa tu nombre y apellido",
      life: 3000,
    });
    return false;
  }

  if (!form.value.email) {
    toast.add({
      severity: "warn",
      summary: "Campo requerido",
      detail: "Por favor ingresa tu correo electrónico",
      life: 3000,
    });
    return false;
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.email)) {
    toast.add({
      severity: "warn",
      summary: "Email inválido",
      detail: "Por favor ingresa un correo electrónico válido",
      life: 3000,
    });
    return false;
  }

  if (!form.value.dob) {
    toast.add({
      severity: "warn",
      summary: "Campo requerido",
      detail: "Por favor selecciona tu fecha de nacimiento",
      life: 3000,
    });
    return false;
  }

  if (!selectedCountry.value || !form.value.phone) {
    toast.add({
      severity: "warn",
      summary: "Campos requeridos",
      detail: "Por favor selecciona tu país e ingresa tu teléfono",
      life: 3000,
    });
    return false;
  }

  if (!form.value.password) {
    toast.add({
      severity: "warn",
      summary: "Campo requerido",
      detail: "Por favor ingresa una contraseña",
      life: 3000,
    });
    return false;
  }

  // Validar fortaleza de contraseña
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(form.value.password)) {
    toast.add({
      severity: "warn",
      summary: "Contraseña débil",
      detail:
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
      life: 4000,
    });
    return false;
  }

  if (form.value.password !== form.value.confirmPassword) {
    toast.add({
      severity: "warn",
      summary: "Contraseñas no coinciden",
      detail: "Las contraseñas ingresadas no coinciden",
      life: 3000,
    });
    return false;
  }

  return true;
};

// Manejo del envío
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    // Formatear fecha al formato YYYY-MM-DD que espera la API
    const formattedDate = form.value.dob
      ? new Date(form.value.dob).toISOString().split("T")[0]
      : null;

    // Preparar datos para enviar con los nombres correctos de la API
    const userData = {
      email: form.value.email,
      first_name: form.value.firstname,
      last_name: form.value.lastname,
      date_of_birth: formattedDate,
      country_code: selectedCountry.value.countryCode,
      phone: `${selectedCountry.value.phoneCode}${form.value.phone}`,
      password: form.value.password,
    };

    await AuthService.register(userData);

    toast.add({
      severity: "success",
      summary: "Registro exitoso",
      detail: "Tu cuenta ha sido creada exitosamente",
      life: 3000,
    });

    // Redirigir al login o al home
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  } catch (error) {
    console.error("Error en registro:", error);

    toast.add({
      severity: "error",
      summary: "Error en el registro",
      detail: error.message || "Ocurrió un error al crear tu cuenta",
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped></style>
