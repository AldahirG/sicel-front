<script setup>

const props = defineProps({
    list: {
        type: Array,
        required: true,
    },
    modelValue: String,
})

defineEmits(['update:modelValue']);

</script>

<template>
    <select
        :value="modelValue" 
        @input="$emit('update:modelValue', $event.target.value)"
        class="select select-bordered w-full"
        required
    >
        <option disabled selected>Elige una opción</option>
        <option 
            v-for="(item, index) in props.list" :key="index"
            :value="item.id"
        >
            {{ item.name }}
        </option>
    </select>
</template>