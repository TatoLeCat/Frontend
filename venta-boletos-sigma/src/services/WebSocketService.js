class WebSocketService {
  constructor() {
    this.ws = null;
    this.url = import.meta.env.VITE_WS_URL || "ws://localhost:8000/api/admin/ws";
    this.reconnectInterval = 5000; // 5 segundos
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.listeners = new Map();
    this.isIntentionallyClosed = false;
  }

  /**
   * Conectar al WebSocket
   */
  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log("WebSocket ya está conectado");
      return;
    }

    this.isIntentionallyClosed = false;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket conectado exitosamente");
        this.reconnectAttempts = 0;
        this.notifyListeners("connected", { connected: true });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Mensaje recibido del WebSocket:", data);
          this.notifyListeners("message", data);

          // Notificar específicamente según el tipo de evento
          if (data.event_type) {
            this.notifyListeners(data.event_type, data);
          }
        } catch (error) {
          console.error("Error parseando mensaje del WebSocket:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("Error en WebSocket:", error);
        this.notifyListeners("error", { error });
      };

      this.ws.onclose = () => {
        console.log("WebSocket cerrado");
        this.notifyListeners("disconnected", { connected: false });

        if (!this.isIntentionallyClosed) {
          this.attemptReconnect();
        }
      };
    } catch (error) {
      console.error("Error creando conexión WebSocket:", error);
    }
  }

  /**
   * Intentar reconectar
   */
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Intentando reconectar... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error("Máximo número de intentos de reconexión alcanzado");
      this.notifyListeners("maxReconnectAttemptsReached", {
        attempts: this.reconnectAttempts,
      });
    }
  }

  /**
   * Desconectar el WebSocket
   */
  disconnect() {
    this.isIntentionallyClosed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Enviar mensaje al servidor
   */
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      if (typeof message === "object") {
        this.ws.send(JSON.stringify(message));
      } else {
        this.ws.send(message);
      }
    } else {
      console.error("WebSocket no está conectado");
    }
  }

  /**
   * Enviar ping para mantener la conexión viva
   */
  sendPing() {
    this.send("ping");
  }

  /**
   * Registrar un listener para eventos
   * @param {string} event - Nombre del evento
   * @param {Function} callback - Función callback
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Eliminar un listener
   * @param {string} event - Nombre del evento
   * @param {Function} callback - Función callback a eliminar
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Notificar a todos los listeners de un evento
   */
  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        callback(data);
      });
    }
  }

  /**
   * Verificar si está conectado
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Exportar una instancia singleton
const websocketService = new WebSocketService();
export default websocketService;
