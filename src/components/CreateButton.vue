<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps({
    label:  String,
    name: String,
    width: {
        type: String,
        default: 'w-40'
    }
})

</script>

<template>
    <RouterLink
        :to="{ name: name }"
        :class="`rounded-lg relative ${width} h-10 cursor-pointer flex items-center border border-green-500 bg-green-500 group hover:bg-green-500 active:bg-green-500 active:border-green-500`"
    >
        <span
            class="text-gray-200 font-semibold ml-6 transform group-hover:translate-x-10 group-hover:opacity-0 transition-all duration-300 ease-in-out text-xs">
            Crear {{ label }}
        </span>

        <span
            class="absolute right-0 h-full w-10 rounded-lg bg-green-500 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300">
            <i class="bi bi-plus-lg text-white"></i>
        </span>
    </RouterLink>
</template>