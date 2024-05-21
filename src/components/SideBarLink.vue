<script setup>
import { computed } from 'vue';

const props = defineProps({
    to: String,
    active: Boolean,
});

const classes = computed(() => {
    return props.active
        ? 'bg-[#334155] text-green-500 border-r-green-500 border-r-[5px]'
        : 'bg-primary-960 text-white';
});
</script>

<template>
    <router-link :to="to" :class="classes">
        <slot />
    </router-link>
</template>