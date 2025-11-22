// src/services/paymentService.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_PAYMENT_URL ?? "http://localhost:8000";

/**
 * @typedef {Object} PaymentRequestDto
 * @property {number} ticket_id
 * @property {number} user_id
 * @property {number} amount
 * @property {string} currency
 * @property {string} payment_token
 */

/**
 * @typedef {Object} PaymentResponseDto
 * @property {number} transaction_id
 * @property {"Pagado"|"Rechazado"} status
 * @property {string} message
 * @property {string | null} qr_payload
 * @property {string} created_at
 */

/**
 * @param {PaymentRequestDto} payload
 * @returns {Promise<PaymentResponseDto>}
 */
export async function processPayment(payload) {
  const response = await axios.post(`${API_BASE_URL}/payments`, payload);
  return response.data;
}
