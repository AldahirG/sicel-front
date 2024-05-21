<script setup>

defineProps({
    colSpan: {
        type: String,
        default: 'col-span-5'
    }
})

</script>

<template>
    <div 
        :class="[colSpan]"
        class="
            p-6
            relative rounded-xl shadow-md
            overflow-hidden
            bg-fiord-50 border border-gray-200 dark:border-gray-800 dark:bg-elephant-900
            text-black dark:text-white text-lg"
        >
        <slot />
    </div>
</template>