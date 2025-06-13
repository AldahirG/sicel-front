<script setup>
import { ref, watchEffect, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const theme = ref(localStorage.getItem('theme') || 'light');
const isChecked = ref(theme.value === 'dark');
const router = useRouter();
const progress = ref(0); // Estado para la barra de progreso

const handleToggle = () => {
  isChecked.value = !isChecked.value;
  theme.value = isChecked.value ? 'dark' : 'light';
};

watchEffect(() => {
  localStorage.setItem('theme', theme.value);
  document.querySelector('html').setAttribute('data-theme', theme.value);
});

onMounted(() => {
  const duration = 3000; // 3 segundos
  const interval = 30; // Actualizar cada 30ms
  const steps = duration / interval;
  const increment = 100 / steps;

  const timer = setInterval(() => {
    progress.value += increment; // Actualizar el progreso
    if (progress.value >= 100) {
      clearInterval(timer); // Detener el intervalo
      router.push('/'); // Redirigir
    }
  }, interval);
});
</script>

<template>
    <div class="grid h-screen place-content-center bg-white px-4 dark:bg-woodsmoke-950">
        <h1 class="uppercase tracking-widest text-gray-500 dark:text-gray-400">404 | Página no encontrada.</h1>
        <!-- Contenedor centrado para la barra de progreso -->
        <div class="flex flex-col items-center mt-4">
            <div class="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    class="h-full bg-gray-500 rounded-full"
                    :style="{ width: `${progress}%` }"
                ></div>
            </div>
            <p class="text-gray-500 dark:text-gray-400 mt-2">Redirigiendo en {{ Math.ceil((100 - progress) / 33.33) }} segundos...</p>
        </div>
    </div>
</template>