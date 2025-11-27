//CE
// src/services/MatchService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVICIO_3 || "http://localhost:8060";

export default {
  /**
   * Obtiene todos los partidos, opcionalmente filtrados por fase
   * @param {number} phaseId - ID de la fase (opcional)
   */
  async getAllMatches(phaseId = null) {
    try {
      const url = phaseId
        ? `${API_URL}/matches?phase_id=${phaseId}`
        : `${API_URL}/matches`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al obtener los partidos."
      );
    }
  },

  /**
   * Obtiene un partido específico por ID
   * @param {number} matchId - ID del partido
   */
  async getMatch(matchId) {
    try {
      const response = await axios.get(`${API_URL}/matches/${matchId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al obtener el partido."
      );
    }
  },

  /**
   * Crea un nuevo partido
   * @param {Object} matchData - Datos del partido
   * @param {number} matchData.stadium_id - ID del estadio
   * @param {number} matchData.home_team_id - ID del equipo local
   * @param {number} matchData.away_team_id - ID del equipo visitante
   * @param {number} matchData.phase_id - ID de la fase
   * @param {string} matchData.kickoff_at - Fecha y hora del partido (ISO 8601)
   * @param {string} matchData.group_name - Nombre del grupo (opcional, solo para Fase de Grupos)
   */
  async createMatch(matchData) {
    try {
      const response = await axios.post(`${API_URL}/matches`, matchData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error("Equipo o estadio no encontrado.");
      }
      throw new Error(
        error.response?.data?.detail || "Error al crear el partido."
      );
    }
  },

  /**
   * Registra el resultado de un partido
   * @param {number} matchId - ID del partido
   * @param {number} homeGoals - Goles del equipo local
   * @param {number} awayGoals - Goles del equipo visitante
   */
  async saveResult(matchId, homeGoals, awayGoals) {
    try {
      const response = await axios.post(`${API_URL}/matches/${matchId}/result`, {
        home_goals: homeGoals,
        away_goals: awayGoals,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error("El resultado ya ha sido registrado.");
      }
      if (error.response && error.response.status === 404) {
        throw new Error("Partido no encontrado.");
      }
      throw new Error(
        error.response?.data?.detail || "Error al guardar el resultado."
      );
    }
  },

  /**
   * Obtiene solo los partidos finalizados
   */
  async getFinishedMatches() {
    try {
      const response = await axios.get(`${API_URL}/matches`);
      return response.data.filter(match => match.is_finished);
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al obtener los partidos finalizados."
      );
    }
  },

  /**
   * Obtiene solo los partidos pendientes (no finalizados)
   */
  async getPendingMatches() {
    try {
      const response = await axios.get(`${API_URL}/matches`);
      return response.data.filter(match => !match.is_finished);
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al obtener los partidos pendientes."
      );
    }
  },
};
