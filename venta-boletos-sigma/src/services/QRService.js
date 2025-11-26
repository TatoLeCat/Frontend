// src/services/qrService.js
import api from "./api";

// ⚠ YA NO SE USA generarQR() — el QR lo genera el backend Payment
// export async function generarQR(payload) {
//   const response = await api.post("/qr/generate", payload);
//   return response.data;
// }

/**
 * Obtener QR ya generado por Payment
 * GET /qr/:id
 */
export async function obtenerQR(ticketId) {
  try {
    const response = await api.get(`/qr/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo QR:", error);
    throw error;
  }
}

/**
 * Validar QR en el estadio
 * POST /qr/validate
 */
export async function validarQR(payload) {
  try {
    const response = await api.post("/qr/validate", payload);
    return response.data;
  } catch (error) {
    console.error("Error validando QR:", error);
    throw error;
  }
}
