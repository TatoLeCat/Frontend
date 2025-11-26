// src/services/paymentService.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_PAYMENT_URL || "http://localhost:8090";
/**
 * @typedef {Object} TicketPaymentDto
 * @property {number} ticket_id
 * @property {number} amount
 */

/**
 * @typedef {Object} PaymentRequestDto
 * @property {TicketPaymentDto[]} tickets
 * @property {number} user_id
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
 * @property {number} total               
 * @property {string} comprador           
 * @property {Array<Object>} detalle_tickets  
 */

/**
 * @param {PaymentRequestDto} payload
 * @returns {Promise<PaymentResponseDto>}
 */
export async function processPayment(payload) {
  const response = await axios.post(`${API_BASE_URL}/payment`, payload);
  return response.data;
}
