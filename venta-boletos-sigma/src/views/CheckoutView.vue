<template>
  <div class="bg-surface-50 dark:bg-surface-950 px-6 py-12 md:px-20 lg:px-80">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-surface-900 dark:text-surface-0 text-3xl font-semibold mb-2">
          Confirmar Compra
        </h1>
        <p class="text-surface-700 dark:text-surface-200">
          Revisa los detalles antes de completar tu pago
        </p>
      </div>

      <!-- Order Summary -->
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl shadow-sm mb-6">
        <h2 class="text-surface-900 dark:text-surface-0 font-semibold text-lg mb-4">
          Resumen del Pedido
        </h2>

        <div class="flex gap-4 mb-6 pb-6 border-b border-surface-200 dark:border-surface-700">
          <img
            :src="ticketOrder?.image"
            :alt="ticketOrder?.eventName"
            class="w-24 h-24 rounded-lg object-cover"
          />
          <div class="flex-1">
            <h3 class="text-surface-900 dark:text-surface-0 font-semibold">
              {{ ticketOrder?.eventName }}
            </h3>
            <p class="text-surface-600 dark:text-surface-300 text-sm mb-2">
              {{ ticketOrder?.location }}
            </p>
            <p class="text-surface-600 dark:text-surface-300 text-sm">
              Fila {{ ticketOrder?.row }} - {{ ticketOrder?.quantity }} boleto(s)
            </p>
          </div>
          <div class="text-right">
            <p class="text-surface-600 dark:text-surface-300 text-xs mb-1">Precio unitario</p>
            <p class="text-surface-900 dark:text-surface-0 font-semibold">
              ${{ ticketOrder?.price.toFixed(2) }}
            </p>
          </div>
        </div>

        <!-- Price Breakdown -->
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-surface-700 dark:text-surface-300">
            <span>Subtotal ({{ ticketOrder?.quantity }} boleto{{ ticketOrder?.quantity > 1 ? 's' : '' }}):</span>
            <span>${{ (ticketOrder?.price * ticketOrder?.quantity).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-surface-700 dark:text-surface-300">
            <span>Impuestos (15%):</span>
            <span>${{ ((ticketOrder?.price * ticketOrder?.quantity) * 0.15).toFixed(2) }}</span>
          </div>
          <Divider class="my-2" />
          <div class="flex justify-between text-surface-900 dark:text-surface-0 font-semibold text-lg">
            <span>Total:</span>
            <span>${{ (ticketOrder?.totalPrice).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Time Limit Info -->
        <div class="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p class="text-yellow-800 dark:text-yellow-200 text-xs flex items-center gap-2">
            <i class="pi pi-clock text-sm"></i>
            Completa tu compra en <span class="font-semibold">72 horas</span> o la oferta expirará
          </p>
        </div>
      </div>

      <!-- Buyer Information -->
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl shadow-sm mb-6">
        <h2 class="text-surface-900 dark:text-surface-0 font-semibold text-lg mb-4">
          Información del Comprador
        </h2>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="flex flex-col gap-2">
            <label class="text-surface-900 dark:text-surface-0 font-medium">Nombre Completo</label>
            <InputText
              v-model="buyerInfo.fullName"
              placeholder="Juan Pérez"
              class="w-full px-3 py-2 shadow-sm rounded-lg"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-surface-900 dark:text-surface-0 font-medium">Email</label>
            <InputText
              v-model="buyerInfo.email"
              type="email"
              placeholder="juan@example.com"
              class="w-full px-3 py-2 shadow-sm rounded-lg"
            />
          </div>
          <div class="flex flex-col gap-2 col-span-2">
            <label class="text-surface-900 dark:text-surface-0 font-medium">Teléfono</label>
            <InputText
              v-model="buyerInfo.phone"
              placeholder="+1 (555) 123-4567"
              class="w-full px-3 py-2 shadow-sm rounded-lg"
            />
          </div>
        </div>
      </div>

      <!-- Payment Method -->
      <div class="bg-surface-0 dark:bg-surface-900 p-6 rounded-2xl shadow-sm mb-6">
        <h2 class="text-surface-900 dark:text-surface-0 font-semibold text-lg mb-4">
          Método de Pago
        </h2>

        <div class="flex gap-3 mb-4">
          <div
            v-for="method in paymentMethods"
            :key="method"
            @click="paymentMethod = method"
            :class="{
              'border-primary bg-primary-50 dark:bg-primary-950': paymentMethod === method,
              'border-surface-200 dark:border-surface-700': paymentMethod !== method,
            }"
            class="flex-1 p-3 border rounded-lg cursor-pointer transition-colors"
          >
            <p class="text-surface-900 dark:text-surface-0 font-medium text-sm">{{ method }}</p>
          </div>
        </div>

        <!-- Card Form (if credit card selected) -->
        <div v-if="paymentMethod === 'Tarjeta de Crédito'" class="space-y-4">
          <div class="flex flex-col gap-2">
            <label class="text-surface-900 dark:text-surface-0 font-medium">Número de Tarjeta</label>
            <InputText
              v-model="cardInfo.number"
              placeholder="1234 5678 9012 3456"
              class="w-full px-3 py-2 shadow-sm rounded-lg"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-surface-900 dark:text-surface-0 font-medium">Vencimiento</label>
              <InputText
                v-model="cardInfo.expiry"
                placeholder="MM/YY"
                class="w-full px-3 py-2 shadow-sm rounded-lg"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-surface-900 dark:text-surface-0 font-medium">CVV</label>
              <InputText
                v-model="cardInfo.cvv"
                placeholder="123"
                type="password"
                class="w-full px-3 py-2 shadow-sm rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Terms & Conditions -->
      <div class="flex gap-3 mb-6">
        <Checkbox v-model="acceptTerms" :binary="true" />
        <label class="text-surface-700 dark:text-surface-300 text-sm">
          Acepto los
          <a class="text-primary font-medium cursor-pointer hover:text-primary-emphasis">
            términos y condiciones
          </a>
        </label>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-3">
        <Button
          label="Completar Pago"
          @click="handlePayment"
          class="w-full py-2 rounded-lg"
          :disabled="!acceptTerms || isProcessing"
          :loading="isProcessing"
        />
        <Button
          label="Volver a las Ofertas"
          severity="secondary"
          @click="goBack"
          class="w-full py-2 rounded-lg"
          :disabled="isProcessing"
        />
      </div>

      <!-- Success Message -->
      <Toast />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Divider from 'primevue/divider';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const toast = useToast();

// Mock data - reemplazar con datos de la orden
const ticketOrder = ref({
  eventName: 'Concierto Bruno Mars',
  location: 'Estadio Nacional - Sector A',
  row: 'A',
  quantity: 2,
  price: 89.99,
  totalPrice: 206.97,
  image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
});

const buyerInfo = ref({
  fullName: '',
  email: '',
  phone: '',
});

const paymentMethods = ['Tarjeta de Crédito', 'PayPal', 'Transferencia Bancaria'];
const paymentMethod = ref('Tarjeta de Crédito');

const cardInfo = ref({
  number: '',
  expiry: '',
  cvv: '',
});

const acceptTerms = ref(false);
const isProcessing = ref(false);

const handlePayment = () => {
  if (!buyerInfo.value.fullName || !buyerInfo.value.email || !buyerInfo.value.phone) {
    toast.add({
      severity: 'warn',
      summary: 'Campos requeridos',
      detail: 'Por favor completa toda la información del comprador',
      life: 3000,
    });
    return;
  }

  isProcessing.value = true;

  // Simular procesamiento de pago
  setTimeout(() => {
    toast.add({
      severity: 'success',
      summary: 'Pago exitoso',
      detail: 'Tu compra se ha completado correctamente. Revisa tu email para los detalles.',
      life: 3000,
    });

    setTimeout(() => {
      router.push({ name: 'orders' });
    }, 1500);

    isProcessing.value = false;
  }, 2000);
};

const goBack = () => {
  router.back();
};
</script>