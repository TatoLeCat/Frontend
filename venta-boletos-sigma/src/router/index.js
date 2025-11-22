import { createRouter, createWebHistory } from "vue-router";

import SeleccionAsiento from "@/views/SeleccionAsiento.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import HomeView from "@/views/HomeView.vue";
import PartidosView from "@/views/PartidosView.vue";
import PerfilView from "@/views/PerfilView.vue";
import HistorialView from "@/views/HistorialView.vue";
import UserTicketView from "@/views/UserTicketView.vue";
import QrticketView from "@/views/QrticketView.vue";
import ScanQrView from "@/views/ScanQRView.vue";
import EligibilityCriteriaDashboard from "@/views/EligibilityCriteriaDashboard.vue";
import RaffleAdmin from "@/views/RaffleAdmin.vue";
import VerifyEmailView from "@/views/VerifyEmailView.vue";
import Enable2FAView from "@/views/Enable2FAView.vue";
import Perfil2FAView from "@/views/Perfil2FAView.vue";

// Vistas demo de boletos
import CheckoutView from "@/views/CheckoutView.vue";
import TicketDetailView from "@/views/TicketDetailView.vue";
import TicketOffersView from "@/views/TicketOffersView.vue";
import StadiumListView from "@/views/StadiumListView.vue";
import StadiumDetailView from "@/views/StadiumDetailView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 2FA / Auth util
    {
      path: "/perfil-2fa",
      name: "perfil2fa",
      component: Perfil2FAView,
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

    // Core app
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
    {
      path: "/seleccionAsiento",
      name: "seleccionAsiento",
      component: SeleccionAsiento,
    },
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

    // Flujos de boletos / demo
    {
      path: "/TicketOffers",
      name: "TicketOffers",
      component: TicketOffersView,
    },
    {
      path: "/checkout",
      name: "Checkout",
      component: CheckoutView,
    },
    {
      path: "/ticket/:id",
      name: "TicketDetail",
      component: TicketDetailView,
      props: true,
    },
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

    // Tickets del usuario
    {
      path: "/ticket",
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

    // Admin
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
