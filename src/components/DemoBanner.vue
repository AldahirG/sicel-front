<script setup>
import { ref } from 'vue'
const dismissed = ref(false)
</script>

<template>
  <Transition name="slide-down">
    <div
      v-if="!dismissed"
      class="demo-banner"
    >
      <div class="demo-banner__content">
        <span class="demo-banner__icon">⚠️</span>
        <span class="demo-banner__text">
          <strong>Modo Demo</strong> — Diseño no definitivo. Información simulada. No representa datos reales.
        </span>
      </div>
      <button class="demo-banner__close" @click="dismissed = true" title="Cerrar">✕</button>
    </div>
  </Transition>
</template>

<style scoped>
.demo-banner {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  background: #1e3a5f;
  color: #e2eaf5;
  border-radius: 9999px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
  font-size: 0.8rem;
  white-space: nowrap;
  max-width: calc(100vw - 2rem);
  overflow: hidden;
}

.demo-banner__content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.demo-banner__icon {
  flex-shrink: 0;
}

.demo-banner__text {
  overflow: hidden;
  text-overflow: ellipsis;
}

.demo-banner__close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #93b4d4;
  cursor: pointer;
  font-size: 0.75rem;
  line-height: 1;
  padding: 0 0.25rem;
}

.demo-banner__close:hover {
  color: #fff;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(1rem);
}
</style>
