import SeleccionAsiento from "@/views/SeleccionAsiento.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import HomeView from "@/views/HomeView.vue";
import PartidosView from "@/views/PartidosView.vue";
import PerfilView from "@/views/PerfilView.vue";
import HistorialView from "@/views/HistorialView.vue";
import { createRouter, createWebHistory } from "vue-router";
import UserTicketView from "@/views/UserTicketView.vue";
import QrticketView from "@/views/QrticketView.vue";
import ScanQrView from "@/views/ScanQRView.vue";
import EligibilityCriteriaDashboard from '@/views/EligibilityCriteriaDashboard.vue';
import RaffleAdmin from "@/views/RaffleAdmin.vue";
import VerifyEmailView from "@/views/VerifyEmailView.vue";
import Enable2FAView from "@/views/Enable2FAView.vue";
import 2FAView from "@/views/2FAView.vue";



// Importación de vistas
import CheckoutView from '../views/CheckoutView.vue'
import TicketDetailView from '../views/TicketDetailView.vue'
import TicketOffersView from '../views/TicketOffersView.vue'
import StadiumListView from '../views/StadiumListView.vue'
import StadiumDetailView from '../views/StadiumDetailView.vue'
import FAView from "@/views/2FAView.vue";

// Configuración de rutas
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
    path: "/2fa",
    name: "2fa",
    component: View2FA,
    },

    {
    path: "/verify-email",
    name: "verifyEmail",
    component: () => import("@/views/VerifyEmailView.vue"),
    },

    {
    path: "/enable-2fa",
    name: "enable2FA",
    component: () => import("@/views/Enable2FAView.vue"),
    },

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
      name: "seleccionAsisnto",
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

    {
      path: '/TicketOffers',
      name: 'TicketOffers', 
      component: TicketOffersView,
    },

    {
      path: '/checkout',
      name: 'Checkout',
      component: CheckoutView,
    },
    {
      path: '/ticket/:id', 
      name: 'TicketDetail',
      component: TicketDetailView,
      props: true, 
    },
    {
      path: '/',
      redirect: '/stadiums'
    },
    {
      path: '/stadiums',
      name: 'StadiumList',
      component: StadiumListView
    },
    {
      path: '/stadiums/:id',
      name: 'StadiumDetail',
      component: StadiumDetailView,
      props: true
    },

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
    {
      path: '/admin/eligibility-criteria',
      name: 'EligibilityCriteriaDashboard',
      component: EligibilityCriteriaDashboard,
      meta: { requiresAdmin: true },
    },
   {
      path: '/admin/raffle',
      name: 'RaffleAdmin',
      component: RaffleAdmin,
      meta: { requiresAdmin: true },
    },
  ],
});
export default router;
