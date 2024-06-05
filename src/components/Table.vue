<template>
    <div class="relative overflow-x-auto pb-6">
        <table class="w-full text-sm text-left text-gray-500 overflow-hidden">
            <thead class="text-xs text-white capitalize bg-sky-800">
                <slot name="header" />
            </thead>
            <tbody class="border-x text-black dark:text-white"> 
                <slot name="content" />
            </tbody>
        </table>
    </div>
</template>

<style>
div {
    scrollbar-color: #51829B #9BB0C1;
    scrollbar-width: thin;
}
</style>