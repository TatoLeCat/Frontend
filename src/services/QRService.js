import api from "./api";

export async function generarQR(payload) {
  try {
    const response = await api.post("/qr/generate", payload);
    return response.data;
  } catch (error) {
    console.error("Error generando QR:", error);
    throw error;
  }
}

export async function obtenerQR(idBoleto) {
  try {
    const response = await api.get(`/qr/${idBoleto}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo QR:", error);
    throw error;
  }
}

export async function validarQR(qrBase64) {
  try {
    const response = await api.post("/qr/validate", {
      qr_base64: qrBase64,
    });

    return response.data; // { valid: true/false, message: "..." }
  } catch (error) {
    console.error("Error validando QR:", error);
    throw error;
  }
}