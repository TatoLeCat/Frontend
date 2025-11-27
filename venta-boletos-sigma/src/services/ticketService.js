import api from "./api";

export async function createTicket(seatId) {
  try {
    const res = await api.post("/tickets/create", {
      user_id: 1,
      seat_id: seatId
    });

    console.log("RESPUESTA TICKET:", res.data);

    // Detecta automáticamente dónde viene el ID
    if (res.data.ticket_id) return res.data.ticket_id;
    if (res.data.id) return res.data.id;
    if (res.data.ticket?.id) return res.data.ticket.id;

    return null;

  } catch (error) {
    console.error("Error creando ticket:", error);
    return null;
  }
}
