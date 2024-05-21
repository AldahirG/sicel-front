<script setup>

defineProps({
    maxWidth: {
        default: "max-w-3xl"
    }
})

</script>

<template>
    <section :class="`h-fit mx-auto ${maxWidth} p-5 border border-gray-300 dark:border dark:border-primary-800 shadow-md rounded-lg dark:bg-primary-950 transition-colors duration-300 ease-out`">
        <slot />
    </section>
</template>