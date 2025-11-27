import api from "./api";

export async function createTicket(seatId) {
  try {
    const res = await api.post("/tickets/create", {
      user_id: 1,
      seat_id: seatId
    });

    return res.data.ticket_id;  // ⬅ IMPORTANTE
  } catch (error) {
    console.error("Error creando ticket:", error);
    return null;
  }
}
