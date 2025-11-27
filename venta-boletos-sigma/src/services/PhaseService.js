//CE
// src/services/PhaseService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVICIO_3 || "http://localhost:8060";

export default {
  /**
   * Obtiene todas las fases del torneo ordenadas por orden
   */
  async getPhases() {
    try {
      const response = await axios.get(`${API_URL}/phases`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al obtener las fases."
      );
    }
  },

  /**
   * Obtiene todos los partidos de una fase específica
   * @param {number} phaseId - ID de la fase
   */
  async getPhaseMatches(phaseId) {
    try {
      const response = await axios.get(`${API_URL}/phases/${phaseId}/matches`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al obtener los partidos de la fase."
      );
    }
  },

  /**
   * Avanza los ganadores de una fase a la siguiente (para fases eliminatorias)
   * @param {number} phaseId - ID de la fase actual
   * @param {number} stadiumId - ID del estadio para los nuevos partidos
   * @param {string} kickoffBase - Fecha/hora base para los partidos (ISO 8601)
   */
  async advanceWinners(phaseId, stadiumId, kickoffBase) {
    try {
      const response = await axios.post(
        `${API_URL}/phases/${phaseId}/advance-winners?stadium_id=${stadiumId}&kickoff_base=${kickoffBase}`
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const detail = error.response.data?.detail || "";
        if (detail.includes("No next phase")) {
          throw new Error("No hay siguiente fase. Esta es la fase final.");
        }
        if (detail.includes("No finished matches")) {
          throw new Error("No hay partidos finalizados en esta fase.");
        }
        if (detail.includes("odd number")) {
          throw new Error("Número impar de ganadores. Verifica los resultados.");
        }
        throw new Error(detail);
      }
      throw new Error(
        error.response?.data?.detail || "Error al avanzar los ganadores."
      );
    }
  },

  /**
   * Avanza equipos clasificados desde Fase de Grupos a Octavos de Final
   * @param {number} groupPhaseId - ID de la Fase de Grupos
   * @param {number} stadiumId - ID del estadio para los partidos de Octavos
   * @param {string} kickoffBase - Fecha/hora base para los partidos (ISO 8601)
   * @param {Array<number>} qualifiedTeamIds - Lista de IDs de equipos clasificados (debe ser par)
   */
  async advanceFromGroups(groupPhaseId, stadiumId, kickoffBase, qualifiedTeamIds) {
    try {
      const response = await axios.post(
        `${API_URL}/phases/${groupPhaseId}/advance-from-groups?stadium_id=${stadiumId}&kickoff_base=${kickoffBase}`,
        { qualified_team_ids: qualifiedTeamIds }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new Error("Fase o equipos no encontrados.");
      }
      if (error.response && error.response.status === 400) {
        const detail = error.response.data?.detail || "";
        if (detail.includes("odd number")) {
          throw new Error("Debe haber un número par de equipos clasificados.");
        }
        throw new Error(detail);
      }
      throw new Error(
        error.response?.data?.detail || "Error al avanzar equipos desde fase de grupos."
      );
    }
  },

  /**
   * Obtiene la tabla de posiciones para la Fase de Grupos
   * @param {number} phaseId - ID de la fase
   * @param {string} group - Nombre del grupo (opcional, ej: "A", "B")
   */
  async getStandings(phaseId, group = null) {
    try {
      const url = group
        ? `${API_URL}/phases/${phaseId}/standings?group=${group}`
        : `${API_URL}/phases/${phaseId}/standings`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Error al obtener la tabla de posiciones."
      );
    }
  },
};
