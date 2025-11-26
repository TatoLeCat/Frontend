import { createRouter, createWebHistory } from "vue-router";
import AuthService from "@/services/AuthService";

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

// Gestión de Tickets del Usuario
import QrticketView from "@/views/QrticketView.vue";
import ScanQrView from "@/views/ScanQRView.vue";

// Administración
import EligibilityCriteriaDashboard from "@/views/EligibilityCriteriaDashboard.vue";
import RaffleAdmin from "@/views/RaffleAdmin.vue";
import TicketStatusView from "@/views/TicketStatusView.vue";

// Torneo - Fases y Equipos
import TournamentPhasesView from "@/views/TournamentPhasesView.vue";
import PhaseDetailView from "@/views/PhaseDetailView.vue";

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

    // ===== GESTIÓN DE TICKETS DEL USUARIO =====
    {
      path: "/ticket/qr",
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

    // ===== TORNEO - FASES Y EQUIPOS =====
    {
      path: "/fases",
      name: "TournamentPhases",
      component: TournamentPhasesView,
    },
    {
      path: "/fases/:id",
      name: "PhaseDetail",
      component: PhaseDetailView,
      props: true,
    },
    {
      path: '/ticketsStatusControl',
      name: 'TicketsStatusControl',
      component: TicketStatusView,
    },
  ],
});

// Navigation Guard para proteger rutas
router.beforeEach((to, _from, next) => {
  // Rutas públicas que NO requieren autenticación
  const publicRoutes = ["/", "/login", "/register", "/verify-email"];

  // Verificar si la ruta requiere autenticación
  const requiresAuth = !publicRoutes.includes(to.path);

  // Verificar si el usuario está autenticado
  const isAuthenticated = AuthService.isAuthenticated();

  if (requiresAuth && !isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario no está autenticado,
    // redirigir a login
    next("/login");
  } else if ((to.path === "/login" || to.path === "/register") && isAuthenticated) {
    // Si el usuario está autenticado e intenta acceder a login o register,
    // redirigir a home
    next("/");
  } else {
    // Permitir acceso
    next();
  }
});

export default router;
