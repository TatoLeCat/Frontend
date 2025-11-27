<template>
  <div class="stadium-list-view">
    <div class="container">

      <!-- Header -->
      <div class="header">
        <h1>Estadios Disponibles</h1>
        <p class="subtitle">Selecciona un estadio para ver los partidos</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando estadios...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="loadStadiums" class="btn-retry">Reintentar</button>
      </div>

      <!-- Stadiums Grid -->
      <div v-else class="stadium-grid">
        <div
          v-for="stadium in stadiums"
          :key="stadium.id"
          class="stadium-card"
          @click="goToMatchesForStadium(stadium.id)"
        >
          <div class="stadium-image">
            <img
              :src="stadium.image_url || getDefaultImage()"
              :alt="stadium.name"
              @error="handleImageError"
            />
            <div class="stadium-capacity-badge">
              <span>{{ formatCapacity(stadium.capacity) }}</span>
            </div>
          </div>

          <div class="stadium-info">
            <h3>{{ stadium.name }}</h3>

            <div class="stadium-location">
              <i class="pi pi-map-marker"></i>
              <span>{{ stadium.city ?? 'Sin ubicación' }}</span>
            </div>

            <div class="stadium-actions">
              <button class="btn-map" @click.stop="openMap(stadium)">
                Ver Mapa
              </button>

              <button
                class="btn-details"
                @click.stop="goToStadiumDetail(stadium.id)"
              >
                Ver Detalles
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-if="!loading && !error && stadiums.length === 0"
        class="empty-state"
      >
        <h3>No hay estadios registrados</h3>
        <p>Vuelve más tarde para ver actualizaciones</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "StadiumListView",

  data() {
    return {
      stadiums: [],
      loading: false,
      error: null,
      API_BASE: "http://localhost:8090",
    };
  },

  mounted() {
    this.loadStadiums();
  },

  methods: {
    /** === Cargar estadios reales desde tu backend === */
    async loadStadiums() {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch(`${this.API_BASE}/stadium/`);

        if (!res.ok) throw new Error("Error al cargar estadios");

        this.stadiums = await res.json();
      } catch (err) {
        console.error(err);
        this.error = "No se pudieron cargar los estadios.";
      } finally {
        this.loading = false;
      }
    },

    /** === Ir a partidos filtrados por estadio (opcional pero cool) === */
    goToMatchesForStadium(stadiumId) {
      this.$router.push({
        name: "MatchesByStadium",
        params: { stadiumId },
      });
    },

    /** === Ir a detalle del estadio === */
    goToStadiumDetail(stadiumId) {
      this.$router.push({
        name: "StadiumDetail",
        params: { id: stadiumId },
      });
    },

    /** === Google Maps === */
    openMap(stadium) {
      const address = stadium.city || stadium.name;
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`;
      window.open(url, "_blank");
    },

    /** === Utils === */
    getDefaultImage() {
      return "https://via.placeholder.com/400x250?text=Estadio";
    },

    handleImageError(e) {
      e.target.src = this.getDefaultImage();
    },

    formatCapacity(cap) {
      return cap ? `${cap.toLocaleString()} personas` : "Capacidad desconocida";
    },
  },
};
</script>

<style scoped>
/* (Se conservan tus estilos originales, omitidos aquí por espacio) */
</style>
