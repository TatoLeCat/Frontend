    <template>
  <div class="stadium-list-view">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <h1>Estadios Disponibles</h1>
        <p class="subtitle">Selecciona un estadio para ver eventos disponibles</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando estadios...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="loadStadiums" class="btn-retry">Reintentar</button>
      </div>

      <!-- Stadium Grid -->
      <div v-else class="stadium-grid">
        <div 
          v-for="stadium in stadiums" 
          :key="stadium.id"
          class="stadium-card"
          @click="goToStadiumDetail(stadium.id)"
        >
          <div class="stadium-image">
            <img 
              :src="stadium.image_url || getDefaultImage()" 
              :alt="stadium.name"
              @error="handleImageError"
            >
            <div class="stadium-capacity-badge">
              <span>{{ formatCapacity(stadium.capacity) }}</span>
            </div>
          </div>
          
          <div class="stadium-info">
            <h3>{{ stadium.name }}</h3>
            <div class="stadium-location">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a5 5 0 0 0-5 5c0 3.5 5 11 5 11s5-7.5 5-11a5 5 0 0 0-5-5zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
              <span>{{ stadium.address }}</span>
            </div>
            <div class="stadium-actions">
              <button 
                class="btn-map" 
                @click.stop="openMap(stadium)"
                title="Ver en Google Maps"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M0 0h16v16H0z" fill="none"/>
                  <path d="M8 0L0 8l8 8 8-8-8-8zm0 14.5L1.5 8 8 1.5 14.5 8 8 14.5z"/>
                </svg>
                Ver Mapa
              </button>
              <button class="btn-details">Ver Detalles</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && !error && stadiums.length === 0" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="currentColor" stroke-width="2"/>
          <path d="M20 32h24M32 20v24" stroke="currentColor" stroke-width="2"/>
        </svg>
        <h3>No hay estadios disponibles</h3>
        <p>Vuelve más tarde para ver nuevos estadios</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StadiumListView',
  
  data() {
    return {
      stadiums: [],
      loading: false,
      error: null
    }
  },

  mounted() {
    this.loadStadiums()
  },

  methods: {
    async loadStadiums() {
      this.loading = true
      this.error = null

      try {
        // Datos mock para pruebas
        // TODO: Reemplazar con llamada real al API
        await this.simulateDelay(800)
        
        this.stadiums = [
          {
            id: 1,
            name: 'Estadio Nacional',
            address: 'Av. Principal 123, Tegucigalpa',
            capacity: 35000,
            tz: 'America/Tegucigalpa',
            image_url: null
          },
          {
            id: 2,
            name: 'Estadio Olímpico',
            address: 'Boulevard del Norte, San Pedro Sula',
            capacity: 40000,
            tz: 'America/Tegucigalpa',
            image_url: null
          },
          {
            id: 3,
            name: 'Estadio Morazán',
            address: 'Colonia Palmira, Tegucigalpa',
            capacity: 25000,
            tz: 'America/Tegucigalpa',
            image_url: null
          }
        ]

        /* Código para cuando se conecte al backend:
        const response = await fetch('/api/v1/stadiums/')
        if (!response.ok) throw new Error('Error al cargar estadios')
        this.stadiums = await response.json()
        */
      } catch (err) {
        this.error = 'Error al cargar los estadios. Por favor, intenta de nuevo.'
        console.error('Error loading stadiums:', err)
      } finally {
        this.loading = false
      }
    },

    goToStadiumDetail(stadiumId) {
      this.$router.push({ name: 'StadiumDetail', params: { id: stadiumId } })
    },

    openMap(stadium) {
      // Generar URL de Google Maps
      const encodedAddress = encodeURIComponent(stadium.address)
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
      window.open(mapsUrl, '_blank')
    },

    formatCapacity(capacity) {
      return `${capacity.toLocaleString()} personas`
    },

    getDefaultImage() {
      return 'https://via.placeholder.com/400x250/3b82f6/ffffff?text=Estadio'
    },

    handleImageError(event) {
      event.target.src = this.getDefaultImage()
    },

    simulateDelay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  }
}
</script>

<style scoped>
.stadium-list-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
}

.loading {
  text-align: center;
  padding: 4rem 0;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: #c33;
}

.btn-retry {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: #c33;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-retry:hover {
  background: #a22;
}

.stadium-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.stadium-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stadium-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.stadium-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #e5e7eb;
}

.stadium-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stadium-capacity-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.stadium-info {
  padding: 1.5rem;
}

.stadium-info h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.stadium-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.stadium-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-map,
.btn-details {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-map {
  background: #f3f4f6;
  color: #374151;
}

.btn-map:hover {
  background: #e5e7eb;
}

.btn-details {
  background: #3b82f6;
  color: white;
}

.btn-details:hover {
  background: #2563eb;
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: white;
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .stadium-grid {
    grid-template-columns: 1fr;
  }

  .header h1 {
    font-size: 2rem;
  }
}
</style>