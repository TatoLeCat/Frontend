import axios from "axios";
import { ref, computed } from "vue";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Estado reactivo
const token = ref(localStorage.getItem("token"));
const user = ref(
  localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
);

// Computed reactivo para autenticación
const isAuthenticated = computed(() => !!token.value);

class AuthService {
  //Inicia sesion con email y contrasena
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      // Extraer token de diferentes posibles estructuras
      // Prioridad: access_token > token > accessToken
      const token = response.data.access_token || response.data.token || response.data.accessToken;
      const user = response.data.user || response.data.userData || response.data.data?.user;

      // Si la respuesta contiene un token, lo guardamos
      if (token) {
        this.setToken(token);

        // Tambien guardamos informacion del usuario si la API la devuelve
        if (user) {
          this.setUser(user);
        }
      }

      return response.data;
    } catch (error) {
      // Mensaje de error más descriptivo
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Error desconocido en el login";

      throw {
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data,
      };
    }
  }

  // Registra un nuevo usuario
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);

      // Extraer token de diferentes posibles estructuras
      const token = response.data.token || response.data.access_token || response.data.accessToken;
      const user = response.data.user || response.data.userData || response.data.data?.user;

      // Si al registrarse tambien devuelve token, lo guardamos
      if (token) {
        this.setToken(token);
        if (user) {
          this.setUser(user);
        }
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

  // Cierra la sesion del usuario
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    token.value = null;
    user.value = null;
  }

  // Guarda el token en localStorage
  setToken(newToken) {
    localStorage.setItem("token", newToken);
    token.value = newToken;
  }

  //Obtiene el token guardado
  getToken() {
    return token.value;
  }

  // Guarda informacion del usuario
  setUser(newUser) {
    localStorage.setItem("user", JSON.stringify(newUser));
    user.value = newUser;
  }

  // Obtiene la informacion del usuario guardada
  getUser() {
    return user.value;
  }

  //Verifica si el usuario esta autenticado
  isAuthenticated() {
    return isAuthenticated.value;
  }

  // Verifica si el usuario es administrador
  isAdmin() {
    if (!user.value) return false;

    // Soporta diferentes estructuras de roles del backend:
    // Opción 1: Campo "role" con valor "admin"
    if (user.value.role === "admin") return true;

    // Opción 2: Array de roles que incluye "admin"
    if (Array.isArray(user.value.roles) && user.value.roles.includes("admin")) return true;

    // Opción 3: Campo booleano "is_admin"
    if (user.value.is_admin === true) return true;

    // Opción 4: Campo booleano "isAdmin"
    if (user.value.isAdmin === true) return true;

    return false;
  }

  // Verifica si el usuario tiene un rol específico
  hasRole(role) {
    if (!user.value) return false;

    // Verifica en campo "role"
    if (user.value.role === role) return true;

    // Verifica en array de "roles"
    if (Array.isArray(user.value.roles) && user.value.roles.includes(role)) return true;

    return false;
  }

  // Verifica si el usuario tiene alguno de los roles proporcionados
  hasAnyRole(roles) {
    return roles.some(role => this.hasRole(role));
  }

  // Verifica si el usuario tiene todos los roles proporcionados
  hasAllRoles(roles) {
    return roles.every(role => this.hasRole(role));
  }

  // Obtiene el header de autorizacion para las peticiones
  getAuthHeader() {
    if (token.value) {
      return { Authorization: `Bearer ${token.value}` };
    }
    return {};
  }
}

export default new AuthService();

// Exportar también el computed para usarlo directamente en componentes
export { isAuthenticated };
