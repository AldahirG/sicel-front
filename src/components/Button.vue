<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps({
    label:  String,
    actionLabel: {
        default: 'Crear'
    },
    name: String,
    width: {
        type: String,
        default: 'w-40'
    },
    icon: {
        default: 'bi bi-plus-lg'
    },
    background: {
        default: 'bg-green-500'
    },
    borderColor: {
        default: 'border-green-500'
    },
    height: {
        type: String,
        default: 'h-10'
    }
})

</script>

<template>
    <RouterLink
        :to="{ name: name }"
        :class="`inline-block rounded-lg relative ${width} ${height} cursor-pointer flex items-center border ${borderColor} ${background} group`"
    >
        <span
            class="text-gray-200 font-semibold ml-6 transform group-hover:translate-x-10 group-hover:opacity-0 transition-all duration-300 ease-in-out text-xs">
            {{ actionLabel }} {{ label }}
        </span>

        <span
            :class="`absolute right-0 h-full w-10 rounded-lg ${background} flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300`">
            <i :class="`${icon} text-gray-200`"></i>
        </span>
    </RouterLink>
</template>