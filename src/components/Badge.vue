<script setup>
import { defineProps } from 'vue';

defineProps({
    status: String,
    bgColor: {
        type: String,
        default: 'bg-green-300 dark:bg-[#0d5a30]'
    },
    textColor: {
        type: String,
        default: 'text-green-800 dark:text-[#7bfaaf]'
    },
});
</script>

<template>
    <span 
        :class="[bgColor, textColor]" 
        class="inline-block text-center text-xs md:text-sm px-2.5 py-0.5 rounded-full"
    >
        {{ status }}
    </span>
</template>
