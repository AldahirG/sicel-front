<template>
  <component :is="chartType" :data="chartData" :options="chartOptions" />
</template>

<script>
import { Bar, Line, Pie, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineController, PointElement, LineElement, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, LineController, PointElement, LineElement, ArcElement);

export default {
  name: 'ChartComponent',
  props: {
    chartType: {
      type: String,
      required: true,
      validator: (value) => ['bar', 'line', 'pie', 'doughnut'].includes(value.toLowerCase())
    },
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    Bar,
    Line,
    Pie,
    Doughnut
  }
}
</script>
