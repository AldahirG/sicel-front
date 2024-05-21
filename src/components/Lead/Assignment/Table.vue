<template>
    <div class="overflow-hidden rounded border border-gray-200 dark:border-gray-500 shadow-xl">
        <section class="max-h-[500px] overflow-y-auto overflow-x-auto">
            <table class="w-full border-collapse bg-white dark:bg-gray-800 text-left text-sm text-gray-500 dark:text-white">
                <thead class="bg-gray-100 dark:bg-gray-900">
                    <slot name="header" />
                </thead>
                <tbody class="divide-y">
                    <slot name="content" />
                </tbody>
            </table>
        </section>
    </div>
</template>

<style>
section {
    scrollbar-color: #7D7C7C #e7e6e6;
    scrollbar-width: thin;
}
</style>
