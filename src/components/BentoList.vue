<script setup>

defineProps({
    field: String,
})

</script>

<template>
    <li>
        <span>{{ field }}: </span> <slot />
    </li>
</template>

<style>
span {
    font-weight: 600;
}
</style>