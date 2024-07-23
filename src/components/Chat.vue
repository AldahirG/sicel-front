<script setup>

defineProps({
    position: {
        type: String,
        default: 'chat-start'
    },
    date: String,
    text: String,
    bgColor: {
        type: String,
        default: 'bg-[#2ba2ff] dark:bg-[#0d6ce8]'
    },
    textColor: {
        type: String,
        default: 'text-white'
    },
})

</script>

<template>
    <article :class="`chat ${position}`">

        <div class="chat-header mb-1">
            <time class="text-xs">
                <relative-time :datetime="date" tense="past"></relative-time>
            </time>
        </div>

        <h5 :class="`chat-bubble ${bgColor} ${textColor}`">{{ text }}</h5>
    </article>
</template>