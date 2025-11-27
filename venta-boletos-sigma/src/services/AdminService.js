import axios from "axios";

const TICKET_API_BASE_URL = import.meta.env.VITE_TICKET_API_URL || "http://localhost:8000";

const AdminService = {
  // ============================================
  // GESTIÓN DE TICKETS
  // ============================================

  /**
   * Obtener un ticket por ID
   */
  async getTicketById(ticketId) {
    try {
      const response = await axios.get(
        `${TICKET_API_BASE_URL}/api/tickets/${ticketId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error obteniendo ticket:", error);
      throw error;
    }
  },

  /**
   * Obtener tickets de un usuario específico
   */
  async getTicketsByUser(userId) {
    try {
      const response = await axios.get(
        `${TICKET_API_BASE_URL}/api/tickets/user/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error obteniendo tickets del usuario:", error);
      throw error;
    }
  },

  /**
   * Obtener tickets por estado
   */
  async getTicketsByStatus(status) {
    try {
      const response = await axios.get(
        `${TICKET_API_BASE_URL}/api/tickets/status/${status}`
      );
      return response.data;
    } catch (error) {
      console.error("Error obteniendo tickets por estado:", error);
      throw error;
    }
  },

  /**
   * Cambiar estado de un ticket
   * @param {number} ticketId - ID del ticket
   * @param {string} status - Nuevo estado (available, onhold, paid, isused)
   * @param {string} actor - Identificador de quién realiza el cambio
   */
  async updateTicketStatus(ticketId, status, actor) {
    try {
      const response = await axios.patch(
        `${TICKET_API_BASE_URL}/api/tickets/${ticketId}/status`,
        {
          status: status,
          actor: actor,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error actualizando estado del ticket:", error);
      throw error;
    }
  },

  /**
   * Validar QR de un ticket
   */
  async validateTicketQR(ticketId, qrPayload, signature) {
    try {
      const response = await axios.post(
        `${TICKET_API_BASE_URL}/api/tickets/${ticketId}/validate-qr`,
        {
          qr_payload: qrPayload,
          signature: signature,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error validando QR del ticket:", error);
      throw error;
    }
  },

  /**
   * Obtener historial de auditoría de un ticket específico
   */
  async getTicketAuditLogs(ticketId) {
    try {
      const response = await axios.get(
        `${TICKET_API_BASE_URL}/api/tickets/${ticketId}/audit-logs`
      );
      return response.data;
    } catch (error) {
      console.error("Error obteniendo logs de auditoría del ticket:", error);
      throw error;
    }
  },

  // ============================================
  // ADMINISTRACIÓN - LOGS DE AUDITORÍA
  // ============================================

  /**
   * Obtener logs de auditoría recientes
   * @param {number} limit - Número máximo de logs a obtener
   * @param {string} entity - Filtrar por entidad (opcional: 'ticket')
   */
  async getAuditLogs(limit = 50, entity = null) {
    try {
      let url = `${TICKET_API_BASE_URL}/api/admin/audit-logs?limit=${limit}`;
      if (entity) {
        url += `&entity=${entity}`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error obteniendo logs de auditoría:", error);
      throw error;
    }
  },

  /**
   * Crear un nuevo ticket (solo admin)
   */
  async createTicket(ticketData) {
    try {
      const response = await axios.post(
        `${TICKET_API_BASE_URL}/api/tickets/`,
        ticketData
      );
      return response.data;
    } catch (error) {
      console.error("Error creando ticket:", error);
      throw error;
    }
  },
};

export default AdminService;
