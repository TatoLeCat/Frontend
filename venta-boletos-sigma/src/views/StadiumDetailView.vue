<template>
  <div class="stadium-detail-view">
    <div class="container">
      <!-- Loading State -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando información del estadio...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="loadStadium" class="btn-retry">Reintentar</button>
        <button @click="goBack" class="btn-back">Volver</button>
      </div>

      <!-- Stadium Detail Content -->
      <div v-else-if="stadium" class="stadium-detail">
        <!-- Back Button -->
        <button @click="goBack" class="btn-back-top">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 18l-8-8 8-8 1.4 1.4L5.8 9H18v2H5.8l5.6 5.6z"/>
          </svg>
          Volver a Estadios
        </button>

        <!-- Stadium Header -->
        <div class="stadium-header">
          <div class="stadium-image-large">
            <img 
              :src="stadium.image_url || getDefaultImage()" 
              :alt="stadium.name"
              @error="handleImageError"
            >
          </div>

          <div class="stadium-main-info">
            <h1>{{ stadium.name }}</h1>
            
            <div class="info-grid">
              <!-- Dirección -->
              <div class="info-item">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div>
                  <p class="info-label">Dirección</p>
                  <p class="info-value">{{ stadium.address }}</p>
                </div>
              </div>

              <!-- Capacidad -->
              <div class="info-item">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <div>
                  <p class="info-label">Capacidad Total</p>
                  <p class="info-value">{{ formatCapacity(stadium.capacity) }} personas</p>
                </div>
              </div>

              <!-- Zona Horaria -->
              <div class="info-item">
                <div class="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </div>
                <div>
                  <p class="info-label">Zona Horaria</p>
                  <p class="info-value">{{ stadium.tz }}</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button @click="openMap" class="btn-primary">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 0C6.13 0 3 3.13 3 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S8.62 4.5 10 4.5s2.5 1.12 2.5 2.5S11.38 9.5 10 9.5z"/>
                </svg>
                Ver en Google Maps
              </button>
              
              <button @click="selectStadium" class="btn-secondary">
                Ver Eventos Disponibles
              </button>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="additional-info">
          <h2>Información Adicional</h2>
          <div class="info-cards">
            <div class="info-card">
              <h3>Servicios</h3>
              <ul>
                <li>Estacionamiento disponible</li>
                <li>Acceso para personas con discapacidad</li>
                <li>Puntos de venta de alimentos</li>
                <li>Servicios sanitarios</li>
              </ul>
            </div>

            <div class="info-card">
              <h3>Ubicación</h3>
              <div class="map-placeholder">
                <iframe
                  v-if="stadium.google_maps_url"
                  width="100%"
                  height="300"
                  frameborder="0"
                  style="border:0; border-radius: 8px;"
                  :src="getEmbedMapUrl()"
                  allowfullscreen
                ></iframe>
                <div v-else class="map-placeholder-text">
                  <p>Mapa no disponible</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StadiumDetailView',

  data() {
    return {
      stadium: null,
      loading: false,
      error: null
    }
  },

  mounted() {
    this.loadStadium()
  },

  methods: {
    async loadStadium() {
      this.loading = true
      this.error = null

      try {
        const stadiumId = this.$route.params.id

        // Datos mock para pruebas
        // TODO: Reemplazar con llamada real al API
        await this.simulateDelay(600)

        // Mock data basado en el ID
        const mockStadiums = {
          1: {
            id: 1,
            name: 'Estadio Nacional',
            address: 'Av. Principal 123, Tegucigalpa',
            capacity: 35000,
            tz: 'America/Tegucigalpa',
            google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Av.+Principal+123,+Tegucigalpa',
            image_url: null
          },
          2: {
            id: 2,
            name: 'Estadio Olímpico',
            address: 'Boulevard del Norte, San Pedro Sula',
            capacity: 40000,
            tz: 'America/Tegucigalpa',
            google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Boulevard+del+Norte,+San+Pedro+Sula',
            image_url: null
          },
          3: {
            id: 3,
            name: 'Estadio Morazán',
            address: 'Colonia Palmira, Tegucigalpa',
            capacity: 25000,
            tz: 'America/Tegucigalpa',
            google_maps_url: 'https://www.google.com/maps/search/?api=1&query=Colonia+Palmira,+Tegucigalpa',
            image_url: null
          }
        }

        this.stadium = mockStadiums[stadiumId] || null

        if (!this.stadium) {
          throw new Error('Estadio no encontrado')
        }

        /* Código para cuando se conecte al backend:
        const response = await fetch(`/api/v1/stadiums/${stadiumId}`)
        if (!response.ok) throw new Error('Estadio no encontrado')
        this.stadium = await response.json()
        */
      } catch (err) {
        this.error = err.message || 'Error al cargar el estadio'
        console.error('Error loading stadium:', err)
      } finally {
        this.loading = false
      }
    },

    openMap() {
      if (this.stadium?.google_maps_url) {
        window.open(this.stadium.google_maps_url, '_blank')
      }
    },

    selectStadium() {
      // Navegar a la vista de eventos o selección de asientos
      this.$router.push({ 
        name: 'TicketOffers', 
        params: { stadiumId: this.stadium.id } 
      })
    },

    goBack() {
      this.$router.push({ name: 'StadiumList' })
    },

    formatCapacity(capacity) {
      return capacity.toLocaleString()
    },

    getDefaultImage() {
      return 'https://via.placeholder.com/800x400/3b82f6/ffffff?text=Estadio'
    },

    handleImageError(event) {
      event.target.src = this.getDefaultImage()
    },

    getEmbedMapUrl() {
      if (!this.stadium?.address) return ''
      const encodedAddress = encodeURIComponent(this.stadium.address)
      return `https://www.google.com/maps?q=${encodedAddress}&output=embed`
    },

    simulateDelay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  }
}
</script>

<style scoped>
.stadium-detail-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading {
  text-align: center;
  padding: 4rem 0;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  background: white;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: #dc2626;
}

.btn-retry,
.btn-back {
  margin: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

.btn-retry {
  background: #dc2626;
  color: white;
}

.btn-back {
  background: #6b7280;
  color: white;
}

.btn-back-top {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.2s;
}

.btn-back-top:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.stadium-detail {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.stadium-header {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
  padding: 2rem;
}

.stadium-image-large {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  background: #e5e7eb;
}

.stadium-image-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stadium-main-info h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.info-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #10b981;
  color: white;
}

.btn-secondary:hover {
  background: #059669;
}

.additional-info {
  padding: 2rem;
  border-top: 1px solid #e5e7eb;
}

.additional-info h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.info-card {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 12px;
}

.info-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-card li {
  padding: 0.5rem 0;
  color: #4b5563;
  display: flex;
  align-items: center;
}

.info-card li:before {
  content: "✓";
  display: inline-block;
  margin-right: 0.5rem;
  color: #10b981;
  font-weight: bold;
}

.map-placeholder {
  width: 100%;
  height: 300px;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.map-placeholder-text {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
}

@media (max-width: 968px) {
  .stadium-header {
    grid-template-columns: 1fr;
  }

  .stadium-main-info h1 {
    font-size: 2rem;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>