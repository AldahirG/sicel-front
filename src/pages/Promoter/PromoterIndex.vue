<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { createSwapy } from "swapy";
import dashboardService from "../../services/dashboard.service";
import ChartComponent from "../../components/ChartComponent.vue";

// Swapy y Dark Mode
const swapyInstance = ref(null);
const container = ref(null);
const isDarkMode = ref(localStorage.getItem("darkMode") === "true");

// Alternar modo oscuro y almacenarlo
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("darkMode", isDarkMode.value);
};

// Datos de las gráficas
const totalByStatus = ref([]);
const totalByFollowUp = ref([]);
const totalByCycle = ref([]);
const totalByCity = ref([]);
const totalByProgram = ref([]);
const totalByCampaign = ref([]);
const totalBySchoolType = ref([]);
const totalBySemester = ref([]);
const totalByScholarship = ref([]);
const totalByContactMedium = ref([]);

// Totales visibles
const calculateTotal = (data) => data.reduce((sum, item) => sum + (item.total || 0), 0);

const totalVisibleStatus = computed(() => calculateTotal(totalByStatus.value));
const totalVisibleFollowUp = computed(() => calculateTotal(totalByFollowUp.value));
const totalVisibleCycle = computed(() => calculateTotal(totalByCycle.value));
const totalVisibleCity = computed(() => calculateTotal(totalByCity.value));
const totalVisibleProgram = computed(() => calculateTotal(totalByProgram.value));
const totalVisibleCampaign = computed(() => calculateTotal(totalByCampaign.value));
const totalVisibleSchoolType = computed(() => calculateTotal(totalBySchoolType.value));
const totalVisibleSemester = computed(() => calculateTotal(totalBySemester.value));
const totalVisibleScholarship = computed(() => calculateTotal(totalByScholarship.value));
const totalVisibleContactMedium = computed(() => calculateTotal(totalByContactMedium.value));

// **Evitar errores asegurando que `labels` siempre sea un array válido**
const chartDataStatus = computed(() => ({
  labels: totalByStatus.value.length ? totalByStatus.value.map(item => item.status || "Desconocido") : [],
  datasets: [{ data: totalByStatus.value.length ? totalByStatus.value.map(item => item.total || 0) : [] }]
}));

const chartDataFollowUp = computed(() => ({
  labels: totalByFollowUp.value.length ? totalByFollowUp.value.map(item => item.followUp || "Desconocido") : [],
  datasets: [{ data: totalByFollowUp.value.length ? totalByFollowUp.value.map(item => item.total || 0) : [] }]
}));

const chartDataCycle = computed(() => ({
  labels: totalByCycle.value.length ? totalByCycle.value.map(item => item.ciclo || "Desconocido") : [],
  datasets: [{ data: totalByCycle.value.length ? totalByCycle.value.map(item => item.total || 0) : [] }]
}));

const chartDataCity = computed(() => ({
  labels: totalByCity.value.length ? totalByCity.value.map(item => item.ciudad || "Desconocido") : [],
  datasets: [{ data: totalByCity.value.length ? totalByCity.value.map(item => item.total || 0) : [] }]
}));

const chartDataProgram = computed(() => ({
  labels: totalByProgram.value.length ? totalByProgram.value.map(item => item.programa || "Desconocido") : [],
  datasets: [{ data: totalByProgram.value.length ? totalByProgram.value.map(item => item.total || 0) : [] }]
}));

const chartDataCampaign = computed(() => ({
  labels: totalByCampaign.value.length ? totalByCampaign.value.map(item => item.campaña || "Desconocido") : [],
  datasets: [{ data: totalByCampaign.value.length ? totalByCampaign.value.map(item => item.total || 0) : [] }]
}));

const chartDataSemester = computed(() => ({
  labels: totalBySemester.value.length ? totalBySemester.value.map(item => item.semestre || "Desconocido") : [],
  datasets: [{ data: totalBySemester.value.length ? totalBySemester.value.map(item => item.total || 0) : [] }]
}));

const chartDataScholarship = computed(() => ({
  labels: totalByScholarship.value.length ? totalByScholarship.value.map(item => item.scholarship || "Desconocido") : [],
  datasets: [{ data: totalByScholarship.value.length ? totalByScholarship.value.map(item => item.total || 0) : [] }]
}));

const chartDataContactMedium = computed(() => ({
  labels: totalByContactMedium.value.length ? totalByContactMedium.value.map(item => item.medio_contacto || "Desconocido") : [],
  datasets: [{ data: totalByContactMedium.value.length ? totalByContactMedium.value.map(item => item.total || 0) : [] }]
}));

// **Obtener los datos del promotor**
const fetchPromoterData = async () => {
  try {
    const [
      status,
      followUp,
      cycle,
      city,
      program,
      campaign,
      schoolType,
      semester,
      scholarship,
      contactMedium,
    ] = await Promise.all([
      dashboardService.getTotalByStatusForPromoter(),
      dashboardService.getTotalByFollowUpForPromoter(),
      dashboardService.getTotalByCycleForPromoter(),
      dashboardService.getTotalByCityForPromoter(),
      dashboardService.getTotalByProgramForPromoter(),
      dashboardService.getTotalByCampaignForPromoter(),
      dashboardService.getTotalBySchoolTypeForPromoter(),
      dashboardService.getTotalBySemesterForPromoter(),
      dashboardService.getTotalByScholarshipForPromoter(),
      dashboardService.getTotalByContactMediumForPromoter(),
    ]);

    totalByStatus.value = status?.data?.data || [];
    totalByFollowUp.value = followUp?.data?.data || [];
    totalByCycle.value = cycle?.data?.data || [];
    totalByCity.value = city?.data?.data || [];
    totalByProgram.value = program?.data?.data || [];
    totalByCampaign.value = campaign?.data?.data || [];
    totalBySchoolType.value = schoolType?.data?.data || [];
    totalBySemester.value = semester?.data?.data || [];
    totalByScholarship.value = scholarship?.data?.data || [];
    totalByContactMedium.value = contactMedium?.data?.data || [];

    await nextTick();
    initSwapy();
  } catch (error) {
    console.error("Error fetching promoter data:", error.message || error);
  }
};

// **Inicializar Swapy**
const initSwapy = () => {
  if (swapyInstance.value) {
    swapyInstance.value.destroy();
  }

  if (container.value) {
    swapyInstance.value = createSwapy(container.value, {
      animation: "dynamic",
    });

    swapyInstance.value.onSwap((event) => {
    });
  }
};

// **Observar cambios en modo oscuro y actualizar las gráficas**
watch(isDarkMode, () => {
});

// **Ejecutar `fetchPromoterData()` en `onMounted`**
onMounted(async () => {
  await fetchPromoterData();
});
</script>

<template>
  <div :class="['dashboard', { dark: isDarkMode }]">
    <!-- Botón para cambiar el modo oscuro -->
    <div class="dark-mode-toggle">
      <button @click="toggleDarkMode">
        {{ isDarkMode ? "🌙 Modo Claro" : "🌑 Modo Oscuro" }}
      </button>
    </div>

    <h1 class="text-2xl font-bold mb-6 text-center">Dashboard Promotor</h1>

    <!-- Contenedor principal del grid con Swapy -->
    <div ref="container" class="grid grid-cols-7 grid-rows-8 gap-4">
      <!-- Primera fila: Status, Ciclo y Ciudad -->
      <div v-if="chartDataStatus.labels.length" data-swapy-slot="status" class="chart-container col-span-2 row-span-2">
        <div data-swapy-item="status">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Status</h2>
          <ChartComponent :chartData="chartDataStatus" chartType="bar" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2 font-semibold">Total: {{ totalVisibleStatus }}</p>
        </div>
      </div>

      
      <div v-if="chartDataFollowUp.labels.length" data-swapy-slot="followUp" class="chart-container col-span-3 row-span-2">
        <div data-swapy-item="followUp">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Seguimiento</h2>
          <ChartComponent :chartData="chartDataFollowUp" chartType="doughnut" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2 font-semibold">Total: {{ totalVisibleFollowUp }}</p>
        </div>
      </div>

      <div v-if="chartDataCycle.labels.length" data-swapy-slot="cycle" class="chart-container col-span-2 row-span-2">
        <div data-swapy-item="cycle">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Ciclo</h2>
          <ChartComponent :chartData="chartDataCycle" chartType="pie" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2 font-semibold">Total: {{ totalVisibleCycle }}</p>
        </div>
      </div>

      <div v-if="chartDataCity.labels.length" data-swapy-slot="city" class="chart-container col-span-3 row-span-2">
        <div data-swapy-item="city">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Ciudad</h2>
          <ChartComponent :chartData="chartDataCity" chartType="line" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2 font-semibold">Total: {{ totalVisibleCity }}</p>
        </div>
      </div>

      <!-- Segunda fila: Programa y Campaña -->
      <div v-if="chartDataProgram.labels.length" data-swapy-slot="program" class="chart-container col-span-4 row-span-2">
        <div data-swapy-item="program">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Programa</h2>
          <ChartComponent :chartData="chartDataProgram" chartType="bar" :chartOptions="{ indexAxis: 'y' }" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2 font-semibold">Total: {{ totalVisibleProgram }}</p>
        </div>
      </div>

      <div v-if="chartDataCampaign.labels.length" data-swapy-slot="campaign" class="chart-container col-span-3 row-span-2">
        <div data-swapy-item="campaign">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Campaña</h2>
          <ChartComponent :chartData="chartDataCampaign" chartType="doughnut" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2 font-semibold">Total: {{ totalVisibleCampaign }}</p>
        </div>
      </div>

      <!-- Tercera fila: Semestre y Becas -->
      <div v-if="chartDataSemester.labels.length" data-swapy-slot="semester" class="chart-container col-span-2 row-span-2">
        <div data-swapy-item="semester">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Semestre</h2>
          <ChartComponent :chartData="chartDataSemester" chartType="pie" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2 font-semibold">Total: {{ totalVisibleSemester }}</p>
        </div>
      </div>

      <div v-if="chartDataScholarship.labels.length" data-swapy-slot="scholarship" class="chart-container col-span-3 row-span-2">
        <div data-swapy-item="scholarship">
          <h2 class="text-lg font-semibold text-center mb-2">Becas Ofertadas</h2>
          <ChartComponent :chartData="chartDataScholarship" chartType="bar" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2 font-semibold">Total: {{ totalVisibleScholarship }}</p>
        </div>
      </div>

      <!-- Cuarta fila: Medios de Contacto -->
      <div v-if="chartDataContactMedium.labels.length" data-swapy-slot="contactMedium" class="chart-container col-span-2 row-span-2">
        <div data-swapy-item="contactMedium">
          <h2 class="text-lg font-semibold text-center mb-2">Medios de Contacto</h2>
          <ChartComponent :chartData="chartDataContactMedium" chartType="bar" :isDarkMode="isDarkMode" />
          <p class="text-center mt-2 font-semibold">Total: {{ totalVisibleContactMedium }}</p>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Estilos generales del dashboard */
.dashboard {
  padding: 20px;
  background-color: #f9f9f9;
  transition: background-color 0.3s, color 0.3s;
}

/* Modo oscuro */
.dashboard.dark {
  background-color: #1e1e1e;
  color: #ffffff;
}

/* Contenedor de las gráficas */
.chart-container {
  background: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, box-shadow 0.3s;
}

/* Modo oscuro para las gráficas */
.dashboard.dark .chart-container {
  background: #2d3748;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
}

/* Botón de modo oscuro */
.dark-mode-toggle {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.dark-mode-toggle button {
  background-color: #ffffff;
  color: #333;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}

.dashboard.dark .dark-mode-toggle button {
  background-color: #333;
  color: #ffffff;
}

/* Ajustes de Swapy */
[data-swapy-slot] {
  cursor: grab;
}

/* Responsive ajustes */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
  }
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
}
</style>
