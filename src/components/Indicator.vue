<script setup>

defineProps({
    validation: String,
    bgColor: {
        type: String,
        default: 'bg-green-600',
    },
    textColor: {
        type: String,
        default: 'text-green-800 dark:text-green-300'
    },
    margin: {
        type: String,
        default: 'mb-0'
    }
})

</script>

<template>
    <div :class="[margin]" class="flex justify-center">
        <span
            :class="[textColor]" 
            class="flex items-center text-sm md:text-lg font-medium">
            <span
                :class="[bgColor]"
                class="flex w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0"></span>
            {{ validation }}
        </span>
    </div>
</template>