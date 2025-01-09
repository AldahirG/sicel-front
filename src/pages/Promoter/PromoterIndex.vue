<script setup>
import { ref, onMounted } from "vue";
import dashboardService from "../../services/dashboard.service";
import ChartComponent from "../../components/ChartComponent.vue";


// Función para obtener el token desde las cookies
function getTokenFromCookies() {
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}

// Función para decodificar el payload del token JWT
function decodeToken(token) {
  try {
    const payload = atob(token.split(".")[1]); // Decodifica el payload
    return JSON.parse(payload); // Parsea el JSON del payload
  } catch (error) {
    console.error("Error decodificando el token:", error);
    return null;
  }
}

// Extraer el userId desde el token
const token = getTokenFromCookies();
const userId = token ? decodeToken(token)?.id : null;

if (!userId) {
  console.error("Error: No se pudo extraer el userId del token.");
}

// Referencias para los datos de las gráficas
const totalByStatus = ref([]);
const totalByCycle = ref([]);
const totalByCity = ref([]);
const totalByProgram = ref([]);
const totalByCampaign = ref([]);
const totalBySchoolType = ref([]);
const totalBySemester = ref([]);
const totalByScholarship = ref([]);
const totalByContactMedium = ref([]);

// Función para obtener datos del dashboard del promotor
const fetchPromoterData = async () => {
  if (!userId) {
    console.error("Error: userId no disponible.");
    return;
  }

  try {
    const [
      status,
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
      dashboardService.getTotalByCycleForPromoter(),
      dashboardService.getTotalByCityForPromoter(),
      dashboardService.getTotalByProgramForPromoter(),
      dashboardService.getTotalByCampaignForPromoter(),
      dashboardService.getTotalBySchoolTypeForPromoter(),
      dashboardService.getTotalBySemesterForPromoter(),
      dashboardService.getTotalByScholarshipForPromoter(),
      dashboardService.getTotalByContactMediumForPromoter(),
    ]);

    totalByStatus.value = status.data.data || [];
    totalByCycle.value = cycle.data.data || [];
    totalByCity.value = city.data.data || [];
    totalByProgram.value = program.data.data || [];
    totalByCampaign.value = campaign.data.data || [];
    totalBySchoolType.value = schoolType.data.data || [];
    totalBySemester.value = semester.data.data || [];
    totalByScholarship.value = scholarship.data.data || [];
    totalByContactMedium.value = contactMedium.data.data || [];
  } catch (error) {
    console.error("Error fetching promoter data:", error.message || error);
  }
};

// Llama a la función al montar el componente
onMounted(() => {
  fetchPromoterData();
});
</script>

<template>
    <div class="dashboard">
      <h1 class="text-2xl font-bold mb-6 text-center">Dashboard Promotor</h1>
      <div class="grid grid-cols-3 gap-6">
        <div v-if="totalByStatus.length" class="chart-container">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Status</h2>
          <ChartComponent
            :chartData="{
              labels: totalByStatus.map(item => item.status),
              datasets: [{ label: 'Total', data: totalByStatus.map(item => item.total) }]
            }"
            chartType="bar"
          />
        </div>
  
        <div v-if="totalByCycle.length" class="chart-container">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Ciclo</h2>
          <ChartComponent
            :chartData="{
              labels: totalByCycle.map(item => item.cycle),
              datasets: [{ label: 'Total', data: totalByCycle.map(item => item.total) }]
            }"
            chartType="pie"
          />
        </div>
  
        <div v-if="totalByCity.length" class="chart-container">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Ciudad</h2>
          <ChartComponent
            :chartData="{
              labels: totalByCity.map(item => item.city),
              datasets: [{ label: 'Total', data: totalByCity.map(item => item.total) }]
            }"
            chartType="bar"
          />
        </div>
  
        <div v-if="totalByProgram.length" class="chart-container">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Programa</h2>
          <ChartComponent
            :chartData="{
              labels: totalByProgram.map(item => item.programa),
              datasets: [{ label: 'Total', data: totalByProgram.map(item => item.total) }]
            }"
            chartType="bar"
            :chartOptions="{ indexAxis: 'y' }"
          />
        </div>
  
        <div v-if="totalByCampaign.length" class="chart-container">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Campaña</h2>
          <ChartComponent
            :chartData="{
              labels: totalByCampaign.map(item => item.campaña),
              datasets: [{ label: 'Total', data: totalByCampaign.map(item => item.total) }]
            }"
            chartType="doughnut"
          />
        </div>
  
        <div v-if="totalBySchoolType.length" class="chart-container">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Tipo de Escuela</h2>
          <ChartComponent
            :chartData="{
              labels: totalBySchoolType.map(item => item.tipo_escuela),
              datasets: [{ label: 'Total', data: totalBySchoolType.map(item => item.total) }]
            }"
            chartType="bar"
          />
        </div>
  
        <div v-if="totalBySemester.length" class="chart-container">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Semestre</h2>
          <ChartComponent
            :chartData="{
              labels: totalBySemester.map(item => item.semestre),
              datasets: [{ label: 'Total', data: totalBySemester.map(item => item.total) }]
            }"
            chartType="line"
          />
        </div>
  
        <div v-if="totalByScholarship.length" class="chart-container">
          <h2 class="text-lg font-semibold text-center mb-2">Becas Ofertadas</h2>
          <ChartComponent
            :chartData="{
              labels: totalByScholarship.map(item => item.scholarship),
              datasets: [{ label: 'Total', data: totalByScholarship.map(item => item.total) }]
            }"
            chartType="bar"
          />
        </div>
  
        <div v-if="totalByContactMedium.length" class="chart-container">
          <h2 class="text-lg font-semibold text-center mb-2">Medios de Contacto</h2>
          <ChartComponent
            :chartData="{
              labels: totalByContactMedium.map(item => item.medio_contacto),
              datasets: [{ label: 'Total', data: totalByContactMedium.map(item => item.total) }]
            }"
            chartType="doughnut"
          />
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .dashboard {
    padding: 20px;
    background-color: #f9f9f9;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .chart-container {
    background: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>
  
