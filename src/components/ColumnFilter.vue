<template>
  <div class="relative inline-block text-left">
    <!-- Botón de apertura del filtro -->
    <button
      @click.stop="toggleDropdown"
      class="ml-1 hover:text-gray-300"
      :class="isActive ? 'text-green-500' : 'text-white'"
      title="Filtrar columna"
    >
      <i class="bi bi-funnel-fill text-xs"></i>
    </button>

    <!-- Dropdown con opciones -->
    <div
      v-if="isOpen"
      ref="dropdown"
      class="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg z-50 max-h-60 overflow-y-auto border"
    >
      <ul class="py-2 text-sm text-gray-700 px-2">
        <!-- Checkbox Seleccionar todo -->
        <li class="mb-1">
          <label class="inline-flex items-center space-x-2 px-1 w-full">
            <input
              type="checkbox"
              v-model="allSelected"
              @change="toggleSelectAll"
              class="accent-teal-600"
            />
            <span class="truncate">Seleccionar todo</span>
          </label>
        </li>

        <!-- Checkbox por opción -->
        <li
          v-for="(option, index) in sortedOptions"
          :key="index"
          class="mb-1"
        >
          <label class="inline-flex items-center space-x-2 w-full px-1">
            <input
              type="checkbox"
              :value="option"
              v-model="selectedValues"
              class="accent-teal-600"
            />
            <span class="truncate">{{ option }}</span>
          </label>
        </li>
      </ul>

      <!-- Botones de acción -->
      <div class="border-t flex justify-end gap-2 p-2">
        <button @click="apply" class="px-3 py-1 text-white bg-teal-600 hover:bg-teal-700 text-xs rounded">Aplicar</button>
        <button @click="close" class="px-3 py-1 text-xs text-gray-600 hover:text-black">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  field: String,
  leads: Array,
});

const emit = defineEmits(["filter-applied"]);
const isOpen = ref(false);
const selectedValues = ref([]);
const allSelected = ref(true);
const dropdown = ref(null);

// Utilidad para acceder a campos anidados
function getValueFromPath(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

const uniqueOptions = computed(() => {
  const values = props.leads.map((lead) => {
    const val = getValueFromPath(lead, props.field);
    return val !== undefined && val !== null && val !== "" ? val : "(Vacías)";
  });
  return [...new Set(values)];
});

const sortedOptions = computed(() =>
  uniqueOptions.value.sort((a, b) => a.localeCompare(b))
);

const isActive = computed(() => selectedValues.value.length > 0);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const close = () => {
  isOpen.value = false;
};

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedValues.value = [...sortedOptions.value];
  } else {
    selectedValues.value = [];
  }
};

const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false;
  }
};

const apply = () => {
  emit("filter-applied", { key: props.field, value: selectedValues.value });
  close();
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
input[type="checkbox"]:focus {
  outline: none;
  box-shadow: none;
}
</style>
