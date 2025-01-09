<script setup>
import { onMounted, ref } from "vue";
import dashboardService from "../../services/dashboard.service";
import ChartComponent from "../../components/ChartComponent.vue";

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
      contactMedium
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
      dashboardService.getTotalByContactMedium()
    ]);

    totalByStatus.value = status.data.data || [];
    totalByCycle.value = cycle.data.data || [];
    totalByCountry.value = country.data.data || [];
    totalByState.value = state.data.data || [];
    totalByCity.value = city.data.data || [];
    totalByGrade.value = grade.data.data || [];
    totalBySemester.value = semester.data.data || [];
    totalByScholarship.value = scholarship.data.data || [];
    totalBySchoolType.value = schoolType.data.data || [];
    totalByContactMedium.value = contactMedium.data.data || [];
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<template>
    <div class="dashboard">
      <h1 class="text-2xl font-bold mb-6 text-center">Dashboard Admin</h1>
      <div class="grid grid-cols-4 gap-6">
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
  
        <div v-if="totalByCountry.length" class="chart-container">
          <h2 class="text-lg font-semibold text-center mb-2">Total por País</h2>
          <ChartComponent
            :chartData="{
              labels: totalByCountry.map(item => item.country),
              datasets: [{ label: 'Total', data: totalByCountry.map(item => item.total) }]
            }"
            chartType="bar"
          />
        </div>
  
        <div v-if="totalByState.length" class="chart-container">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Estado</h2>
          <ChartComponent
            :chartData="{
              labels: totalByState.map(item => item.state),
              datasets: [{ label: 'Total', data: totalByState.map(item => item.total) }]
            }"
            chartType="bar"
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
  
        <div v-if="totalByGrade.length" class="chart-container">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Grado</h2>
          <ChartComponent
            :chartData="{
              labels: totalByGrade.map(item => item.grade),
              datasets: [{ label: 'Total', data: totalByGrade.map(item => item.total) }]
            }"
            chartType="bar"
            :chartOptions="{
              indexAxis: 'y'
            }"
          />
        </div>
  
        <div v-if="totalBySemester.length" class="chart-container">
          <h2 class="text-lg font-semibold text-center mb-2">Total por Semestre</h2>
          <ChartComponent
            :chartData="{
              labels: totalBySemester.map(item => item.semester),
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
  
        <div v-if="totalBySchoolType.length" class="chart-container">
          <h2 class="text-lg font-semibold text-center mb-2">Tipo de Escuela</h2>
          <ChartComponent
            :chartData="{
              labels: totalBySchoolType.map(item => item.schoolType),
              datasets: [{ label: 'Total', data: totalBySchoolType.map(item => item.total) }]
            }"
            chartType="doughnut"
          />
        </div>
  
        <div v-if="totalByContactMedium.length" class="chart-container">
          <h2 class="text-lg font-semibold text-center mb-2">Medio de Contacto</h2>
          <ChartComponent
            :chartData="{
              labels: totalByContactMedium.map(item => item.contactMedium),
              datasets: [{ label: 'Total', data: totalByContactMedium.map(item => item.total) }]
            }"
            chartType="bar"
          />
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .dashboard {
    padding: 20px;
    background-color: #f5f5f5;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  .chart-container {
    background: #fff;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  </style>
  