<script setup>
const emit = defineEmits(['search']);

defineProps({
    text: String
})

const search = (e) => {
    const searchTerm = e.target.value;
    emit('search', searchTerm);
};
</script>

<template>
    <form class="max-w-md w-full">
        <label class="text-sm text-gray-900 dark:text-white">{{ text }}</label>
        <div>
            <input 
                type="search" 
                placeholder="Ingresa un nombre" 
                @input="search"
                class="block w-full p-4 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-sky-800 focus:border-sky-800 rounded-lg">
        </div>
    </form>
</template>
