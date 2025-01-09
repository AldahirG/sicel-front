<template>
  <div class="chart-container">
    <component :is="chartType" :data="coloredChartData" :options="mergedOptions" />
  </div>
</template>

<script>
import { Bar, Line, Pie, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineController, PointElement, LineElement, ArcElement);

export default {
  name: 'ChartComponent',
  props: {
    chartType: {
      type: String,
      required: true,
      validator: (value) => ['bar', 'line', 'pie', 'doughnut'].includes(value.toLowerCase()),
    },
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    mergedOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 12,
              },
            },
          },
        },
        ...this.chartOptions,
      };
    },
    coloredChartData() {
      const colors = [
    '#03045E', '#023E8A', '#0077B6', '#0096C7', '#00B4D8', 
    '#48CAE4', '#90E0EF', '#ADE8F4', '#CAF0F8', 
    '#4F4F4F', '#707070', '#5A5A5A', '#3D3D3D', // Grises oscuros
    '#2A9D8F', '#52B788', '#74C69D'  // Verdes
  ];

      return {
        ...this.chartData,
        datasets: this.chartData.datasets.map((dataset, index) => {
          const backgroundColors = dataset.data.map((_, i) => colors[i % colors.length]);
          return {
            ...dataset,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            borderWidth: 1,
          };
        }),
      };
    },
  },
  components: {
    Bar,
    Line,
    Pie,
    Doughnut,
  },
};
</script>

<style scoped>
.chart-container {
  max-width: 100%;
  max-height: 350px;
  margin: auto;
  padding: 10px;
}
</style>
