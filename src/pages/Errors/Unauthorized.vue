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

</script>

<template>
    <div class="grid h-screen place-content-center bg-white px-4 dark:bg-woodsmoke-950">
        <h1 class="uppercase tracking-widest text-gray-500 dark:text-gray-400">403 | Acceso no autorizado.</h1>
    </div>
</template>