<script setup>
import { ref, watchEffect } from 'vue';

const theme = ref(localStorage.getItem('theme') || 'light');
const isChecked = ref(theme.value === 'dark');

const handleToggle = () => {
  isChecked.value = !isChecked.value;
  theme.value = isChecked.value ? 'dark' : 'light';
};

watchEffect(() => {
  localStorage.setItem('theme', theme.value);
  document.querySelector('html').setAttribute('data-theme', theme.value);
});

const clearAndGoHome = () => {
  // Limpiar almacenamiento
  localStorage.clear();
  sessionStorage.clear();

  // Limpiar cookies
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  // Redirigir
  window.location.href = "/";
};
</script>

<template>
  <div class="grid h-screen place-content-center bg-white px-4 dark:bg-woodsmoke-950 text-center space-y-4">
    <h1 class="uppercase tracking-widest text-gray-500 dark:text-gray-400">
      403 | Acceso no autorizado.
    </h1>

    <button
      @click="clearAndGoHome"
      class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Volver al inicio
    </button>
  </div>
</template>
