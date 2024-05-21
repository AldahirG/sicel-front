<script setup>
defineProps({
    type: {
        type: String,
        default: 'submit',
    },
    styles: {
        type: String,
        default: 'py-2 px-4 text-white dark:text-black bg-green-500 rounded-md duration-200'
    },
    label: {
        type: String,
        default: 'Guardar',
    }
});
</script>

<template>
    <button 
        :type="type"
        @click="$emit('click')"
        :class="`${styles}`"
    >
        {{ label }}
    </button>
</template>