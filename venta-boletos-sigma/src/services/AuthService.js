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
      const token = response.data.token || response.data.access_token || response.data.accessToken;
      const user = response.data.user || response.data.userData || response.data.data?.user;

      // Si la respuesta contiene un token, lo guardamos
      if (token) {
        this.setToken(token);

        // Tambien puedes guardar informacion del usuario si la API la devuelve
        if (user) {
          this.setUser(user);
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Respuesta del servidor:", error.response);

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
