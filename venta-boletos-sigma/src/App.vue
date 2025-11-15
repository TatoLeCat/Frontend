<script setup>
import { RouterView } from "vue-router";
import Toast from "primevue/toast";
</script>

<template>
  <div>
    <Toast />
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
