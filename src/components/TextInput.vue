<script setup>
import { onMounted, ref } from 'vue';

defineProps({
    modelValue: String,
});

defineEmits(['update:modelValue']);

const input = ref(null);

onMounted(() => {
    if (input.value.hasAttribute('autofocus')) {
        input.value.focus();
    }
});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
    <input 
        ref="input" 
        :value="modelValue" 
        @input="$emit('update:modelValue', $event.target.value)"
        class="bg-white text-black border border-gray-300  focus:border-elephant-500 focus:ring-elephant-900 rounded-xl shadow-sm py-2 px-3"
    >
</template>

<style scoped>
input::placeholder {
  text-transform: none; /* Mostrar el placeholder en minúsculas */
}

input[data-placeholder]::placeholder {
  text-transform: none; /* Evitar que el texto ingresado se muestre en minúsculas */
}
</style>