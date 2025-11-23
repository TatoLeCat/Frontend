import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

class AuthService {
  //Inicia sesion con email y contrasena
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      // Si la respuesta contiene un token, lo guardamos
      if (response.data.token) {
        this.setToken(response.data.token);

        // Tambien puedes guardar informacion del usuario si la API la devuelve
        if (response.data.user) {
          this.setUser(response.data.user);
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
      const response = await axios.post(`${API_URL}/register`, userData);

      // Si al registrarse tambien devuelve token, lo guardamos
      if (response.data.token) {
        this.setToken(response.data.token);
        if (response.data.user) {
          this.setUser(response.data.user);
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
  }

  // Guarda el token en localStorage
  setToken(token) {
    localStorage.setItem("token", token);
  }

  //Obtiene el token guardado
  getToken() {
    return localStorage.getItem("token");
  }

  // Guarda informacion del usuario
  setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  // Obtiene la informacion del usuario guardada
  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  //Verifica si el usuario esta autenticado
  isAuthenticated() {
    return !!this.getToken();
  }

  // Obtiene el header de autorizacion para las peticiones
  getAuthHeader() {
    const token = this.getToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }
}

export default new AuthService();
