<template>
  <tr :class="customClass">
    <slot />
  </tr>
</template>

<script setup>
defineProps({
  customClass: {
    type: [String, Array, Object],
    default: '',
  },
});
</script>
