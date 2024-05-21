<script>
export default {
  props: {
    currentPage: Number,
    pageSize: Number,
    totalPages: Number
  },
};
</script>

<template>
    <div class="flex flex-col items-center">
        <!-- Help text -->
        <span class="text-sm text-gray-700 dark:text-gray-400">
            Página 
            <span class="font-semibold text-gray-900 dark:text-white">{{ currentPage }}</span> de
            <span class="font-semibold text-gray-900 dark:text-white">{{ totalPages }}</span>
        </span>
        <div class="inline-flex mt-2 xs:mt-0">
            <slot />
        </div>
    </div>
</template>