<template>
    <transition name="fade">
      <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
        <div
          class="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in"
        >
          <div class="p-6">
            <button
              class="absolute top-2 right-2 text-gray-500 hover:text-black dark:hover:text-white"
              @click="$emit('close')"
            >
              <i class="bi bi-x-lg"></i>
            </button>
  
            <!-- Header -->
            <div class="mb-4">
              <slot name="header"></slot>
            </div>
  
            <!-- Body -->
            <div class="mb-6">
              <slot name="body"></slot>
            </div>
  
            <!-- Footer -->
            <div class="flex justify-end gap-2">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  // No additional logic needed
  </script>
  
  <style scoped>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>
  