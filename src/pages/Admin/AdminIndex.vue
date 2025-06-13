<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { createSwapy } from "swapy";
import dashboardService from "../../services/dashboard.service";
import ChartComponent from "../../components/ChartComponent.vue";

const swapyInstance = ref(null);
const container = ref(null);
const isDarkMode = ref(localStorage.getItem("darkMode") === "true");

// Función para alternar el modo oscuro y guardarlo en localStorage
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("darkMode", isDarkMode.value);
};

// Datos de las gráficas
const totalByStatus = ref([]);
const totalByCycle = ref([]);
const totalByCountry = ref([]);
const totalByState = ref([]);
const totalByCity = ref([]);
const totalByGrade = ref([]);
const totalBySemester = ref([]);
const totalByScholarship = ref([]);
const totalBySchoolType = ref([]);
const totalByContactMedium = ref([]);

// Totales visibles
const totalVisibleStatus = ref(0);
const totalVisibleCycle = ref(0);
const totalVisibleCountry = ref(0);
const totalVisibleState = ref(0);
const totalVisibleCity = ref(0);
const totalVisibleGrade = ref(0);
const totalVisibleSemester = ref(0);
const totalVisibleScholarship = ref(0);
const totalVisibleSchoolType = ref(0);
const totalVisibleContactMedium = ref(0);

// Obtener los datos del dashboard
const fetchDashboardData = async () => {
  try {
    const [
      status,
      cycle,
      country,
      state,
      city,
      grade,
      semester,
      scholarship,
      schoolType,
      contactMedium,
    ] = await Promise.all([
      dashboardService.getTotalByStatus(),
      dashboardService.getTotalByCycle(),
      dashboardService.getTotalByCountry(),
      dashboardService.getTotalByState(),
      dashboardService.getTotalByCity(),
      dashboardService.getTotalByGrade(),
      dashboardService.getTotalBySemester(),
      dashboardService.getTotalByScholarship(),
      dashboardService.getTotalBySchoolType(),
      dashboardService.getTotalByContactMedium(),
    ]);

    totalByStatus.value = status?.data?.data || [];
    totalByCycle.value = cycle?.data?.data || [];
    totalByCountry.value = country?.data?.data || [];
    totalByState.value = state?.data?.data || [];
    totalByCity.value = city?.data?.data || [];
    totalByGrade.value = grade?.data?.data || [];
    totalBySemester.value = semester?.data?.data || [];
    totalByScholarship.value = scholarship?.data?.data || [];
    totalBySchoolType.value = schoolType?.data?.data || [];
    totalByContactMedium.value = contactMedium?.data?.data || [];

    updateAllTotals(); // Actualizar los totales después de cargar los datos

    await nextTick();
    initSwapy();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

// Inicializar Swapy
const initSwapy = () => {
  if (swapyInstance.value) {
    swapyInstance.value.destroy();
  }

  if (container.value) {
    swapyInstance.value = createSwapy(container.value, {
      animation: "dynamic",
    });

    swapyInstance.value.onSwap((event) => {
      console.log("Swapy updated:", event.newSlotItemMap.asArray);
    });
  }
};

// Función para actualizar el total visible cuando se oculta/muestra una categoría en la gráfica
const updateTotal = (chartData, totalRef) => {
  totalRef.value = chartData.datasets[0].data.reduce((sum, value) => sum + value, 0);
};

// Computed para los datos de las gráficas
const chartDataStatus = computed(() => ({
  labels: totalByStatus.value.map(item => item.status),
  datasets: [{ data: totalByStatus.value.map(item => Math.round(item.total)) }]
}));

const chartDataCycle = computed(() => ({
  labels: totalByCycle.value.map(item => item.cycle),
  datasets: [{ data: totalByCycle.value.map(item => Math.round(item.total)) }]
}));

const chartDataCountry = computed(() => ({
  labels: totalByCountry.value.map(item => item.country),
  datasets: [{ data: totalByCountry.value.map(item => Math.round(item.total)) }]
}));

const chartDataState = computed(() => ({
  labels: totalByState.value.map(item => item.state),
  datasets: [{ data: totalByState.value.map(item => Math.round(item.total)) }]
}));

const chartDataCity = computed(() => ({
  labels: totalByCity.value.map(item => item.city),
  datasets: [{ data: totalByCity.value.map(item => Math.round(item.total)) }]
}));

const chartDataGrade = computed(() => ({
  labels: totalByGrade.value.map(item => item.grade),
  datasets: [{ data: totalByGrade.value.map(item => Math.round(item.total)) }]
}));

const chartDataSemester = computed(() => ({
  labels: totalBySemester.value.map(item => item.semester),
  datasets: [{ data: totalBySemester.value.map(item => Math.round(item.total)) }]
}));

const chartDataScholarship = computed(() => ({
  labels: totalByScholarship.value.map(item => item.scholarship),
  datasets: [{ data: totalByScholarship.value.map(item => Math.round(item.total)) }]
}));

const chartDataSchoolType = computed(() => ({
  labels: totalBySchoolType.value.map(item => item.typeSchool),
  datasets: [{ data: totalBySchoolType.value.map(item => Math.round(item.total)) }]
}));

const chartDataContactMedium = computed(() => ({
  labels: totalByContactMedium.value.map(item => item.contactMedium),
  datasets: [{ data: totalByContactMedium.value.map(item => Math.round(item.total)) }]
}));

// Función para actualizar todos los totales después de cargar los datos
const updateAllTotals = () => {
  updateTotal(chartDataStatus.value, totalVisibleStatus);
  updateTotal(chartDataCycle.value, totalVisibleCycle);
  updateTotal(chartDataCountry.value, totalVisibleCountry);
  updateTotal(chartDataState.value, totalVisibleState);
  updateTotal(chartDataCity.value, totalVisibleCity);
  updateTotal(chartDataGrade.value, totalVisibleGrade);
  updateTotal(chartDataSemester.value, totalVisibleSemester);
  updateTotal(chartDataScholarship.value, totalVisibleScholarship);
  updateTotal(chartDataSchoolType.value, totalVisibleSchoolType);
  updateTotal(chartDataContactMedium.value, totalVisibleContactMedium);
};

// Observar cambios en el modo oscuro y actualizar las gráficas
watch(isDarkMode, () => {
  console.log("Modo oscuro activado:", isDarkMode.value);
});

// Ejecutar `fetchDashboardData()` en `onMounted`
onMounted(async () => {
  await fetchDashboardData();
});

onUnmounted(() => {
  swapyInstance.value?.destroy();
});
</script>

<template>
  <div :class="['dashboard', { dark: isDarkMode }]">
    <div class="dark-mode-toggle">
      <button @click="toggleDarkMode">
        {{ isDarkMode ? "🌙 Modo Claro" : "🌑 Modo Oscuro" }}
      </button>
    </div>

    <h1 class="text-2xl font-bold mb-6 text-center">Dashboard Admin</h1>

    <!-- Contenedor principal del grid con Swapy -->
    <div ref="container" class="grid">
      <!-- Primera fila: 3 columnas -->
      <div v-if="chartDataStatus.labels.length" data-swapy-slot="status" :class="['chart-container', { dark: isDarkMode }]">
        <div data-swapy-item="status">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Status</h2>
          <ChartComponent :chartData="chartDataStatus" chartType="bar" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2">Total: {{ totalVisibleStatus }}</p>
        </div>
      </div>

      <div v-if="chartDataCycle.labels.length" data-swapy-slot="cycle" :class="['chart-container', { dark: isDarkMode }]">
        <div data-swapy-item="cycle">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Ciclo</h2>
          <ChartComponent :chartData="chartDataCycle" chartType="pie" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2">Total: {{ totalVisibleCycle }}</p>
        </div>
      </div>

      <div v-if="chartDataCountry.labels.length" data-swapy-slot="country" :class="['chart-container', { dark: isDarkMode }]">
        <div data-swapy-item="country">
          <h2 class="text-lg font-semibold text-center mb-2">Total por País</h2>
          <ChartComponent :chartData="chartDataCountry" chartType="bar" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2">Total: {{ totalVisibleCountry }}</p>
        </div>
      </div>

      <!-- Segunda fila: 2 columnas -->
      <div v-if="chartDataState.labels.length" data-swapy-slot="state" :class="['chart-container chart-wide', { dark: isDarkMode }]">
        <div data-swapy-item="state">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Estado</h2>
          <ChartComponent :chartData="chartDataState" chartType="line" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2">Total: {{ totalVisibleState }}</p>
        </div>
      </div>

      <div v-if="chartDataSemester.labels.length" data-swapy-slot="semester" :class="['chart-container', { dark: isDarkMode }]">
        <div data-swapy-item="semester">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Semestre</h2>
          <ChartComponent :chartData="chartDataSemester" chartType="line" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2">Total: {{ totalVisibleSemester }}</p>
        </div>
      </div>

      <!-- Tercera fila: "Medio de Contacto" y "Tipo de Escuela" -->
      <div v-if="chartDataContactMedium.labels.length" data-swapy-slot="contactMedium" :class="['chart-container chart-wide', { dark: isDarkMode }]">
        <div data-swapy-item="contactMedium">
          <h2 class="text-lg font-semibold text-center mb-2">Medio de Contacto</h2>
          <ChartComponent :chartData="chartDataContactMedium" chartType="bar" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2">Total: {{ totalVisibleContactMedium }}</p>
        </div>
      </div>

      <div v-if="chartDataSchoolType.labels.length" data-swapy-slot="schoolType" :class="['chart-container', { dark: isDarkMode }]">
        <div data-swapy-item="schoolType">
          <h2 class="text-lg font-semibold text-center mb-2">Tipo de Escuela</h2>
          <ChartComponent :chartData="chartDataSchoolType" chartType="doughnut" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2">Total: {{ totalVisibleSchoolType }}</p>
        </div>
      </div>

      <!-- Última fila: 2 columnas -->
      <div v-if="chartDataGrade.labels.length" data-swapy-slot="grade" :class="['chart-container', { dark: isDarkMode }]">
        <div data-swapy-item="grade">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Grado</h2>
          <ChartComponent :chartData="chartDataGrade" chartType="pie" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2">Total: {{ totalVisibleGrade }}</p>
        </div>
      </div>

      <div v-if="chartDataScholarship.labels.length" data-swapy-slot="scholarship" :class="['chart-container chart-wide', { dark: isDarkMode }]">
        <div data-swapy-item="scholarship">
          <h2 class="text-lg font-semibold text-center mb-2">Becas Ofertadas</h2>
          <ChartComponent :chartData="chartDataScholarship" chartType="bar" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2">Total: {{ totalVisibleScholarship }}</p>
        </div>
      </div>

      <!-- Gráfica alargada al final -->
      <div v-if="chartDataCity.labels.length" data-swapy-slot="city" :class="['chart-container chart-alargada', { dark: isDarkMode }]">
        <div data-swapy-item="city">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Ciudad</h2>
          <ChartComponent :chartData="chartDataCity" chartType="bar" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2">Total: {{ totalVisibleCity }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal */
.dashboard {
  padding: 20px;
  background-color: #f5f5f5;
  color: #333;
  transition: background-color 0.3s, color 0.3s;
}

/* Modo oscuro */
.dashboard.dark {
  background-color: #1e293b;
  color: #f1f5f9;
}

/* Botón de Modo Oscuro */
.dark-mode-toggle {
  display: flex;
  justify-content: right; /* Centra el botón */
  margin-bottom: 15px;
}

.dark-mode-toggle button {
  background-color: #ffffff;
  color: #333;
  border: 1px solid #ccc;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s, box-shadow 0.2s;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dark-mode-toggle button:hover {
  background-color: #e5e7eb;
}

/* Modo oscuro para el botón */
.dashboard.dark .dark-mode-toggle button {
  background-color: #374151;
  color: #ffffff;
  border: 1px solid #4b5563;
}

.dashboard.dark .dark-mode-toggle button:hover {
  background-color: #475569;
}

/* Grid de gráficos */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* Contenedor de cada gráfica */
.chart-container {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.2s ease;
}

/* Estilos de Swapy para resaltar el gráfico seleccionado */
.chart-container[data-swapy-highlighted] {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Cursor de agarre para arrastrar */
.chart-container[data-swapy-item] {
  cursor: grab;
}

/* Modo oscuro para cada gráfica */
.dashboard.dark .chart-container {
  background: #2d3748;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
}

/* Gráficas que ocupan dos columnas */
.chart-wide {
  grid-column: span 2;
  min-height: 300px;
}

/* Gráfica que ocupa una fila completa */
.chart-alargada {
  grid-column: span 3;
  min-height: 400px;
}

/* Ajustes responsivos */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-alargada {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .chart-wide,
  .chart-alargada {
    grid-column: span 1;
  }
}
</style>
