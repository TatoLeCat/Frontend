//CE
// src/services/TeamService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVICIO_3 || "http://localhost:8060";

export default {
  async createTeam(team) {
    try {
      const response = await axios.post(`${API_URL}/teams`, team);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error("El equipo ya existe.");
      }
      throw new Error(
        error.response?.data?.detail || "Error al registrar el equipo."
      );
    }
  },
  async getTeams() {
    try {
      const response = await axios.get(`${API_URL}/teams`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al obtener los equipos."
      );
    }
  },
};
