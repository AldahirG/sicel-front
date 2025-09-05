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
      class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 max-h-96 overflow-y-auto border"
    >
      <!-- Agrupado solo para fecha -->
      <ul v-if="isDateField" class="py-2 text-sm text-gray-700 px-2">
        <li class="mb-1">
          <label class="inline-flex items-center space-x-2 px-1 w-full">
            <input type="checkbox" v-model="allSelected" @change="toggleSelectAll" class="accent-teal-600" />
            <span class="truncate font-semibold uppercase">Seleccionar todo</span>
          </label>
        </li>

        <template v-for="(months, year) in groupedDateOptions" :key="year">
          <li>
            <details open class="ml-1">
              <summary class="cursor-pointer font-bold">
                <label class="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    :checked="isYearSelected(year)"
                    @change="toggleYear(year)"
                    class="accent-teal-600"
                  />
                  <span>{{ year }}</span>
                </label>
              </summary>

              <ul class="ml-4">
                <li v-for="(days, month) in months" :key="month">
                  <details open>
                    <summary class="cursor-pointer capitalize">
                      <label class="inline-flex items-center space-x-2">
                        <input
                          type="checkbox"
                          :checked="isMonthSelected(year, month)"
                          @change="toggleMonth(year, month)"
                          class="accent-teal-600"
                        />
                        <span>{{ month }}</span>
                      </label>
                    </summary>
                    <ul class="ml-4">
                      <li v-for="day in Array.from(days).sort()" :key="day">
                        <label class="inline-flex items-center space-x-2 w-full px-1">
                          <input
                            type="checkbox"
                            :value="day"
                            v-model="selectedValues"
                            class="accent-teal-600"
                          />
                          <span class="truncate">{{ day }}</span>
                        </label>
                      </li>
                    </ul>
                  </details>
                </li>
              </ul>
            </details>
          </li>
        </template>
      </ul>

      <!-- Para campos normales -->
      <ul v-else class="py-2 text-sm text-gray-700 px-2 max-h-60 overflow-y-auto">
        <li class="mb-1">
          <label class="inline-flex items-center space-x-2 px-1 w-full">
            <input
              type="checkbox"
              v-model="allSelected"
              @change="toggleSelectAll"
              class="accent-teal-600"
            />
            <span class="truncate font-semibold uppercase">Seleccionar todo</span>
          </label>
        </li>

        <li v-for="(option, index) in sortedOptions" :key="index" class="mb-1">
          <label class="inline-flex items-center space-x-2 w-full px-1">
            <input type="checkbox" :value="option" v-model="selectedValues" class="accent-teal-600" />
            <span class="truncate">{{ option }}</span>
          </label>
        </li>
      </ul>

      <!-- Botones de acción -->
      <div class="border-t flex justify-end gap-2 p-2">
        <button @click="apply" class="px-3 py-1 text-white bg-teal-600 hover:bg-teal-700 text-xs rounded">
          Aplicar
        </button>
        <button @click="close" class="px-3 py-1 text-xs text-gray-600 hover:text-black">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useFilterStore } from "../store/Admin/filter.store";


const filterStore = useFilterStore();


const props = defineProps({
  field: String,
  leads: Array,
  externalOptions: Boolean,
});

const emit = defineEmits(["filter-applied"]);
const isOpen = ref(false);
const selectedValues = ref([]);
const allSelected = ref(true);
const dropdown = ref(null);

const isDateField = computed(() => props.field === "dateContact");

// Utilidad para acceder a campos anidados
function getValueFromPath(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

const formatDate = (iso) => {
  if (!iso) return "(Vacías)";
  const date = new Date(iso);
  if (isNaN(date)) return iso;
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const groupedDateOptions = computed(() => {
  if (!isDateField.value) return {};

  const groups = {};
  for (const lead of props.leads) {
    const rawDate = getValueFromPath(lead, props.field);
    if (!rawDate) continue;
    const date = new Date(rawDate);
    if (isNaN(date)) continue;

    const year = date.getFullYear();
    const month = date.toLocaleString("es-MX", { month: "long" });
    const day = date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    if (!groups[year]) groups[year] = {};
    if (!groups[year][month]) groups[year][month] = new Set();
    groups[year][month].add(day);
  }
  return groups;
});

// Opciones reales a usar según la fuente
const resolvedOptions = computed(() => {
  if (props.externalOptions && filterStore.options[props.field]) {
    return filterStore.options[props.field].map(opt => opt.label ?? opt); // ← usa label si viene de objeto
  }
  return [...new Set(
    props.leads.map((lead) => {
      const val = getValueFromPath(lead, props.field);
      return val !== undefined && val !== null && val !== "" ? val : "(Vacías)";
    })
  )];
});

const sortedOptions = computed(() =>
  resolvedOptions.value.sort((a, b) => a.localeCompare(b))
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
    if (isDateField.value) {
      selectedValues.value = [];
      for (const year of Object.keys(groupedDateOptions.value)) {
        for (const month of Object.keys(groupedDateOptions.value[year])) {
          selectedValues.value.push(...Array.from(groupedDateOptions.value[year][month]));
        }
      }
    } else {
      selectedValues.value = [...sortedOptions.value];
    }
  } else {
    selectedValues.value = [];
  }
};

// Agrupación lógica
const isYearSelected = (year) => {
  const months = groupedDateOptions.value[year];
  return Object.values(months).every((days) =>
    Array.from(days).every((d) => selectedValues.value.includes(d))
  );
};

const isMonthSelected = (year, month) => {
  const days = groupedDateOptions.value[year][month];
  return Array.from(days).every((d) => selectedValues.value.includes(d));
};

const toggleYear = (year) => {
  const months = groupedDateOptions.value[year];
  let allDays = [];
  for (const month of Object.keys(months)) {
    allDays.push(...Array.from(months[month]));
  }

  const allIncluded = allDays.every((d) => selectedValues.value.includes(d));
  if (allIncluded) {
    selectedValues.value = selectedValues.value.filter((d) => !allDays.includes(d));
  } else {
    selectedValues.value = [...new Set([...selectedValues.value, ...allDays])];
  }
};

const toggleMonth = (year, month) => {
  const days = Array.from(groupedDateOptions.value[year][month]);
  const allIncluded = days.every((d) => selectedValues.value.includes(d));

  if (allIncluded) {
    selectedValues.value = selectedValues.value.filter((d) => !days.includes(d));
  } else {
    selectedValues.value = [...new Set([...selectedValues.value, ...days])];
  }
};

const apply = () => {
  emit("filter-applied", { key: props.field, value: selectedValues.value });
  close();
};

const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  toggleSelectAll(); // Inicializa con todos seleccionados si `allSelected` lo está
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
