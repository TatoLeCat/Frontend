<template>
  <div>hola mundo</div>
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

const ticketOrder = ref({
  team1: 'Argentina',
  team2: 'Francia',
  stadium: 'MetLife Stadium',
  city: 'New Jersey',
  phase: 'Semifinal',
  sector: 'Sur',
  row: 'A',
  quantity: 2,
  price: 189.99,
  totalPrice: 436.97,
  image: 'https://images.unsplash.com/photo-1516231318713-ef900995ad4d?w=400',
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
