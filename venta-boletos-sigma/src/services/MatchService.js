//CE
// src/services/MatchService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default {
  async getFinishedMatches() {
    const response = await axios.get(`${API_URL}/matches?status=finished`);
    return response.data;
  },
  async saveResult(matchId, resultA, resultB) {
    try {
      const response = await axios.put(`${API_URL}/matches/${matchId}/result`, {
        teamAResult: resultA,
        teamBResult: resultB,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error al guardar el resultado.");
    }
  },
};
