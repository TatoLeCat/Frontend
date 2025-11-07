import LoginView from '@/views/LoginView.vue'
import SeleccionAsiento from '@/views/SeleccionAsiento.vue'
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
  
      path: '/seleccionAsiento',
  name: 'seleccionAsisnto',
  component: SeleccionAsiento,
  },
    
    {
  
      path: '/login',
  name: 'login',
  component: LoginView,
  },
    
  ],
})

export default router
