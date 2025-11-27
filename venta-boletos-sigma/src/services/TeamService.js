//CE
// src/services/TeamService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default {
  async createTeam(team) {
    try {
      const response = await axios.post(`${API_URL}/teams`, team);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        throw new Error("El equipo ya existe.");
      }
      throw new Error(error.response?.data?.message || "Error al registrar el equipo.");
    }
  },
  async getTeams() {
    const response = await axios.get(`${API_URL}/teams`);
    return response.data;
  },
};
