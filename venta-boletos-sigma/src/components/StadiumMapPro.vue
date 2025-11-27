<template>
  <div class="stadium-map-container">
    <!-- Controles -->
    <div class="controls">
      <button @click="zoomIn">+</button>
      <button @click="zoomOut">-</button>
      <button @click="resetView">Reset</button>
    </div>

    <!-- Leyenda -->
    <div class="legend">
      <div v-for="tier in tierColors" :key="tier.id" class="legend-item">
        <span class="legend-color" :style="{ background: tier.color }"></span>
        <span>{{ tier.label }}</span>
      </div>
    </div>

    <!-- Lienzo del estadio -->
    <div
      class="stadium-canvas"
      ref="canvas"
      @mousedown="startPan"
      @mousemove="pan"
      @mouseup="endPan"
      @mouseleave="endPan"
      @wheel.prevent="onScrollZoom"
    >
      <div
        class="seat"
        v-for="seat in seats"
        :key="seat.id"
        :style="seatPosition(seat)"
        @click.stop="selectSeat(seat)"
        @mouseenter="hoverSeat = seat"
        @mouseleave="hoverSeat = null"
        :class="{ selected: selectedSeats.has(seat.id) }"
      ></div>

      <!-- Tooltip -->
      <div
        v-if="hoverSeat"
        class="tooltip"
        :style="{ top: hoverY + 'px', left: hoverX + 'px' }"
      >
        <p><strong>Fila:</strong> {{ hoverSeat.row }}</p>
        <p><strong>Asiento:</strong> {{ hoverSeat.seat_number }}</p>
        <p><strong>Precio:</strong> L. {{ hoverSeat.price || 100 }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  seats: Array,
  selectedSeats: Object, // Set
  tiers: Array, // price tier info
});

const emit = defineEmits(["select"]);

// Parámetros visuales
const scale = ref(4);
const offsetX = ref(0);
const offsetY = ref(0);
let isPanning = false;
let startX = 0;
let startY = 0;

const hoverSeat = ref(null);
const hoverX = ref(0);
const hoverY = ref(0);

// Colores por tier
const tierColors = [
  { id: 1, label: "VIP Ultra", color: "#ff006e" },
  { id: 2, label: "VIP Premium", color: "#ffbe0b" },
  { id: 3, label: "Preferencial", color: "#3a86ff" },
  { id: 4, label: "General", color: "#8338ec" },
  { id: 5, label: "Económica", color: "#06d6a0" },
];

// Función para seleccionar
const selectSeat = (seat) => {
  emit("select", seat);
};

// Posición visual
const seatPosition = (seat) => {
  const color = tierColors.find((t) => t.id === seat.price_tier_id)?.color;

  return {
    left: seat.x * scale.value + offsetX.value + "px",
    top: seat.y * scale.value + offsetY.value + "px",
    background: color || "#555",
  };
};

// Pan / movimiento
const canvas = ref(null);

const startPan = (e) => {
  isPanning = true;
  startX = e.clientX - offsetX.value;
  startY = e.clientY - offsetY.value;
};

const pan = (e) => {
  if (!isPanning) return;
  offsetX.value = e.clientX - startX;
  offsetY.value = e.clientY - startY;

  // tooltip follow
  hoverX.value = e.offsetX + 20;
  hoverY.value = e.offsetY + 20;
};

const endPan = () => {
  isPanning = false;
};

// Zoom con scroll
const onScrollZoom = (e) => {
  if (e.deltaY < 0) scale.value += 0.3;
  else if (scale.value > 1) scale.value -= 0.3;
};

// Botones
const zoomIn = () => (scale.value += 0.3);
const zoomOut = () => (scale.value = Math.max(1, scale.value - 0.3));
const resetView = () => {
  scale.value = 4;
  offsetX.value = 0;
  offsetY.value = 0;
};
</script>

<style scoped>
.stadium-map-container {
  position: relative;
  width: 100%;
  height: 650px;
}

.stadium-canvas {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #e7e7e7;
  border-radius: 16px;
  cursor: grab;
}

.seat {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  position: absolute;
  cursor: pointer;
  transition: 0.15s;
}

.seat:hover {
  transform: scale(1.4);
}

.seat.selected {
  border: 2px solid #00ff95;
  transform: scale(1.3);
}

.controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.controls button {
  padding: 6px 10px;
  background: #1e1e1e;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  border: none;
}

.legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: white;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.2);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.legend-color {
  width: 14px;
  height: 14px;
  border-radius: 4px;
}

.tooltip {
  position: absolute;
  background: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  pointer-events: none;
  transform: translate(-50%, -120%);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
</style>
