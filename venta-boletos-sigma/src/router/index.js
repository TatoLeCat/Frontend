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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
