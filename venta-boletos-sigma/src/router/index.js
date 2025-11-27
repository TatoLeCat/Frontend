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
import AdminDashboard from "@/views/AdminDashboard.vue";
import AdminTicketManager from "@/views/AdminTicketManager.vue";
import AdminAuditLogs from "@/views/AdminAuditLogs.vue";
import EligibilityCriteriaDashboard from "@/views/EligibilityCriteriaDashboard.vue";
import RaffleAdmin from "@/views/RaffleAdmin.vue";
import TicketStatusView from "@/views/TicketStatusView.vue";

// Torneo - Fases y Equipos
import TournamentPhasesView from "@/views/TournamentPhasesView.vue";
import PhaseDetailView from "@/views/PhaseDetailView.vue";

//CE
// Registrar equipos y resultados
import MatchResultView from "@/views/MatchResultView.vue";
import TeamRegisterView from "@/views/TeamRegisterView.vue";
import MatchRegisterView from "@/views/MatchRegisterView.vue";
import PhaseManagementView from "@/views/PhaseManagementView.vue";
import StandingsView from "@/views/StandingsView.vue";


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
      path: "/admin",
      name: "AdminDashboard",
      component: AdminDashboard,
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/tickets",
      name: "AdminTicketManager",
      component: AdminTicketManager,
      meta: { requiresAdmin: true },
    },
    {
      path: "/admin/audit-logs",
      name: "AdminAuditLogs",
      component: AdminAuditLogs,
      meta: { requiresAdmin: true },
    },
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

    // CE ===== RUTAS PARA GESTIÓN DE TORNEO =====
    // Registrar Equipos
    {
      path: "/admin/register-team",
      name: "RegisterTeam",
      component: TeamRegisterView,
      meta: { requiresAdmin: true },
    },
    // Registrar Partidos
    {
      path: "/admin/register-match",
      name: "RegisterMatch",
      component: MatchRegisterView,
      meta: { requiresAdmin: true },
    },
    // Registrar Resultados
    {
      path: "/admin/match-results",
      name: "MatchResults",
      component: MatchResultView,
      meta: { requiresAdmin: true },
    },
    // Gestión de Fases
    {
      path: "/admin/phase-management",
      name: "PhaseManagement",
      component: PhaseManagementView,
      meta: { requiresAdmin: true },
    },
    // Tabla de Posiciones (Admin)
    {
      path: "/admin/standings",
      name: "AdminStandings",
      component: StandingsView,
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
    // Tabla de Posiciones (Público)
    {
      path: "/tabla-posiciones",
      name: "Standings",
      component: StandingsView,
    },
    {
      path: '/ticketsStatusControl',
      name: 'TicketsStatusControl',
      component: TicketStatusView,
    },

    {
      path: "/seleccionar-asiento/:matchId",
      name: "SelectSeats",
      component: () => import("@/views/SeleccionAsiento.vue"),
      props: true
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

  // Verificar si la ruta requiere permisos de admin
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

  // 1. Si la ruta requiere autenticación y el usuario no está autenticado
  if (requiresAuth && !isAuthenticated) {
    next("/login");
    return;
  }

  // 2. Si el usuario está autenticado e intenta acceder a login o register
  if ((to.path === "/login" || to.path === "/register") && isAuthenticated) {
    next("/");
    return;
  }

  // 3. Si la ruta requiere permisos de admin
  if (requiresAdmin) {
    const isAdmin = AuthService.isAdmin();

    if (!isAdmin) {
      // Usuario no es admin, redirigir al home con mensaje de error
      console.warn("Acceso denegado: Se requieren permisos de administrador");
      next("/");
      return;
    }
  }

  // 4. Permitir acceso
  next();
});

export default router;
