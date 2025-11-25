import { createRouter, createWebHistory } from "vue-router";

// Autenticación y Seguridad
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import VerifyEmailView from "@/views/VerifyEmailView.vue";
import Enable2FAView from "@/views/Enable2FAView.vue";
import Perfil2FAView from "@/views/Perfil2FAView.vue";

// Vistas Principales
import HomeView from "@/views/HomeView.vue";
import PartidosView from "@/views/PartidosView.vue";
import PerfilView from "@/views/PerfilView.vue";
import HistorialView from "@/views/HistorialView.vue";

// Flujo de Compra de Boletos
import StadiumListView from "@/views/StadiumListView.vue";
import StadiumDetailView from "@/views/StadiumDetailView.vue";
import TicketOffersView from "@/views/TicketOffersView.vue";
import TicketDetailView from "@/views/TicketDetailView.vue";
import SeleccionAsiento from "@/views/SeleccionAsiento.vue";
import CheckoutView from "@/views/CheckoutView.vue";
import PaymentView from "@/views/PaymentView.vue";

// Gestión de Tickets del Usuario
import UserTicketView from "@/views/UserTicketView.vue";
import QrticketView from "@/views/QrticketView.vue";
import ScanQrView from "@/views/ScanQRView.vue";

// Administración
import EligibilityCriteriaDashboard from "@/views/EligibilityCriteriaDashboard.vue";
import RaffleAdmin from "@/views/RaffleAdmin.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ===== AUTENTICACIÓN Y SEGURIDAD =====
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/verify-email",
      name: "verifyEmail",
      component: VerifyEmailView,
    },
    {
      path: "/enable-2fa",
      name: "enable2FA",
      component: Enable2FAView,
    },
    {
      path: "/perfil-2fa",
      name: "perfil2fa",
      component: Perfil2FAView,
    },

    // ===== VISTAS PRINCIPALES =====
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/partidos",
      name: "partidos",
      component: PartidosView,
    },
    {
      path: "/perfil",
      name: "perfil",
      component: PerfilView,
    },
    {
      path: "/historial",
      name: "historial",
      component: HistorialView,
    },

    // ===== FLUJO DE COMPRA DE BOLETOS =====
    // 1. Explorar estadios
    {
      path: "/stadiums",
      name: "StadiumList",
      component: StadiumListView,
    },
    {
      path: "/stadiums/:id",
      name: "StadiumDetail",
      component: StadiumDetailView,
      props: true,
    },
    // 2. Ver ofertas de boletos
    {
      path: "/ticket-offers",
      name: "TicketOffers",
      component: TicketOffersView,
    },
    {
      path: "/ticket/:id",
      name: "TicketDetail",
      component: TicketDetailView,
      props: true,
    },
    // 3. Seleccionar asiento
    {
      path: "/seleccion-asiento",
      name: "seleccionAsiento",
      component: SeleccionAsiento,
    },
    // 4. Checkout y pago
    {
      path: "/checkout",
      name: "Checkout",
      component: CheckoutView,
    },
    {
      path: "/payment",
      name: "Payment",
      component: PaymentView,
    },

    // ===== GESTIÓN DE TICKETS DEL USUARIO =====
    {
      path: "/mis-tickets",
      name: "ticket",
      component: UserTicketView,
    },
    {
      path: "/ticket/qr/:id",
      name: "ticket-qr",
      component: QrticketView,
      props: true,
    },
    {
      path: "/scan-qr",
      name: "scan-qr",
      component: ScanQrView,
    },

    // ===== ADMINISTRACIÓN =====
    {
      path: "/admin/eligibility-criteria",
      name: "EligibilityCriteriaDashboard",
      component: EligibilityCriteriaDashboard,
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/raffle",
      name: "RaffleAdmin",
      component: RaffleAdmin,
      meta: { requiresAdmin: true },
    },
  ],
});

export default router;
