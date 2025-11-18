import { createRouter, createWebHistory } from 'vue-router'

// Importación de vistas
import CheckoutView from '../views/CheckoutView.vue'
import TicketDetailView from '../views/TicketDetailView.vue'
import TicketOffersView from '../views/TicketOffersView.vue'
import StadiumListView from '../views/StadiumListView.vue'
import StadiumDetailView from '../views/StadiumDetailView.vue'

// Configuración de rutas
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    }
  ],
})

export default router
